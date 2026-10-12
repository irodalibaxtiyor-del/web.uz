import { and, eq, inArray, max, ne, sql, type SQL } from 'drizzle-orm';
import type {
  AssignmentStatus,
  CheckRule,
  CheckRunStatus,
  ExerciseStatus,
  GradingPolicy,
  StruggleSignals,
  SubmissionStatus,
  WeakTopic,
} from '@webdizayn/shared';
import { progressPercent, rate } from '@webdizayn/shared';
import type { Db } from '../db/client';
import {
  assignments,
  checkRuns,
  enrollments,
  exercises,
  lessonProgress,
  lessons,
  modules,
  quizAttempts,
  quizzes,
  studentExercises,
  submissionReviews,
  submissions,
  submissionVersions,
} from '../db/schema';

/**
 * Everything the analytics views are computed from, loaded with a fixed number of aggregate
 * queries for a set of courses (and optionally a set of students). Nothing here is stored:
 * analytics are always derived from the learning records, so they cannot drift from them.
 */
export interface Facts {
  lessons: Map<string, LessonInfo[]>;
  enrollments: { userId: string; courseId: string; createdAt: Date }[];
  progress: { userId: string; courseId: string; lessonId: string; completed: boolean; at: Date }[];
  exercises: {
    id: string;
    courseId: string;
    lessonId: string;
    title: string;
    rules: CheckRule[];
  }[];
  studentExercises: { userId: string; exerciseId: string; status: ExerciseStatus }[];
  runs: {
    userId: string;
    exerciseId: string;
    passed: number;
    failed: number;
    errored: number;
    first: CheckRunStatus | null;
    last: Date | null;
  }[];
  quizzes: { id: string; courseId: string; lessonId: string }[];
  attempts: {
    userId: string;
    quizId: string;
    attempts: number;
    failed: number;
    passed: boolean;
    best: number;
    last: Date | null;
  }[];
  assignments: {
    id: string;
    courseId: string;
    title: string;
    status: AssignmentStatus;
    deadline: Date | null;
    maxScore: number;
  }[];
  submissions: {
    userId: string;
    assignmentId: string;
    status: SubmissionStatus;
    score: number | null;
    lastSubmittedAt: Date | null;
    revisionEverRequested: boolean;
    late: boolean;
  }[];
}

export interface LessonInfo {
  id: string;
  title: string;
  moduleTitle: string;
}

export interface Scope {
  courseIds: string[];
  /** Restrict to these students; all enrolled students when omitted. */
  userIds?: string[];
}

const FINISHED: CheckRunStatus[] = ['PASSED', 'FAILED'];

export async function loadFacts(db: Db, scope: Scope): Promise<Facts> {
  const empty: Facts = {
    lessons: new Map(),
    enrollments: [],
    progress: [],
    exercises: [],
    studentExercises: [],
    runs: [],
    quizzes: [],
    attempts: [],
    assignments: [],
    submissions: [],
  };
  if (scope.courseIds.length === 0 || scope.userIds?.length === 0) return empty;
  const ids = scope.courseIds;
  const byUser = (col: Parameters<typeof inArray>[0]): SQL | undefined =>
    scope.userIds ? inArray(col, scope.userIds) : undefined;

  const [
    lessonRows,
    enrollmentRows,
    progressRows,
    exerciseRows,
    seRows,
    runRows,
    quizRows,
    attemptRows,
    assignmentRows,
    submissionRows,
  ] = await Promise.all([
    db
      .select({
        id: lessons.id,
        courseId: lessons.courseId,
        title: lessons.title,
        moduleTitle: modules.title,
      })
      .from(lessons)
      .innerJoin(modules, eq(modules.id, lessons.moduleId))
      .where(inArray(lessons.courseId, ids))
      .orderBy(modules.position, modules.createdAt, lessons.position, lessons.createdAt),
    db
      .select({
        userId: enrollments.userId,
        courseId: enrollments.courseId,
        createdAt: enrollments.createdAt,
      })
      .from(enrollments)
      .where(and(inArray(enrollments.courseId, ids), byUser(enrollments.userId))),
    db
      .select({
        userId: lessonProgress.userId,
        courseId: lessonProgress.courseId,
        lessonId: lessonProgress.lessonId,
        status: lessonProgress.status,
        startedAt: lessonProgress.startedAt,
        completedAt: lessonProgress.completedAt,
      })
      .from(lessonProgress)
      .where(and(inArray(lessonProgress.courseId, ids), byUser(lessonProgress.userId))),
    db
      .select({
        id: exercises.id,
        courseId: exercises.courseId,
        lessonId: exercises.lessonId,
        title: exercises.title,
        rules: exercises.checks,
      })
      .from(exercises)
      .where(and(inArray(exercises.courseId, ids), eq(exercises.isActive, true))),
    db
      .select({
        userId: studentExercises.userId,
        exerciseId: studentExercises.exerciseId,
        status: studentExercises.status,
      })
      .from(studentExercises)
      .innerJoin(exercises, eq(exercises.id, studentExercises.exerciseId))
      .where(
        and(
          inArray(studentExercises.courseId, ids),
          eq(exercises.isActive, true),
          byUser(studentExercises.userId),
        ),
      ),
    db
      .select({
        userId: checkRuns.userId,
        exerciseId: checkRuns.exerciseId,
        passed: sql<number>`(count(*) filter (where ${checkRuns.status} = 'PASSED'))::int`,
        failed: sql<number>`(count(*) filter (where ${checkRuns.status} = 'FAILED'))::int`,
        errored: sql<number>`(count(*) filter (where ${checkRuns.status} in ('ERROR', 'TIMEOUT')))::int`,
        first: sql<CheckRunStatus | null>`(array_agg(${checkRuns.status}::text order by ${checkRuns.createdAt}) filter (where ${checkRuns.status} in ('PASSED', 'FAILED')))[1]`,
        last: max(checkRuns.createdAt),
      })
      .from(checkRuns)
      .where(and(inArray(checkRuns.courseId, ids), byUser(checkRuns.userId)))
      .groupBy(checkRuns.userId, checkRuns.exerciseId),
    db
      .select({ id: quizzes.id, courseId: quizzes.courseId, lessonId: quizzes.lessonId })
      .from(quizzes)
      .where(and(inArray(quizzes.courseId, ids), eq(quizzes.isActive, true))),
    db
      .select({
        userId: quizAttempts.userId,
        quizId: quizAttempts.quizId,
        attempts: sql<number>`count(*)::int`,
        failed: sql<number>`(count(*) filter (where not ${quizAttempts.passed}))::int`,
        passed: sql<boolean>`bool_or(${quizAttempts.passed})`,
        best: sql<number>`max(${quizAttempts.score})::int`,
        last: max(quizAttempts.createdAt),
      })
      .from(quizAttempts)
      .where(and(inArray(quizAttempts.courseId, ids), byUser(quizAttempts.userId)))
      .groupBy(quizAttempts.userId, quizAttempts.quizId),
    db
      .select({
        id: assignments.id,
        courseId: assignments.courseId,
        title: assignments.title,
        status: assignments.status,
        deadline: assignments.deadline,
        policy: assignments.gradingPolicy,
      })
      .from(assignments)
      .where(and(inArray(assignments.courseId, ids), ne(assignments.status, 'DRAFT')))
      .orderBy(assignments.position, assignments.createdAt),
    db
      .select({
        userId: submissions.userId,
        assignmentId: submissions.assignmentId,
        status: submissions.status,
        score: submissions.score,
        lastSubmittedAt: submissions.lastSubmittedAt,
        revisionEverRequested: sql<boolean>`exists (select 1 from ${submissionReviews} where ${submissionReviews.submissionId} = ${submissions.id} and ${submissionReviews.action} = 'REVISION_REQUESTED')`,
        late: sql<boolean>`exists (select 1 from ${submissionVersions} where ${submissionVersions.submissionId} = ${submissions.id} and ${submissionVersions.isLate})`,
      })
      .from(submissions)
      .innerJoin(assignments, eq(assignments.id, submissions.assignmentId))
      .where(
        and(
          inArray(submissions.courseId, ids),
          ne(assignments.status, 'DRAFT'),
          byUser(submissions.userId),
        ),
      ),
  ]);

  const lessonMap = new Map<string, LessonInfo[]>();
  for (const l of lessonRows) {
    const list = lessonMap.get(l.courseId) ?? [];
    list.push({ id: l.id, title: l.title, moduleTitle: l.moduleTitle });
    lessonMap.set(l.courseId, list);
  }

  return {
    lessons: lessonMap,
    enrollments: enrollmentRows,
    progress: progressRows.map((p) => ({
      userId: p.userId,
      courseId: p.courseId,
      lessonId: p.lessonId,
      completed: p.status === 'COMPLETED',
      at: p.completedAt ?? p.startedAt,
    })),
    exercises: exerciseRows,
    studentExercises: seRows,
    runs: runRows.map((r) => ({ ...r, last: toDate(r.last) })),
    quizzes: quizRows,
    attempts: attemptRows.map((a) => ({ ...a, passed: Boolean(a.passed), last: toDate(a.last) })),
    assignments: assignmentRows.map((a) => ({
      id: a.id,
      courseId: a.courseId,
      title: a.title,
      status: a.status,
      deadline: a.deadline,
      maxScore: (a.policy as GradingPolicy).maxScore,
    })),
    submissions: submissionRows.map((s) => ({
      ...s,
      revisionEverRequested: Boolean(s.revisionEverRequested),
      late: Boolean(s.late),
    })),
  };
}

function toDate(v: Date | string | null): Date | null {
  if (v === null) return null;
  return v instanceof Date ? v : new Date(v);
}

/** One student's numbers in one course. */
export interface StudentCourseStats {
  lessonsCompleted: number;
  lessonsTotal: number;
  percent: number;
  /** The lesson the student is working towards: first one not completed. */
  frontierLessonId: string | null;
  exercises: { total: number; passed: number; needsImprovement: number; inProgress: number };
  checks: {
    runs: number;
    passed: number;
    failed: number;
    errored: number;
    firstTry: number;
    tried: number;
  };
  quizzes: { total: number; passed: number; bestSum: number; attempted: number };
  assignments: {
    available: number;
    submitted: number;
    graded: number;
    revisionsRequested: number;
    scoreSum: number;
  };
  weakTopics: WeakTopic[];
  lastActivityAt: Date | null;
  signals: Omit<StruggleSignals, 'classAveragePercent' | 'enrolledAt' | 'progressPercent'>;
}

const GRADED: SubmissionStatus[] = ['GRADED', 'FINALIZED'];

/**
 * Indexes the facts once so per-student numbers are cheap. Built for one Facts object and
 * queried for many (student, course) pairs.
 */
export class FactsIndex {
  private readonly completed = new Map<string, Set<string>>();
  private readonly lastProgress = new Map<string, Date>();
  private readonly exerciseById: Map<string, Facts['exercises'][number]>;
  private readonly quizById: Map<string, Facts['quizzes'][number]>;
  private readonly assignmentById: Map<string, Facts['assignments'][number]>;
  private readonly se = new Map<string, ExerciseStatus>();
  private readonly runsByUser = new Map<string, Facts['runs']>();
  private readonly attemptsByUser = new Map<string, Facts['attempts']>();
  private readonly submissionsByUser = new Map<string, Facts['submissions']>();

  constructor(readonly facts: Facts) {
    for (const p of facts.progress) {
      const k = key(p.userId, p.courseId);
      if (p.completed) {
        const set = this.completed.get(k) ?? new Set<string>();
        set.add(p.lessonId);
        this.completed.set(k, set);
      }
      bump(this.lastProgress, k, p.at);
    }
    this.exerciseById = new Map(facts.exercises.map((e) => [e.id, e]));
    this.quizById = new Map(facts.quizzes.map((q) => [q.id, q]));
    this.assignmentById = new Map(facts.assignments.map((a) => [a.id, a]));
    for (const s of facts.studentExercises) this.se.set(key(s.userId, s.exerciseId), s.status);
    group(this.runsByUser, facts.runs);
    group(this.attemptsByUser, facts.attempts);
    group(this.submissionsByUser, facts.submissions);
  }

  stats(userId: string, courseId: string): StudentCourseStats {
    const lessonsList = this.facts.lessons.get(courseId) ?? [];
    const lessonById = new Map(lessonsList.map((l) => [l.id, l]));
    const done = this.completed.get(key(userId, courseId)) ?? new Set<string>();
    const lessonsCompleted = lessonsList.filter((l) => done.has(l.id)).length;
    const frontier = lessonsList.find((l) => !done.has(l.id));
    let last: Date | null = this.lastProgress.get(key(userId, courseId)) ?? null;

    const weak = new Map<string, WeakTopic>();
    const weakOf = (lessonId: string) => {
      let w = weak.get(lessonId);
      if (!w) {
        const l = lessonById.get(lessonId);
        w = {
          lessonId,
          lessonTitle: l?.title ?? '',
          moduleTitle: l?.moduleTitle ?? '',
          failedChecks: 0,
          needsImprovement: 0,
          failedQuizAttempts: 0,
        };
        weak.set(lessonId, w);
      }
      return w;
    };

    // Exercises
    const courseExercises = this.facts.exercises.filter((e) => e.courseId === courseId);
    const ex = { total: courseExercises.length, passed: 0, needsImprovement: 0, inProgress: 0 };
    for (const e of courseExercises) {
      const status = this.se.get(key(userId, e.id));
      if (status === 'PASSED') ex.passed++;
      else if (status === 'NEEDS_IMPROVEMENT') {
        ex.needsImprovement++;
        weakOf(e.lessonId).needsImprovement++;
      } else if (status === 'IN_PROGRESS') ex.inProgress++;
    }

    // CHECK runs
    const checks = { runs: 0, passed: 0, failed: 0, errored: 0, firstTry: 0, tried: 0 };
    let maxFailures = 0;
    for (const r of this.runsByUser.get(userId) ?? []) {
      const e = this.exerciseById.get(r.exerciseId);
      if (!e || e.courseId !== courseId) continue;
      checks.runs += r.passed + r.failed + r.errored;
      checks.passed += r.passed;
      checks.failed += r.failed;
      checks.errored += r.errored;
      if (r.first && FINISHED.includes(r.first)) {
        checks.tried++;
        if (r.first === 'PASSED') checks.firstTry++;
      }
      const unpassed = this.se.get(key(userId, e.id)) !== 'PASSED';
      if (unpassed && r.failed > 0) {
        weakOf(e.lessonId).failedChecks += r.failed;
        maxFailures = Math.max(maxFailures, r.failed);
      }
      last = later(last, r.last);
    }

    // Quizzes
    const courseQuizzes = this.facts.quizzes.filter((q) => q.courseId === courseId);
    const quizzesStats = { total: courseQuizzes.length, passed: 0, bestSum: 0, attempted: 0 };
    let failedUnpassedQuizzes = 0;
    for (const a of this.attemptsByUser.get(userId) ?? []) {
      const q = this.quizById.get(a.quizId);
      if (!q || q.courseId !== courseId) continue;
      quizzesStats.attempted++;
      quizzesStats.bestSum += a.best;
      if (a.passed) quizzesStats.passed++;
      else if (a.failed > 0) {
        failedUnpassedQuizzes++;
        weakOf(q.lessonId).failedQuizAttempts += a.failed;
      }
      last = later(last, a.last);
    }

    // Assignments
    const courseAssignments = this.facts.assignments.filter((a) => a.courseId === courseId);
    const asg = {
      available: courseAssignments.length,
      submitted: 0,
      graded: 0,
      revisionsRequested: 0,
      scoreSum: 0,
    };
    let revisionRequested = 0;
    for (const s of this.submissionsByUser.get(userId) ?? []) {
      const a = this.assignmentById.get(s.assignmentId);
      if (!a || a.courseId !== courseId) continue;
      if (s.lastSubmittedAt) asg.submitted++;
      if (s.revisionEverRequested) asg.revisionsRequested++;
      if (s.status === 'REVISION_REQUESTED') revisionRequested++;
      if (GRADED.includes(s.status) && s.score !== null && a.maxScore > 0) {
        asg.graded++;
        asg.scoreSum += s.score / a.maxScore;
      }
      last = later(last, s.lastSubmittedAt);
    }

    const weakTopics = [...weak.values()]
      .map((w) => ({ w, score: w.failedChecks + 3 * w.needsImprovement + w.failedQuizAttempts }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.w);

    return {
      lessonsCompleted,
      lessonsTotal: lessonsList.length,
      percent: progressPercent(lessonsCompleted, lessonsList.length),
      frontierLessonId: frontier?.id ?? null,
      exercises: ex,
      checks,
      quizzes: quizzesStats,
      assignments: asg,
      weakTopics,
      lastActivityAt: last,
      signals: {
        lastActivityAt: last,
        maxFailuresOnUnpassedExercise: maxFailures,
        needsImprovement: ex.needsImprovement,
        revisionRequested,
        failedUnpassedQuizzes,
      },
    };
  }
}

export function key(a: string, b: string): string {
  return `${a}:${b}`;
}

function bump(map: Map<string, Date>, k: string, d: Date) {
  const cur = map.get(k);
  if (!cur || d > cur) map.set(k, d);
}

function later(a: Date | null, b: Date | null): Date | null {
  if (!b) return a;
  return !a || b > a ? b : a;
}

function group<T extends { userId: string }>(map: Map<string, T[]>, rows: T[]) {
  for (const r of rows) {
    const list = map.get(r.userId) ?? [];
    list.push(r);
    map.set(r.userId, list);
  }
}

export function successRate(c: { passed: number; failed: number }) {
  return rate(c.passed, c.passed + c.failed);
}
