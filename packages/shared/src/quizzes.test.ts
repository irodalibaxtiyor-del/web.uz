import { describe, expect, it } from 'vitest';
import {
  createQuizSchema,
  gradeQuestion,
  gradeQuiz,
  isAnswered,
  quizAnswerSchema,
  quizQuestionSchema,
  toStudentQuestion,
  type QuizAnswer,
  type QuizQuestion,
} from './quizzes';

const q = (over: Record<string, unknown> = {}) => ({
  id: 'q1',
  prompt: 'Qaysi teg sarlavha?',
  options: [
    { id: 'a', text: '<h1>' },
    { id: 'b', text: '<p>' },
  ],
  correct: ['a'],
  ...over,
});

const parse = (v: unknown) => quizQuestionSchema.parse(v) as QuizQuestion;
const ans = (questionId: string, over: Partial<QuizAnswer> = {}): QuizAnswer =>
  quizAnswerSchema.parse({ questionId, ...over });

const fill = parse({
  id: 'f',
  kind: 'FILL_BLANK',
  prompt: "Bo'sh joyni to'ldiring",
  template: 'Sarlavha tegi {{1}}, xatboshi {{2}}.',
  blanks: [{ accepted: ['h1', '<h1>'] }, { accepted: ['p'] }],
});
const code = parse({
  id: 'c',
  kind: 'CODE_FILL',
  prompt: 'Kodni to‘ldiring',
  template: '.box { {{1}}: flex; }',
  blanks: [{ accepted: ['display'], caseSensitive: true }],
});
const matching = parse({
  id: 'm',
  kind: 'MATCHING',
  prompt: 'Moslang',
  left: [
    { id: 'a', text: '<ul>' },
    { id: 'b', text: '<ol>' },
  ],
  right: [
    { id: 'r1', text: 'belgili ro‘yxat' },
    { id: 'r2', text: 'raqamli ro‘yxat' },
    { id: 'r3', text: 'jadval' },
  ],
  pairs: [
    ['a', 'r1'],
    ['b', 'r2'],
  ],
});
const ordering = parse({
  id: 'o',
  kind: 'ORDERING',
  prompt: 'Tartiblang',
  items: [
    { id: 'a', text: '<!DOCTYPE html>' },
    { id: 'b', text: '<html>' },
    { id: 'c', text: '<head>' },
    { id: 'd', text: '<body>' },
  ],
});
const categorize = parse({
  id: 'g',
  kind: 'CATEGORIZE',
  prompt: 'Ajrating',
  groups: [
    { id: 'blok', text: 'Blok' },
    { id: 'qator', text: 'Qator' },
  ],
  items: [
    { id: 'div', text: '<div>', group: 'blok' },
    { id: 'p', text: '<p>', group: 'blok' },
    { id: 'span', text: '<span>', group: 'qator' },
  ],
});
const truth = parse({ id: 't', kind: 'TRUE_FALSE', prompt: '<br> yopilmaydi', answer: true });

describe('quiz schemas', () => {
  it('validates options and correct answers', () => {
    expect(quizQuestionSchema.safeParse(q()).success).toBe(true);
    expect(quizQuestionSchema.safeParse(q({ correct: ['z'] })).success).toBe(false);
    expect(quizQuestionSchema.safeParse(q({ correct: ['a', 'b'] })).success).toBe(false);
    expect(quizQuestionSchema.safeParse(q({ kind: 'MULTIPLE', correct: ['a', 'b'] })).success).toBe(
      true,
    );
    expect(quizQuestionSchema.safeParse(q({ options: [{ id: 'a', text: 'x' }] })).success).toBe(
      false,
    );
  });

  it('reads stored questions without a kind as SINGLE', () => {
    expect(parse(q()).kind).toBe('SINGLE');
  });

  it('checks gap markers against the blanks', () => {
    const base = { id: 'f', kind: 'FILL_BLANK', prompt: 'x', blanks: [{ accepted: ['a'] }] };
    expect(quizQuestionSchema.safeParse({ ...base, template: 'a {{1}}' }).success).toBe(true);
    expect(quizQuestionSchema.safeParse({ ...base, template: 'bo‘sh joy yo‘q' }).success).toBe(
      false,
    );
    expect(quizQuestionSchema.safeParse({ ...base, template: '{{1}} {{1}}' }).success).toBe(false);
    expect(quizQuestionSchema.safeParse({ ...base, template: '{{2}}' }).success).toBe(false);
  });

  it('checks matching pairs and categorize groups', () => {
    const m = { ...(matching as object) } as Record<string, unknown>;
    expect(quizQuestionSchema.safeParse({ ...m, pairs: [['a', 'r1']] }).success).toBe(false);
    expect(
      quizQuestionSchema.safeParse({
        ...m,
        pairs: [
          ['a', 'r1'],
          ['b', 'r1'],
        ],
      }).success,
    ).toBe(false);
    const g = { ...(categorize as object) } as Record<string, unknown>;
    expect(
      quizQuestionSchema.safeParse({
        ...g,
        items: [
          { id: 'x', text: 'x', group: 'yoq' },
          { id: 'y', text: 'y', group: 'blok' },
        ],
      }).success,
    ).toBe(false);
  });

  it('starts inactive and refuses an active quiz without questions', () => {
    expect(createQuizSchema.parse({ title: 'Test' }).isActive).toBe(false);
    expect(createQuizSchema.safeParse({ title: 'Test', isActive: true }).success).toBe(false);
  });
});

describe('gradeQuiz', () => {
  const questions = [parse(q()), parse(q({ id: 'q2', kind: 'MULTIPLE', correct: ['a', 'b'] }))];

  it('needs the exact set of correct options', () => {
    expect(
      gradeQuiz(questions, [ans('q1', { optionIds: ['a'] }), ans('q2', { optionIds: ['a'] })], 50),
    ).toMatchObject({ correct: 1, total: 2, score: 50, passed: true });
    expect(gradeQuiz(questions, [ans('q2', { optionIds: ['b', 'a', 'a'] })], 50)).toMatchObject({
      correct: 0,
      passed: false,
    });
  });

  it('reports a result per question with its kind', () => {
    expect(gradeQuiz([truth, fill], [ans('t', { optionIds: ['true'] })], 50).results).toEqual([
      { questionId: 't', kind: 'TRUE_FALSE', correct: true },
      { questionId: 'f', kind: 'FILL_BLANK', correct: false },
    ]);
  });

  it('treats an empty quiz as not passed', () => {
    expect(gradeQuiz([], [], 1).passed).toBe(false);
  });
});

describe('gradeQuestion by kind', () => {
  it('true / false', () => {
    expect(gradeQuestion(truth, ans('t', { optionIds: ['true'] }))).toBe(true);
    expect(gradeQuestion(truth, ans('t', { optionIds: ['false'] }))).toBe(false);
    expect(gradeQuestion(truth, ans('t', { optionIds: ['true', 'false'] }))).toBe(false);
    expect(gradeQuestion(truth, undefined)).toBe(false);
  });

  it('fill blanks: trims, ignores case and accepts alternatives', () => {
    expect(gradeQuestion(fill, ans('f', { texts: [' H1 ', 'p'] }))).toBe(true);
    expect(gradeQuestion(fill, ans('f', { texts: ['<h1>', 'P'] }))).toBe(true);
    expect(gradeQuestion(fill, ans('f', { texts: ['h2', 'p'] }))).toBe(false);
    expect(gradeQuestion(fill, ans('f', { texts: ['h1'] }))).toBe(false);
    expect(gradeQuestion(fill, ans('f', { texts: ['', ''] }))).toBe(false);
  });

  it('unifies Uzbek apostrophes in typed answers', () => {
    const uz = parse({
      id: 'u',
      kind: 'FILL_BLANK',
      prompt: 'x',
      template: '{{1}}',
      blanks: [{ accepted: ["o'zgaruvchi"] }],
    });
    expect(gradeQuestion(uz, ans('u', { texts: ['oʻzgaruvchi'] }))).toBe(true);
    expect(gradeQuestion(uz, ans('u', { texts: ['o‘zgaruvchi'] }))).toBe(true);
  });

  it('code fill: ignores whitespace, respects case', () => {
    expect(gradeQuestion(code, ans('c', { texts: ['display'] }))).toBe(true);
    expect(gradeQuestion(code, ans('c', { texts: [' dis play '] }))).toBe(true);
    expect(gradeQuestion(code, ans('c', { texts: ['Display'] }))).toBe(false);
  });

  it('matching needs every pair', () => {
    const good: [string, string][] = [
      ['b', 'r2'],
      ['a', 'r1'],
    ];
    expect(gradeQuestion(matching, ans('m', { pairs: good }))).toBe(true);
    expect(gradeQuestion(matching, ans('m', { pairs: [['a', 'r1']] }))).toBe(false);
    expect(
      gradeQuestion(
        matching,
        ans('m', {
          pairs: [
            ['a', 'r1'],
            ['b', 'r3'],
          ],
        }),
      ),
    ).toBe(false);
  });

  it('ordering needs the exact order', () => {
    expect(gradeQuestion(ordering, ans('o', { order: ['a', 'b', 'c', 'd'] }))).toBe(true);
    expect(gradeQuestion(ordering, ans('o', { order: ['a', 'c', 'b', 'd'] }))).toBe(false);
    expect(gradeQuestion(ordering, ans('o', { order: ['a', 'b', 'c'] }))).toBe(false);
  });

  it('categorize needs every item in its group', () => {
    const all: [string, string][] = [
      ['div', 'blok'],
      ['p', 'blok'],
      ['span', 'qator'],
    ];
    expect(gradeQuestion(categorize, ans('g', { placements: all }))).toBe(true);
    expect(gradeQuestion(categorize, ans('g', { placements: all.slice(0, 2) }))).toBe(false);
    expect(
      gradeQuestion(
        categorize,
        ans('g', {
          placements: [
            ['div', 'qator'],
            ['p', 'blok'],
            ['span', 'qator'],
          ],
        }),
      ),
    ).toBe(false);
  });
});

describe('toStudentQuestion', () => {
  const all = [parse(q()), truth, fill, code, matching, ordering, categorize];

  it('never contains the answers', () => {
    for (const x of all) {
      const json = JSON.stringify(toStudentQuestion(x, 'seed'));
      for (const secret of ['correct', 'answer', 'blanks', 'accepted', 'pairs', 'group"']) {
        expect(json).not.toContain(secret);
      }
    }
  });

  it('never hands out the ordering answer and keeps the shuffle stable', () => {
    for (let i = 0; i < 50; i++) {
      const v = toStudentQuestion(ordering, `talaba-${i}`);
      if (v.kind !== 'ORDERING') throw new Error('kind');
      expect(v.items.map((x) => x.id).join('')).not.toBe('abcd');
      expect(toStudentQuestion(ordering, `talaba-${i}`)).toEqual(v);
    }
  });

  it('counts an answer as given per kind', () => {
    const view = toStudentQuestion(ordering, 's');
    expect(isAnswered(view, ans('o', { order: ['a', 'b'] }))).toBe(false);
    expect(isAnswered(view, ans('o', { order: ['b', 'a', 'd', 'c'] }))).toBe(true);
    expect(isAnswered(toStudentQuestion(fill, 's'), ans('f', { texts: [' ', 'p'] }))).toBe(true);
  });
});
