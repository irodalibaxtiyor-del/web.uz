import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  gradeSubmissionSchema,
  requestRevisionSchema,
  reviewVersionSchema,
  type GradeSubmissionInput,
  type RequestRevisionInput,
  type ReviewVersionInput,
} from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { VersionPipe } from './assignments.controller';
import { ReviewsService } from './reviews.service';

/** Teacher review of one student's submission. Staff of the course only. */
@Controller('orgs/:orgId/courses/:courseId/assignments/:assignmentId/submissions/:studentId')
@OrgRoles('TEACHER', 'ORG_ADMIN')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get()
  get(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Param('studentId', Id) studentId: string,
  ) {
    return this.reviews.get(auth, m, courseId, assignmentId, studentId);
  }

  @Get('versions/:version')
  version(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Param('studentId', Id) studentId: string,
    @Param('version', VersionPipe) version: number,
  ) {
    return this.reviews.version(auth, m, courseId, assignmentId, studentId, version);
  }

  @Post('start-review')
  @HttpCode(200)
  start(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Param('studentId', Id) studentId: string,
    @Body(new ZodPipe(reviewVersionSchema)) body: ReviewVersionInput,
  ) {
    return this.reviews.startReview(auth, m, courseId, assignmentId, studentId, body.version);
  }

  @Post('request-revision')
  @HttpCode(200)
  requestRevision(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Param('studentId', Id) studentId: string,
    @Body(new ZodPipe(requestRevisionSchema)) body: RequestRevisionInput,
  ) {
    return this.reviews.requestRevision(auth, m, courseId, assignmentId, studentId, body);
  }

  @Post('grade')
  @HttpCode(200)
  grade(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Param('studentId', Id) studentId: string,
    @Body(new ZodPipe(gradeSubmissionSchema)) body: GradeSubmissionInput,
  ) {
    return this.reviews.grade(auth, m, courseId, assignmentId, studentId, body);
  }

  @Post('finalize')
  @HttpCode(200)
  finalize(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Param('studentId', Id) studentId: string,
    @Body(new ZodPipe(reviewVersionSchema)) body: ReviewVersionInput,
  ) {
    return this.reviews.finalize(auth, m, courseId, assignmentId, studentId, body.version);
  }
}
