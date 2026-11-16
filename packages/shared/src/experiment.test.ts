import { describe, expect, it } from 'vitest';
import type { AssessmentResultRow } from './assessments';
import { compareExperiment, experimentConclusions } from './experiment';
import { hakeGain } from './stats';

const row = (id: string, pre: number | null, post: number | null): AssessmentResultRow => ({
  userId: id,
  name: id,
  group: null,
  pre,
  post,
  gain: pre !== null && post !== null ? post - pre : null,
  normalizedGain: pre !== null && post !== null ? hakeGain(pre, post) : null,
  preMinutes: null,
  postMinutes: null,
  activeMinutes: null,
});

const E = [
  row('e1', 40, 85),
  row('e2', 45, 90),
  row('e3', 50, 80),
  row('e4', 35, 75),
  row('e5', 42, 88),
  row('e6', 48, 92),
];
const C = [
  row('c1', 42, 60),
  row('c2', 44, 55),
  row('c3', 47, 65),
  row('c4', 38, 50),
  row('c5', 46, 62),
  row('c6', 41, 58),
];

describe('compareExperiment', () => {
  it('finds equal baselines and a significant gain difference', () => {
    const s = compareExperiment(E, C, 70);
    expect(s.baseline.test!.p).toBeGreaterThan(0.05);
    expect(s.gain.test!.p).toBeLessThan(0.001);
    expect(s.gain.difference).toBeGreaterThan(20);
    expect(s.gain.d!).toBeGreaterThan(0.8);
    expect(s.post.test!.p).toBeLessThan(0.001);
    expect(s.passRate.experiment).toEqual({ passed: 6, total: 6 });
    expect(s.passRate.control).toEqual({ passed: 0, total: 6 });
    expect(s.passRate.p!).toBeLessThan(0.01);
    expect(s.experiment.paired).toBe(6);
  });

  it('explains the result in plain words and warns about small samples', () => {
    const text = experimentConclusions(compareExperiment(E, C, 70)).join(' ');
    expect(text).toContain('boshlang‘ich bilim darajasi teng');
    expect(text).toContain('statistik ahamiyatli darajada yuqori');
    expect(text).toContain('< 15');
  });

  it('asks for both groups when one is empty', () => {
    expect(experimentConclusions(compareExperiment(E, [], 70))).toEqual([
      'Tajriba va nazorat guruhlarini belgilang: ikkalasida ham talaba bo‘lishi kerak.',
    ]);
  });

  it('does not claim a difference that is not there', () => {
    const same = compareExperiment(
      E,
      E.map((r) => ({ ...r, userId: `x${r.userId}` })),
      70,
    );
    expect(experimentConclusions(same).join(' ')).toContain('statistik ahamiyatli emas');
  });
});
