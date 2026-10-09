import { z } from 'zod';

/** Lesson quiz: auto-graded on the server; correct answers never reach the student. */

export const QUIZ_QUESTION_KINDS = ['SINGLE', 'MULTIPLE'] as const;
export type QuizQuestionKind = (typeof QUIZ_QUESTION_KINDS)[number];

export const QUIZ_MAX_QUESTIONS = 30;
const itemId = z.string().regex(/^[a-z0-9_-]{1,40}$/);

export const quizOptionSchema = z.object({
  id: itemId,
  text: z.string().trim().min(1).max(500),
});

export const quizQuestionSchema = z
  .object({
    id: itemId,
    prompt: z.string().trim().min(1).max(2000),
    kind: z.enum(QUIZ_QUESTION_KINDS).default('SINGLE'),
    options: z.array(quizOptionSchema).min(2).max(8),
    /** Ids of the correct options. Staff-only. */
    correct: z.array(itemId).min(1).max(8),
  })
  .superRefine((q, ctx) => {
    const ids = new Set(q.options.map((o) => o.id));
    if (ids.size !== q.options.length) {
      ctx.addIssue({ code: 'custom', message: 'duplicate option id', path: ['options'] });
    }
    if (new Set(q.correct).size !== q.correct.length || q.correct.some((c) => !ids.has(c))) {
      ctx.addIssue({
        code: 'custom',
        message: 'correct must reference options',
        path: ['correct'],
      });
    }
    if (q.kind === 'SINGLE' && q.correct.length !== 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'SINGLE needs exactly one answer',
        path: ['correct'],
      });
    }
  });
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const quizQuestionsSchema = z
  .array(quizQuestionSchema)
  .max(QUIZ_MAX_QUESTIONS)
  .superRefine((qs, ctx) => {
    if (new Set(qs.map((q) => q.id)).size !== qs.length) {
      ctx.addIssue({ code: 'custom', message: 'duplicate question id' });
    }
  });

/** An active quiz gates its lesson, so it must have questions. */
const ACTIVE_NEEDS_QUESTIONS = {
  message: 'an active quiz needs at least one question',
  path: ['questions'],
};

export const createQuizSchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    description: z.string().trim().max(2000).default(''),
    questions: quizQuestionsSchema.default([]),
    passingPercent: z.number().int().min(1).max(100).default(70),
    /** New quizzes start inactive so a half-written quiz never blocks students. */
    isActive: z.boolean().default(false),
    position: z.number().int().min(0).max(10_000).optional(),
  })
  .refine((q) => !q.isActive || q.questions.length > 0, ACTIVE_NEEDS_QUESTIONS);
export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export const updateQuizSchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    questions: quizQuestionsSchema.optional(),
    passingPercent: z.number().int().min(1).max(100).optional(),
    isActive: z.boolean().optional(),
    position: z.number().int().min(0).max(10_000).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: itemId,
        optionIds: z.array(itemId).max(8),
      }),
    )
    .max(QUIZ_MAX_QUESTIONS),
});
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;

/**
 * A question counts only when the chosen set equals the correct set exactly.
 * Unanswered and unknown questions count as wrong.
 */
export function gradeQuiz(
  questions: Pick<QuizQuestion, 'id' | 'correct'>[],
  answers: SubmitQuizInput['answers'],
  passingPercent: number,
): { correct: number; total: number; score: number; passed: boolean } {
  const chosen = new Map(answers.map((a) => [a.questionId, new Set(a.optionIds)]));
  let correct = 0;
  for (const q of questions) {
    const set = chosen.get(q.id);
    if (set && set.size === q.correct.length && q.correct.every((c) => set.has(c))) correct++;
  }
  const total = questions.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, score, passed: total > 0 && score >= passingPercent };
}

export const QUIZ_STATUSES = ['NOT_STARTED', 'FAILED', 'PASSED'] as const;
export type QuizStatus = (typeof QUIZ_STATUSES)[number];

export interface QuizSummary {
  id: string;
  title: string;
  status: QuizStatus;
  bestScore: number | null;
}

export interface QuizAttemptResult {
  correct: number;
  total: number;
  score: number;
  passed: boolean;
  createdAt: string;
}

/** Student view: questions without the answers. */
export interface QuizView {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  passingPercent: number;
  questions: {
    id: string;
    prompt: string;
    kind: QuizQuestionKind;
    options: { id: string; text: string }[];
  }[];
  status: QuizStatus;
  bestScore: number | null;
  attempts: number;
  lastAttempt: QuizAttemptResult | null;
}

export interface QuizAdmin {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingPercent: number;
  isActive: boolean;
  position: number;
  /** Students who have attempted it. */
  attemptedBy: number;
  passedBy: number;
}
