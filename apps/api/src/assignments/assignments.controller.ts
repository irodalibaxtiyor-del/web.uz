import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  type PipeTransform,
} from '@nestjs/common';
import {
  ASSIGNMENT_MAX_ATTEMPTS,
  createAssignmentSchema,
  previewChecksSchema,
  saveSubmissionDraftSchema,
  updateAssignmentSchema,
  type CreateAssignmentInput,
  type PreviewChecksInput,
  type SaveSubmissionDraftInput,
  type UpdateAssignmentInput,
} from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { AssignmentsService } from './assignments.service';

/** Version numbers in URLs: positive integers within the attempt limit, otherwise 404. */
class VersionPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const n = Number(value);
    if (!/^\d{1,2}$/.test(value) || n < 1 || n > ASSIGNMENT_MAX_ATTEMPTS) {
      throw new NotFoundException('Versiya topilmadi');
    }
    return n;
  }
}

@Controller('orgs/:orgId/courses/:courseId')
export class AssignmentsController {
  constructor(private readonly assignments: AssignmentsService) {}

  // ---- Staff: authoring -------------------------------------------------

  @Post('lessons/:lessonId/assignments')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  create(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
    @Body(new ZodPipe(createAssignmentSchema)) body: CreateAssignmentInput,
  ) {
    return this.assignments.create(auth, m, courseId, lessonId, body);
  }

  @Get('lessons/:lessonId/assignments')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  listForLesson(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('lessonId', Id) lessonId: string,
  ) {
    return this.assignments.listForLesson(auth, m, courseId, lessonId);
  }

  @Get('assignments/:assignmentId/edit')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  getForEdit(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
  ) {
    return this.assignments.getForEdit(auth, m, courseId, assignmentId);
  }

  @Patch('assignments/:assignmentId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  update(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Body(new ZodPipe(updateAssignmentSchema)) body: UpdateAssignmentInput,
  ) {
    return this.assignments.update(auth, m, courseId, assignmentId, body);
  }

  @Post('assignments/:assignmentId/publish')
  @HttpCode(200)
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  publish(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
  ) {
    return this.assignments.transition(auth, m, courseId, assignmentId, 'PUBLISHED');
  }

  @Post('assignments/:assignmentId/close')
  @HttpCode(200)
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  close(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
  ) {
    return this.assignments.transition(auth, m, courseId, assignmentId, 'CLOSED');
  }

  @Get('assignments/:assignmentId/submissions')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  submissions(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
  ) {
    return this.assignments.submissionsOverview(auth, m, courseId, assignmentId);
  }

  @Post('assignments/:assignmentId/checks/preview')
  @HttpCode(200)
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  previewChecks(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Body(new ZodPipe(previewChecksSchema)) body: PreviewChecksInput,
  ) {
    return this.assignments.previewChecks(auth, m, courseId, assignmentId, body);
  }

  // ---- Learners: own submission only ------------------------------------

  @Get('assignments/:assignmentId')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  view(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
  ) {
    return this.assignments.view(auth, m, courseId, assignmentId);
  }

  @Put('assignments/:assignmentId/draft')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  saveDraft(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Body(new ZodPipe(saveSubmissionDraftSchema)) body: SaveSubmissionDraftInput,
  ) {
    return this.assignments.saveDraft(auth, m, courseId, assignmentId, body.files);
  }

  @Post('assignments/:assignmentId/submit')
  @HttpCode(201)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  submit(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
  ) {
    return this.assignments.submit(auth, m, courseId, assignmentId);
  }

  @Get('assignments/:assignmentId/versions/:version')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  version(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('assignmentId', Id) assignmentId: string,
    @Param('version', VersionPipe) version: number,
  ) {
    return this.assignments.version(auth, m, courseId, assignmentId, version);
  }
}
