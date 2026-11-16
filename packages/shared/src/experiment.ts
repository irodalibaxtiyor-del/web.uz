import { z } from 'zod';
import {
  summarizeAssessment,
  type AssessmentResultRow,
  type AssessmentResults,
} from './assessments';
import {
  chiSquare2x2,
  cohensD,
  mannWhitney,
  mean,
  shapiroWilk,
  welchTTest,
  type RankTest,
  type TTest,
} from './stats';

/**
 * Pedagogical experiment of a course: student groups are marked experimental (taught with the
 * platform's method) or control, and compared on the course pre-/post-tests.
 */

export const EXPERIMENT_ROLES = ['EXPERIMENT', 'CONTROL'] as const;
export type ExperimentRole = (typeof EXPERIMENT_ROLES)[number];

export const EXPERIMENT_ROLE_LABEL: Record<ExperimentRole, string> = {
  EXPERIMENT: 'Tajriba guruhi',
  CONTROL: 'Nazorat guruhi',
};

export const setExperimentGroupsSchema = z.object({
  groups: z
    .array(z.object({ groupId: z.string().uuid(), role: z.enum(EXPERIMENT_ROLES).nullable() }))
    .max(200),
});
export type SetExperimentGroupsInput = z.infer<typeof setExperimentGroupsSchema>;

export interface ExperimentGroup {
  id: string;
  name: string;
  students: number;
  role: ExperimentRole | null;
}

export interface Comparison {
  /** Experimental minus control (means). */
  difference: number | null;
  test: TTest | null;
  /** Cohen's d, experimental − control. */
  d: number | null;
  /** Rank-based alternative (experimental vs control). */
  mannWhitney: RankTest | null;
  /** Shapiro–Wilk p per group (null when not computable). */
  normalityP: { experiment: number | null; control: number | null };
  /** Welch t when both groups look normal (p ≥ 0.05), otherwise Mann–Whitney. */
  recommended: 'WELCH' | 'MANN_WHITNEY';
  /** p of the recommended test. */
  p: number | null;
}

export interface ExperimentStats {
  experiment: AssessmentResults;
  control: AssessmentResults;
  /** Pre-test: the groups should NOT differ (baseline equivalence). */
  baseline: Comparison;
  /** Post-test difference. */
  post: Comparison;
  /** Gain (post − pre) difference, students with both tests. */
  gain: Comparison;
  /** Hake g difference, students with both tests. */
  normalizedGain: Comparison;
  /** Active minutes on the course (time on task). */
  time: Comparison;
  /** Pass rates on the post-test (score ≥ passing %) and the χ² test. */
  passRate: {
    experiment: { passed: number; total: number };
    control: { passed: number; total: number };
    chi2: number | null;
    p: number | null;
  };
}

function compare(a: number[], b: number[]): Comparison {
  const ma = mean(a);
  const mb = mean(b);
  const na = shapiroWilk(a)?.p ?? null;
  const nb = shapiroWilk(b)?.p ?? null;
  const test = welchTTest(a, b);
  const mw = mannWhitney(a, b);
  const recommended =
    (na !== null && na < 0.05) || (nb !== null && nb < 0.05) ? 'MANN_WHITNEY' : 'WELCH';
  return {
    difference: ma === null || mb === null ? null : ma - mb,
    test,
    d: cohensD(a, b),
    mannWhitney: mw,
    normalityP: { experiment: na, control: nb },
    recommended,
    p: recommended === 'WELCH' ? (test?.p ?? null) : (mw?.p ?? null),
  };
}

const values = (rows: AssessmentResultRow[], pick: (r: AssessmentResultRow) => number | null) =>
  rows.flatMap((r) => {
    const v = pick(r);
    return v === null ? [] : [v];
  });

export function compareExperiment(
  experiment: AssessmentResultRow[],
  control: AssessmentResultRow[],
  postPassingPercent: number,
): ExperimentStats {
  const both = (rows: AssessmentResultRow[]) =>
    rows.filter((r) => r.pre !== null && r.post !== null);
  const passCount = (rows: AssessmentResultRow[]) => {
    const taken = values(rows, (r) => r.post);
    return { passed: taken.filter((x) => x >= postPassingPercent).length, total: taken.length };
  };
  const pe = passCount(experiment);
  const pc = passCount(control);
  const chi = chiSquare2x2(pe.passed, pe.total - pe.passed, pc.passed, pc.total - pc.passed);
  return {
    experiment: summarizeAssessment(experiment),
    control: summarizeAssessment(control),
    baseline: compare(
      values(experiment, (r) => r.pre),
      values(control, (r) => r.pre),
    ),
    post: compare(
      values(experiment, (r) => r.post),
      values(control, (r) => r.post),
    ),
    gain: compare(
      values(both(experiment), (r) => r.gain),
      values(both(control), (r) => r.gain),
    ),
    normalizedGain: compare(
      values(both(experiment), (r) => r.normalizedGain),
      values(both(control), (r) => r.normalizedGain),
    ),
    time: compare(
      values(experiment, (r) => r.activeMinutes),
      values(control, (r) => r.activeMinutes),
    ),
    passRate: { experiment: pe, control: pc, chi2: chi?.chi2 ?? null, p: chi?.p ?? null },
  };
}

export interface ExperimentView {
  groups: ExperimentGroup[];
  /** Post-test passing threshold used for pass rates (60 when there is no post-test yet). */
  postPassingPercent: number;
  stats: ExperimentStats;
  /** Plain-language conclusions for the report (Uzbek). */
  conclusions: string[];
}

const P = 0.05;

function testName(c: Comparison): string {
  return c.recommended === 'WELCH'
    ? 'Welch t-mezoni'
    : 'Mann–Whitney U mezoni (taqsimot normal emas)';
}

/** Plain-language reading of the statistics, careful not to claim more than the data shows. */
export function experimentConclusions(s: ExperimentStats): string[] {
  const out: string[] = [];
  const ne = s.experiment.rows.length;
  const nc = s.control.rows.length;
  if (ne === 0 || nc === 0) {
    return ['Tajriba va nazorat guruhlarini belgilang: ikkalasida ham talaba bo‘lishi kerak.'];
  }
  if (s.baseline.p !== null) {
    out.push(
      s.baseline.p >= P
        ? `Kirish testida guruhlar orasida statistik ahamiyatli farq yo‘q (p = ${s.baseline.p.toFixed(3)}, ${testName(s.baseline)}): boshlang‘ich bilim darajasi teng deb hisoblash mumkin.`
        : `Diqqat: kirish testida guruhlar farq qiladi (p = ${s.baseline.p.toFixed(3)}, ${testName(s.baseline)}). Natijani o‘sish (gain) bo‘yicha taqqoslash to‘g‘riroq.`,
    );
  } else {
    out.push(
      'Kirish testi bo‘yicha taqqoslash uchun ma’lumot yetarli emas (har guruhda kamida 2 natija kerak).',
    );
  }
  const main = s.gain.p !== null ? s.gain : s.post;
  const what = s.gain.p !== null ? 'bilim o‘sishi' : 'yakuniy test natijasi';
  if (main.p !== null && main.difference !== null) {
    const p = main.p;
    const how = testName(main);
    const d = `${main.d === null ? '' : `, Cohen d = ${main.d.toFixed(2)}`}; ${how}`;
    out.push(
      p < P && main.difference > 0
        ? `Tajriba guruhida ${what} nazorat guruhiga nisbatan statistik ahamiyatli darajada yuqori (farq ${main.difference.toFixed(1)}, p = ${p.toFixed(3)}${d}).`
        : p < P
          ? `Nazorat guruhida ${what} statistik ahamiyatli darajada yuqori (p = ${p.toFixed(3)}${d}).`
          : `Guruhlar orasidagi ${what} farqi statistik ahamiyatli emas (p = ${p.toFixed(3)}${d}); xulosa uchun ko‘proq ma’lumot kerak bo‘lishi mumkin.`,
    );
  } else {
    out.push('Yakuniy natijalarni taqqoslash uchun ma’lumot yetarli emas.');
  }
  if (s.passRate.p !== null) {
    out.push(
      `Yakuniy testdan o‘tganlar: tajriba ${s.passRate.experiment.passed}/${s.passRate.experiment.total}, nazorat ${s.passRate.control.passed}/${s.passRate.control.total} (χ² = ${s.passRate.chi2!.toFixed(2)}, p = ${s.passRate.p.toFixed(3)}).`,
    );
  }
  if (Math.min(ne, nc) < 15) {
    out.push(
      'Guruhlardagi talabalar soni kichik (< 15): natijalarni ehtiyotkorlik bilan talqin qiling.',
    );
  }
  return out;
}
