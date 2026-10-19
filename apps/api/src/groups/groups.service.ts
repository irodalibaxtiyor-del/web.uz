import { Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, sql } from 'drizzle-orm';
import type {
  GroupStudentRow,
  GroupSummary,
  RosterImportInput,
  RosterImportResult,
  RosterPreview,
} from '@webdizayn/shared';
import { UNUSABLE_PASSWORD_HASH } from '../auth/password.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { DbService } from '../db/db.module';
import { groups, groupStudents, groupTeachers, users } from '../db/schema';
import { importRoster, previewRoster } from './roster-import';

/** Admin-side group management. Every method is scoped to the caller's organization. */
@Injectable()
export class GroupsService {
  constructor(private readonly dbs: DbService) {}

  previewRoster(m: MembershipContext, input: RosterImportInput): Promise<RosterPreview> {
    return previewRoster(this.dbs.db, m.organizationId, input);
  }

  importRoster(
    auth: AuthContext,
    m: MembershipContext,
    input: RosterImportInput,
  ): Promise<RosterImportResult> {
    return importRoster(this.dbs.db, m.organizationId, auth.userId, input);
  }

  async list(m: MembershipContext): Promise<GroupSummary[]> {
    const rows = await this.dbs.db
      .select({
        id: groups.id,
        name: groups.name,
        code: groups.code,
        createdAt: groups.createdAt,
        students: sql<number>`(select count(*)::int from ${groupStudents} gs where gs.group_id = ${groups.id})`,
        teachers: sql<number>`(select count(*)::int from ${groupTeachers} gt where gt.group_id = ${groups.id})`,
      })
      .from(groups)
      .where(eq(groups.organizationId, m.organizationId))
      .orderBy(asc(groups.name));
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  }

  async students(
    m: MembershipContext,
    groupId: string,
  ): Promise<{ group: GroupSummary; students: GroupStudentRow[] }> {
    const group = (await this.list(m)).find((g) => g.id === groupId);
    if (!group) throw new NotFoundException('Guruh topilmadi');
    const rows = await this.dbs.db
      .select({
        userId: users.id,
        fullName: users.fullName,
        login: users.login,
        email: users.email,
        disabledAt: users.disabledAt,
        mustChangePassword: users.mustChangePassword,
        passwordHash: users.passwordHash,
        addedAt: groupStudents.createdAt,
      })
      .from(groupStudents)
      .innerJoin(users, eq(users.id, groupStudents.userId))
      .where(
        and(eq(groupStudents.groupId, groupId), eq(groupStudents.organizationId, m.organizationId)),
      )
      .orderBy(asc(users.fullName));
    return {
      group,
      // The hash is read only to tell whether a password exists; it never leaves this method.
      students: rows.map(({ passwordHash, disabledAt, addedAt, ...r }) => ({
        ...r,
        disabled: disabledAt !== null,
        hasPassword: passwordHash !== UNUSABLE_PASSWORD_HASH,
        addedAt: addedAt.toISOString(),
      })),
    };
  }
}
