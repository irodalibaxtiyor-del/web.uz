import { Body, Controller, Get, HttpCode, Param, Patch, Post, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import { eq } from 'drizzle-orm';
import {
  createTeacherSchema,
  credentialsResetSchema,
  groupEnrollSchema,
  studentGroupSchema,
  teacherCoursesSchema,
  teacherGroupsSchema,
  updateTeacherSchema,
  type CreateTeacherInput,
  type GroupEnrollInput,
  type StudentGroupInput,
  type TeacherCoursesInput,
  type TeacherGroupsInput,
  type UpdateTeacherInput,
} from '@webdizayn/shared';
import type { z } from 'zod';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { attachmentHeader, XLSX_MIME } from '../common/xlsx';
import { ZodPipe } from '../common/zod.pipe';
import { DbService } from '../db/db.module';
import { organizations } from '../db/schema';
import { credentialsWorkbook, loginsWorkbook } from './account-exports';
import { AccountsService } from './accounts.service';

type ResetBody = z.output<typeof credentialsResetSchema>;

function sendXlsx(res: Response, fileName: string, data: Buffer) {
  res.setHeader('Content-Type', XLSX_MIME);
  res.setHeader('Content-Disposition', attachmentHeader(fileName));
  res.setHeader('Cache-Control', 'no-store');
  res.send(data);
}

const day = (d: Date) => d.toISOString().slice(0, 10);

/** Organization administrators only: teacher and student accounts, passwords, exports. */
@Controller('orgs/:orgId/admin')
export class AdminAccountsController {
  constructor(
    private readonly accounts: AccountsService,
    private readonly dbs: DbService,
  ) {}

  private async orgName(orgId: string) {
    const [o] = await this.dbs.db
      .select({ name: organizations.name })
      .from(organizations)
      .where(eq(organizations.id, orgId));
    return o?.name ?? '';
  }

  @Get('teachers')
  @OrgRoles('ORG_ADMIN')
  teachers(@CurrentMembership() m: MembershipContext) {
    return this.accounts.listTeachers(m);
  }

  @Post('teachers')
  @OrgRoles('ORG_ADMIN')
  createTeacher(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Body(new ZodPipe(createTeacherSchema)) body: CreateTeacherInput,
  ) {
    return this.accounts.createTeacher(auth, m, body);
  }

  @Patch('teachers/:userId')
  @OrgRoles('ORG_ADMIN')
  updateTeacher(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('userId', Id) userId: string,
    @Body(new ZodPipe(updateTeacherSchema)) body: UpdateTeacherInput,
  ) {
    return this.accounts.updateTeacher(auth, m, userId, body);
  }

  @Put('teachers/:userId/groups')
  @OrgRoles('ORG_ADMIN')
  teacherGroups(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('userId', Id) userId: string,
    @Body(new ZodPipe(teacherGroupsSchema)) body: TeacherGroupsInput,
  ) {
    return this.accounts.setTeacherGroups(auth, m, userId, body.groupIds);
  }

  @Put('teachers/:userId/courses')
  @OrgRoles('ORG_ADMIN')
  teacherCourses(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('userId', Id) userId: string,
    @Body(new ZodPipe(teacherCoursesSchema)) body: TeacherCoursesInput,
  ) {
    return this.accounts.setTeacherCourses(auth, m, userId, body.courseIds);
  }

  @Post('groups/:groupId/enroll')
  @HttpCode(200)
  @OrgRoles('ORG_ADMIN')
  enrollGroup(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Body(new ZodPipe(groupEnrollSchema)) body: GroupEnrollInput,
  ) {
    return this.accounts.enrollGroup(auth, m, groupId, body.courseId);
  }

  @Get('students')
  @OrgRoles('ORG_ADMIN')
  students(@CurrentMembership() m: MembershipContext) {
    return this.accounts.listStudents(m);
  }

  @Put('students/:userId/group')
  @OrgRoles('ORG_ADMIN')
  studentGroup(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('userId', Id) userId: string,
    @Body(new ZodPipe(studentGroupSchema)) body: StudentGroupInput,
  ) {
    return this.accounts.setStudentGroup(auth, m, userId, body.groupId);
  }

  @Post('accounts/:userId/disable')
  @HttpCode(200)
  @OrgRoles('ORG_ADMIN')
  disable(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('userId', Id) userId: string,
  ) {
    return this.accounts.setDisabled(auth, m, userId, true);
  }

  @Post('accounts/:userId/enable')
  @HttpCode(200)
  @OrgRoles('ORG_ADMIN')
  enable(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('userId', Id) userId: string,
  ) {
    return this.accounts.setDisabled(auth, m, userId, false);
  }

  /** One account: the temporary password is in this response only. */
  @Post('accounts/:userId/reset-password')
  @HttpCode(200)
  @OrgRoles('ORG_ADMIN')
  async resetPassword(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('userId', Id) userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.setHeader('Cache-Control', 'no-store');
    const { credentials } = await this.accounts.resetCredentials(auth, m, {
      userIds: [userId],
      onlyWithoutPassword: false,
    });
    const credential = credentials[0];
    if (!credential) {
      return {
        credential: null,
        message: 'Bu hisobga parol berib bo‘lmaydi (login yo‘q yoki faolsiz)',
      };
    }
    return { credential };
  }

  /**
   * Issues temporary passwords to a group (or chosen accounts) and returns them as a one-time
   * .xlsx hand-out. Nothing readable is kept: re-downloading means issuing new passwords.
   */
  @Post('credentials/reset.xlsx')
  @HttpCode(200)
  @OrgRoles('ORG_ADMIN')
  async resetCredentialsXlsx(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Body(new ZodPipe(credentialsResetSchema)) body: ResetBody,
    @Res() res: Response,
  ) {
    const result = await this.accounts.resetCredentials(auth, m, body);
    await this.accounts.recordExport(auth, m, 'credentials.export', {
      groupId: body.groupId ?? null,
      count: result.credentials.length,
      skipped: result.skipped,
    });
    const now = new Date();
    const label = result.groupName ?? 'tanlangan hisoblar';
    res.setHeader('X-Credentials-Count', String(result.credentials.length));
    res.setHeader('X-Credentials-Skipped', String(result.skipped));
    sendXlsx(
      res,
      `parollar-${label}-${day(now)}.xlsx`,
      credentialsWorkbook(
        await this.orgName(m.organizationId),
        `${label}: vaqtinchalik parollar`,
        result.credentials,
        now,
      ),
    );
  }

  /** Logins and account states only — no password or hash is read for this file. */
  @Get('logins.xlsx')
  @OrgRoles('ORG_ADMIN')
  async loginsXlsx(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Res() res: Response,
  ) {
    const [students, teachers] = await Promise.all([
      this.accounts.listStudents(m),
      this.accounts.listTeachers(m),
    ]);
    await this.accounts.recordExport(auth, m, 'logins.export', {
      students: students.length,
      teachers: teachers.length,
    });
    const now = new Date();
    sendXlsx(
      res,
      `loginlar-${day(now)}.xlsx`,
      loginsWorkbook(await this.orgName(m.organizationId), students, teachers, now),
    );
  }
}
