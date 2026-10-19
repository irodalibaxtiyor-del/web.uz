import { z } from 'zod';
import type { CheckRunStatus } from './checks';
import type { ExerciseStatus } from './exercises';
import type { SubmissionStatus } from './assignments';

/**
 * Group panel for teachers: what each student of an assigned group has done, derived from the
 * existing course, progress, exercise, CHECK, quiz, assignment and review records.
 */

export interface GroupCard {
  id: string;
  name: string;
  code: string;
  students: number;
}

export interface GroupCourseRef {
  courseId: string;
  title: string;
  lessonsTotal: number;
  /** For the export filter (module / lesson). */
  modules: { moduleId: string; title: string; lessons: { lessonId: string; title: string }[] }[];
}

export interface LessonRef {
  lessonId: string;
  title: string;
  moduleTitle: string;
}

export interface GroupStudentCourse {
  courseId: string;
  percent: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  /** First lesson not yet completed; null when the course is finished. */
  currentLesson: LessonRef | null;
  exercises: { total: number; passed: number; needsImprovement: number };
  checks: { runs: number; passed: number; failed: number };
  quizzes: { total: number; passed: number };
  assignments: { available: number; graded: number; points: number; maxPoints: number };
  lastActivityAt: string | null;
}

/**
 * OK: nothing points at trouble. STRUGGLING: at least one concrete fact (see StruggleItem).
 * INSUFFICIENT_DATA: the student has no CHECK runs, quiz attempts or submissions yet, so
 * there is nothing to judge by — shown as such, never as "doing fine".
 */
export type StruggleStatus = 'OK' | 'STRUGGLING' | 'INSUFFICIENT_DATA';

export interface GroupStudentOverview {
  userId: string;
  fullName: string;
  login: string | null;
  disabled: boolean;
  /** Mean progress over the courses the student is enrolled in; null when in none. */
  averagePercent: number | null;
  points: number;
  maxPoints: number;
  lastActivityAt: string | null;
  struggle: StruggleStatus;
  struggleCount: number;
  courses: GroupStudentCourse[];
}

export interface GroupOverview {
  group: { id: string; name: string; code: string };
  generatedAt: string;
  courses: GroupCourseRef[];
  students: GroupStudentOverview[];
}

/** Repeated failures need at least this many FAILED CHECK runs on a still-unpassed exercise. */
export const REPEATED_FAILURES = 3;

export type StruggleKind =
  'REPEATED_CHECK_FAILURES' | 'NEEDS_IMPROVEMENT' | 'QUIZ_NOT_PASSED' | 'REVISION_REQUESTED';

export interface StruggleItem {
  kind: StruggleKind;
  courseTitle: string;
  lessonTitle: string;
  itemTitle: string;
  /** FAILED CHECK runs or failed quiz attempts. */
  failedAttempts: number;
  /** Requirements the latest CHECK run did not meet; hidden ones are flagged. */
  unmet: { title: string; hidden: boolean }[];
}

export interface ExerciseProgress {
  exerciseId: string;
  title: string;
  status: ExerciseStatus;
  checks: {
    runs: number;
    passed: number;
    failed: number;
    errored: number;
    lastStatus: CheckRunStatus | null;
    lastAt: string | null;
  };
  /** Requirements failed in the latest finished CHECK run (only while not PASSED). */
  unmet: { title: string; hidden: boolean }[];
}

export interface QuizProgress {
  quizId: string;
  title: string;
  attempts: number;
  bestPercent: number | null;
  passed: boolean;
}

export interface LessonProgressDetail extends LessonRef {
  state: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  exercises: ExerciseProgress[];
  quizzes: QuizProgress[];
}

/**
 * One assignment grade with its source. Points come only from teacher-graded submissions; one
 * submission holds one current score, so re-submitting never adds points twice.
 */
export interface ScoreEntry {
  assignmentId: string;
  courseId: string;
  title: string;
  status: SubmissionStatus | 'NOT_SUBMITTED';
  score: number | null;
  maxScore: number;
  versions: number;
  gradedAt: string | null;
  gradedBy: string | null;
  feedback: string | null;
  final: boolean;
}

export interface StudentCourseDetail {
  courseId: string;
  title: string;
  percent: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  currentLesson: LessonRef | null;
  lastActivityAt: string | null;
  lessons: LessonProgressDetail[];
  assignments: ScoreEntry[];
}

export interface StudentDetail {
  student: {
    userId: string;
    fullName: string;
    login: string | null;
    disabled: boolean;
    group: { id: string; name: string };
  };
  generatedAt: string;
  /** RUN happens in the browser sandbox and is not stored on the server. */
  runResults: 'NOT_STORED';
  points: number;
  maxPoints: number;
  struggle: StruggleStatus;
  struggles: StruggleItem[];
  courses: StudentCourseDetail[];
}

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Sana YYYY-MM-DD ko‘rinishida');

/** Filters for the teacher's .xlsx export. All optional; ids are checked against access. */
export const groupExportQuerySchema = z
  .object({
    /** One group; omitted = every group the caller may see. */
    groupId: z.uuid().optional(),
    studentId: z.uuid().optional(),
    courseId: z.uuid().optional(),
    moduleId: z.uuid().optional(),
    lessonId: z.uuid().optional(),
    /** Inclusive day range (UTC) applied to CHECK runs and grades. */
    from: isoDate.optional(),
    to: isoDate.optional(),
  })
  .refine((v) => !v.from || !v.to || v.from <= v.to, {
    path: ['to'],
    message: 'Oraliq oxiri boshidan oldin',
  })
  .refine((v) => !v.studentId || v.groupId, {
    path: ['studentId'],
    message: 'Talaba uchun guruhni ham tanlang',
  })
  .refine((v) => (!v.moduleId && !v.lessonId) || v.courseId, {
    path: ['courseId'],
    message: 'Modul yoki dars uchun kursni ham tanlang',
  });
export type GroupExportQuery = z.infer<typeof groupExportQuerySchema>;
