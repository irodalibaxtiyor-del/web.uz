import { describe, expect, it } from 'vitest';
import {
  alphaLabel,
  analyzeSurvey,
  createSurveySchema,
  likertScore,
  surveyTemplate,
  validateSurveyAnswers,
  type SurveyItem,
} from './surveys';

const L = (id: string, scale: string, reverse = false): SurveyItem => ({
  id,
  text: id,
  kind: 'LIKERT',
  reverse,
  scale,
  required: true,
});
const ITEMS: SurveyItem[] = [
  L('a', 'M'),
  L('b', 'M'),
  L('c', 'M', true),
  { id: 't', text: 'Fikr', kind: 'TEXT', reverse: false, scale: '', required: false },
];

describe('survey schemas', () => {
  it('the template is valid and has reverse items and subscales', () => {
    const t = createSurveySchema.parse(surveyTemplate());
    expect(t.items.filter((i) => i.reverse)).toHaveLength(2);
    expect(new Set(t.items.map((i) => i.scale).filter(Boolean)).size).toBe(3);
  });

  it('an open survey needs items; ids are unique', () => {
    expect(createSurveySchema.safeParse({ title: 'So‘rov', isOpen: true }).success).toBe(false);
    expect(
      createSurveySchema.safeParse({ title: 'So‘rov', items: [L('a', ''), L('a', '')] }).success,
    ).toBe(false);
  });

  it('validates answers against the items', () => {
    expect(validateSurveyAnswers(ITEMS, { a: 5, b: 4, c: 1 })).toBeNull();
    expect(validateSurveyAnswers(ITEMS, { a: 5, b: 4 })).toContain('c');
    expect(validateSurveyAnswers(ITEMS, { a: 5, b: 4, c: 'x' })).toContain('1–5');
    expect(validateSurveyAnswers(ITEMS, { a: 5, b: 4, c: 2, z: 1 })).toBe('Noma’lum savol');
  });
});

describe('analyzeSurvey', () => {
  it('reverses negative items, computes alpha and the group comparison', () => {
    expect(likertScore(ITEMS[2]!, 1)).toBe(5);
    const rows = [
      { userId: '1', role: 'EXPERIMENT' as const, answers: { a: 5, b: 5, c: 1, t: 'Zo‘r' } },
      { userId: '2', role: 'EXPERIMENT' as const, answers: { a: 4, b: 5, c: 2 } },
      { userId: '3', role: 'CONTROL' as const, answers: { a: 2, b: 2, c: 4, t: ' Qiyin ' } },
      { userId: '4', role: 'CONTROL' as const, answers: { a: 3, b: 2, c: 4 } },
      { userId: '5', role: null, answers: { a: 3, b: 3 } },
    ];
    const r = analyzeSurvey(ITEMS, rows);
    const c = r.items.find((i) => i.id === 'c')!;
    expect(c.distribution).toEqual([1, 1, 0, 2, 0]);
    expect(c.mean).toBeCloseTo((5 + 4 + 2 + 2) / 4, 6);
    expect(r.items.find((i) => i.id === 't')!.texts).toEqual(['Qiyin', 'Zo‘r']);
    const m = r.scales[0]!;
    expect(m).toMatchObject({ scale: 'M', items: 3, n: 4 });
    expect(m.alpha!).toBeGreaterThan(0.9);
    expect(m.experiment!.n).toBe(2);
    expect(m.experiment!.mean!).toBeGreaterThan(m.control!.mean!);
    expect(m.test).not.toBeNull();
  });

  it('labels alpha', () => {
    expect(alphaLabel(0.92)).toBe("a'lo");
    expect(alphaLabel(0.75)).toBe('qoniqarli');
    expect(alphaLabel(0.4)).toBe('qabul qilinmaydi');
    expect(alphaLabel(null)).toBe('—');
  });
});
