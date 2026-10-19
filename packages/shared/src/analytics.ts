import type { StudentAiUsage } from './ai';
import type { AssignmentStatus, SubmissionStatus } from './assignments';
import type { CourseStatus } from './courses';
import type { Role } from './roles';

/** Number of calendar weeks shown in activity trends (the current week included). */
export const ANALYTICS_TREND_WEEKS = 8;
/** A student with no activity for this many days is reported as inactive. */
export const INACTIVE_AFTER_DAYS = 7;
/** Failed CHECK runs on one still-unpassed exercise before a student counts as stuck on it. */
export const STUCK_CHECK_FAILURES = 3;
/** Progress this many percentage points below the class average counts as falling behind. */
export const BEHIND_BY_PERCENT = 25;

export interface WeeklyPoint {
  /** Monday of the week (UTC), `YYYY-MM-DD`. */
  weekStart: string;
  checkRuns: number;
  checksPassed: number;
  lessonsCompleted: number;
}

export interface OrgWeeklyPoint extends WeeklyPoint {
  activeStudents: number;
}

/** Share in 0..1, or null when there is nothing to divide by (never a fake 0%). */
export type Rate = number | null;

// ---------------------------------------------------------------- student

export interface WeakTopic {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  failedChecks: number;
  needsImprovement: number;
  failedQuizAttempts: number;
}

export interface StudentCourseAnalytics {
  organizationId: string;
  courseId: string;
  title: string;
  status: CourseStatus;
  progress: { lessonsCompleted: number; lessonsTotal: number; percent: number; completed: boolean };
  exercises: { total: number; passed: number; needsImprovement: number; inProgress: number };
  checks: {
    runs: number;
    passed: number;
    failed: number;
    /** ERROR and TIMEOUT: not the student's fault and not counted in the success rate. */
    errored: number;
    successRate: Rate;
    /** Of the exercises the student checked, the share whose first finished run passed. */
    firstTryRate: Rate;
  };
  assignments: {
    available: number;
    submitted: number;
    graded: number;
    revisionsRequested: number;
    /** Average of score / maxScore over graded work. */
    averageScore: Rate;
  };
  quizzes: { total: number; passed: number; averageBest: Rate };
  weakTopics: WeakTopic[];
  lastActivityAt: string | null;
}

export interface StudentAnalytics {
  generatedAt: string;
  courses: StudentCourseAnalytics[];
  trend: WeeklyPoint[];
  /** The student's own AI tutor usage in these courses. */
  aiUsage: StudentAiUsage;
}

// ---------------------------------------------------------------- teacher

export const STRUGGLE_REASONS = [
  'INACTIVE',
  'BEHIND',
  'STUCK_ON_CHECK',
  'NEEDS_IMPROVEMENT',
  'REVISION_REQUESTED',
  'QUIZ_NOT_PASSED',
] as const;
export type StruggleReason = (typeof STRUGGLE_REASONS)[number];

export const PROGRESS_BUCKETS = ['0', '1-24', '25-49', '50-74', '75-99', '100'] as const;
export type ProgressBucket = (typeof PROGRESS_BUCKETS)[number];

export interface Bottleneck {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  /** Students whose next lesson (the first not completed) is this one. */
  stuckStudents: number;
  checkFailRate: Rate;
}

export interface CommonError {
  exerciseId: string;
  exerciseTitle: string;
  ruleId: string;
  ruleTitle: string;
  hidden: boolean;
  failedRuns: number;
  students: number;
}

export interface AssignmentAnalytics {
  assignmentId: string;
  title: string;
  status: AssignmentStatus;
  deadline: string | null;
  notSubmitted: number;
  statuses: Record<SubmissionStatus, number>;
  late: number;
  averageScore: Rate;
  revisionRate: Rate;
}

export interface StrugglingStudent {
  userId: string;
  fullName: string;
  progressPercent: number;
  reasons: StruggleReason[];
  lastActivityAt: string | null;
}

export interface CourseAnalytics {
  generatedAt: string;
  course: { id: string; title: string; status: CourseStatus };
  students: number;
  progress: {
    averagePercent: number;
    completedCount: number;
    distribution: { bucket: ProgressBucket; count: number }[];
  };
  bottlenecks: Bottleneck[];
  commonErrors: CommonError[];
  checkIssues: { timeouts: number; errors: number };
  assignments: AssignmentAnalytics[];
  revisions: { reviewed: number; revisionRequested: number; rate: Rate };
  strugglingStudents: StrugglingStudent[];
  trend: WeeklyPoint[];
}

// ---------------------------------------------------------------- organization

export interface OrgCourseActivity {
  courseId: string;
  title: string;
  status: CourseStatus;
  students: number;
  activeLast30: number;
  averagePercent: number;
  completedCount: number;
  checkRunsLast30: number;
  submissionsLast30: number;
}

export interface TeacherActivity {
  userId: string;
  fullName: string;
  role: Role;
  courses: number;
  reviewsLast30: number;
  reviewsTotal: number;
  lastReviewAt: string | null;
  /** Submissions waiting in SUBMITTED in the courses this person teaches. */
  pendingReviews: number;
}

export interface OrgAnalytics {
  generatedAt: string;
  members: { students: number; teachers: number; admins: number };
  engagement: { enrolledStudents: number; activeLast7: number; activeLast30: number };
  completion: { enrollments: number; completed: number; rate: Rate };
  courses: OrgCourseActivity[];
  teachers: TeacherActivity[];
  trend: OrgWeeklyPoint[];
}

// ---------------------------------------------------------------- pure helpers

export function rate(part: number, whole: number): Rate {
  return whole > 0 ? part / whole : null;
}

/**
 * Weeks are counted in Tashkent time. Uzbekistan has no daylight saving time, so a fixed
 * offset is exact and keeps JS and SQL (see the API's `weekOf`) in agreement without tz data.
 */
export const ANALYTICS_UTC_OFFSET_HOURS = 5;

/** Monday (Tashkent time) of the week containing `d`, as `YYYY-MM-DD`. */
export function weekStartOf(d: Date): string {
  const local = new Date(d.getTime() + ANALYTICS_UTC_OFFSET_HOURS * 3_600_000);
  const day = (local.getUTCDay() + 6) % 7; // Monday = 0
  const monday = new Date(
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - day),
  );
  return monday.toISOString().slice(0, 10);
}

/** The last `weeks` week starts, oldest first, ending with the week of `now`. */
export function trendWeeks(now: Date, weeks = ANALYTICS_TREND_WEEKS): string[] {
  const current = new Date(`${weekStartOf(now)}T00:00:00Z`);
  return Array.from({ length: weeks }, (_, i) => {
    const d = new Date(current);
    d.setUTCDate(d.getUTCDate() - (weeks - 1 - i) * 7);
    return d.toISOString().slice(0, 10);
  });
}

export function progressBucket(percent: number): ProgressBucket {
  if (percent <= 0) return '0';
  if (percent >= 100) return '100';
  if (percent < 25) return '1-24';
  if (percent < 50) return '25-49';
  if (percent < 75) return '50-74';
  return '75-99';
}

export interface StruggleSignals {
  progressPercent: number;
  classAveragePercent: number;
  lastActivityAt: Date | null;
  enrolledAt: Date;
  /** Max failed CHECK runs on a single exercise the student has not passed yet. */
  maxFailuresOnUnpassedExercise: number;
  needsImprovement: number;
  revisionRequested: number;
  failedUnpassedQuizzes: number;
}

/**
 * Why a student may need help. Deliberately simple and explainable: every reason maps to
 * one observable fact the teacher can check. A finished course is never flagged.
 */
export function struggleReasons(s: StruggleSignals, now: Date): StruggleReason[] {
  if (s.progressPercent >= 100) return [];
  const reasons: StruggleReason[] = [];
  const since = s.lastActivityAt ?? s.enrolledAt;
  if (now.getTime() - since.getTime() >= INACTIVE_AFTER_DAYS * 86_400_000) reasons.push('INACTIVE');
  if (s.classAveragePercent - s.progressPercent >= BEHIND_BY_PERCENT) reasons.push('BEHIND');
  if (s.maxFailuresOnUnpassedExercise >= STUCK_CHECK_FAILURES) reasons.push('STUCK_ON_CHECK');
  if (s.needsImprovement > 0) reasons.push('NEEDS_IMPROVEMENT');
  if (s.revisionRequested > 0) reasons.push('REVISION_REQUESTED');
  if (s.failedUnpassedQuizzes > 0) reasons.push('QUIZ_NOT_PASSED');
  return reasons;
}
