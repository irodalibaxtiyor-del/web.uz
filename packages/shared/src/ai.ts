import { z } from 'zod';

/** What the student asks for. OUT_OF_SCOPE is decided by the server, never requested. */
export const TUTOR_REQUEST_MODES = [
  'HINT',
  'CODE_EXPLANATION',
  'ERROR_EXPLANATION',
  'COMPREHENSION_QUESTION',
  'FLEXBOX_HELP',
  'ASSIGNMENT_GUIDANCE',
  'TEACHER_HANDOFF',
] as const;
export type TutorRequestMode = (typeof TUTOR_REQUEST_MODES)[number];

export const TUTOR_MODES = [...TUTOR_REQUEST_MODES, 'OUT_OF_SCOPE'] as const;
export type TutorMode = (typeof TUTOR_MODES)[number];

export const TUTOR_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
export type TutorLevel = (typeof TUTOR_LEVELS)[number];

export const TUTOR_TARGET_KINDS = ['EXERCISE', 'ASSIGNMENT'] as const;
export type TutorTargetKind = (typeof TUTOR_TARGET_KINDS)[number];

export const HANDOFF_CATEGORIES = ['STUCK', 'CONCEPT', 'BUG', 'OTHER'] as const;
export type HandoffCategory = (typeof HANDOFF_CATEGORIES)[number];

export const MAX_HINTS = 3;
export const TUTOR_MESSAGE_MAX = 2000;
export const TUTOR_RUN_ERRORS_MAX = 5;
export const TUTOR_RUN_ERROR_CHARS = 300;

/**
 * RUN happens in the student's browser, so its summary is client-supplied and untrusted.
 * It is bounded here and passed to the model only as quoted data.
 */
export const runSummarySchema = z.object({
  errors: z
    .array(
      z
        .string()
        .max(TUTOR_RUN_ERROR_CHARS * 4)
        .transform((s) => s.slice(0, TUTOR_RUN_ERROR_CHARS)),
    )
    .max(TUTOR_RUN_ERRORS_MAX),
});
export type RunSummary = z.infer<typeof runSummarySchema>;

export const tutorAskSchema = z.object({
  targetKind: z.enum(TUTOR_TARGET_KINDS),
  targetId: z.string().uuid(),
  mode: z.enum(TUTOR_REQUEST_MODES),
  message: z.string().trim().max(TUTOR_MESSAGE_MAX).default(''),
  level: z.enum(TUTOR_LEVELS).default('BEGINNER'),
  handoffCategory: z.enum(HANDOFF_CATEGORIES).optional(),
  run: runSummarySchema.optional(),
});
export type TutorAskInput = z.input<typeof tutorAskSchema>;
export type TutorAsk = z.output<typeof tutorAskSchema>;

export const tutorFeedbackSchema = z.object({
  helpful: z.boolean(),
  reason: z.string().trim().max(500).optional(),
});
export type TutorFeedbackInput = z.infer<typeof tutorFeedbackSchema>;

export type TutorRefusal = 'FULL_SOLUTION' | 'OUT_OF_SCOPE';

export interface TutorQuota {
  requestsUsed: number;
  requestsLimit: number;
  charsUsed: number;
  charsLimit: number;
}

export interface TutorReply {
  interactionId: string;
  mode: TutorMode;
  level: TutorLevel;
  /** 1..MAX_HINTS for HINT answers, otherwise null. */
  hintNumber: number | null;
  message: string;
  /** Exactly one question for teaching answers; null for handoff, refusal of scope or blocked. */
  comprehensionQuestion: string | null;
  refused: TutorRefusal | null;
  /** The output guard replaced the model's answer with a safe message. */
  blocked: boolean;
  handoffId: string | null;
  createdAt: string;
  feedback: { helpful: boolean } | null;
}

export interface TutorExchange {
  request: { mode: TutorRequestMode; message: string; createdAt: string };
  reply: TutorReply;
}

export interface TutorState {
  /** Whether a real (HTTP) provider is configured; the mock is used otherwise. */
  provider: 'mock' | 'http';
  hintsUsed: number;
  maxHints: number;
  quota: TutorQuota;
  history: TutorExchange[];
}

export interface TutorHandoffView {
  id: string;
  studentId: string;
  studentName: string;
  targetKind: TutorTargetKind;
  targetId: string;
  targetTitle: string;
  category: HandoffCategory;
  note: string;
  createdAt: string;
}

export interface StudentAiUsage {
  available: true;
  requests: number;
  hintsUsed: number;
  handoffs: number;
  helpful: number;
  notHelpful: number;
}
