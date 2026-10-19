import { Body, Controller, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import {
  TUTOR_TARGET_KINDS,
  handoffResolveSchema,
  tutorAskSchema,
  tutorFeedbackSchema,
  type TutorAsk,
  type TutorFeedbackInput,
} from '@webdizayn/shared';
import { z } from 'zod';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { TutorService } from './tutor.service';

const targetQuery = z.object({
  targetKind: z.enum(TUTOR_TARGET_KINDS),
  targetId: z.string().uuid(),
});

/**
 * AI tutor. The student is always the session user; the target is re-validated against the
 * course on every request with the same rules as the exercise and assignment pages.
 */
@Controller('orgs/:orgId/courses/:courseId/tutor')
export class TutorController {
  constructor(private readonly tutor: TutorService) {}

  @Get()
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  state(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Query(new ZodPipe(targetQuery)) q: z.infer<typeof targetQuery>,
  ) {
    return this.tutor.state(auth, m, courseId, q.targetKind, q.targetId);
  }

  @Post('ask')
  @HttpCode(200)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  ask(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Body(new ZodPipe(tutorAskSchema)) body: TutorAsk,
  ) {
    return this.tutor.ask(auth, m, courseId, body);
  }

  @Post('interactions/:interactionId/feedback')
  @HttpCode(200)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  feedback(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('interactionId', Id) interactionId: string,
    @Body(new ZodPipe(tutorFeedbackSchema)) body: TutorFeedbackInput,
  ) {
    return this.tutor.feedback(auth, m, courseId, interactionId, body.helpful, body.reason);
  }

  @Get('handoffs')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  handoffs(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.tutor.handoffs(auth, m, courseId);
  }

  @Put('handoffs/:handoffId/resolved')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  resolveHandoff(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('handoffId', Id) handoffId: string,
    @Body(new ZodPipe(handoffResolveSchema)) body: z.infer<typeof handoffResolveSchema>,
  ) {
    return this.tutor.resolveHandoff(auth, m, courseId, handoffId, body.resolved);
  }
}
