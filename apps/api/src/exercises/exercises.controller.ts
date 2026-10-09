import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  createExerciseSchema,
  saveWorkspaceSchema,
  setExerciseStatusSchema,
  updateExerciseSchema,
  type CreateExerciseInput,
  type SaveWorkspaceInput,
  type SetExerciseStatusInput,
  type UpdateExerciseInput,
} from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { ExercisesService } from './exercises.service';

@Controller('orgs/:orgId/courses/:courseId')
export class ExercisesController {
  constructor(private readonly exercises: ExercisesService) {}

  // ---- Staff: authoring and review --------------------------------------

  @Post('lessons/:lessonId/exercises')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  create(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
    @Body(new ZodPipe(createExerciseSchema)) body: CreateExerciseInput,
  ) {
    return this.exercises.create(auth, m, courseId, lessonId, body);
  }

  @Get('lessons/:lessonId/exercises')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  listForLesson(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
  ) {
    return this.exercises.listForLesson(auth, m, courseId, lessonId);
  }

  @Get('exercises/:exerciseId/edit')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  getForEdit(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
  ) {
    return this.exercises.getForEdit(auth, m, courseId, exerciseId);
  }

  @Patch('exercises/:exerciseId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  update(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
    @Body(new ZodPipe(updateExerciseSchema)) body: UpdateExerciseInput,
  ) {
    return this.exercises.update(auth, m, courseId, exerciseId, body);
  }

  @Get('exercises/:exerciseId/students')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  studentProgress(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
  ) {
    return this.exercises.studentProgress(auth, m, courseId, exerciseId);
  }

  @Put('exercises/:exerciseId/students/:studentId/status')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  setStatus(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
    @Param('studentId', Id) studentId: string,
    @Body(new ZodPipe(setExerciseStatusSchema)) body: SetExerciseStatusInput,
  ) {
    return this.exercises.setStatusByTeacher(auth, m, courseId, exerciseId, studentId, body);
  }

  // ---- Learners: own workspace only -------------------------------------

  @Get('exercises/:exerciseId')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  view(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
  ) {
    return this.exercises.view(auth, m, courseId, exerciseId);
  }

  @Put('exercises/:exerciseId/workspace')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  save(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
    @Body(new ZodPipe(saveWorkspaceSchema)) body: SaveWorkspaceInput,
  ) {
    return this.exercises.saveWorkspace(auth, m, courseId, exerciseId, body.files);
  }

  @Post('exercises/:exerciseId/workspace/reset')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  reset(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('exerciseId', Id) exerciseId: string,
  ) {
    return this.exercises.resetWorkspace(auth, m, courseId, exerciseId);
  }
}
