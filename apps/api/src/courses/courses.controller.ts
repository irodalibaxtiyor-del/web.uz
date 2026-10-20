import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  createCourseSchema,
  createLessonSchema,
  createModuleSchema,
  slugSuggestionQuerySchema,
  updateCourseSchema,
  updateLessonSchema,
  updateModuleSchema,
  type CreateCourseInput,
  type CreateLessonInput,
  type CreateModuleInput,
  type SlugSuggestionQuery,
  type UpdateCourseInput,
  type UpdateLessonInput,
  type UpdateModuleInput,
} from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import type { AuthContext, MembershipContext } from '../common/types';
import { Id } from '../common/params';
import { ZodPipe } from '../common/zod.pipe';
import { CoursesService } from './courses.service';
import { LearningService } from './learning.service';

@Controller('orgs/:orgId/courses')
export class CoursesController {
  constructor(
    private readonly courses: CoursesService,
    private readonly learning: LearningService,
  ) {}

  @Get()
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  list(@CurrentAuth() auth: AuthContext, @CurrentMembership() m: MembershipContext) {
    return this.courses.list(auth, m);
  }

  // ---- Staff: authoring -------------------------------------------------

  @Post()
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  create(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Body(new ZodPipe(createCourseSchema)) body: CreateCourseInput,
  ) {
    return this.courses.create(auth, m, body);
  }

  /** Live preview of the slug the server would assign (form helper; the create/patch re-check). */
  @Get('slug-suggestion')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  slugSuggestion(
    @CurrentMembership() m: MembershipContext,
    @Query(new ZodPipe(slugSuggestionQuerySchema)) q: SlugSuggestionQuery,
  ) {
    return this.courses.suggestSlug(m, q);
  }

  @Get(':courseId/structure')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  structure(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.courses.structure(auth, m, courseId);
  }

  @Patch(':courseId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  update(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Body(new ZodPipe(updateCourseSchema)) body: UpdateCourseInput,
  ) {
    return this.courses.update(auth, m, courseId, body);
  }

  @Post(':courseId/modules')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  createModule(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Body(new ZodPipe(createModuleSchema)) body: CreateModuleInput,
  ) {
    return this.courses.createModule(auth, m, courseId, body);
  }

  @Patch(':courseId/modules/:moduleId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  updateModule(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('moduleId', Id) moduleId: string,
    @Body(new ZodPipe(updateModuleSchema)) body: UpdateModuleInput,
  ) {
    return this.courses.updateModule(auth, m, courseId, moduleId, body);
  }

  @Post(':courseId/modules/:moduleId/lessons')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  createLesson(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('moduleId', Id) moduleId: string,
    @Body(new ZodPipe(createLessonSchema)) body: CreateLessonInput,
  ) {
    return this.courses.createLesson(auth, m, courseId, moduleId, body);
  }

  @Get(':courseId/lessons/:lessonId/edit')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  lessonForEdit(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
  ) {
    return this.courses.getLessonForEdit(auth, m, courseId, lessonId);
  }

  @Patch(':courseId/lessons/:lessonId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  updateLesson(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
    @Body(new ZodPipe(updateLessonSchema)) body: UpdateLessonInput,
  ) {
    return this.courses.updateLesson(auth, m, courseId, lessonId, body);
  }

  // ---- Learners: sequential learning -----------------------------------

  @Post(':courseId/enroll')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  enroll(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.learning.enroll(auth, m, courseId);
  }

  @Get(':courseId/map')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  map(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.learning.map(auth, m, courseId);
  }

  @Get(':courseId/lessons/:lessonId')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  lesson(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
  ) {
    return this.learning.lesson(auth, m, courseId, lessonId);
  }

  @Post(':courseId/lessons/:lessonId/complete')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  complete(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
  ) {
    return this.learning.complete(auth, m, courseId, lessonId);
  }
}
