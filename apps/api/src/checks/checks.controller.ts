import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { previewChecksSchema, type PreviewChecksInput } from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { ChecksService } from './checks.service';

@Controller('orgs/:orgId/courses/:courseId/exercises/:exerciseId')
export class ChecksController {
  constructor(private readonly checks: ChecksService) {}

  // ---- Learners: CHECK of their own saved workspace ----------------------

  @Post('checks')
  @HttpCode(202)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  start(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
  ) {
    return this.checks.start(auth, m, courseId, exerciseId);
  }

  @Get('checks/latest')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  async latest(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
  ) {
    return { run: await this.checks.latest(auth, m, courseId, exerciseId) };
  }

  @Get('checks/:runId')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  get(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
    @Param('runId', Id) runId: string,
  ) {
    return this.checks.get(auth, m, courseId, exerciseId, runId);
  }

  // ---- Staff: dry-run of rules -------------------------------------------

  @Post('checks/preview')
  @HttpCode(200)
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  preview(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
    @Body(new ZodPipe(previewChecksSchema)) body: PreviewChecksInput,
  ) {
    return this.checks.preview(auth, m, courseId, exerciseId, body);
  }
}
