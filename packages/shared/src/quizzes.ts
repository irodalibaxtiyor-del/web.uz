import { z } from 'zod';

/**
 * Lesson quiz: auto-graded on the server; correct answers never reach the student.
 *
 * Question kinds:
 * - SINGLE / MULTIPLE — choose one / several options;
 * - TRUE_FALSE — a statement is true or false;
 * - FILL_BLANK — type the missing word(s) into a text with `{{1}}`, `{{2}}`… gaps;
 * - CODE_FILL — the same, in a code snippet (whitespace inside an answer is ignored);
 * - MATCHING — pair every left item with one right item (right may hold distractors);
 * - ORDERING — put the items into the right order;
 * - CATEGORIZE — drag every item into its group.
 *
 * Every question is graded all-or-nothing, like the original choice questions.
 */

export const QUIZ_QUESTION_KINDS = [
  'SINGLE',
  'MULTIPLE',
  'TRUE_FALSE',
  'FILL_BLANK',
  'CODE_FILL',
  'MATCHING',
  'ORDERING',
  'CATEGORIZE',
] as const;
export type QuizQuestionKind = (typeof QUIZ_QUESTION_KINDS)[number];

export const QUIZ_KIND_LABEL: Record<QuizQuestionKind, string> = {
  SINGLE: 'Bitta javob',
  MULTIPLE: 'Bir nechta javob',
  TRUE_FALSE: "To'g'ri / noto'g'ri",
  FILL_BLANK: "Bo'sh joyni to'ldirish",
  CODE_FILL: "Kodni to'ldirish",
  MATCHING: 'Moslashtirish',
  ORDERING: 'Tartiblash',
  CATEGORIZE: 'Guruhlarga ajratish',
};

export const QUIZ_MAX_QUESTIONS = 30;
export const QUIZ_MAX_BLANKS = 10;
const itemId = z.string().regex(/^[a-z0-9_-]{1,40}$/);
const itemText = z.string().trim().min(1).max(500);
const item = z.object({ id: itemId, text: itemText });
export type QuizItem = z.infer<typeof item>;

const prompt = z.string().trim().min(1).max(2000);

/**
 * Shared by every kind. `explanation` is the teacher's short "why" shown to the student after an
 * attempt (formative feedback) when the quiz uses per-question feedback.
 */
const questionBase = {
  id: itemId,
  prompt,
  explanation: z.string().trim().max(1000).optional(),
};

const unique = (ids: string[]) => new Set(ids).size === ids.length;

/** `{{n}}` gap markers in a FILL_BLANK / CODE_FILL template. */
export const BLANK_RE = /\{\{(\d{1,2})\}\}/g;

export function blankNumbers(template: string): number[] {
  return [...template.matchAll(BLANK_RE)].map((m) => Number(m[1]));
}

const choiceShape = {
  ...questionBase,
  options: z.array(item).min(2).max(8),
  /** Ids of the correct options. Staff-only. */
  correct: z.array(itemId).min(1).max(8),
};

const singleSchema = z.object({ ...choiceShape, kind: z.literal('SINGLE') });
const multipleSchema = z.object({ ...choiceShape, kind: z.literal('MULTIPLE') });

const trueFalseSchema = z.object({
  ...questionBase,
  kind: z.literal('TRUE_FALSE'),
  /** Staff-only. */
  answer: z.boolean(),
});

const blankSchema = z.object({
  /** Accepted answers; compared after trimming and collapsing whitespace. */
  accepted: z.array(z.string().trim().min(1).max(200)).min(1).max(10),
  caseSensitive: z.boolean().default(false),
});

const fillShape = {
  ...questionBase,
  /** Text (or code) with `{{1}}`…`{{n}}` gaps, each used exactly once, numbered from 1. */
  template: z.string().min(1).max(4000),
  /** Staff-only: `blanks[i]` answers gap `{{i+1}}`. */
  blanks: z.array(blankSchema).min(1).max(QUIZ_MAX_BLANKS),
};
const fillBlankSchema = z.object({ ...fillShape, kind: z.literal('FILL_BLANK') });
const codeFillSchema = z.object({ ...fillShape, kind: z.literal('CODE_FILL') });

const matchingSchema = z.object({
  ...questionBase,
  kind: z.literal('MATCHING'),
  left: z.array(item).min(2).max(8),
  /** May contain more items than `left` (distractors). */
  right: z.array(item).min(2).max(10),
  /** Staff-only: `[leftId, rightId]`, one per left item, each right item at most once. */
  pairs: z
    .array(z.tuple([itemId, itemId]))
    .min(2)
    .max(8),
});

const orderingSchema = z.object({
  ...questionBase,
  kind: z.literal('ORDERING'),
  /** In the correct order (staff-only order; students get them shuffled). */
  items: z.array(item).min(2).max(10),
});

const categorizeSchema = z.object({
  ...questionBase,
  kind: z.literal('CATEGORIZE'),
  groups: z.array(item).min(2).max(5),
  /** Staff-only: `group` is the id of the item's group. */
  items: z
    .array(z.object({ id: itemId, text: itemText, group: itemId }))
    .min(2)
    .max(12),
});

const questionUnion = z.discriminatedUnion('kind', [
  singleSchema,
  multipleSchema,
  trueFalseSchema,
  fillBlankSchema,
  codeFillSchema,
  matchingSchema,
  orderingSchema,
  categorizeSchema,
]);

export const quizQuestionSchema = z
  .preprocess(
    // Questions stored before kinds existed have no `kind`: they are SINGLE.
    (v) =>
      v && typeof v === 'object' && !('kind' in v) ? { ...(v as object), kind: 'SINGLE' } : v,
    questionUnion,
  )
  .superRefine((q, ctx) => {
    const issue = (message: string, path: string) =>
      ctx.addIssue({ code: 'custom', message, path: [path] });
    switch (q.kind) {
      case 'SINGLE':
      case 'MULTIPLE': {
        const ids = new Set(q.options.map((o) => o.id));
        if (ids.size !== q.options.length) issue('duplicate option id', 'options');
        if (!unique(q.correct) || q.correct.some((c) => !ids.has(c))) {
          issue('correct must reference options', 'correct');
        }
        if (q.kind === 'SINGLE' && q.correct.length !== 1) {
          issue('SINGLE needs exactly one answer', 'correct');
        }
        break;
      }
      case 'FILL_BLANK':
      case 'CODE_FILL': {
        const nums = blankNumbers(q.template);
        const expected = q.blanks.map((_, i) => i + 1);
        if (nums.length !== expected.length || !expected.every((n) => nums.includes(n))) {
          issue('template must use {{1}}…{{n}} once each, n = number of blanks', 'template');
        }
        break;
      }
      case 'MATCHING': {
        const left = q.left.map((x) => x.id);
        const right = q.right.map((x) => x.id);
        if (!unique(left)) issue('duplicate left id', 'left');
        if (!unique(right)) issue('duplicate right id', 'right');
        const pairedLeft = q.pairs.map((p) => p[0]);
        const pairedRight = q.pairs.map((p) => p[1]);
        if (
          q.pairs.length !== left.length ||
          !unique(pairedLeft) ||
          !left.every((l) => pairedLeft.includes(l))
        ) {
          issue('every left item needs exactly one pair', 'pairs');
        }
        if (!unique(pairedRight) || pairedRight.some((r) => !right.includes(r))) {
          issue('pairs must reference distinct right items', 'pairs');
        }
        break;
      }
      case 'ORDERING':
        if (!unique(q.items.map((x) => x.id))) issue('duplicate item id', 'items');
        break;
      case 'CATEGORIZE': {
        const groups = q.groups.map((g) => g.id);
        if (!unique(groups)) issue('duplicate group id', 'groups');
        if (!unique(q.items.map((x) => x.id))) issue('duplicate item id', 'items');
        if (q.items.some((x) => !groups.includes(x.group))) {
          issue('item group must reference a group', 'items');
        }
        break;
      }
      case 'TRUE_FALSE':
        break;
    }
  });
export type QuizQuestion = z.infer<typeof questionUnion>;
export type ChoiceQuestion = Extract<QuizQuestion, { kind: 'SINGLE' | 'MULTIPLE' }>;

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

/**
 * What a student learns after an attempt.
 * - PER_QUESTION (formative feedback): which questions were right or wrong, plus the teacher's
 *   explanation for each — never the correct options themselves;
 * - TOTAL_ONLY: the score only.
 */
export const QUIZ_FEEDBACK_MODES = ['PER_QUESTION', 'TOTAL_ONLY'] as const;
export type QuizFeedbackMode = (typeof QUIZ_FEEDBACK_MODES)[number];

export const createQuizSchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    description: z.string().trim().max(2000).default(''),
    questions: quizQuestionsSchema.default([]),
    passingPercent: z.number().int().min(1).max(100).default(70),
    feedback: z.enum(QUIZ_FEEDBACK_MODES).default('PER_QUESTION'),
    /**
     * Set: an optional self-check mini-test of that exercise (same lesson). It never gates the
     * lesson; null/absent: a lesson quiz.
     */
    exerciseId: z.string().uuid().nullable().optional(),
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
    feedback: z.enum(QUIZ_FEEDBACK_MODES).optional(),
    exerciseId: z.string().uuid().nullable().optional(),
    isActive: z.boolean().optional(),
    position: z.number().int().min(0).max(10_000).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;

/**
 * One answer. Which field is read depends on the question kind:
 * `optionIds` (SINGLE, MULTIPLE; TRUE_FALSE sends `['true']` or `['false']`), `texts` (gaps in
 * order), `pairs` (`[leftId, rightId]`), `order` (item ids), `placements` (`[itemId, groupId]`).
 */
export const quizAnswerSchema = z.object({
  questionId: itemId,
  optionIds: z.array(itemId).max(8).default([]),
  texts: z.array(z.string().max(500)).max(QUIZ_MAX_BLANKS).optional(),
  pairs: z
    .array(z.tuple([itemId, itemId]))
    .max(8)
    .optional(),
  order: z.array(itemId).max(10).optional(),
  placements: z
    .array(z.tuple([itemId, itemId]))
    .max(12)
    .optional(),
});
export type QuizAnswer = z.infer<typeof quizAnswerSchema>;

export const submitQuizSchema = z.object({
  answers: z.array(quizAnswerSchema).max(QUIZ_MAX_QUESTIONS),
});
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;

/** Uzbek apostrophe variants (o‘, oʻ, o’, o`) compare equal. */
const APOSTROPHES = /[‘’ʻʼ`´]/g;

/** How typed answers are compared: trimmed, whitespace collapsed (removed in code), apostrophes unified. */
export function normalizeTyped(
  value: string,
  kind: 'FILL_BLANK' | 'CODE_FILL',
  caseSensitive: boolean,
) {
  let v = value.normalize('NFC').replace(APOSTROPHES, "'").trim();
  v = kind === 'CODE_FILL' ? v.replace(/\s+/g, '') : v.replace(/\s+/g, ' ');
  return caseSensitive ? v : v.toLowerCase();
}

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && unique(a) && b.every((x) => a.includes(x));

const pairKey = (p: readonly [string, string]) => `${p[0]}\u0000${p[1]}`;

/** True when the answer is exactly right. Missing or malformed answers are wrong. */
export function gradeQuestion(q: QuizQuestion, a: QuizAnswer | undefined): boolean {
  if (!a) return false;
  switch (q.kind) {
    case 'SINGLE':
    case 'MULTIPLE':
      return sameSet(a.optionIds, q.correct);
    case 'TRUE_FALSE':
      return a.optionIds.length === 1 && a.optionIds[0] === String(q.answer);
    case 'FILL_BLANK':
    case 'CODE_FILL': {
      const texts = a.texts ?? [];
      if (texts.length !== q.blanks.length) return false;
      return q.blanks.every((b, i) => {
        const given = normalizeTyped(texts[i] ?? '', q.kind, b.caseSensitive);
        return (
          given.length > 0 &&
          b.accepted.some((acc) => normalizeTyped(acc, q.kind, b.caseSensitive) === given)
        );
      });
    }
    case 'MATCHING': {
      const given = (a.pairs ?? []).map(pairKey);
      return sameSet(given, q.pairs.map(pairKey));
    }
    case 'ORDERING': {
      const order = a.order ?? [];
      return order.length === q.items.length && q.items.every((x, i) => order[i] === x.id);
    }
    case 'CATEGORIZE': {
      const given = (a.placements ?? []).map(pairKey);
      return sameSet(
        given,
        q.items.map((x) => pairKey([x.id, x.group])),
      );
    }
  }
}

export interface QuizQuestionResult {
  questionId: string;
  kind: QuizQuestionKind;
  correct: boolean;
}

/**
 * Grades every question (all-or-nothing). Unanswered and unknown questions count as wrong;
 * answers to questions that are not in the quiz are ignored.
 */
export function gradeQuiz(
  questions: QuizQuestion[],
  answers: QuizAnswer[],
  passingPercent: number,
): {
  correct: number;
  total: number;
  score: number;
  passed: boolean;
  results: QuizQuestionResult[];
} {
  const byId = new Map(answers.map((a) => [a.questionId, a]));
  const results = questions.map((q) => ({
    questionId: q.id,
    kind: q.kind,
    correct: gradeQuestion(q, byId.get(q.id)),
  }));
  const correct = results.filter((r) => r.correct).length;
  const total = questions.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, score, passed: total > 0 && score >= passingPercent, results };
}

/** Fisher–Yates over `0..n-1` driven by a small PRNG seeded from `seed` (FNV-1a). */
export function seededOrder(n: number, seed: string): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  const next = () => {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    return h / 2 ** 32;
  };
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order;
}

function shuffled<T>(list: T[], seed: string, avoidIdentity = false): T[] {
  let order = seededOrder(list.length, seed);
  // For ORDERING the authored order *is* the answer: never hand it out unchanged.
  if (avoidIdentity && list.length > 1 && order.every((v, i) => v === i)) {
    order = order.map((_, i) => (i + 1) % list.length);
  }
  return order.map((i) => list[i]!);
}

/** What a student sees of a question: no correct options, pairs, order or groups. */
export type QuizViewQuestion =
  | { id: string; prompt: string; kind: 'SINGLE' | 'MULTIPLE'; options: QuizItem[] }
  | { id: string; prompt: string; kind: 'TRUE_FALSE' }
  | {
      id: string;
      prompt: string;
      kind: 'FILL_BLANK' | 'CODE_FILL';
      template: string;
      blankCount: number;
    }
  | { id: string; prompt: string; kind: 'MATCHING'; left: QuizItem[]; right: QuizItem[] }
  | { id: string; prompt: string; kind: 'ORDERING'; items: QuizItem[] }
  | { id: string; prompt: string; kind: 'CATEGORIZE'; groups: QuizItem[]; items: QuizItem[] };

const plain = (x: QuizItem): QuizItem => ({ id: x.id, text: x.text });

/**
 * Strips the answers. `seed` (quiz + student) fixes the shuffle so a reload shows the same
 * order, while authored order (which can be the answer) never leaks.
 */
/**
 * Per-question review of a graded attempt: right/wrong from the stored results and the teacher's
 * explanation from the current questions. Questions removed since the attempt are skipped.
 */
export function reviewAttempt(
  questions: QuizQuestion[],
  results: QuizQuestionResult[],
): QuizQuestionReview[] {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return results
    .filter((r) => byId.has(r.questionId))
    .map((r) => ({
      questionId: r.questionId,
      correct: r.correct,
      explanation: byId.get(r.questionId)!.explanation ?? null,
    }));
}

export function toStudentQuestion(q: QuizQuestion, seed: string): QuizViewQuestion {
  const s = `${seed}\u0000${q.id}`;
  switch (q.kind) {
    case 'SINGLE':
    case 'MULTIPLE':
      return { id: q.id, prompt: q.prompt, kind: q.kind, options: q.options.map(plain) };
    case 'TRUE_FALSE':
      return { id: q.id, prompt: q.prompt, kind: q.kind };
    case 'FILL_BLANK':
    case 'CODE_FILL':
      return {
        id: q.id,
        prompt: q.prompt,
        kind: q.kind,
        template: q.template,
        blankCount: q.blanks.length,
      };
    case 'MATCHING':
      return {
        id: q.id,
        prompt: q.prompt,
        kind: q.kind,
        left: q.left.map(plain),
        right: shuffled(q.right.map(plain), `${s}\u0000r`),
      };
    case 'ORDERING':
      return {
        id: q.id,
        prompt: q.prompt,
        kind: q.kind,
        items: shuffled(q.items.map(plain), s, true),
      };
    case 'CATEGORIZE':
      return {
        id: q.id,
        prompt: q.prompt,
        kind: q.kind,
        groups: q.groups.map(plain),
        items: shuffled(q.items.map(plain), s),
      };
  }
}

/** Whether the student has given an answer worth sending (used for the "answered" counter). */
export function isAnswered(q: QuizViewQuestion, a: QuizAnswer | undefined): boolean {
  if (!a) return false;
  switch (q.kind) {
    case 'SINGLE':
    case 'MULTIPLE':
    case 'TRUE_FALSE':
      return a.optionIds.length > 0;
    case 'FILL_BLANK':
    case 'CODE_FILL':
      return (a.texts ?? []).some((t) => t.trim().length > 0);
    case 'MATCHING':
      return (a.pairs ?? []).length > 0;
    case 'ORDERING':
      return (a.order ?? []).length === q.items.length;
    case 'CATEGORIZE':
      return (a.placements ?? []).length > 0;
  }
}

export const QUIZ_STATUSES = ['NOT_STARTED', 'FAILED', 'PASSED'] as const;
export type QuizStatus = (typeof QUIZ_STATUSES)[number];

export interface QuizSummary {
  id: string;
  title: string;
  status: QuizStatus;
  bestScore: number | null;
}

/** Per-question outcome shown to the student (no correct options, only right/wrong + why). */
export interface QuizQuestionReview {
  questionId: string;
  correct: boolean;
  explanation: string | null;
}

export interface QuizAttemptResult {
  correct: number;
  total: number;
  score: number;
  passed: boolean;
  createdAt: string;
  /** Present when the quiz gives per-question feedback. */
  review?: QuizQuestionReview[];
}

/** Student view: questions without the answers. */
export interface QuizView {
  id: string;
  lessonId: string;
  /** Set for an exercise mini-test (self-check; does not gate the lesson). */
  exerciseId: string | null;
  title: string;
  description: string;
  passingPercent: number;
  feedback: QuizFeedbackMode;
  questions: QuizViewQuestion[];
  status: QuizStatus;
  bestScore: number | null;
  attempts: number;
  lastAttempt: QuizAttemptResult | null;
}

export interface QuizAdmin {
  id: string;
  lessonId: string;
  exerciseId: string | null;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingPercent: number;
  feedback: QuizFeedbackMode;
  isActive: boolean;
  position: number;
  /** Students who have attempted it. */
  attemptedBy: number;
  passedBy: number;
}
