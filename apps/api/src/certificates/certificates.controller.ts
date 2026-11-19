import { Body, Controller, Get, HttpCode, Inject, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { revokeCertificateSchema, type RevokeCertificateInput } from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles, Public } from '../common/decorators';
import { Id } from '../common/params';
import { RateLimiter } from '../common/rate-limiter';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { APP_CONFIG, type AppConfig } from '../config';
import { CertificatesService } from './certificates.service';

@Controller('orgs/:orgId/courses/:courseId')
export class CourseCertificatesController {
  constructor(private readonly certs: CertificatesService) {}

  @Get('certificate')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  mine(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.certs.mine(auth, m, courseId);
  }

  @Post('certificate')
  @HttpCode(200)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  claim(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.certs.claim(auth, m, courseId);
  }

  @Get('certificates')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  list(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.certs.list(auth, m, courseId);
  }

  @Post('certificates/:certificateId/revoke')
  @HttpCode(200)
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  revoke(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('certificateId', Id) id: string,
    @Body(new ZodPipe(revokeCertificateSchema)) body: RevokeCertificateInput,
  ) {
    return this.certs.revoke(auth, m, courseId, id, body);
  }
}

@Controller('me/certificates')
export class MyCertificatesController {
  constructor(private readonly certs: CertificatesService) {}

  @Get()
  all(@CurrentAuth() auth: AuthContext) {
    return this.certs.all(auth);
  }
}

/** Public verification page: anyone with the code sees name, course, date and status. */
@Controller('public/certificates')
export class PublicCertificatesController {
  constructor(
    private readonly certs: CertificatesService,
    private readonly limiter: RateLimiter,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  @Public()
  @Get(':code')
  async verify(@Param('code') code: string, @Req() req: Request) {
    await this.limiter.consume(
      `public:${req.ip ?? 'unknown'}`,
      this.config.PUBLIC_RATE_PER_MINUTE,
      60_000,
      'PUBLIC_RATE_LIMITED',
    );
    return this.certs.verify(String(code).slice(0, 40));
  }
}
