import { z } from 'zod';
import type { GradingPolicy, RubricCriterion, SubmissionStatus } from './assignments';
import type { CheckErrorCode, CheckRunStatus } from './checks';
import type { ProjectFile } from './exercises';

/** Teacher actions that are recorded as immutable review entries. */
export const REVIEW_ACTIONS = ['REVISION_REQUESTED', 'GRADED', 'FINALIZED'] as const;
export type ReviewAction = (typeof REVIEW_ACTIONS)[number];

const feedback = z.string().trim().max(5000);
/** The version the teacher looked at; a newer one makes the action stale (409). */
const version = z.number().int().min(1);

export const requestRevisionSchema = z.object({
  version,
  feedback: feedback.min(1),
});
export type RequestRevisionInput = z.infer<typeof requestRevisionSchema>;

export const rubricScoreSchema = z.object({
  criterionId: z.string().min(1).max(40),
  points: z.number().int().min(0).max(1000),
});
export type RubricScore = z.infer<typeof rubricScoreSchema>;

/** With a rubric: `scores` for every criterion. Without one: a single `score`. */
export const gradeSubmissionSchema = z
  .object({
    version,
    scores: z.array(rubricScoreSchema).max(20).optional(),
    score: z.number().int().min(0).max(1000).optional(),
    feedback: feedback.default(''),
  })
  .refine((g) => (g.scores === undefined) !== (g.score === undefined), {
    message: 'give either scores or score',
  });
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;

export const reviewVersionSchema = z.object({ version });
export type ReviewVersionInput = z.infer<typeof reviewVersionSchema>;

/**
 * Validates scores against the rubric and returns the total, or an error message.
 * Pure so that API and UI agree.
 */
export function scoreTotal(
  rubric: RubricCriterion[],
  policy: GradingPolicy,
  input: { scores?: RubricScore[]; score?: number },
): { ok: true; total: number } | { ok: false; error: string } {
  if (rubric.length === 0) {
    if (input.score === undefined) return { ok: false, error: 'score required' };
    if (input.score > policy.maxScore) return { ok: false, error: 'score above maxScore' };
    return { ok: true, total: input.score };
  }
  if (!input.scores) return { ok: false, error: 'rubric scores required' };
  const byId = new Map(input.scores.map((s) => [s.criterionId, s.points]));
  if (byId.size !== input.scores.length) return { ok: false, error: 'duplicate criterion' };
  if (byId.size !== rubric.length || rubric.some((r) => !byId.has(r.id))) {
    return { ok: false, error: 'every criterion needs exactly one score' };
  }
  for (const r of rubric) {
    if (byId.get(r.id)! > r.maxPoints) return { ok: false, error: `${r.id} above maxPoints` };
  }
  return { ok: true, total: input.scores.reduce((n, s) => n + s.points, 0) };
}

/** Grade as the student sees it (GRADED may still change; FINALIZED is final). */
export interface StudentGrade {
  score: number;
  maxScore: number;
  passed: boolean;
  final: boolean;
  scores: RubricScore[] | null;
}

/** Latest teacher feedback and grade shown to the student. No reviewer identity. */
export interface StudentReview {
  action: ReviewAction;
  version: number;
  feedback: string;
  createdAt: string;
  grade: StudentGrade | null;
}

export interface ReviewEntry {
  action: ReviewAction;
  version: number;
  reviewerName: string | null;
  feedback: string;
  score: number | null;
  scores: RubricScore[] | null;
  createdAt: string;
}

/** Everything a teacher needs to review one student's submission. */
export interface SubmissionReviewView {
  assignment: {
    id: string;
    title: string;
    rubric: RubricCriterion[];
    gradingPolicy: GradingPolicy;
    deadline: string | null;
  };
  student: { id: string; fullName: string };
  status: SubmissionStatus;
  score: number | null;
  versions: {
    version: number;
    submittedAt: string;
    isLate: boolean;
    /** Full staff detail, including hidden checks. */
    check: {
      status: CheckRunStatus;
      errorCode: CheckErrorCode | null;
      durationMs: number | null;
      checks: { id: string; title: string; hidden: boolean; passed: boolean }[];
    } | null;
  }[];
  reviews: ReviewEntry[];
}

export interface StaffVersionView {
  version: number;
  submittedAt: string;
  isLate: boolean;
  files: ProjectFile[];
}
