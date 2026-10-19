import { Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, desc, eq, gte, inArray, lt, sql } from 'drizzle-orm';
import {
  REPEATED_FAILURES,
  type CheckRule,
  type CheckRunStatus,
  type ExerciseProgress,
  type GroupCard,
  type GroupOverview,
  type GroupStudentCourse,
  type GroupStudentOverview,
  type LessonProgressDetail,
  type LessonRef,
  type ScoreEntry,
  type StruggleItem,
  type StruggleStatus,
  type StudentCourseDetail,
  type StudentDetail,
} from '@webdizayn/shared';
import type { AuthContext, MembershipContext } from '../common/types';
import { FactsIndex, key, loadFacts, type Facts } from '../analytics/analytics-facts';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  checkRuns,
  courses,
  enrollments,
  groups,
  groupStudents,
  groupTeachers,
  lessons,
  modules,
  quizzes,
  submissionReviews,
  submissions,
  submissionVersions,
  users,
} from '../db/schema';

export interface GroupRef {
  id: string;
  name: string;
  code: string;
}

export interface Roster {
  group: GroupRef;
  students: { userId: string; fullName: string; login: string | null; disabled: boolean }[];
}

/** Grade, source and grader of one submission (latest GRADED/FINALIZED review). */
interface Grade {
  submissionId: string;
  userId: string;
  assignmentId: string;
  gradedAt: Date;
  gradedBy: string | null;
  feedback: string;
  final: boolean;
}

export interface LatestRun {
  userId: string;
  exerciseId: string;
  status: CheckRunStatus;
  at: Date;
  rules: CheckRule[];
  results: { id: string; passed: boolean }[] | null;
}

/** Everything a group view or export is computed from. */
export interface GroupData {
  facts: Facts;
  index: FactsIndex;
  courseTitles: Map<string, string>;
  quizTitles: Map<string, string>;
  enrolled: Map<string, string[]>;
  grades: Map<string, Grade>;
  versions: Map<string, number>;
  latestRuns: Map<string, LatestRun>;
}

const iso = (d: Date | null) => (d ? d.toISOString() : null);

/**
 * Group panel. Access: ORG_ADMIN sees every group of the organization, a TEACHER only the
 * groups an admin assigned (group_teachers). Anything else is 404, whatever the URL or body says.
 */
@Injectable()
export class MonitoringService {
  constructor(private readonly dbs: DbService) {}

  private get db(): Db {
    return this.dbs.db;
  }

  async accessibleGroups(auth: AuthContext, m: MembershipContext): Promise<GroupCard[]> {
    const count = sql<number>`(select count(*)::int from ${groupStudents} gs where gs.group_id = ${groups.id})`;
    const base = this.db
      .select({ id: groups.id, name: groups.name, code: groups.code, students: count })
      .from(groups);
    const rows =
      m.role === 'ORG_ADMIN'
        ? await base.where(eq(groups.organizationId, m.organizationId)).orderBy(asc(groups.name))
        : await base
            .innerJoin(groupTeachers, eq(groupTeachers.groupId, groups.id))
            .where(
              and(
                eq(groups.organizationId, m.organizationId),
                eq(groupTeachers.userId, auth.userId),
              ),
            )
            .orderBy(asc(groups.name));
    return rows;
  }

  async assertGroup(auth: AuthContext, m: MembershipContext, groupId: string): Promise<GroupRef> {
    const group = (await this.accessibleGroups(auth, m)).find((g) => g.id === groupId);
    if (!group) throw new NotFoundException('Guruh topilmadi');
    return { id: group.id, name: group.name, code: group.code };
  }

  async roster(group: GroupRef): Promise<Roster> {
    const rows = await this.db
      .select({
        userId: users.id,
        fullName: users.fullName,
        login: users.login,
        disabledAt: users.disabledAt,
      })
      .from(groupStudents)
      .innerJoin(users, eq(users.id, groupStudents.userId))
      .where(eq(groupStudents.groupId, group.id))
      .orderBy(asc(users.fullName));
    return {
      group,
      students: rows.map(({ disabledAt, ...r }) => ({ ...r, disabled: disabledAt !== null })),
    };
  }

  /**
   * Loads the learning records of these students in this organization's courses. `range`
   * limits CHECK runs and grades to a period (exports); progress is always the current state.
   */
  async load(
    orgId: string,
    userIds: string[],
    opts: { courseId?: string; range?: { from: Date; to: Date } } = {},
  ): Promise<GroupData> {
    const db = this.db;
    const enrollRows = userIds.length
      ? await db
          .select({
            userId: enrollments.userId,
            courseId: enrollments.courseId,
            title: courses.title,
          })
          .from(enrollments)
          .innerJoin(courses, eq(courses.id, enrollments.courseId))
          .where(
            and(
              eq(courses.organizationId, orgId),
              inArray(enrollments.userId, userIds),
              opts.courseId ? eq(courses.id, opts.courseId) : undefined,
            ),
          )
          .orderBy(asc(courses.position), asc(courses.title))
      : [];
    const courseTitles = new Map(enrollRows.map((r) => [r.courseId, r.title]));
    const enrolled = new Map<string, string[]>();
    for (const r of enrollRows)
      enrolled.set(r.userId, [...(enrolled.get(r.userId) ?? []), r.courseId]);
    const courseIds = [...courseTitles.keys()];

    const facts = await loadFacts(db, { courseIds, userIds });
    if (opts.range) facts.runs = await this.rangedRuns(courseIds, userIds, opts.range);

    const [quizRows, gradeRows, versionRows, runRows] = courseIds.length
      ? await Promise.all([
          db
            .select({ id: quizzes.id, title: quizzes.title })
            .from(quizzes)
            .where(inArray(quizzes.courseId, courseIds)),
          db
            .selectDistinctOn([submissionReviews.submissionId], {
              submissionId: submissionReviews.submissionId,
              userId: submissions.userId,
              assignmentId: submissions.assignmentId,
              gradedAt: submissionReviews.createdAt,
              gradedBy: users.fullName,
              feedback: submissionReviews.feedback,
              action: submissionReviews.action,
            })
            .from(submissionReviews)
            .innerJoin(submissions, eq(submissions.id, submissionReviews.submissionId))
            .leftJoin(users, eq(users.id, submissionReviews.reviewerId))
            .where(
              and(
                inArray(submissions.courseId, courseIds),
                inArray(submissions.userId, userIds),
                inArray(submissionReviews.action, ['GRADED', 'FINALIZED']),
              ),
            )
            .orderBy(submissionReviews.submissionId, desc(submissionReviews.createdAt)),
          db
            .select({
              submissionId: submissionVersions.submissionId,
              n: sql<number>`count(*)::int`,
            })
            .from(submissionVersions)
            .innerJoin(submissions, eq(submissions.id, submissionVersions.submissionId))
            .where(
              and(inArray(submissions.courseId, courseIds), inArray(submissions.userId, userIds)),
            )
            .groupBy(submissionVersions.submissionId),
          db
            .selectDistinctOn([checkRuns.userId, checkRuns.exerciseId], {
              userId: checkRuns.userId,
              exerciseId: checkRuns.exerciseId,
              status: checkRuns.status,
              at: checkRuns.createdAt,
              rules: checkRuns.rules,
              results: checkRuns.results,
            })
            .from(checkRuns)
            .where(
              and(
                inArray(checkRuns.courseId, courseIds),
                inArray(checkRuns.userId, userIds),
                inArray(checkRuns.status, ['PASSED', 'FAILED', 'ERROR', 'TIMEOUT']),
                opts.range ? gte(checkRuns.createdAt, opts.range.from) : undefined,
                opts.range ? lt(checkRuns.createdAt, opts.range.to) : undefined,
              ),
            )
            .orderBy(checkRuns.userId, checkRuns.exerciseId, desc(checkRuns.createdAt)),
        ])
      : [[], [], [], []];

    // Submission ids are needed to join grades and version counts to the facts rows.
    const subRows = courseIds.length
      ? await db
          .select({
            id: submissions.id,
            userId: submissions.userId,
            assignmentId: submissions.assignmentId,
          })
          .from(submissions)
          .where(
            and(inArray(submissions.courseId, courseIds), inArray(submissions.userId, userIds)),
          )
      : [];
    const subKey = new Map(subRows.map((s) => [s.id, key(s.userId, s.assignmentId)]));

    const grades = new Map<string, Grade>();
    for (const g of gradeRows) {
      if (opts.range && (g.gradedAt < opts.range.from || g.gradedAt >= opts.range.to)) continue;
      grades.set(key(g.userId, g.assignmentId), { ...g, final: g.action === 'FINALIZED' });
    }
    const versions = new Map<string, number>();
    for (const v of versionRows) {
      const k = subKey.get(v.submissionId);
      if (k) versions.set(k, v.n);
    }
    const latestRuns = new Map<string, LatestRun>();
    for (const r of runRows) latestRuns.set(key(r.userId, r.exerciseId), r);

    return {
      facts,
      index: new FactsIndex(facts),
      courseTitles,
      quizTitles: new Map(quizRows.map((q) => [q.id, q.title])),
      enrolled,
      grades,
      versions,
      latestRuns,
    };
  }

  private async rangedRuns(
    courseIds: string[],
    userIds: string[],
    range: { from: Date; to: Date },
  ): Promise<Facts['runs']> {
    if (courseIds.length === 0) return [];
    const rows = await this.db
      .select({
        userId: checkRuns.userId,
        exerciseId: checkRuns.exerciseId,
        passed: sql<number>`(count(*) filter (where ${checkRuns.status} = 'PASSED'))::int`,
        failed: sql<number>`(count(*) filter (where ${checkRuns.status} = 'FAILED'))::int`,
        errored: sql<number>`(count(*) filter (where ${checkRuns.status} in ('ERROR', 'TIMEOUT')))::int`,
        first: sql<CheckRunStatus | null>`(array_agg(${checkRuns.status}::text order by ${checkRuns.createdAt}) filter (where ${checkRuns.status} in ('PASSED', 'FAILED')))[1]`,
        last: sql<string | null>`max(${checkRuns.createdAt})`,
      })
      .from(checkRuns)
      .where(
        and(
          inArray(checkRuns.courseId, courseIds),
          inArray(checkRuns.userId, userIds),
          gte(checkRuns.createdAt, range.from),
          lt(checkRuns.createdAt, range.to),
        ),
      )
      .groupBy(checkRuns.userId, checkRuns.exerciseId);
    return rows.map((r) => ({ ...r, last: r.last ? new Date(r.last) : null }));
  }

  // ---------- Derived views ----------

  lessonRef(data: GroupData, courseId: string, lessonId: string | null): LessonRef | null {
    if (!lessonId) return null;
    const l = data.facts.lessons.get(courseId)?.find((x) => x.id === lessonId);
    return l ? { lessonId: l.id, title: l.title, moduleTitle: l.moduleTitle } : null;
  }

  courseSummary(data: GroupData, userId: string, courseId: string): GroupStudentCourse {
    const s = data.index.stats(userId, courseId);
    const available = data.facts.assignments.filter((a) => a.courseId === courseId);
    let points = 0;
    let graded = 0;
    for (const a of available) {
      const e = this.scoreEntry(data, userId, a);
      if (e.score !== null && e.gradedAt) {
        points += e.score;
        graded++;
      }
    }
    return {
      courseId,
      percent: s.percent,
      lessonsCompleted: s.lessonsCompleted,
      lessonsTotal: s.lessonsTotal,
      currentLesson: this.lessonRef(data, courseId, s.frontierLessonId),
      exercises: {
        total: s.exercises.total,
        passed: s.exercises.passed,
        needsImprovement: s.exercises.needsImprovement,
      },
      checks: { runs: s.checks.runs, passed: s.checks.passed, failed: s.checks.failed },
      quizzes: { total: s.quizzes.total, passed: s.quizzes.passed },
      assignments: {
        available: available.length,
        graded,
        points,
        maxPoints: available.reduce((sum, a) => sum + a.maxScore, 0),
      },
      lastActivityAt: iso(s.lastActivityAt),
    };
  }

  scoreEntry(data: GroupData, userId: string, a: Facts['assignments'][number]): ScoreEntry {
    const sub = data.facts.submissions.find((s) => s.userId === userId && s.assignmentId === a.id);
    const grade = data.grades.get(key(userId, a.id));
    const graded = sub && (sub.status === 'GRADED' || sub.status === 'FINALIZED') && grade;
    return {
      assignmentId: a.id,
      courseId: a.courseId,
      title: a.title,
      status: sub?.lastSubmittedAt ? sub.status : 'NOT_SUBMITTED',
      score: graded ? sub.score : null,
      maxScore: a.maxScore,
      versions: data.versions.get(key(userId, a.id)) ?? 0,
      gradedAt: graded ? grade.gradedAt.toISOString() : null,
      gradedBy: graded ? grade.gradedBy : null,
      feedback: graded ? grade.feedback || null : null,
      final: Boolean(graded && sub.status === 'FINALIZED'),
    };
  }

  unmet(data: GroupData, userId: string, exerciseId: string) {
    const run = data.latestRuns.get(key(userId, exerciseId));
    if (!run || run.status !== 'FAILED' || !run.results) return [];
    const failed = new Set(run.results.filter((r) => !r.passed).map((r) => r.id));
    return run.rules
      .filter((r) => failed.has(r.id))
      .map((r) => ({ title: r.title, hidden: r.hidden }));
  }

  /** Concrete facts only; see StruggleStatus for how "no data" is told apart from "fine". */
  struggles(data: GroupData, userId: string): { status: StruggleStatus; items: StruggleItem[] } {
    const items: StruggleItem[] = [];
    const se = new Map(
      data.facts.studentExercises
        .filter((s) => s.userId === userId)
        .map((s) => [s.exerciseId, s.status]),
    );
    const lessonTitle = (courseId: string, lessonId: string) =>
      data.facts.lessons.get(courseId)?.find((l) => l.id === lessonId)?.title ?? '';
    const userRuns = data.facts.runs.filter((r) => r.userId === userId);
    const runsBy = new Map(userRuns.map((r) => [r.exerciseId, r]));

    for (const e of data.facts.exercises) {
      if (!(data.enrolled.get(userId) ?? []).includes(e.courseId)) continue;
      const status = se.get(e.id);
      const runs = runsBy.get(e.id);
      const base = {
        courseTitle: data.courseTitles.get(e.courseId) ?? '',
        lessonTitle: lessonTitle(e.courseId, e.lessonId),
        itemTitle: e.title,
        failedAttempts: runs?.failed ?? 0,
        unmet: this.unmet(data, userId, e.id),
      };
      if (status !== 'PASSED' && runs && runs.failed >= REPEATED_FAILURES) {
        items.push({ kind: 'REPEATED_CHECK_FAILURES', ...base });
      } else if (status === 'NEEDS_IMPROVEMENT') {
        items.push({ kind: 'NEEDS_IMPROVEMENT', ...base });
      }
    }
    const userAttempts = data.facts.attempts.filter((a) => a.userId === userId);
    for (const a of userAttempts) {
      if (a.passed || a.failed === 0) continue;
      const q = data.facts.quizzes.find((x) => x.id === a.quizId);
      if (!q) continue;
      items.push({
        kind: 'QUIZ_NOT_PASSED',
        courseTitle: data.courseTitles.get(q.courseId) ?? '',
        lessonTitle: lessonTitle(q.courseId, q.lessonId),
        itemTitle: data.quizTitles.get(q.id) ?? '',
        failedAttempts: a.failed,
        unmet: [],
      });
    }
    const userSubs = data.facts.submissions.filter((s) => s.userId === userId);
    for (const s of userSubs) {
      if (s.status !== 'REVISION_REQUESTED') continue;
      const a = data.facts.assignments.find((x) => x.id === s.assignmentId);
      if (!a) continue;
      items.push({
        kind: 'REVISION_REQUESTED',
        courseTitle: data.courseTitles.get(a.courseId) ?? '',
        lessonTitle: '',
        itemTitle: a.title,
        failedAttempts: 0,
        unmet: [],
      });
    }
    const hasData =
      userRuns.some((r) => r.passed + r.failed > 0) ||
      userAttempts.length > 0 ||
      userSubs.some((s) => s.lastSubmittedAt) ||
      [...se.values()].some((s) => s === 'PASSED' || s === 'NEEDS_IMPROVEMENT');
    const status: StruggleStatus =
      items.length > 0 ? 'STRUGGLING' : hasData ? 'OK' : 'INSUFFICIENT_DATA';
    return { status, items };
  }

  studentOverview(data: GroupData, s: Roster['students'][number]): GroupStudentOverview {
    const courseIds = data.enrolled.get(s.userId) ?? [];
    const list = courseIds.map((c) => this.courseSummary(data, s.userId, c));
    const struggle = this.struggles(data, s.userId);
    const last = list
      .map((c) => c.lastActivityAt)
      .filter((d): d is string => d !== null)
      .sort()
      .at(-1);
    return {
      userId: s.userId,
      fullName: s.fullName,
      login: s.login,
      disabled: s.disabled,
      averagePercent: list.length
        ? Math.round(list.reduce((sum, c) => sum + c.percent, 0) / list.length)
        : null,
      points: list.reduce((sum, c) => sum + c.assignments.points, 0),
      maxPoints: list.reduce((sum, c) => sum + c.assignments.maxPoints, 0),
      lastActivityAt: last ?? null,
      struggle: struggle.status,
      struggleCount: struggle.items.length,
      courses: list,
    };
  }

  // ---------- Endpoints ----------

  async overview(auth: AuthContext, m: MembershipContext, groupId: string): Promise<GroupOverview> {
    const group = await this.assertGroup(auth, m, groupId);
    const roster = await this.roster(group);
    const data = await this.load(
      m.organizationId,
      roster.students.map((s) => s.userId),
    );
    return {
      group,
      generatedAt: new Date().toISOString(),
      courses: await this.courseOutline(data),
      students: roster.students.map((s) => this.studentOverview(data, s)),
    };
  }

  async student(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    studentId: string,
  ): Promise<StudentDetail> {
    const group = await this.assertGroup(auth, m, groupId);
    const roster = await this.roster(group);
    const s = roster.students.find((x) => x.userId === studentId);
    if (!s) throw new NotFoundException('Talaba topilmadi');
    const data = await this.load(m.organizationId, [s.userId]);
    const progress = data.facts.progress.filter((p) => p.userId === s.userId);
    const completed = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
    const started = new Set(progress.map((p) => p.lessonId));
    const se = new Map(data.facts.studentExercises.map((x) => [x.exerciseId, x.status]));
    const runs = new Map(data.facts.runs.map((r) => [r.exerciseId, r]));
    const attempts = new Map(data.facts.attempts.map((a) => [a.quizId, a]));

    const courseDetails: StudentCourseDetail[] = (data.enrolled.get(s.userId) ?? []).map(
      (courseId) => {
        const summary = this.courseSummary(data, s.userId, courseId);
        const lessonList: LessonProgressDetail[] = (data.facts.lessons.get(courseId) ?? []).map(
          (l) => ({
            lessonId: l.id,
            title: l.title,
            moduleTitle: l.moduleTitle,
            state: completed.has(l.id)
              ? 'COMPLETED'
              : started.has(l.id)
                ? 'IN_PROGRESS'
                : 'NOT_STARTED',
            exercises: data.facts.exercises
              .filter((e) => e.lessonId === l.id)
              .map((e): ExerciseProgress => {
                const r = runs.get(e.id);
                const latest = data.latestRuns.get(key(s.userId, e.id));
                const status = se.get(e.id) ?? 'NOT_STARTED';
                return {
                  exerciseId: e.id,
                  title: e.title,
                  status,
                  checks: {
                    runs: r ? r.passed + r.failed + r.errored : 0,
                    passed: r?.passed ?? 0,
                    failed: r?.failed ?? 0,
                    errored: r?.errored ?? 0,
                    lastStatus: latest?.status ?? null,
                    lastAt: iso(latest?.at ?? null),
                  },
                  unmet: status === 'PASSED' ? [] : this.unmet(data, s.userId, e.id),
                };
              }),
            quizzes: data.facts.quizzes
              .filter((q) => q.lessonId === l.id)
              .map((q) => {
                const a = attempts.get(q.id);
                return {
                  quizId: q.id,
                  title: data.quizTitles.get(q.id) ?? '',
                  attempts: a?.attempts ?? 0,
                  bestPercent: a ? a.best : null,
                  passed: a?.passed ?? false,
                };
              }),
          }),
        );
        return {
          courseId,
          title: data.courseTitles.get(courseId) ?? '',
          percent: summary.percent,
          lessonsCompleted: summary.lessonsCompleted,
          lessonsTotal: summary.lessonsTotal,
          currentLesson: summary.currentLesson,
          lastActivityAt: summary.lastActivityAt,
          lessons: lessonList,
          assignments: data.facts.assignments
            .filter((a) => a.courseId === courseId)
            .map((a) => this.scoreEntry(data, s.userId, a)),
        };
      },
    );
    const overview = this.studentOverview(data, s);
    const struggle = this.struggles(data, s.userId);
    return {
      student: {
        userId: s.userId,
        fullName: s.fullName,
        login: s.login,
        disabled: s.disabled,
        group: { id: group.id, name: group.name },
      },
      generatedAt: new Date().toISOString(),
      runResults: 'NOT_STORED',
      points: overview.points,
      maxPoints: overview.maxPoints,
      struggle: struggle.status,
      struggles: struggle.items,
      courses: courseDetails,
    };
  }

  private async courseOutline(data: GroupData): Promise<GroupOverview['courses']> {
    const ids = [...data.courseTitles.keys()];
    const rows = ids.length
      ? await this.db
          .select({
            courseId: lessons.courseId,
            moduleId: modules.id,
            moduleTitle: modules.title,
            lessonId: lessons.id,
            lessonTitle: lessons.title,
          })
          .from(lessons)
          .innerJoin(modules, eq(modules.id, lessons.moduleId))
          .where(inArray(lessons.courseId, ids))
          .orderBy(modules.position, modules.createdAt, lessons.position, lessons.createdAt)
      : [];
    return ids.map((courseId) => {
      const mods: GroupOverview['courses'][number]['modules'] = [];
      for (const r of rows.filter((x) => x.courseId === courseId)) {
        let mod = mods.find((m) => m.moduleId === r.moduleId);
        if (!mod) {
          mod = { moduleId: r.moduleId, title: r.moduleTitle, lessons: [] };
          mods.push(mod);
        }
        mod.lessons.push({ lessonId: r.lessonId, title: r.lessonTitle });
      }
      return {
        courseId,
        title: data.courseTitles.get(courseId) ?? '',
        lessonsTotal: data.facts.lessons.get(courseId)?.length ?? 0,
        modules: mods,
      };
    });
  }

  /** Lesson ids of a course restricted to one module or one lesson (export filters). */
  async lessonFilter(
    courseId: string,
    moduleId?: string,
    lessonId?: string,
  ): Promise<Set<string> | null> {
    if (!moduleId && !lessonId) return null;
    const rows = await this.db
      .select({ id: lessons.id })
      .from(lessons)
      .where(
        and(
          eq(lessons.courseId, courseId),
          moduleId ? eq(lessons.moduleId, moduleId) : undefined,
          lessonId ? eq(lessons.id, lessonId) : undefined,
        ),
      );
    if (rows.length === 0) throw new NotFoundException('Modul yoki dars topilmadi');
    return new Set(rows.map((r) => r.id));
  }
}
