import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, inArray, ne, sql } from 'drizzle-orm';
import {
  groupCode,
  rosterKey,
  type AccountState,
  type AdminStudentRow,
  type CreatedTeacher,
  type CreateTeacherInput,
  type CredentialsResetInput,
  type GroupEnrollResult,
  type Role,
  type TeacherRow,
  type TemporaryCredential,
  type UpdateTeacherInput,
} from '@webdizayn/shared';
import { PasswordService, UNUSABLE_PASSWORD_HASH } from '../auth/password.service';
import { SessionService } from '../auth/session.service';
import type { AuthContext, MembershipContext } from '../common/types';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  auditEvents,
  courses,
  courseTeachers,
  enrollments,
  groups,
  groupStudents,
  groupTeachers,
  memberships,
  users,
} from '../db/schema';
import { LOGIN_LOCK } from '../groups/roster-import';
import { temporaryPassword } from './temporary-password';

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

const MANAGED: Role[] = ['STUDENT', 'TEACHER'];

/**
 * Accounts an organization administrator manages: teachers and students of this organization.
 * An account that also belongs to another organization is not managed from here (its admin
 * there would lose control of it), and administrators cannot act on their own account.
 */
@Injectable()
export class AccountsService {
  constructor(
    private readonly dbs: DbService,
    private readonly passwords: PasswordService,
    private readonly sessions: SessionService,
  ) {}

  private async audit(
    db: Db | Tx,
    actorUserId: string,
    organizationId: string,
    action: string,
    targetId: string,
    metadata: Record<string, unknown> = {},
  ) {
    await db.insert(auditEvents).values({
      action,
      actorUserId,
      organizationId,
      targetType: 'user',
      targetId,
      metadata,
    });
  }

  /** The target must be a STUDENT/TEACHER of this organization only, and not the caller. */
  private async managed(db: Db | Tx, orgId: string, actorId: string, userIds: string[]) {
    const unique = [...new Set(userIds)];
    if (unique.length === 0) return [];
    const rows = await db
      .select({
        userId: users.id,
        fullName: users.fullName,
        login: users.login,
        email: users.email,
        role: memberships.role,
        elsewhere: sql<number>`(select count(*)::int from ${memberships} m2 where m2.user_id = ${users.id} and m2.organization_id <> ${orgId})`,
      })
      .from(memberships)
      .innerJoin(users, eq(users.id, memberships.userId))
      .where(and(eq(memberships.organizationId, orgId), inArray(memberships.userId, unique)));
    if (rows.length !== unique.length) throw new NotFoundException('Hisob topilmadi');
    for (const r of rows) {
      if (r.userId === actorId) {
        throw new ConflictException({
          code: 'SELF_ACCOUNT',
          message: 'O‘z hisobingizni bu yerdan boshqarib bo‘lmaydi',
        });
      }
      if (!MANAGED.includes(r.role)) throw new NotFoundException('Hisob topilmadi');
      if (r.elsewhere > 0) {
        throw new ConflictException({
          code: 'ACCOUNT_SHARED',
          message: 'Bu hisob boshqa tashkilotga ham a’zo — uni bu yerdan boshqarib bo‘lmaydi',
        });
      }
    }
    return rows;
  }

  private async assertLoginFree(db: Db | Tx, login: string, exceptUserId?: string) {
    const [taken] = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(sql`lower(${users.login})`, login),
          exceptUserId ? ne(users.id, exceptUserId) : undefined,
        ),
      )
      .limit(1);
    if (taken) throw new ConflictException({ code: 'LOGIN_TAKEN', message: 'Bu login band' });
  }

  private async assertEmailFree(db: Db | Tx, email: string, exceptUserId?: string) {
    const [taken] = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(sql`lower(${users.email})`, email),
          exceptUserId ? ne(users.id, exceptUserId) : undefined,
        ),
      )
      .limit(1);
    if (taken) throw new ConflictException({ code: 'EMAIL_TAKEN', message: 'Bu email band' });
  }

  // ---------- Teachers ----------

  async listTeachers(m: MembershipContext): Promise<TeacherRow[]> {
    const db = this.dbs.db;
    const rows = await db
      .select({
        userId: users.id,
        fullName: users.fullName,
        login: users.login,
        email: users.email,
        disabledAt: users.disabledAt,
        mustChangePassword: users.mustChangePassword,
        passwordHash: users.passwordHash,
        createdAt: users.createdAt,
      })
      .from(memberships)
      .innerJoin(users, eq(users.id, memberships.userId))
      .where(and(eq(memberships.organizationId, m.organizationId), eq(memberships.role, 'TEACHER')))
      .orderBy(asc(users.fullName));
    const assigned = rows.length
      ? await db
          .select({ userId: groupTeachers.userId, id: groups.id, name: groups.name })
          .from(groupTeachers)
          .innerJoin(groups, eq(groups.id, groupTeachers.groupId))
          .where(
            and(
              eq(groups.organizationId, m.organizationId),
              inArray(
                groupTeachers.userId,
                rows.map((r) => r.userId),
              ),
            ),
          )
          .orderBy(asc(groups.name))
      : [];
    const teaching = rows.length
      ? await db
          .select({ userId: courseTeachers.userId, id: courses.id, title: courses.title })
          .from(courseTeachers)
          .innerJoin(courses, eq(courses.id, courseTeachers.courseId))
          .where(
            and(
              eq(courses.organizationId, m.organizationId),
              inArray(
                courseTeachers.userId,
                rows.map((r) => r.userId),
              ),
            ),
          )
          .orderBy(asc(courses.position), asc(courses.title))
      : [];
    return rows.map(({ passwordHash, disabledAt, createdAt, ...r }) => ({
      ...r,
      ...state(r.userId, disabledAt, r.mustChangePassword, passwordHash),
      groups: assigned.filter((a) => a.userId === r.userId).map(({ id, name }) => ({ id, name })),
      courses: teaching
        .filter((a) => a.userId === r.userId)
        .map(({ id, title }) => ({ id, title })),
      createdAt: createdAt.toISOString(),
    }));
  }

  private async teacherRow(m: MembershipContext, userId: string): Promise<TeacherRow> {
    const row = (await this.listTeachers(m)).find((t) => t.userId === userId);
    if (!row) throw new NotFoundException('O‘qituvchi topilmadi');
    return row;
  }

  async createTeacher(
    auth: AuthContext,
    m: MembershipContext,
    input: CreateTeacherInput,
  ): Promise<CreatedTeacher> {
    const password = temporaryPassword('wd');
    const passwordHash = await this.passwords.hash(password);
    const userId = await this.dbs.db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${LOGIN_LOCK}))`);
      await this.assertLoginFree(tx, input.login);
      if (input.email) await this.assertEmailFree(tx, input.email);
      const [u] = await tx
        .insert(users)
        .values({
          fullName: input.fullName,
          login: input.login,
          email: input.email ?? null,
          passwordHash,
          mustChangePassword: true,
        })
        .returning({ id: users.id });
      await tx
        .insert(memberships)
        .values({ userId: u!.id, organizationId: m.organizationId, role: 'TEACHER' });
      await this.audit(tx, auth.userId, m.organizationId, 'teacher.create', u!.id, {
        login: input.login,
      });
      return u!.id;
    });
    const teacher = await this.teacherRow(m, userId);
    return {
      teacher,
      credential: {
        userId,
        fullName: teacher.fullName,
        login: input.login,
        group: null,
        temporaryPassword: password,
      },
    };
  }

  async updateTeacher(
    auth: AuthContext,
    m: MembershipContext,
    userId: string,
    input: UpdateTeacherInput,
  ): Promise<TeacherRow> {
    await this.dbs.db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${LOGIN_LOCK}))`);
      const [target] = await this.managed(tx, m.organizationId, auth.userId, [userId]);
      if (target!.role !== 'TEACHER') throw new NotFoundException('O‘qituvchi topilmadi');
      if (input.login) await this.assertLoginFree(tx, input.login, userId);
      if (input.email) await this.assertEmailFree(tx, input.email, userId);
      const nextLogin = input.login ?? target!.login;
      const nextEmail = input.email === undefined ? target!.email : input.email;
      if (!nextLogin && !nextEmail) {
        throw new ConflictException({
          code: 'IDENTIFIER_REQUIRED',
          message: 'Hisobda login yoki email bo‘lishi kerak',
        });
      }
      await tx
        .update(users)
        .set({
          ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
          ...(input.login !== undefined ? { login: input.login } : {}),
          ...(input.email !== undefined ? { email: input.email } : {}),
        })
        .where(eq(users.id, userId));
      await this.audit(tx, auth.userId, m.organizationId, 'teacher.update', userId, {
        fields: Object.keys(input).filter(
          (k) => input[k as keyof UpdateTeacherInput] !== undefined,
        ),
      });
    });
    return this.teacherRow(m, userId);
  }

  /** Replaces the set of groups a teacher may see. Every group must belong to this organization. */
  async setTeacherGroups(
    auth: AuthContext,
    m: MembershipContext,
    userId: string,
    groupIds: string[],
  ): Promise<TeacherRow> {
    await this.dbs.db.transaction(async (tx) => {
      const [target] = await this.managed(tx, m.organizationId, auth.userId, [userId]);
      if (target!.role !== 'TEACHER') throw new NotFoundException('O‘qituvchi topilmadi');
      if (groupIds.length > 0) {
        const found = await tx
          .select({ id: groups.id })
          .from(groups)
          .where(and(eq(groups.organizationId, m.organizationId), inArray(groups.id, groupIds)));
        if (found.length !== groupIds.length) throw new NotFoundException('Guruh topilmadi');
      }
      const orgGroups = tx
        .select({ id: groups.id })
        .from(groups)
        .where(eq(groups.organizationId, m.organizationId));
      await tx
        .delete(groupTeachers)
        .where(and(eq(groupTeachers.userId, userId), inArray(groupTeachers.groupId, orgGroups)));
      if (groupIds.length > 0) {
        await tx
          .insert(groupTeachers)
          .values(groupIds.map((groupId) => ({ groupId, userId, assignedBy: auth.userId })));
      }
      await this.audit(tx, auth.userId, m.organizationId, 'teacher.groups_set', userId, {
        groupIds,
      });
    });
    return this.teacherRow(m, userId);
  }

  /**
   * Replaces the courses (of this organization) the teacher manages. Assignments in other
   * organizations are untouched. Grading history keeps the reviewer even after removal.
   */
  async setTeacherCourses(
    auth: AuthContext,
    m: MembershipContext,
    userId: string,
    courseIds: string[],
  ): Promise<TeacherRow> {
    await this.dbs.db.transaction(async (tx) => {
      const [target] = await this.managed(tx, m.organizationId, auth.userId, [userId]);
      if (target!.role !== 'TEACHER') throw new NotFoundException('O‘qituvchi topilmadi');
      if (courseIds.length > 0) {
        const found = await tx
          .select({ id: courses.id })
          .from(courses)
          .where(and(eq(courses.organizationId, m.organizationId), inArray(courses.id, courseIds)));
        if (found.length !== courseIds.length) throw new NotFoundException('Kurs topilmadi');
      }
      const orgCourses = tx
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.organizationId, m.organizationId));
      await tx
        .delete(courseTeachers)
        .where(
          and(eq(courseTeachers.userId, userId), inArray(courseTeachers.courseId, orgCourses)),
        );
      if (courseIds.length > 0) {
        await tx.insert(courseTeachers).values(courseIds.map((courseId) => ({ courseId, userId })));
      }
      await this.audit(tx, auth.userId, m.organizationId, 'teacher.courses_set', userId, {
        courseIds,
      });
    });
    return this.teacherRow(m, userId);
  }

  // ---------- Students ----------

  /** Enrols every active student of the group in a published course of this organization. */
  async enrollGroup(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    courseId: string,
  ): Promise<GroupEnrollResult> {
    return this.dbs.db.transaction(async (tx) => {
      const [group] = await tx
        .select({ id: groups.id })
        .from(groups)
        .where(and(eq(groups.id, groupId), eq(groups.organizationId, m.organizationId)));
      if (!group) throw new NotFoundException('Guruh topilmadi');
      const [course] = await tx
        .select({ status: courses.status })
        .from(courses)
        .where(and(eq(courses.id, courseId), eq(courses.organizationId, m.organizationId)));
      if (!course) throw new NotFoundException('Kurs topilmadi');
      if (course.status !== 'PUBLISHED') {
        throw new ConflictException({
          code: 'COURSE_NOT_PUBLISHED',
          message: 'Faqat e’lon qilingan kursga yozish mumkin',
        });
      }
      const members = await tx
        .select({ userId: groupStudents.userId, disabledAt: users.disabledAt })
        .from(groupStudents)
        .innerJoin(users, eq(users.id, groupStudents.userId))
        .innerJoin(
          memberships,
          and(
            eq(memberships.userId, groupStudents.userId),
            eq(memberships.organizationId, m.organizationId),
            eq(memberships.role, 'STUDENT'),
          ),
        )
        .where(eq(groupStudents.groupId, groupId));
      const active = members.filter((s) => s.disabledAt === null).map((s) => s.userId);
      const inserted = active.length
        ? await tx
            .insert(enrollments)
            .values(active.map((userId) => ({ userId, courseId })))
            .onConflictDoNothing()
            .returning({ id: enrollments.id })
        : [];
      const result: GroupEnrollResult = {
        courseId,
        enrolled: inserted.length,
        alreadyEnrolled: active.length - inserted.length,
        skippedDisabled: members.length - active.length,
      };
      await tx.insert(auditEvents).values({
        actorUserId: auth.userId,
        organizationId: m.organizationId,
        action: 'group.enroll',
        targetType: 'group',
        targetId: groupId,
        metadata: { ...result },
      });
      return result;
    });
  }

  async listStudents(m: MembershipContext): Promise<AdminStudentRow[]> {
    const rows = await this.dbs.db
      .select({
        userId: users.id,
        fullName: users.fullName,
        login: users.login,
        email: users.email,
        disabledAt: users.disabledAt,
        mustChangePassword: users.mustChangePassword,
        passwordHash: users.passwordHash,
        createdAt: users.createdAt,
        groupId: groups.id,
        groupName: groups.name,
      })
      .from(memberships)
      .innerJoin(users, eq(users.id, memberships.userId))
      .leftJoin(
        groupStudents,
        and(eq(groupStudents.userId, users.id), eq(groupStudents.organizationId, m.organizationId)),
      )
      .leftJoin(groups, eq(groups.id, groupStudents.groupId))
      .where(and(eq(memberships.organizationId, m.organizationId), eq(memberships.role, 'STUDENT')))
      .orderBy(asc(groups.name), asc(users.fullName));
    return rows.map(({ passwordHash, disabledAt, createdAt, groupId, groupName, ...r }) => ({
      ...r,
      ...state(r.userId, disabledAt, r.mustChangePassword, passwordHash),
      group: groupId && groupName ? { id: groupId, name: groupName } : null,
      createdAt: createdAt.toISOString(),
    }));
  }

  /** Moves a student to another group of this organization (or out of every group). */
  async setStudentGroup(
    auth: AuthContext,
    m: MembershipContext,
    userId: string,
    groupId: string | null,
  ): Promise<AdminStudentRow> {
    await this.dbs.db.transaction(async (tx) => {
      const [target] = await this.managed(tx, m.organizationId, auth.userId, [userId]);
      if (target!.role !== 'STUDENT') throw new NotFoundException('Talaba topilmadi');
      if (groupId) {
        const [g] = await tx
          .select({ id: groups.id })
          .from(groups)
          .where(and(eq(groups.id, groupId), eq(groups.organizationId, m.organizationId)));
        if (!g) throw new NotFoundException('Guruh topilmadi');
      }
      const key = rosterKey(target!.fullName);
      if (groupId) {
        const [clash] = await tx
          .select({ userId: groupStudents.userId })
          .from(groupStudents)
          .where(
            and(
              eq(groupStudents.groupId, groupId),
              eq(groupStudents.rosterKey, key),
              ne(groupStudents.userId, userId),
            ),
          );
        if (clash) {
          throw new ConflictException({
            code: 'NAME_IN_GROUP',
            message: 'Bu guruhda shu ismli talaba bor',
          });
        }
      }
      await tx
        .delete(groupStudents)
        .where(
          and(eq(groupStudents.userId, userId), eq(groupStudents.organizationId, m.organizationId)),
        );
      if (groupId) {
        await tx.insert(groupStudents).values({
          groupId,
          organizationId: m.organizationId,
          userId,
          rosterKey: key,
          addedBy: auth.userId,
        });
      }
      await this.audit(tx, auth.userId, m.organizationId, 'student.group_set', userId, {
        groupId,
      });
    });
    const row = (await this.listStudents(m)).find((s) => s.userId === userId);
    return row!;
  }

  // ---------- Account state and passwords ----------

  async setDisabled(
    auth: AuthContext,
    m: MembershipContext,
    userId: string,
    disabled: boolean,
  ): Promise<AccountState> {
    const db = this.dbs.db;
    await db.transaction(async (tx) => {
      await this.managed(tx, m.organizationId, auth.userId, [userId]);
      await tx
        .update(users)
        .set({ disabledAt: disabled ? new Date() : null })
        .where(eq(users.id, userId));
      if (disabled) await this.sessions.revokeAll(userId, tx);
      await this.audit(
        tx,
        auth.userId,
        m.organizationId,
        disabled ? 'account.disable' : 'account.enable',
        userId,
      );
    });
    const [u] = await db
      .select({
        disabledAt: users.disabledAt,
        mustChangePassword: users.mustChangePassword,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.id, userId));
    return state(userId, u!.disabledAt, u!.mustChangePassword, u!.passwordHash);
  }

  /**
   * Issues fresh temporary passwords. The plain passwords exist only in the returned list
   * (and the file built from it); the database keeps Argon2id hashes. Every target is signed
   * out and must change the password on the next sign-in.
   */
  async resetCredentials(
    auth: AuthContext,
    m: MembershipContext,
    input: Omit<CredentialsResetInput, 'onlyWithoutPassword'> & { onlyWithoutPassword: boolean },
  ): Promise<{ groupName: string | null; credentials: TemporaryCredential[]; skipped: number }> {
    const db = this.dbs.db;
    let userIds = input.userIds ?? [];
    let groupName: string | null = null;
    if (input.groupId) {
      const [g] = await db
        .select({ name: groups.name })
        .from(groups)
        .where(and(eq(groups.id, input.groupId), eq(groups.organizationId, m.organizationId)));
      if (!g) throw new NotFoundException('Guruh topilmadi');
      groupName = g.name;
      userIds = (
        await db
          .select({ userId: groupStudents.userId })
          .from(groupStudents)
          .where(eq(groupStudents.groupId, input.groupId))
      ).map((r) => r.userId);
    }
    const targets = await this.managed(db, m.organizationId, auth.userId, userIds);
    const meta = await db
      .select({
        userId: users.id,
        passwordHash: users.passwordHash,
        disabledAt: users.disabledAt,
        groupName: groups.name,
      })
      .from(users)
      .leftJoin(
        groupStudents,
        and(eq(groupStudents.userId, users.id), eq(groupStudents.organizationId, m.organizationId)),
      )
      .leftJoin(groups, eq(groups.id, groupStudents.groupId))
      .where(
        inArray(
          users.id,
          targets.map((t) => t.userId),
        ),
      );
    const byId = new Map(meta.map((r) => [r.userId, r]));
    const chosen = targets
      .filter((t) => t.login)
      .filter((t) => !byId.get(t.userId)!.disabledAt)
      .filter(
        (t) =>
          !input.onlyWithoutPassword || byId.get(t.userId)!.passwordHash === UNUSABLE_PASSWORD_HASH,
      )
      .sort(
        (a, b) =>
          (byId.get(a.userId)!.groupName ?? '').localeCompare(
            byId.get(b.userId)!.groupName ?? '',
          ) || a.fullName.localeCompare(b.fullName),
      );

    const issued = await Promise.all(
      chosen.map(async (t) => {
        const group = byId.get(t.userId)!.groupName;
        const password = temporaryPassword(group ? groupCode(group) : 'wd');
        return { t, group, password, hash: await this.passwords.hash(password) };
      }),
    );
    await db.transaction(async (tx) => {
      for (const i of issued) {
        await tx
          .update(users)
          .set({ passwordHash: i.hash, mustChangePassword: true })
          .where(eq(users.id, i.t.userId));
        await this.sessions.revokeAll(i.t.userId, tx);
        await this.audit(tx, auth.userId, m.organizationId, 'account.password_reset', i.t.userId, {
          bulk: issued.length > 1,
        });
      }
    });
    return {
      groupName,
      // No login (email-only accounts), disabled, or already has a password when asked to skip.
      skipped: targets.length - issued.length,
      credentials: issued.map((i) => ({
        userId: i.t.userId,
        fullName: i.t.fullName,
        login: i.t.login!,
        group: i.group,
        temporaryPassword: i.password,
      })),
    };
  }

  async recordExport(auth: AuthContext, m: MembershipContext, action: string, meta: object) {
    await this.dbs.db.insert(auditEvents).values({
      action,
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'organization',
      targetId: m.organizationId,
      metadata: { ...meta },
    });
  }
}

function state(
  userId: string,
  disabledAt: Date | null,
  mustChangePassword: boolean,
  passwordHash: string,
): AccountState {
  return {
    userId,
    disabled: disabledAt !== null,
    mustChangePassword,
    hasPassword: passwordHash !== UNUSABLE_PASSWORD_HASH,
  };
}
