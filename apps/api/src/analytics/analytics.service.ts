import { Injectable } from '@nestjs/common';
import { and, count, eq, gte, inArray, max, ne, sql, type AnyColumn, type SQL } from 'drizzle-orm';
import {
  PROGRESS_BUCKETS,
  progressBucket,
  rate,
  SUBMISSION_STATUSES,
  struggleReasons,
  trendWeeks,
  type AssignmentAnalytics,
  type CheckRule,
  type CommonError,
  type CourseAnalytics,
  type OrgAnalytics,
  type OrgWeeklyPoint,
  type StudentAiUsage,
  type StudentAnalytics,
  type StudentCourseAnalytics,
  type SubmissionStatus,
  type WeeklyPoint,
} from '@webdizayn/shared';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  aiFeedback,
  aiInteractions,
  assignments,
  checkRuns,
  courses,
  courseTeachers,
  enrollments,
  lessonProgress,
  memberships,
  quizAttempts,
  submissionReviews,
  submissions,
  submissionVersions,
  users,
} from '../db/schema';
import { FactsIndex, key, loadFacts, successRate } from './analytics-facts';

const DAY = 86_400_000;
/** Most recent failed runs scanned for common errors; keeps the query bounded. */
const COMMON_ERRORS_SCAN = 5000;

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
  ) {}

  // ---------------------------------------------------------------- student

  /** The session user's own numbers in every course they are enrolled in. */
  async student(auth: AuthContext, now = new Date()): Promise<StudentAnalytics> {
    const db = this.dbs.db;
    // Only courses of organizations the user still belongs to, and never drafts.
    const rows = await db
      .select({
        courseId: courses.id,
        organizationId: courses.organizationId,
        title: courses.title,
        status: courses.status,
      })
      .from(enrollments)
      .innerJoin(courses, eq(courses.id, enrollments.courseId))
      .innerJoin(
        memberships,
        and(
          eq(memberships.organizationId, courses.organizationId),
          eq(memberships.userId, enrollments.userId),
        ),
      )
      .where(and(eq(enrollments.userId, auth.userId), ne(courses.status, 'DRAFT')))
      .orderBy(courses.title);

    const courseIds = rows.map((r) => r.courseId);
    const index = new FactsIndex(await loadFacts(db, { courseIds, userIds: [auth.userId] }));

    const result: StudentCourseAnalytics[] = rows.map((c) => {
      const s = index.stats(auth.userId, c.courseId);
      return {
        organizationId: c.organizationId,
        courseId: c.courseId,
        title: c.title,
        status: c.status,
        progress: {
          lessonsCompleted: s.lessonsCompleted,
          lessonsTotal: s.lessonsTotal,
          percent: s.percent,
          completed: s.lessonsTotal > 0 && s.lessonsCompleted === s.lessonsTotal,
        },
        exercises: s.exercises,
        checks: {
          runs: s.checks.runs,
          passed: s.checks.passed,
          failed: s.checks.failed,
          errored: s.checks.errored,
          successRate: successRate(s.checks),
          firstTryRate: rate(s.checks.firstTry, s.checks.tried),
        },
        assignments: {
          available: s.assignments.available,
          submitted: s.assignments.submitted,
          graded: s.assignments.graded,
          revisionsRequested: s.assignments.revisionsRequested,
          averageScore: rate(s.assignments.scoreSum, s.assignments.graded),
        },
        quizzes: {
          total: s.quizzes.total,
          passed: s.quizzes.passed,
          averageBest: rate(s.quizzes.bestSum / 100, s.quizzes.attempted),
        },
        weakTopics: s.weakTopics,
        lastActivityAt: s.lastActivityAt?.toISOString() ?? null,
      };
    });

    return {
      generatedAt: now.toISOString(),
      courses: result,
      trend: await this.trend(db, courseIds, [auth.userId], now),
      aiUsage: await this.aiUsage(db, auth.userId, courseIds),
    };
  }

  private async aiUsage(db: Db, userId: string, courseIds: string[]): Promise<StudentAiUsage> {
    const none = {
      available: true as const,
      requests: 0,
      hintsUsed: 0,
      handoffs: 0,
      helpful: 0,
      notHelpful: 0,
    };
    if (courseIds.length === 0) return none;
    const [row] = await db
      .select({
        requests: sql<number>`count(*)::int`,
        hints: sql<number>`(count(*) filter (where ${aiInteractions.hintNumber} is not null))::int`,
        handoffs: sql<number>`(count(*) filter (where ${aiInteractions.mode} = 'TEACHER_HANDOFF'))::int`,
        helpful: sql<number>`(count(*) filter (where ${aiFeedback.helpful}))::int`,
        notHelpful: sql<number>`(count(*) filter (where not ${aiFeedback.helpful}))::int`,
      })
      .from(aiInteractions)
      .leftJoin(aiFeedback, eq(aiFeedback.interactionId, aiInteractions.id))
      .where(and(eq(aiInteractions.userId, userId), inArray(aiInteractions.courseId, courseIds)));
    return {
      ...none,
      requests: row?.requests ?? 0,
      hintsUsed: row?.hints ?? 0,
      handoffs: row?.handoffs ?? 0,
      helpful: row?.helpful ?? 0,
      notHelpful: row?.notHelpful ?? 0,
    };
  }

  // ---------------------------------------------------------------- teacher

  /** Class view of one course: only for its assigned teachers and org admins. */
  async course(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    now = new Date(),
  ): Promise<CourseAnalytics> {
    const course = await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const facts = await loadFacts(db, { courseIds: [courseId] });
    const index = new FactsIndex(facts);
    const lessonList = facts.lessons.get(courseId) ?? [];

    const names = new Map(
      facts.enrollments.length === 0
        ? []
        : (
            await db
              .select({ id: users.id, fullName: users.fullName })
              .from(users)
              .where(
                inArray(
                  users.id,
                  facts.enrollments.map((e) => e.userId),
                ),
              )
          ).map((u) => [u.id, u.fullName]),
    );

    const perStudent = facts.enrollments.map((e) => ({
      enrollment: e,
      stats: index.stats(e.userId, courseId),
    }));
    const students = perStudent.length;
    const averagePercent = students
      ? Math.round(perStudent.reduce((sum, p) => sum + p.stats.percent, 0) / students)
      : 0;
    const completedCount = perStudent.filter(
      (p) => p.stats.lessonsTotal > 0 && p.stats.lessonsCompleted === p.stats.lessonsTotal,
    ).length;

    const distribution = PROGRESS_BUCKETS.map((bucket) => ({
      bucket,
      count: perStudent.filter((p) => progressBucket(p.stats.percent) === bucket).length,
    }));

    // Bottlenecks: where unfinished students currently are, and how hard that lesson's CHECK is.
    const stuck = new Map<string, number>();
    for (const p of perStudent) {
      if (p.stats.frontierLessonId) {
        stuck.set(p.stats.frontierLessonId, (stuck.get(p.stats.frontierLessonId) ?? 0) + 1);
      }
    }
    const lessonChecks = new Map<string, { passed: number; failed: number }>();
    const exerciseLesson = new Map(facts.exercises.map((e) => [e.id, e.lessonId]));
    for (const r of facts.runs) {
      const lessonId = exerciseLesson.get(r.exerciseId);
      if (!lessonId) continue;
      const c = lessonChecks.get(lessonId) ?? { passed: 0, failed: 0 };
      c.passed += r.passed;
      c.failed += r.failed;
      lessonChecks.set(lessonId, c);
    }
    const bottlenecks = lessonList
      .filter((l) => (stuck.get(l.id) ?? 0) > 0)
      .map((l) => ({
        lessonId: l.id,
        lessonTitle: l.title,
        moduleTitle: l.moduleTitle,
        stuckStudents: stuck.get(l.id) ?? 0,
        checkFailRate: lessonChecks.has(l.id)
          ? rate(
              lessonChecks.get(l.id)!.failed,
              lessonChecks.get(l.id)!.passed + lessonChecks.get(l.id)!.failed,
            )
          : null,
      }))
      .sort((a, b) => b.stuckStudents - a.stuckStudents)
      .slice(0, 5);

    const checkIssues = facts.runs.reduce(
      (acc, r) => ({ ...acc, errors: acc.errors + r.errored }),
      { timeouts: 0, errors: 0 },
    );
    const [timeouts] = await db
      .select({ n: count() })
      .from(checkRuns)
      .where(and(eq(checkRuns.courseId, courseId), eq(checkRuns.status, 'TIMEOUT')));
    checkIssues.timeouts = timeouts?.n ?? 0;
    checkIssues.errors -= checkIssues.timeouts;

    // Assignments
    const enrolled = new Set(facts.enrollments.map((e) => e.userId));
    const assignmentsView: AssignmentAnalytics[] = facts.assignments.map((a) => {
      const subs = facts.submissions.filter(
        (s) => s.assignmentId === a.id && enrolled.has(s.userId),
      );
      const statuses = Object.fromEntries(SUBMISSION_STATUSES.map((s) => [s, 0])) as Record<
        SubmissionStatus,
        number
      >;
      for (const s of subs) statuses[s.status]++;
      const submitted = subs.filter((s) => s.lastSubmittedAt);
      const graded = subs.filter(
        (s) => (s.status === 'GRADED' || s.status === 'FINALIZED') && s.score !== null,
      );
      const reviewed = subs.filter(
        (s) => s.revisionEverRequested || s.status === 'GRADED' || s.status === 'FINALIZED',
      );
      return {
        assignmentId: a.id,
        title: a.title,
        status: a.status,
        deadline: a.deadline?.toISOString() ?? null,
        notSubmitted: students - submitted.length,
        statuses,
        late: subs.filter((s) => s.late).length,
        averageScore:
          a.maxScore > 0
            ? rate(
                graded.reduce((sum, s) => sum + (s.score ?? 0) / a.maxScore, 0),
                graded.length,
              )
            : null,
        revisionRate: rate(subs.filter((s) => s.revisionEverRequested).length, reviewed.length),
      };
    });
    const reviewedAll = facts.submissions.filter(
      (s) => s.revisionEverRequested || s.status === 'GRADED' || s.status === 'FINALIZED',
    );
    const revisionRequested = facts.submissions.filter((s) => s.revisionEverRequested).length;

    const strugglingStudents = perStudent
      .map((p) => ({
        userId: p.enrollment.userId,
        fullName: names.get(p.enrollment.userId) ?? '',
        progressPercent: p.stats.percent,
        lastActivityAt: p.stats.lastActivityAt?.toISOString() ?? null,
        reasons: struggleReasons(
          {
            ...p.stats.signals,
            progressPercent: p.stats.percent,
            classAveragePercent: averagePercent,
            enrolledAt: p.enrollment.createdAt,
          },
          now,
        ),
      }))
      .filter((s) => s.reasons.length > 0)
      .sort((a, b) => b.reasons.length - a.reasons.length || a.progressPercent - b.progressPercent);

    return {
      generatedAt: now.toISOString(),
      course: { id: course.id, title: course.title, status: course.status },
      students,
      progress: { averagePercent, completedCount, distribution },
      bottlenecks,
      commonErrors: await this.commonErrors(db, courseId, facts.exercises),
      checkIssues,
      assignments: assignmentsView,
      revisions: {
        reviewed: reviewedAll.length,
        revisionRequested,
        rate: rate(revisionRequested, reviewedAll.length),
      },
      strugglingStudents,
      trend: await this.trend(db, [courseId], undefined, now),
    };
  }

  /** Which CHECK rules fail most often. Staff-only, so hidden rule titles are included. */
  private async commonErrors(
    db: Db,
    courseId: string,
    exerciseList: { id: string; title: string }[],
  ): Promise<CommonError[]> {
    const titles = new Map(exerciseList.map((e) => [e.id, e.title]));
    const rows = await db
      .select({
        exerciseId: checkRuns.exerciseId,
        userId: checkRuns.userId,
        rules: checkRuns.rules,
        results: checkRuns.results,
      })
      .from(checkRuns)
      .where(and(eq(checkRuns.courseId, courseId), eq(checkRuns.status, 'FAILED')))
      .orderBy(sql`${checkRuns.createdAt} desc`)
      .limit(COMMON_ERRORS_SCAN);

    const agg = new Map<string, CommonError & { users: Set<string> }>();
    for (const r of rows) {
      if (!titles.has(r.exerciseId)) continue; // inactive exercise
      const rules = new Map((r.rules as CheckRule[]).map((rule) => [rule.id, rule]));
      for (const res of r.results ?? []) {
        if (res.passed) continue;
        const rule = rules.get(res.id);
        const k = key(r.exerciseId, res.id);
        let e = agg.get(k);
        if (!e) {
          e = {
            exerciseId: r.exerciseId,
            exerciseTitle: titles.get(r.exerciseId) ?? '',
            ruleId: res.id,
            ruleTitle: rule?.title ?? res.id,
            hidden: rule?.hidden ?? false,
            failedRuns: 0,
            students: 0,
            users: new Set(),
          };
          agg.set(k, e);
        }
        e.failedRuns++;
        e.users.add(r.userId);
      }
    }
    return [...agg.values()]
      .map(({ users: u, ...e }) => ({ ...e, students: u.size }))
      .sort((a, b) => b.students - a.students || b.failedRuns - a.failedRuns)
      .slice(0, 10);
  }

  // ---------------------------------------------------------------- organization

  /** Organization-wide view: ORG_ADMIN only (enforced by the controller). */
  async organization(m: MembershipContext, now = new Date()): Promise<OrgAnalytics> {
    const db = this.dbs.db;
    const orgId = m.organizationId;
    const last30 = new Date(now.getTime() - 30 * DAY);
    const last7 = new Date(now.getTime() - 7 * DAY);

    const courseRows = await db
      .select({ id: courses.id, title: courses.title, status: courses.status })
      .from(courses)
      .where(eq(courses.organizationId, orgId))
      .orderBy(courses.title);
    const courseIds = courseRows.map((c) => c.id);

    const [roleRows, facts, runs30, subs30] = await Promise.all([
      db
        .select({ role: memberships.role, n: count() })
        .from(memberships)
        .where(eq(memberships.organizationId, orgId))
        .groupBy(memberships.role),
      loadFacts(db, { courseIds }),
      courseIds.length
        ? db
            .select({ courseId: checkRuns.courseId, n: count() })
            .from(checkRuns)
            .where(and(inArray(checkRuns.courseId, courseIds), gte(checkRuns.createdAt, last30)))
            .groupBy(checkRuns.courseId)
        : Promise.resolve([]),
      courseIds.length
        ? db
            .select({ courseId: assignments.courseId, n: count() })
            .from(submissionVersions)
            .innerJoin(assignments, eq(assignments.id, submissionVersions.assignmentId))
            .where(
              and(
                inArray(assignments.courseId, courseIds),
                gte(submissionVersions.submittedAt, last30),
              ),
            )
            .groupBy(assignments.courseId)
        : Promise.resolve([]),
    ]);
    const index = new FactsIndex(facts);
    const roleCount = (r: string) => roleRows.find((x) => x.role === r)?.n ?? 0;

    const lastByUser = new Map<string, Date>();
    let completedEnrollments = 0;
    const courseView = courseRows.map((c) => {
      const enrolled = facts.enrollments.filter((e) => e.courseId === c.id);
      const stats = enrolled.map((e) => ({ userId: e.userId, s: index.stats(e.userId, c.id) }));
      let active30 = 0;
      for (const { userId, s } of stats) {
        if (s.lastActivityAt) {
          if (s.lastActivityAt >= last30) active30++;
          const cur = lastByUser.get(userId);
          if (!cur || s.lastActivityAt > cur) lastByUser.set(userId, s.lastActivityAt);
        }
      }
      const completed = stats.filter(
        ({ s }) => s.lessonsTotal > 0 && s.lessonsCompleted === s.lessonsTotal,
      ).length;
      completedEnrollments += completed;
      return {
        courseId: c.id,
        title: c.title,
        status: c.status,
        students: enrolled.length,
        activeLast30: active30,
        averagePercent: stats.length
          ? Math.round(stats.reduce((sum, x) => sum + x.s.percent, 0) / stats.length)
          : 0,
        completedCount: completed,
        checkRunsLast30: runs30.find((r) => r.courseId === c.id)?.n ?? 0,
        submissionsLast30: subs30.find((r) => r.courseId === c.id)?.n ?? 0,
      };
    });

    const activeSince = (d: Date) => [...lastByUser.values()].filter((t) => t >= d).length;

    return {
      generatedAt: now.toISOString(),
      members: {
        students: roleCount('STUDENT'),
        teachers: roleCount('TEACHER'),
        admins: roleCount('ORG_ADMIN'),
      },
      engagement: {
        enrolledStudents: new Set(facts.enrollments.map((e) => e.userId)).size,
        activeLast7: activeSince(last7),
        activeLast30: activeSince(last30),
      },
      completion: {
        enrollments: facts.enrollments.length,
        completed: completedEnrollments,
        rate: rate(completedEnrollments, facts.enrollments.length),
      },
      courses: courseView,
      teachers: await this.teachers(db, orgId, last30),
      trend: await this.orgTrend(db, courseIds, now),
    };
  }

  private async teachers(db: Db, orgId: string, last30: Date) {
    const staff = await db
      .select({ userId: users.id, fullName: users.fullName, role: memberships.role })
      .from(memberships)
      .innerJoin(users, eq(users.id, memberships.userId))
      .where(
        and(
          eq(memberships.organizationId, orgId),
          inArray(memberships.role, ['TEACHER', 'ORG_ADMIN']),
        ),
      )
      .orderBy(users.fullName);
    if (staff.length === 0) return [];
    const staffIds = staff.map((s) => s.userId);

    const [assigned, reviews, pending] = await Promise.all([
      db
        .select({ userId: courseTeachers.userId, n: count() })
        .from(courseTeachers)
        .innerJoin(courses, eq(courses.id, courseTeachers.courseId))
        .where(and(eq(courses.organizationId, orgId), inArray(courseTeachers.userId, staffIds)))
        .groupBy(courseTeachers.userId),
      db
        .select({
          userId: submissionReviews.reviewerId,
          total: sql<number>`count(*)::int`,
          last30: sql<number>`(count(*) filter (where ${submissionReviews.createdAt} >= ${last30}))::int`,
          lastAt: max(submissionReviews.createdAt),
        })
        .from(submissionReviews)
        .innerJoin(submissions, eq(submissions.id, submissionReviews.submissionId))
        .innerJoin(courses, eq(courses.id, submissions.courseId))
        .where(
          and(eq(courses.organizationId, orgId), inArray(submissionReviews.reviewerId, staffIds)),
        )
        .groupBy(submissionReviews.reviewerId),
      db
        .select({ userId: courseTeachers.userId, n: count() })
        .from(submissions)
        .innerJoin(courseTeachers, eq(courseTeachers.courseId, submissions.courseId))
        .innerJoin(courses, eq(courses.id, submissions.courseId))
        .where(
          and(
            eq(courses.organizationId, orgId),
            eq(submissions.status, 'SUBMITTED'),
            inArray(courseTeachers.userId, staffIds),
          ),
        )
        .groupBy(courseTeachers.userId),
    ]);

    return staff.map((s) => {
      const r = reviews.find((x) => x.userId === s.userId);
      const lastAt = r?.lastAt ? new Date(r.lastAt) : null;
      return {
        userId: s.userId,
        fullName: s.fullName,
        role: s.role,
        courses: assigned.find((x) => x.userId === s.userId)?.n ?? 0,
        reviewsLast30: r?.last30 ?? 0,
        reviewsTotal: r?.total ?? 0,
        lastReviewAt: lastAt?.toISOString() ?? null,
        pendingReviews: pending.find((x) => x.userId === s.userId)?.n ?? 0,
      };
    });
  }

  // ---------------------------------------------------------------- trends

  private async trend(
    db: Db,
    courseIds: string[],
    userIds: string[] | undefined,
    now: Date,
  ): Promise<WeeklyPoint[]> {
    const weeks = trendWeeks(now);
    const points = new Map<string, WeeklyPoint>(
      weeks.map((w) => [w, { weekStart: w, checkRuns: 0, checksPassed: 0, lessonsCompleted: 0 }]),
    );
    if (courseIds.length === 0) return [...points.values()];
    const start = new Date(`${weeks[0]}T00:00:00Z`);
    const runUsers = userIds ? inArray(checkRuns.userId, userIds) : undefined;
    const progressUsers = userIds ? inArray(lessonProgress.userId, userIds) : undefined;

    const [runRows, lessonRows] = await Promise.all([
      db
        .select({
          week: weekOf(checkRuns.createdAt),
          n: sql<number>`count(*)::int`,
          passed: sql<number>`(count(*) filter (where ${checkRuns.status} = 'PASSED'))::int`,
        })
        .from(checkRuns)
        .where(
          and(inArray(checkRuns.courseId, courseIds), gte(checkRuns.createdAt, start), runUsers),
        )
        .groupBy(sql`1`),
      db
        .select({ week: weekOf(lessonProgress.completedAt), n: sql<number>`count(*)::int` })
        .from(lessonProgress)
        .where(
          and(
            inArray(lessonProgress.courseId, courseIds),
            eq(lessonProgress.status, 'COMPLETED'),
            gte(lessonProgress.completedAt, start),
            progressUsers,
          ),
        )
        .groupBy(sql`1`),
    ]);
    for (const r of runRows) {
      const p = points.get(r.week);
      if (p) {
        p.checkRuns = r.n;
        p.checksPassed = r.passed;
      }
    }
    for (const r of lessonRows) {
      const p = points.get(r.week);
      if (p) p.lessonsCompleted = r.n;
    }
    return [...points.values()];
  }

  /** Course trend plus distinct active students per week across every kind of activity. */
  private async orgTrend(db: Db, courseIds: string[], now: Date): Promise<OrgWeeklyPoint[]> {
    const base = await this.trend(db, courseIds, undefined, now);
    const active = new Map(base.map((p) => [p.weekStart, new Set<string>()]));
    if (courseIds.length > 0) {
      const start = new Date(`${base[0]!.weekStart}T00:00:00Z`);
      const sources = await Promise.all([
        db
          .selectDistinct({ week: weekOf(checkRuns.createdAt), userId: checkRuns.userId })
          .from(checkRuns)
          .where(and(inArray(checkRuns.courseId, courseIds), gte(checkRuns.createdAt, start))),
        db
          .selectDistinct({
            week: weekOf(lessonProgress.startedAt),
            userId: lessonProgress.userId,
          })
          .from(lessonProgress)
          .where(
            and(inArray(lessonProgress.courseId, courseIds), gte(lessonProgress.startedAt, start)),
          ),
        db
          .selectDistinct({
            week: weekOf(lessonProgress.completedAt),
            userId: lessonProgress.userId,
          })
          .from(lessonProgress)
          .where(
            and(
              inArray(lessonProgress.courseId, courseIds),
              gte(lessonProgress.completedAt, start),
            ),
          ),
        db
          .selectDistinct({ week: weekOf(quizAttempts.createdAt), userId: quizAttempts.userId })
          .from(quizAttempts)
          .where(
            and(inArray(quizAttempts.courseId, courseIds), gte(quizAttempts.createdAt, start)),
          ),
        db
          .selectDistinct({
            week: weekOf(submissionVersions.submittedAt),
            userId: submissionVersions.userId,
          })
          .from(submissionVersions)
          .innerJoin(assignments, eq(assignments.id, submissionVersions.assignmentId))
          .where(
            and(
              inArray(assignments.courseId, courseIds),
              gte(submissionVersions.submittedAt, start),
            ),
          ),
      ]);
      for (const rows of sources) for (const r of rows) active.get(r.week)?.add(r.userId);
    }
    return base.map((p) => ({ ...p, activeStudents: active.get(p.weekStart)?.size ?? 0 }));
  }
}

/** Monday of the row's week in UTC, matching `weekStartOf` in the shared package. */
function weekOf(col: AnyColumn): SQL<string> {
  return sql<string>`to_char(date_trunc('week', ${col} at time zone 'UTC'), 'YYYY-MM-DD')`;
}
