import { z } from 'zod';
import { cronbachAlpha, mean, sd, welchTTest, cohensD, type TTest } from './stats';

/**
 * Course questionnaires for the research (motivation, satisfaction, self-efficacy…).
 * Likert items are scored 1–5; `reverse` items are scored 6 − x. Items share a `scale` name to
 * form subscales; reliability is reported as Cronbach's alpha per subscale.
 * One response per student; items freeze after the first response.
 */

export const LIKERT_LABELS = [
  'Mutlaqo qo‘shilmayman',
  'Qo‘shilmayman',
  'Betarafman',
  'Qo‘shilaman',
  'To‘liq qo‘shilaman',
] as const;

export const SURVEY_PHASES = ['PRE', 'POST', 'ANY'] as const;
export type SurveyPhase = (typeof SURVEY_PHASES)[number];
export const SURVEY_PHASE_LABEL: Record<SurveyPhase, string> = {
  PRE: 'Kurs boshida',
  POST: 'Kurs oxirida',
  ANY: 'Istalgan vaqtda',
};

const itemId = z.string().regex(/^[a-z0-9_-]{1,40}$/);

export const surveyItemSchema = z.object({
  id: itemId,
  text: z.string().trim().min(1).max(500),
  kind: z.enum(['LIKERT', 'TEXT']),
  /** Negatively worded Likert item: scored 6 − x. */
  reverse: z.boolean().default(false),
  /** Subscale name (Likert only), e.g. "Motivatsiya". */
  scale: z.string().trim().max(60).default(''),
  required: z.boolean().default(true),
});
export type SurveyItem = z.infer<typeof surveyItemSchema>;

const items = z
  .array(surveyItemSchema)
  .max(60)
  .superRefine((xs, ctx) => {
    if (new Set(xs.map((x) => x.id)).size !== xs.length) {
      ctx.addIssue({ code: 'custom', message: 'duplicate item id' });
    }
  });

export const createSurveySchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    description: z.string().trim().max(2000).default(''),
    phase: z.enum(SURVEY_PHASES).default('ANY'),
    items: items.default([]),
    /** Results never show names (the user id is still kept to allow one response each). */
    anonymous: z.boolean().default(true),
    isOpen: z.boolean().default(false),
  })
  .refine((s) => !s.isOpen || s.items.length > 0, {
    message: 'an open survey needs items',
    path: ['items'],
  });
export type CreateSurveyInput = z.infer<typeof createSurveySchema>;

export const updateSurveySchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    phase: z.enum(SURVEY_PHASES).optional(),
    items: items.optional(),
    anonymous: z.boolean().optional(),
    isOpen: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdateSurveyInput = z.infer<typeof updateSurveySchema>;

export const surveyResponseSchema = z.object({
  answers: z.record(itemId, z.union([z.number().int().min(1).max(5), z.string().max(2000)])),
});
export type SurveyResponseInput = z.infer<typeof surveyResponseSchema>;

/** Checks a response against the items: right type per item, required ones present. */
export function validateSurveyAnswers(
  list: SurveyItem[],
  answers: SurveyResponseInput['answers'],
): string | null {
  const known = new Set(list.map((i) => i.id));
  if (Object.keys(answers).some((k) => !known.has(k))) return 'Noma’lum savol';
  for (const i of list) {
    const a = answers[i.id];
    const empty = a === undefined || (typeof a === 'string' && a.trim() === '');
    if (empty) {
      if (i.required) return `«${i.text}» savoliga javob bering`;
      continue;
    }
    if (i.kind === 'LIKERT' && typeof a !== 'number') return `«${i.text}»: 1–5 ball tanlang`;
    if (i.kind === 'TEXT' && typeof a !== 'string') return `«${i.text}»: matn yozing`;
  }
  return null;
}

/** Score of a Likert answer with reverse items flipped. */
export function likertScore(item: SurveyItem, value: number): number {
  return item.reverse ? 6 - value : value;
}

export interface SurveyAdmin {
  id: string;
  courseId: string;
  title: string;
  description: string;
  phase: SurveyPhase;
  items: SurveyItem[];
  anonymous: boolean;
  isOpen: boolean;
  responses: number;
  locked: boolean;
}

export interface SurveySummary {
  id: string;
  title: string;
  phase: SurveyPhase;
  answered: boolean;
}

export interface SurveyStudentView {
  id: string;
  title: string;
  description: string;
  items: Pick<SurveyItem, 'id' | 'text' | 'kind' | 'required'>[];
  answered: boolean;
}

export interface SurveyItemResult {
  id: string;
  text: string;
  kind: 'LIKERT' | 'TEXT';
  reverse: boolean;
  scale: string;
  n: number;
  /** Likert: mean ± SD of the scored values (after reversing). */
  mean: number | null;
  sd: number | null;
  /** Likert: how many chose 1..5 (raw answers). */
  distribution: number[] | null;
  /** Text answers (anonymous order). */
  texts: string[] | null;
}

export interface SurveyScaleResult {
  scale: string;
  items: number;
  /** Respondents with every item of the scale answered. */
  n: number;
  mean: number | null;
  sd: number | null;
  alpha: number | null;
  /** Experimental vs control on the scale mean, when groups are marked. */
  experiment: { n: number; mean: number | null } | null;
  control: { n: number; mean: number | null } | null;
  test: TTest | null;
  d: number | null;
}

export interface SurveyResults {
  survey: Pick<SurveyAdmin, 'id' | 'title' | 'phase' | 'anonymous'>;
  respondents: number;
  enrolled: number;
  items: SurveyItemResult[];
  scales: SurveyScaleResult[];
}

export interface SurveyResponseRow {
  userId: string;
  /** Experiment role of the student's group in this course, if any. */
  role: 'EXPERIMENT' | 'CONTROL' | null;
  answers: Record<string, number | string>;
}

/** Item and subscale statistics (with Cronbach's alpha) from raw responses. */
export function analyzeSurvey(
  list: SurveyItem[],
  rows: SurveyResponseRow[],
): {
  items: SurveyItemResult[];
  scales: SurveyScaleResult[];
} {
  const itemsOut: SurveyItemResult[] = list.map((i) => {
    const raw = rows.map((r) => r.answers[i.id]).filter((a) => a !== undefined && a !== '');
    if (i.kind === 'TEXT') {
      const texts = raw
        .filter((a): a is string => typeof a === 'string')
        .map((t) => t.trim())
        // Alphabetical, not arrival order: order could reveal who wrote what in a small group.
        .sort((x, y) => x.localeCompare(y));
      return {
        id: i.id,
        text: i.text,
        kind: i.kind,
        reverse: false,
        scale: i.scale,
        n: texts.length,
        mean: null,
        sd: null,
        distribution: null,
        texts,
      };
    }
    const nums = raw.filter((a): a is number => typeof a === 'number');
    const scored = nums.map((v) => likertScore(i, v));
    const distribution = [1, 2, 3, 4, 5].map((k) => nums.filter((v) => v === k).length);
    return {
      id: i.id,
      text: i.text,
      kind: i.kind,
      reverse: i.reverse,
      scale: i.scale,
      n: nums.length,
      mean: mean(scored),
      sd: sd(scored),
      distribution,
      texts: null,
    };
  });

  const likert = list.filter((i) => i.kind === 'LIKERT');
  const names = [...new Set(likert.map((i) => i.scale || 'Umumiy'))];
  const scales: SurveyScaleResult[] = names.map((name) => {
    const its = likert.filter((i) => (i.scale || 'Umumiy') === name);
    const complete = rows
      .map((r) => {
        const vals = its.map((i) => r.answers[i.id]);
        return vals.every((v) => typeof v === 'number')
          ? { role: r.role, scores: its.map((i, k) => likertScore(i, vals[k] as number)) }
          : null;
      })
      .filter((x): x is { role: SurveyResponseRow['role']; scores: number[] } => x !== null);
    const means = complete.map((c) => mean(c.scores)!);
    const e = complete.filter((c) => c.role === 'EXPERIMENT').map((c) => mean(c.scores)!);
    const k = complete.filter((c) => c.role === 'CONTROL').map((c) => mean(c.scores)!);
    const grouped = e.length > 0 || k.length > 0;
    return {
      scale: name,
      items: its.length,
      n: complete.length,
      mean: mean(means),
      sd: sd(means),
      alpha: its.length >= 2 ? cronbachAlpha(complete.map((c) => c.scores)) : null,
      experiment: grouped ? { n: e.length, mean: mean(e) } : null,
      control: grouped ? { n: k.length, mean: mean(k) } : null,
      test: grouped ? welchTTest(e, k) : null,
      d: grouped ? cohensD(e, k) : null,
    };
  });
  return { items: itemsOut, scales };
}

/** Conventional reading of Cronbach's alpha (George & Mallery), in Uzbek. */
export function alphaLabel(a: number | null): string {
  if (a === null) return '—';
  return a >= 0.9
    ? "a'lo"
    : a >= 0.8
      ? 'yaxshi'
      : a >= 0.7
        ? 'qoniqarli'
        : a >= 0.6
          ? 'shubhali'
          : a >= 0.5
            ? 'zaif'
            : 'qabul qilinmaydi';
}

/**
 * A ready, original questionnaire (Uzbek) on learning motivation, satisfaction with the platform
 * and self-efficacy in web design, with two reverse-worded items. Teachers may adapt it.
 */
export function surveyTemplate(): CreateSurveyInput {
  const L = (id: string, text: string, scale: string, reverse = false): SurveyItem => ({
    id,
    text,
    kind: 'LIKERT',
    reverse,
    scale,
    required: true,
  });
  return {
    title: 'O‘quv motivatsiyasi va platformadan qoniqish',
    description:
      'Har bir fikrga qanchalik qo‘shilishingizni belgilang. To‘g‘ri yoki noto‘g‘ri javob yo‘q; javoblar faqat ilmiy tahlil uchun ishlatiladi va ismingiz ko‘rsatilmaydi.',
    phase: 'POST',
    anonymous: true,
    isOpen: false,
    items: [
      L('m1', 'Web dizaynni o‘rganish menga qiziqarli.', 'Motivatsiya'),
      L('m2', 'Darslarni o‘zim xohlaganim uchun bajaraman, majburlikdan emas.', 'Motivatsiya'),
      L('m3', 'Mashqni o‘tgach, keyingisini boshlashni xohlayman.', 'Motivatsiya'),
      L('m4', 'Darslarni ko‘pincha zerikib bajaraman.', 'Motivatsiya', true),
      L('q1', 'Platformadagi darslar tushunarli tuzilgan.', 'Qoniqish'),
      L('q2', 'Kodni darhol tekshirish (CHECK) xatolarimni topishga yordam beradi.', 'Qoniqish'),
      L('q3', 'Testdan keyingi izohlar mavzuni yaxshiroq tushunishga yordam beradi.', 'Qoniqish'),
      L('q4', 'Platformadan foydalanish menga noqulay.', 'Qoniqish', true),
      L('s1', 'Oddiy veb-sahifani mustaqil yarata olaman.', 'O‘z-o‘ziga ishonch'),
      L('s2', 'Kodimdagi xatoni o‘zim topib tuzata olaman.', 'O‘z-o‘ziga ishonch'),
      L('s3', 'Yangi CSS xususiyatini hujjatdan o‘qib qo‘llay olaman.', 'O‘z-o‘ziga ishonch'),
      {
        id: 't1',
        text: 'Platformada sizga eng ko‘p nima yoqdi va nimani yaxshilash kerak?',
        kind: 'TEXT',
        reverse: false,
        scale: '',
        required: false,
      },
    ],
  };
}
