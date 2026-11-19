import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  reviewAnswerSchema,
  upsertTermSchema,
  type ReviewAnswerInput,
  type UpsertTermInput,
} from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { GlossaryService } from './glossary.service';

@Controller('orgs/:orgId/courses/:courseId/glossary')
export class GlossaryController {
  constructor(private readonly glossary: GlossaryService) {}

  @Get()
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  list(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.glossary.glossary(auth, m, courseId);
  }

  @Post()
  @HttpCode(201)
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  create(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Body(new ZodPipe(upsertTermSchema)) body: UpsertTermInput,
  ) {
    return this.glossary.create(auth, m, courseId, body);
  }

  @Get('review')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  queue(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.glossary.queue(auth, m, courseId);
  }

  @Post('review/:termId')
  @HttpCode(200)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  answer(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('termId', Id) termId: string,
    @Body(new ZodPipe(reviewAnswerSchema)) body: ReviewAnswerInput,
  ) {
    return this.glossary.answer(auth, m, courseId, termId, body);
  }

  @Patch(':termId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  update(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('termId', Id) termId: string,
    @Body(new ZodPipe(upsertTermSchema)) body: UpsertTermInput,
  ) {
    return this.glossary.update(auth, m, courseId, termId, body);
  }

  @Delete(':termId')
  @HttpCode(204)
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  async remove(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('termId', Id) termId: string,
  ) {
    await this.glossary.remove(auth, m, courseId, termId);
  }
}
