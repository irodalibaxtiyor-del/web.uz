import { z } from 'zod';
import { CHECK_ID_RE, checkRulesSchema, type CheckRule, type CheckRunView } from './checks';
import { projectFilesSchema, type ProjectFile } from './exercises';

export const ASSIGNMENT_STATUSES = ['DRAFT', 'PUBLISHED', 'CLOSED'] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const SUBMISSION_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'IN_REVIEW',
  'REVISION_REQUESTED',
  'GRADED',
  'FINALIZED',
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

/** Statuses in which the student may still edit the draft and submit a new version. */
export const SUBMITTABLE_STATUSES: readonly SubmissionStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'REVISION_REQUESTED',
];

export const ASSIGNMENT_MAX_ATTEMPTS = 20;

export const rubricCriterionSchema = z.object({
  id: z.string().regex(CHECK_ID_RE),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(1000).default(''),
  maxPoints: z.number().int().min(1).max(1000),
});
export type RubricCriterion = z.infer<typeof rubricCriterionSchema>;

export const rubricSchema = z
  .array(rubricCriterionSchema)
  .max(20)
  .superRefine((rows, ctx) => {
    const seen = new Set<string>();
    for (const r of rows) {
      if (seen.has(r.id)) ctx.addIssue({ code: 'custom', message: `duplicate criterion: ${r.id}` });
      seen.add(r.id);
    }
  });

export const gradingPolicySchema = z
  .object({
    maxScore: z.number().int().min(1).max(1000).default(100),
    passingScore: z.number().int().min(0).max(1000).default(60),
    /** Accept submissions after the deadline (marked late) instead of refusing them. */
    allowLate: z.boolean().default(false),
  })
  .refine((p) => p.passingScore <= p.maxScore, { message: 'passingScore > maxScore' });
export type GradingPolicy = z.infer<typeof gradingPolicySchema>;

export const DEFAULT_GRADING_POLICY: GradingPolicy = {
  maxScore: 100,
  passingScore: 60,
  allowLate: false,
};

const requirementsSchema = z.array(z.string().trim().min(1).max(300)).max(30);
const deadlineSchema = z.iso.datetime({ offset: true }).nullable();

/** A rubric, when present, must add up to the maximum score. */
export function rubricMatchesPolicy(rubric: RubricCriterion[], policy: GradingPolicy): boolean {
  return rubric.length === 0 || rubric.reduce((n, r) => n + r.maxPoints, 0) === policy.maxScore;
}

const RUBRIC_MISMATCH = { message: 'rubric points must add up to maxScore', path: ['rubric'] };

export const createAssignmentSchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    instructions: z.string().max(20_000).default(''),
    requirements: requirementsSchema.default([]),
    starterFiles: projectFilesSchema.default([{ path: 'index.html', content: '' }]),
    rubric: rubricSchema.default([]),
    gradingPolicy: gradingPolicySchema.default(DEFAULT_GRADING_POLICY),
    deadline: deadlineSchema.default(null),
    maxAttempts: z.number().int().min(1).max(ASSIGNMENT_MAX_ATTEMPTS).default(3),
    /** Optional CHECK on every submitted version. Informational; never a grade. */
    checks: checkRulesSchema.default([]),
    position: z.number().int().min(0).max(10_000).optional(),
  })
  .refine((a) => rubricMatchesPolicy(a.rubric, a.gradingPolicy), RUBRIC_MISMATCH);
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

export const updateAssignmentSchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    instructions: z.string().max(20_000).optional(),
    requirements: requirementsSchema.optional(),
    starterFiles: projectFilesSchema.optional(),
    rubric: rubricSchema.optional(),
    gradingPolicy: gradingPolicySchema.optional(),
    deadline: deadlineSchema.optional(),
    maxAttempts: z.number().int().min(1).max(ASSIGNMENT_MAX_ATTEMPTS).optional(),
    checks: checkRulesSchema.optional(),
    position: z.number().int().min(0).max(10_000).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;

export const saveSubmissionDraftSchema = z.object({ files: projectFilesSchema });
export type SaveSubmissionDraftInput = z.infer<typeof saveSubmissionDraftSchema>;

/** Why a student cannot submit right now. */
export const SUBMIT_BLOCKERS = [
  'ASSIGNMENT_CLOSED',
  'SUBMISSION_LOCKED',
  'ATTEMPTS_EXHAUSTED',
  'DEADLINE_PASSED',
] as const;
export type SubmitBlocker = (typeof SUBMIT_BLOCKERS)[number];

export interface AssignmentSummary {
  id: string;
  title: string;
  deadline: string | null;
  status: Exclude<AssignmentStatus, 'DRAFT'>;
  /** null: the student has not started it. */
  submissionStatus: SubmissionStatus | null;
}

export interface AssignmentAdmin {
  id: string;
  lessonId: string;
  title: string;
  instructions: string;
  requirements: string[];
  starterFiles: ProjectFile[];
  rubric: RubricCriterion[];
  gradingPolicy: GradingPolicy;
  deadline: string | null;
  maxAttempts: number;
  checks: CheckRule[];
  position: number;
  status: AssignmentStatus;
  publishedAt: string | null;
  closedAt: string | null;
  /** Students with at least one submitted version. Rubric and policy lock once > 0. */
  submittedCount: number;
}

export interface SubmissionVersionSummary {
  version: number;
  submittedAt: string;
  isLate: boolean;
  /** Student-safe CHECK summary of this version, if the assignment has CHECK rules. */
  check: CheckRunView | null;
}

/** Student-facing assignment with the student's own submission. No hidden CHECK rules. */
export interface AssignmentView {
  id: string;
  lessonId: string;
  title: string;
  instructions: string;
  requirements: string[];
  rubric: RubricCriterion[];
  gradingPolicy: GradingPolicy;
  deadline: string | null;
  maxAttempts: number;
  status: Exclude<AssignmentStatus, 'DRAFT'>;
  checkAvailable: boolean;
  submission: {
    status: SubmissionStatus;
    files: ProjectFile[];
    attemptsUsed: number;
    updatedAt: string;
    /** null when a submit is possible now. */
    blockedBy: SubmitBlocker | null;
    /** A submit now would be marked late. */
    wouldBeLate: boolean;
  };
  versions: SubmissionVersionSummary[];
}

export interface SubmissionVersionView {
  version: number;
  submittedAt: string;
  isLate: boolean;
  files: ProjectFile[];
}

/** Staff overview row (detailed review is phase 12E). No files or emails. */
export interface AssignmentSubmissionRow {
  userId: string;
  fullName: string;
  status: SubmissionStatus | null;
  versions: number;
  lastSubmittedAt: string | null;
  lastIsLate: boolean;
}
