import { z } from 'zod';
import { quizQuestionsSchema, type QuizQuestion, type QuizViewQuestion } from './quizzes';
import {
  mean,
  pairedTTest,
  pearson,
  sd,
  shapiroWilk,
  wilcoxonSignedRank,
  type RankTest,
} from './stats';

/**
 * Course-level measurement instruments for the pedagogical experiment:
 * - PRETEST (diagnostic / kirish testi) — before the course;
 * - POSTTEST (yakuniy test) — after it.
 *
 * Unlike lesson quizzes they are measurements, not practice: one attempt per student, no
 * per-question feedback, an optional time limit, and the questions are frozen once anyone has
 * started (so every student answers the same instrument). They never gate lessons.
 */

export const ASSESSMENT_KINDS = ['PRETEST', 'POSTTEST'] as const;
export type AssessmentKind = (typeof ASSESSMENT_KINDS)[number];

export const ASSESSMENT_LABEL: Record<AssessmentKind, string> = {
  PRETEST: 'Kirish (diagnostik) testi',
  POSTTEST: 'Yakuniy test',
};

/** URL segment ↔ kind. */
export const ASSESSMENT_SLUG: Record<AssessmentKind, string> = {
  PRETEST: 'kirish',
  POSTTEST: 'yakuniy',
};
export function assessmentKindFromSlug(slug: string): AssessmentKind | null {
  return (
    (Object.keys(ASSESSMENT_SLUG) as AssessmentKind[]).find((k) => ASSESSMENT_SLUG[k] === slug) ??
    null
  );
}

export const ASSESSMENT_GRACE_SECONDS = 60;

export const upsertAssessmentSchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    description: z.string().trim().max(2000).default(''),
    questions: quizQuestionsSchema.default([]),
    /** Null: no limit. */
    timeLimitMinutes: z.number().int().min(1).max(180).nullable().default(null),
    /** "Passed" threshold used only for the pass-rate comparison (χ²); not shown as a grade. */
    passingPercent: z.number().int().min(1).max(100).default(60),
    isOpen: z.boolean().default(false),
  })
  .refine((a) => !a.isOpen || a.questions.length > 0, {
    message: 'an open test needs questions',
    path: ['questions'],
  });
export type UpsertAssessmentInput = z.infer<typeof upsertAssessmentSchema>;

export interface AssessmentAdmin {
  id: string;
  courseId: string;
  kind: AssessmentKind;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimitMinutes: number | null;
  passingPercent: number;
  isOpen: boolean;
  /** Students who started it. Once > 0 the questions are frozen. */
  started: number;
  submitted: number;
  locked: boolean;
}

export type AssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';

export interface AssessmentSummary {
  kind: AssessmentKind;
  title: string;
  status: AssessmentStatus;
  /** Only once submitted. */
  score: number | null;
}

export interface AssessmentStudentView {
  kind: AssessmentKind;
  title: string;
  description: string;
  questionCount: number;
  timeLimitMinutes: number | null;
  status: AssessmentStatus;
  startedAt: string | null;
  /** ISO deadline when time-limited and started. */
  deadline: string | null;
  /** Only while IN_PROGRESS (never before starting, never after submitting). */
  questions: QuizViewQuestion[] | null;
  result: {
    score: number;
    correct: number;
    total: number;
    submittedAt: string;
    late: boolean;
  } | null;
}

export interface AssessmentResultRow {
  userId: string;
  name: string;
  group: string | null;
  pre: number | null;
  post: number | null;
  /** post − pre (percentage points). */
  gain: number | null;
  /** Hake's g. */
  normalizedGain: number | null;
  preMinutes: number | null;
  postMinutes: number | null;
  /** Active time on the course's lessons, exercises, quizzes and assignments (minutes). */
  activeMinutes: number | null;
}

export interface AssessmentResults {
  rows: AssessmentResultRow[];
  /** Students with both scores. */
  paired: number;
  preMean: number | null;
  preSd: number | null;
  postMean: number | null;
  postSd: number | null;
  meanGain: number | null;
  meanNormalizedGain: number | null;
  /** Paired t test pre → post on students with both scores. */
  t: number | null;
  df: number | null;
  p: number | null;
  /** Cohen's d for the change (mean diff / sd of diffs, a.k.a. d_z). */
  effectSize: number | null;
  meanActiveMinutes: number | null;
  /** Pearson r between active minutes and the post-test score. */
  timePostCorrelation: number | null;
  /** Wilcoxon signed-rank test pre → post (rank-based alternative to the paired t test). */
  wilcoxon: RankTest | null;
  /** Shapiro–Wilk on the paired differences: decides which test to report. */
  diffNormality: { w: number; p: number } | null;
  /** Paired t when the differences look normal (p ≥ 0.05), otherwise Wilcoxon. */
  recommended: 'PAIRED_T' | 'WILCOXON' | null;
}

/** Descriptive statistics and the paired t test for the pre → post change. */
export function summarizeAssessment(rows: AssessmentResultRow[]): AssessmentResults {
  const pre = rows.flatMap((r) => (r.pre === null ? [] : [r.pre]));
  const post = rows.flatMap((r) => (r.post === null ? [] : [r.post]));
  const pairs = rows.filter((r) => r.pre !== null && r.post !== null);
  const test = pairs.length
    ? pairedTTest(
        pairs.map((r) => r.pre!),
        pairs.map((r) => r.post!),
      )
    : null;
  const gains = pairs.flatMap((r) => (r.normalizedGain === null ? [] : [r.normalizedGain]));
  return {
    rows: rows.map(
      ({
        userId,
        name,
        group,
        pre,
        post,
        gain,
        normalizedGain,
        preMinutes,
        postMinutes,
        activeMinutes,
      }) => ({
        userId,
        name,
        group,
        pre,
        post,
        gain,
        normalizedGain,
        preMinutes,
        postMinutes,
        activeMinutes,
      }),
    ),
    paired: pairs.length,
    preMean: mean(pre),
    preSd: sd(pre),
    postMean: mean(post),
    postSd: sd(post),
    meanGain: mean(pairs.map((r) => r.gain!)),
    meanNormalizedGain: mean(gains),
    t: test && Number.isFinite(test.t) ? test.t : null,
    df: test?.df ?? null,
    p: test?.p ?? null,
    effectSize: test && test.sdDiff > 0 ? test.meanDiff / test.sdDiff : null,
    meanActiveMinutes: mean(
      rows.flatMap((r) => (r.activeMinutes === null ? [] : [r.activeMinutes])),
    ),
    wilcoxon: pairs.length
      ? wilcoxonSignedRank(
          pairs.map((r) => r.pre!),
          pairs.map((r) => r.post!),
        )
      : null,
    diffNormality: shapiroWilk(pairs.map((r) => r.post! - r.pre!)),
    recommended: (() => {
      if (pairs.length < 2) return null;
      const sw = shapiroWilk(pairs.map((r) => r.post! - r.pre!));
      return sw && sw.p < 0.05 ? 'WILCOXON' : 'PAIRED_T';
    })(),
    timePostCorrelation: (() => {
      const both = rows.filter((r) => r.activeMinutes !== null && r.post !== null);
      return pearson(
        both.map((r) => r.activeMinutes!),
        both.map((r) => r.post!),
      );
    })(),
  };
}
