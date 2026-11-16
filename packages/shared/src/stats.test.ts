import { describe, expect, it } from 'vitest';
import {
  chiSquare2x2,
  cohensD,
  cronbachAlpha,
  effectSizeLabel,
  formatP,
  hakeGain,
  itemAnalysis,
  mean,
  median,
  normalCdf,
  pairedTTest,
  pearson,
  sd,
  tTestP,
  welchTTest,
  mannWhitney,
  normalQuantile,
  shapiroWilk,
  wilcoxonSignedRank,
} from './stats';

describe('descriptive statistics', () => {
  it('mean, sample sd, median', () => {
    expect(mean([2, 4, 4, 4, 5, 5, 7, 9])).toBe(5);
    expect(sd([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2.1381, 4);
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 2, 3])).toBe(2.5);
    expect(mean([])).toBeNull();
    expect(sd([1])).toBeNull();
  });
});

describe('distributions (table values)', () => {
  it('Student t two-tailed p', () => {
    expect(tTestP(2.228, 10)).toBeCloseTo(0.05, 3);
    expect(tTestP(2.0, 10)).toBeCloseTo(0.0734, 3);
    expect(tTestP(1.96, 1e6)).toBeCloseTo(0.05, 3);
    expect(tTestP(0, 5)).toBeCloseTo(1, 6);
    expect(tTestP(12.706, 1)).toBeCloseTo(0.05, 3);
  });

  it('standard normal CDF', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normalCdf(-1)).toBeCloseTo(0.1587, 4);
  });
});

describe('t tests and effect size', () => {
  it('paired t test', () => {
    const pre = [40, 55, 60, 35, 50, 45];
    const post = [62, 70, 75, 50, 68, 66];
    const r = pairedTTest(pre, post)!;
    expect(r.meanDiff).toBeCloseTo(17.6667, 3);
    expect(r.df).toBe(5);
    expect(r.t).toBeCloseTo(13.506, 2); // diffs 22,15,15,15,18,21: sd 3.204
    expect(r.p).toBeLessThan(0.001);
    expect(pairedTTest([1], [2])).toBeNull();
    expect(pairedTTest([1, 2], [1, 2])).toBeNull();
  });

  it('Welch t test (R: t.test(a, b))', () => {
    const a = [19.1, 21.2, 18.4, 22.0, 20.5, 19.9];
    const b = [17.0, 18.2, 16.5, 19.1, 17.8];
    const r = welchTTest(a, b)!;
    expect(r.t).toBeCloseTo(3.473, 2);
    expect(r.df).toBeCloseTo(8.96, 1);
    expect(r.p).toBeGreaterThan(0.005);
    expect(r.p).toBeLessThan(0.01);
    expect(welchTTest([1], [2, 3])).toBeNull();
  });

  it("Cohen's d and its label", () => {
    expect(cohensD([2, 4, 6], [1, 3, 5])).toBeCloseTo(0.5, 6);
    expect(effectSizeLabel(0.1)).toBe('juda kichik');
    expect(effectSizeLabel(-0.6)).toBe("o'rtacha");
    expect(effectSizeLabel(1.2)).toBe('katta');
  });

  it("Hake's normalized gain", () => {
    expect(hakeGain(40, 70)).toBeCloseTo(0.5, 6);
    expect(hakeGain(100, 100)).toBeNull();
    expect(hakeGain(60, 50)).toBeCloseTo(-0.25, 6);
  });
});

describe('chi-square, reliability and item analysis', () => {
  it('2×2 chi-square', () => {
    // 20/10 vs 10/20: chi2 = 6.667, p ≈ 0.0098
    const r = chiSquare2x2(20, 10, 10, 20)!;
    expect(r.chi2).toBeCloseTo(6.667, 2);
    expect(r.p).toBeCloseTo(0.0098, 3);
    expect(chiSquare2x2(5, 0, 5, 0)).toBeNull();
  });

  it("Cronbach's alpha", () => {
    // Perfectly consistent items -> 1; known example -> 0.8
    expect(
      cronbachAlpha([
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
    ).toBeCloseTo(1, 6);
    const rows = [
      [4, 5, 4],
      [3, 3, 4],
      [5, 5, 5],
      [2, 3, 2],
      [4, 4, 3],
    ];
    expect(cronbachAlpha(rows)).toBeCloseTo(0.9, 1);
    expect(cronbachAlpha([[1, 2]])).toBeNull();
  });

  it('Pearson correlation', () => {
    expect(pearson([1, 2, 3], [2, 4, 6])).toBeCloseTo(1, 6);
    expect(pearson([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1, 6);
    expect(pearson([1, 1, 1], [1, 2, 3])).toBeNull();
  });

  it('item difficulty and discrimination', () => {
    // 10 respondents, item 0 separates strong from weak, item 1 everyone gets right.
    const answers: (0 | 1)[][] = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ];
    const [a, b] = itemAnalysis(answers);
    expect(a!.difficulty).toBeCloseTo(0.5, 6);
    expect(a!.discrimination).toBeCloseTo(1, 6);
    expect(a!.pointBiserial!).toBeGreaterThan(0.5);
    expect(b!.difficulty).toBe(1);
    expect(b!.discrimination).toBe(0);
    expect(b!.pointBiserial).toBeNull();
  });

  it('formats p', () => {
    expect(formatP(0.0004)).toBe('p < 0.001');
    expect(formatP(0.0342)).toBe('p = 0.034');
    expect(formatP(null)).toBe('—');
  });
});

describe('normality and rank-based tests', () => {
  it('normal quantile', () => {
    expect(normalQuantile(0.975)).toBeCloseTo(1.959964, 5);
    expect(normalQuantile(0.5)).toBeCloseTo(0, 8);
    expect(normalQuantile(0.01)).toBeCloseTo(-2.326348, 5);
  });

  it('Shapiro–Wilk: the 1965 paper example (W ≈ 0.79, p < 0.01)', () => {
    const r = shapiroWilk([148, 154, 158, 160, 161, 162, 166, 170, 182, 195, 236])!;
    expect(r.w).toBeCloseTo(0.79, 2);
    expect(r.p).toBeLessThan(0.01);
  });

  it('Shapiro–Wilk: near-normal data are not rejected; skewed data are', () => {
    const normalish = [
      -1.6, -1.1, -0.8, -0.5, -0.3, -0.1, 0, 0.1, 0.3, 0.5, 0.8, 1.1, 1.6, 0.2, -0.2,
    ];
    expect(shapiroWilk(normalish)!.p).toBeGreaterThan(0.05);
    const skewed = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 6, 9, 15, 30, 60];
    expect(shapiroWilk(skewed)!.p).toBeLessThan(0.01);
    expect(shapiroWilk([1, 2])).toBeNull();
    expect(shapiroWilk([3, 3, 3])).toBeNull();
  });

  it('Mann–Whitney U (normal approximation with continuity correction)', () => {
    const r = mannWhitney([1, 2, 3, 4, 5], [6, 7, 8, 9, 10])!;
    expect(r.statistic).toBe(0);
    expect(r.z).toBeCloseTo(-2.507, 2);
    expect(r.p).toBeCloseTo(0.0122, 3);
  });

  it('Wilcoxon signed-rank', () => {
    const r = wilcoxonSignedRank([10, 20, 30, 40, 50, 60], [12, 25, 33, 46, 55, 68])!;
    expect(r.statistic).toBe(21);
    expect(r.z).toBeCloseTo(2.102, 3); // |d| = 2,5,3,6,5,8: one tie (5, 5)
    expect(r.p).toBeCloseTo(0.036, 2);
    expect(wilcoxonSignedRank([1, 2], [1, 2])).toBeNull();
  });
});
