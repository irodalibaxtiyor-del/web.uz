import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, inArray, sql } from 'drizzle-orm';
import {
  compareExperiment,
  experimentConclusions,
  type ExperimentGroup,
  type ExperimentView,
  type SetExperimentGroupsInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  courseAssessments,
  courseExperimentGroups,
  enrollments,
  groups,
  groupStudents,
} from '../db/schema';
import { AssessmentsService } from './assessments.service';

@Injectable()
export class ExperimentService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly assessments: AssessmentsService,
    private readonly audit: AuditService,
  ) {}

  async view(auth: AuthContext, m: MembershipContext, courseId: string): Promise<ExperimentView> {
    await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const list = await this.groups(db, m.organizationId, courseId);
    const role = new Map(list.map((g) => [g.id, g.role]));
    const rows = await this.assessments.resultRows(db, m.organizationId, courseId);
    const [post] = await db
      .select({ passing: courseAssessments.passingPercent })
      .from(courseAssessments)
      .where(and(eq(courseAssessments.courseId, courseId), eq(courseAssessments.kind, 'POSTTEST')));
    const passing = post?.passing ?? 60;
    const pick = (r: 'EXPERIMENT' | 'CONTROL') =>
      rows.filter((x) => x.groupId !== null && role.get(x.groupId) === r);
    const stats = compareExperiment(pick('EXPERIMENT'), pick('CONTROL'), passing);
    return {
      groups: list,
      postPassingPercent: passing,
      stats,
      conclusions: experimentConclusions(stats),
    };
  }

  /** Replaces the roles of the listed groups (null removes a group from the experiment). */
  async setGroups(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    input: SetExperimentGroupsInput,
  ): Promise<ExperimentView> {
    await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const ids = [...new Set(input.groups.map((g) => g.groupId))];
    if (ids.length) {
      const own = await db
        .select({ id: groups.id })
        .from(groups)
        .where(and(inArray(groups.id, ids), eq(groups.organizationId, m.organizationId)));
      // Groups of another organization look exactly like missing ones.
      if (own.length !== ids.length) throw new NotFoundException('Guruh topilmadi');
    }
    await db.transaction(async (tx) => {
      const t = tx as unknown as Db;
      for (const g of input.groups) {
        if (g.role === null) {
          await t
            .delete(courseExperimentGroups)
            .where(
              and(
                eq(courseExperimentGroups.courseId, courseId),
                eq(courseExperimentGroups.groupId, g.groupId),
              ),
            );
        } else {
          await t
            .insert(courseExperimentGroups)
            .values({ courseId, groupId: g.groupId, role: g.role, updatedBy: auth.userId })
            .onConflictDoUpdate({
              target: [courseExperimentGroups.courseId, courseExperimentGroups.groupId],
              set: { role: g.role, updatedBy: auth.userId, updatedAt: new Date() },
            });
        }
      }
    });
    await this.audit.record({
      action: 'experiment.groups_set',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course',
      targetId: courseId,
      metadata: { groups: input.groups },
    });
    return this.view(auth, m, courseId);
  }

  /** Every group of the organization, its students enrolled in the course and its role. */
  private async groups(db: Db, orgId: string, courseId: string): Promise<ExperimentGroup[]> {
    const rows = await db
      .select({
        id: groups.id,
        name: groups.name,
        role: courseExperimentGroups.role,
        students: sql<number>`count(${enrollments.userId})::int`,
      })
      .from(groups)
      .leftJoin(
        courseExperimentGroups,
        and(
          eq(courseExperimentGroups.groupId, groups.id),
          eq(courseExperimentGroups.courseId, courseId),
        ),
      )
      .leftJoin(groupStudents, eq(groupStudents.groupId, groups.id))
      .leftJoin(
        enrollments,
        and(eq(enrollments.userId, groupStudents.userId), eq(enrollments.courseId, courseId)),
      )
      .where(eq(groups.organizationId, orgId))
      .groupBy(groups.id, groups.name, courseExperimentGroups.role)
      .orderBy(groups.name);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      students: r.students,
      role: r.role ?? null,
    }));
  }
}
