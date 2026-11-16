import { describe, expect, it } from 'vitest';
import { analyzeInstrument, itemFlag, summarizeByKind } from './item-analysis';
import type { QuizQuestion, QuizQuestionResult } from './quizzes';

const tf = (id: string): QuizQuestion => ({ id, prompt: id, kind: 'TRUE_FALSE', answer: true });
const QS = [tf('easy'), tf('good'), tf('bad')];

/** 10 students: "good" tracks ability, "easy" everyone gets, "bad" only weak students get. */
function attempts(): QuizQuestionResult[][] {
  const out: QuizQuestionResult[][] = [];
  for (let s = 0; s < 10; s++) {
    const strong = s < 5;
    out.push([
      { questionId: 'easy', kind: 'TRUE_FALSE', correct: true },
      { questionId: 'good', kind: 'TRUE_FALSE', correct: strong },
      { questionId: 'bad', kind: 'TRUE_FALSE', correct: !strong },
    ]);
  }
  return out;
}

describe('item analysis', () => {
  it('flags easy, negative and fine questions', () => {
    const r = analyzeInstrument(
      { id: 'q', source: 'QUIZ', title: 'Test', lessonTitle: 'Dars' },
      QS,
      attempts(),
    );
    const by = Object.fromEntries(r.questions.map((q) => [q.id, q]));
    expect(r.respondents).toBe(10);
    expect(by.easy).toMatchObject({ difficulty: 1, flag: 'TOO_EASY' });
    expect(by.good!.difficulty).toBe(0.5);
    expect(by.bad!.flag).toBe('NEGATIVE');
    expect(r.meanScore).toBeCloseTo(66.67, 1);
  });

  it('withholds indices with too few respondents', () => {
    const r = analyzeInstrument(
      { id: 'q', source: 'PRETEST', title: 'Kirish', lessonTitle: null },
      QS,
      attempts().slice(0, 3),
    );
    expect(r.reliability).toBeNull();
    expect(r.questions.every((q) => q.discrimination === null && q.flag === null)).toBe(true);
  });

  it('summarizes by question kind', () => {
    const r = analyzeInstrument(
      { id: 'q', source: 'QUIZ', title: 'Test', lessonTitle: null },
      QS,
      attempts(),
    );
    expect(summarizeByKind([r])).toEqual([
      expect.objectContaining({ kind: 'TRUE_FALSE', questions: 3, answers: 30 }),
    ]);
  });

  it('itemFlag thresholds', () => {
    expect(itemFlag(0.5, 0.4)).toBeNull();
    expect(itemFlag(0.1, 0.4)).toBe('TOO_HARD');
    expect(itemFlag(0.5, 0.1)).toBe('POOR_DISCRIMINATION');
    expect(itemFlag(0.5, -0.2)).toBe('NEGATIVE');
  });
});
