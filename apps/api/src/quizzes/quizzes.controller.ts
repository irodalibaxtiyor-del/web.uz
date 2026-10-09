import { Body, Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  createQuizSchema,
  submitQuizSchema,
  updateQuizSchema,
  type CreateQuizInput,
  type SubmitQuizInput,
  type UpdateQuizInput,
} from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { QuizzesService } from './quizzes.service';

@Controller('orgs/:orgId/courses/:courseId')
export class QuizzesController {
  constructor(private readonly quizzes: QuizzesService) {}

  // ---- Staff: authoring --------------------------------------------------

  @Post('lessons/:lessonId/quizzes')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  create(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
    @Body(new ZodPipe(createQuizSchema)) body: CreateQuizInput,
  ) {
    return this.quizzes.create(auth, m, courseId, lessonId, body);
  }

  @Get('lessons/:lessonId/quizzes')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  listForLesson(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
  ) {
    return this.quizzes.listForLesson(auth, m, courseId, lessonId);
  }

  @Get('quizzes/:quizId/edit')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  getForEdit(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('quizId', Id) quizId: string,
  ) {
    return this.quizzes.getForEdit(auth, m, courseId, quizId);
  }

  @Patch('quizzes/:quizId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  update(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('quizId', Id) quizId: string,
    @Body(new ZodPipe(updateQuizSchema)) body: UpdateQuizInput,
  ) {
    return this.quizzes.update(auth, m, courseId, quizId, body);
  }

  // ---- Learners -----------------------------------------------------------

  @Get('quizzes/:quizId')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  view(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('quizId', Id) quizId: string,
  ) {
    return this.quizzes.view(auth, m, courseId, quizId);
  }

  @Post('quizzes/:quizId/attempts')
  @HttpCode(201)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  submit(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('quizId', Id) quizId: string,
    @Body(new ZodPipe(submitQuizSchema)) body: SubmitQuizInput,
  ) {
    return this.quizzes.submit(auth, m, courseId, quizId, body);
  }
}
