/**
 * Descriptive and inferential statistics for the pedagogical experiment (13.00.06 research):
 * pre/post comparison, experimental vs control groups, survey reliability and item analysis.
 *
 * Dependency-free and deterministic. p-values come from the Student t distribution (regularized
 * incomplete beta) and the standard normal distribution; tests check them against table values.
 * Every function returns `null` where the statistic is undefined (too few values, zero variance)
 * instead of a misleading number.
 */

export function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

/** Sample variance (n − 1). */
export function variance(xs: number[]): number | null {
  if (xs.length < 2) return null;
  const m = mean(xs)!;
  return xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1);
}

export function sd(xs: number[]): number | null {
  const v = variance(xs);
  return v === null ? null : Math.sqrt(v);
}

export function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

/** ln Γ(x), Lanczos approximation (g = 7). */
function logGamma(x: number): number {
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = c[0]!;
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += c[i]! / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Continued fraction for the incomplete beta function (Numerical Recipes `betacf`). */
function betaContinuedFraction(a: number, b: number, x: number): number {
  const EPS = 1e-14;
  const FPMIN = 1e-300;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

/** Regularized incomplete beta I_x(a, b). */
export function incompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x),
  );
  return x < (a + 1) / (a + b + 2)
    ? (front * betaContinuedFraction(a, b, x)) / a
    : 1 - (front * betaContinuedFraction(b, a, 1 - x)) / b;
}

/** Two-tailed p-value of Student's t with `df` degrees of freedom. */
export function tTestP(t: number, df: number): number {
  if (!Number.isFinite(t)) return 0;
  return incompleteBeta(df / (df + t * t), df / 2, 0.5);
}

/** Standard normal CDF (Abramowitz–Stegun 26.2.17, |error| < 7.5e-8). */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly =
    t *
    (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const tail = (Math.exp((-z * z) / 2) / Math.sqrt(2 * Math.PI)) * poly;
  return z >= 0 ? 1 - tail : tail;
}

export interface TTest {
  t: number;
  df: number;
  p: number;
}

/** Paired-samples t test (e.g. the same students' pre- and post-test scores). */
export function pairedTTest(
  before: number[],
  after: number[],
): (TTest & { n: number; meanDiff: number; sdDiff: number }) | null {
  if (before.length !== after.length) throw new Error('paired samples must have equal length');
  const diffs = after.map((x, i) => x - before[i]!);
  const n = diffs.length;
  const s = sd(diffs);
  if (n < 2 || s === null) return null;
  const m = mean(diffs)!;
  if (s === 0) {
    return m === 0
      ? null
      : { n, meanDiff: m, sdDiff: 0, t: Infinity * Math.sign(m), df: n - 1, p: 0 };
  }
  const t = m / (s / Math.sqrt(n));
  return { n, meanDiff: m, sdDiff: s, t, df: n - 1, p: tTestP(t, n - 1) };
}

/** Welch's t test for two independent groups (does not assume equal variances). */
export function welchTTest(a: number[], b: number[]): TTest | null {
  const va = variance(a);
  const vb = variance(b);
  if (va === null || vb === null) return null;
  const sa = va / a.length;
  const sb = vb / b.length;
  if (sa + sb === 0) return null;
  const t = (mean(a)! - mean(b)!) / Math.sqrt(sa + sb);
  const df = (sa + sb) ** 2 / (sa ** 2 / (a.length - 1) + sb ** 2 / (b.length - 1));
  return { t, df, p: tTestP(t, df) };
}

/** Cohen's d with the pooled standard deviation (a − b). */
export function cohensD(a: number[], b: number[]): number | null {
  const va = variance(a);
  const vb = variance(b);
  if (va === null || vb === null) return null;
  const pooled = Math.sqrt(((a.length - 1) * va + (b.length - 1) * vb) / (a.length + b.length - 2));
  return pooled === 0 ? null : (mean(a)! - mean(b)!) / pooled;
}

/** Conventional reading of |d| (Cohen 1988), in Uzbek. */
export function effectSizeLabel(d: number | null): string {
  if (d === null) return '—';
  const x = Math.abs(d);
  return x < 0.2 ? 'juda kichik' : x < 0.5 ? 'kichik' : x < 0.8 ? "o'rtacha" : 'katta';
}

/** Hake's normalized gain for percentage scores: (post − pre) / (100 − pre). */
export function hakeGain(pre: number, post: number): number | null {
  return pre >= 100 ? null : (post - pre) / (100 - pre);
}

/**
 * Pearson χ² test (no continuity correction) on a 2×2 table
 * [[a, b], [c, d]] — e.g. rows: experimental / control, columns: passed / not passed.
 */
export function chiSquare2x2(
  a: number,
  b: number,
  c: number,
  d: number,
): { chi2: number; df: 1; p: number } | null {
  const n = a + b + c + d;
  const rows = [a + b, c + d];
  const cols = [a + c, b + d];
  if (n === 0 || rows.includes(0) || cols.includes(0)) return null;
  const chi2 = (n * (a * d - b * c) ** 2) / (rows[0]! * rows[1]! * cols[0]! * cols[1]!);
  return { chi2, df: 1, p: 2 * (1 - normalCdf(Math.sqrt(chi2))) };
}

/**
 * Cronbach's alpha. `rows` are respondents, each an array of item scores (same length).
 * Respondents with a missing item must be dropped by the caller.
 */
export function cronbachAlpha(rows: number[][]): number | null {
  const k = rows[0]?.length ?? 0;
  if (rows.length < 2 || k < 2) return null;
  const itemVars = Array.from({ length: k }, (_, j) => variance(rows.map((r) => r[j]!))!);
  const totalVar = variance(rows.map((r) => r.reduce((a, b) => a + b, 0)))!;
  if (totalVar === 0) return null;
  return (k / (k - 1)) * (1 - itemVars.reduce((a, b) => a + b, 0) / totalVar);
}

/** Pearson correlation; `null` when either side has no variance. */
export function pearson(x: number[], y: number[]): number | null {
  if (x.length !== y.length || x.length < 2) return null;
  const mx = mean(x)!;
  const my = mean(y)!;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i++) {
    sxy += (x[i]! - mx) * (y[i]! - my);
    sxx += (x[i]! - mx) ** 2;
    syy += (y[i]! - my) ** 2;
  }
  return sxx === 0 || syy === 0 ? null : sxy / Math.sqrt(sxx * syy);
}

export interface ItemStats {
  /** Share of respondents who got the item right (0..1); higher is easier. */
  difficulty: number;
  /** Upper 27% minus lower 27% share correct (−1..1); ≥ 0.3 discriminates well. */
  discrimination: number | null;
  /** Point-biserial correlation of the item with the rest of the test (item excluded). */
  pointBiserial: number | null;
}

/**
 * Classical test theory item analysis. `answers[r][i]` is 1 when respondent r got item i right.
 * Discrimination uses the upper/lower 27% groups by total score (Kelley).
 */
export function itemAnalysis(answers: (0 | 1)[][]): ItemStats[] {
  const k = answers[0]?.length ?? 0;
  const totals = answers.map((r) => r.reduce<number>((a, b) => a + b, 0));
  const order = totals.map((t, i) => [t, i] as const).sort((x, y) => y[0] - x[0]);
  const g = Math.max(1, Math.round(answers.length * 0.27));
  const upper = order.slice(0, g).map(([, i]) => i);
  const lower = order.slice(-g).map(([, i]) => i);
  const share = (rows: number[], item: number) =>
    rows.reduce((a, r) => a + answers[r]![item]!, 0) / rows.length;
  return Array.from({ length: k }, (_, item) => {
    const col = answers.map((r) => r[item]!);
    const rest = answers.map((r, ri) => totals[ri]! - r[item]!);
    return {
      difficulty: answers.length ? mean(col)! : 0,
      discrimination: answers.length >= 4 ? share(upper, item) - share(lower, item) : null,
      pointBiserial: pearson(col, rest),
    };
  });
}

/** Rounds for display; keeps `null`. */
export function round(x: number | null, digits = 2): number | null {
  if (x === null || !Number.isFinite(x)) return x;
  const f = 10 ** digits;
  return Math.round(x * f) / f;
}

/** "p < 0.001" / "p = 0.034" (APA style without the leading zero would confuse readers here). */
export function formatP(p: number | null): string {
  if (p === null) return '—';
  return p < 0.001 ? 'p < 0.001' : `p = ${p.toFixed(3)}`;
}

/** Inverse standard normal CDF (Acklam's rational approximation, |relative error| < 1.15e-9). */
export function normalQuantile(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [
    -39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716,
    2.506628277459239,
  ];
  const b = [
    -54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972,
    -13.28068155288572,
  ];
  const c = [
    -0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  if (p < lo) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  if (p > 1 - lo) return -normalQuantile(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return (
    ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
    (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
  );
}

/**
 * Shapiro–Wilk normality test (Royston 1992/1995 approximation, 3 ≤ n ≤ 5000).
 * p < 0.05 suggests the data are not normally distributed (prefer rank-based tests).
 */
export function shapiroWilk(xs: number[]): { w: number; p: number } | null {
  const n = xs.length;
  if (n < 3 || n > 5000) return null;
  const x = [...xs].sort((p, q) => p - q);
  const m = mean(x)!;
  const ss = x.reduce((acc, v) => acc + (v - m) ** 2, 0);
  if (ss === 0) return null;
  let a: number[];
  if (n === 3) {
    a = [-Math.SQRT1_2, 0, Math.SQRT1_2];
  } else {
    const mi = Array.from({ length: n }, (_, i) => normalQuantile((i + 1 - 0.375) / (n + 0.25)));
    const mm = mi.reduce((s, v) => s + v * v, 0);
    const u = 1 / Math.sqrt(n);
    const poly = (k: number[], v: number) => k.reduce((s, kk, i) => s + kk * v ** i, 0);
    const an = poly(
      [mi[n - 1]! / Math.sqrt(mm), 0.221157, -0.147981, -2.07119, 4.434685, -2.706056],
      u,
    );
    a = new Array<number>(n).fill(0);
    if (n > 5) {
      const an1 = poly(
        [mi[n - 2]! / Math.sqrt(mm), 0.042981, -0.293762, -1.752461, 5.682633, -3.582633],
        u,
      );
      const phi =
        (mm - 2 * mi[n - 1]! ** 2 - 2 * mi[n - 2]! ** 2) / (1 - 2 * an ** 2 - 2 * an1 ** 2);
      for (let i = 2; i < n - 2; i++) a[i] = mi[i]! / Math.sqrt(phi);
      a[0] = -an;
      a[1] = -an1;
      a[n - 2] = an1;
      a[n - 1] = an;
    } else {
      const phi = (mm - 2 * mi[n - 1]! ** 2) / (1 - 2 * an ** 2);
      for (let i = 1; i < n - 1; i++) a[i] = mi[i]! / Math.sqrt(phi);
      a[0] = -an;
      a[n - 1] = an;
    }
  }
  const w = Math.min(1, a.reduce((s, ai, i) => s + ai * x[i]!, 0) ** 2 / ss);
  let p: number;
  if (n === 3) {
    p = (6 / Math.PI) * (Math.asin(Math.sqrt(w)) - Math.asin(Math.sqrt(0.75)));
    p = Math.max(0, Math.min(1, p));
  } else if (n <= 11) {
    const g = -2.273 + 0.459 * n;
    const mu = 0.544 - 0.39978 * n + 0.025054 * n ** 2 - 0.0006714 * n ** 3;
    const sigma = Math.exp(1.3822 - 0.77857 * n + 0.062767 * n ** 2 - 0.0020322 * n ** 3);
    const arg = g - Math.log(1 - w);
    p = arg <= 0 ? 0 : 1 - normalCdf((-Math.log(arg) - mu) / sigma);
  } else {
    const ln = Math.log(n);
    const mu = 0.0038915 * ln ** 3 - 0.083751 * ln ** 2 - 0.31082 * ln - 1.5861;
    const sigma = Math.exp(0.0030302 * ln ** 2 - 0.082676 * ln - 0.4803);
    p = 1 - normalCdf((Math.log(1 - w) - mu) / sigma);
  }
  return { w, p };
}

/** Average ranks (1-based, ties share the mean rank) and the tie correction Σ(t³ − t). */
function ranks(values: number[]): { r: number[]; ties: number } {
  const order = values.map((v, i) => [v, i] as const).sort((p, q) => p[0] - q[0]);
  const r = new Array<number>(values.length);
  let ties = 0;
  for (let i = 0; i < order.length;) {
    let j = i;
    while (j + 1 < order.length && order[j + 1]![0] === order[i]![0]) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[order[k]![1]] = avg;
    const t = j - i + 1;
    ties += t ** 3 - t;
    i = j + 1;
  }
  return { r, ties };
}

export interface RankTest {
  /** U (Mann–Whitney) or W+ (Wilcoxon). */
  statistic: number;
  z: number;
  p: number;
  /** Effect size r = z / √N. */
  r: number;
}

/** Mann–Whitney U test (normal approximation with tie and continuity correction), a vs b. */
export function mannWhitney(a: number[], b: number[]): RankTest | null {
  const n1 = a.length;
  const n2 = b.length;
  if (n1 < 2 || n2 < 2) return null;
  const { r, ties } = ranks([...a, ...b]);
  const r1 = r.slice(0, n1).reduce((s, v) => s + v, 0);
  const u = r1 - (n1 * (n1 + 1)) / 2;
  const n = n1 + n2;
  const mu = (n1 * n2) / 2;
  const sigma = Math.sqrt(((n1 * n2) / 12) * (n + 1 - ties / (n * (n - 1))));
  if (sigma === 0) return null;
  const z = (u - mu - Math.sign(u - mu) * 0.5) / sigma;
  return { statistic: u, z, p: 2 * (1 - normalCdf(Math.abs(z))), r: z / Math.sqrt(n) };
}

/** Wilcoxon signed-rank test for paired samples (normal approximation, zero differences dropped). */
export function wilcoxonSignedRank(before: number[], after: number[]): RankTest | null {
  const d = after.map((x, i) => x - before[i]!).filter((x) => x !== 0);
  const n = d.length;
  if (n < 2) return null;
  const { r, ties } = ranks(d.map(Math.abs));
  const wPlus = d.reduce((s, x, i) => (x > 0 ? s + r[i]! : s), 0);
  const mu = (n * (n + 1)) / 4;
  const sigma = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24 - ties / 48);
  if (sigma === 0) return null;
  const z = (wPlus - mu - Math.sign(wPlus - mu) * 0.5) / sigma;
  return { statistic: wPlus, z, p: 2 * (1 - normalCdf(Math.abs(z))), r: z / Math.sqrt(n) };
}
