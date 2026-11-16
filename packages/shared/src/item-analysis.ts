import type { QuizQuestion, QuizQuestionKind, QuizQuestionResult } from './quizzes';
import { cronbachAlpha, itemAnalysis, mean } from './stats';

/**
 * Quality of test questions (classical test theory) for the course's lesson quizzes and
 * pre-/post-tests. Lesson quizzes use each student's first attempt so practice does not
 * inflate the numbers.
 */

export type ItemFlag = 'TOO_EASY' | 'TOO_HARD' | 'POOR_DISCRIMINATION' | 'NEGATIVE' | null;

export const ITEM_FLAG_LABEL: Record<Exclude<ItemFlag, null>, string> = {
  TOO_EASY: 'Juda oson (p > 0,9)',
  TOO_HARD: 'Juda qiyin (p < 0,2)',
  POOR_DISCRIMINATION: 'Yomon ajratadi (D < 0,2)',
  NEGATIVE: 'Teskari ajratadi (D < 0) — kalitni tekshiring',
};

export interface ItemRow {
  id: string;
  prompt: string;
  kind: QuizQuestionKind;
  /** Respondents who saw the question. */
  n: number;
  difficulty: number | null;
  discrimination: number | null;
  pointBiserial: number | null;
  flag: ItemFlag;
}

export interface InstrumentAnalysis {
  id: string;
  source: 'QUIZ' | 'PRETEST' | 'POSTTEST';
  title: string;
  lessonTitle: string | null;
  respondents: number;
  /** KR-20 (Cronbach's alpha on right/wrong scores) over respondents who saw every question. */
  reliability: number | null;
  meanScore: number | null;
  questions: ItemRow[];
}

export interface KindSummary {
  kind: QuizQuestionKind;
  questions: number;
  answers: number;
  meanDifficulty: number | null;
  meanDiscrimination: number | null;
}

export interface ItemAnalysisReport {
  instruments: InstrumentAnalysis[];
  byKind: KindSummary[];
}

/** Minimum respondents before indices are worth reading. */
export const ITEM_MIN_RESPONDENTS = 5;

export function itemFlag(difficulty: number | null, discrimination: number | null): ItemFlag {
  if (discrimination !== null && discrimination < 0) return 'NEGATIVE';
  if (difficulty !== null && difficulty > 0.9) return 'TOO_EASY';
  if (difficulty !== null && difficulty < 0.2) return 'TOO_HARD';
  if (discrimination !== null && discrimination < 0.2) return 'POOR_DISCRIMINATION';
  return null;
}

/** Analyzes one instrument from the per-question results of its attempts (one per student). */
export function analyzeInstrument(
  meta: Omit<InstrumentAnalysis, 'respondents' | 'reliability' | 'meanScore' | 'questions'>,
  questions: QuizQuestion[],
  attempts: QuizQuestionResult[][],
): InstrumentAnalysis {
  const ids = questions.map((q) => q.id);
  const maps = attempts.map((a) => new Map(a.map((r) => [r.questionId, r.correct])));
  // Complete rows (every current question present) drive discrimination and reliability.
  const complete = maps
    .filter((m) => ids.every((id) => m.has(id)))
    .map((m) => ids.map((id) => (m.get(id) ? 1 : 0) as 0 | 1));
  const enough = complete.length >= ITEM_MIN_RESPONDENTS;
  const stats = enough ? itemAnalysis(complete) : [];
  const rows: ItemRow[] = questions.map((q, i) => {
    const seen = maps.filter((m) => m.has(q.id));
    const right = seen.filter((m) => m.get(q.id)).length;
    const difficulty = seen.length ? right / seen.length : null;
    const discrimination = enough ? (stats[i]?.discrimination ?? null) : null;
    return {
      id: q.id,
      prompt: q.prompt,
      kind: q.kind,
      n: seen.length,
      difficulty,
      discrimination,
      pointBiserial: enough ? (stats[i]?.pointBiserial ?? null) : null,
      flag: seen.length >= ITEM_MIN_RESPONDENTS ? itemFlag(difficulty, discrimination) : null,
    };
  });
  return {
    ...meta,
    respondents: attempts.length,
    reliability: enough && ids.length >= 2 ? cronbachAlpha(complete) : null,
    meanScore: mean(
      maps.map((m) => {
        const vals = ids.filter((id) => m.has(id));
        return vals.length ? (vals.filter((id) => m.get(id)).length / vals.length) * 100 : 0;
      }),
    ),
    questions: rows,
  };
}

/** Averages per question kind across instruments (questions with enough answers only). */
export function summarizeByKind(instruments: InstrumentAnalysis[]): KindSummary[] {
  const all = instruments.flatMap((x) => x.questions).filter((q) => q.n >= ITEM_MIN_RESPONDENTS);
  const kinds = [...new Set(all.map((q) => q.kind))];
  return kinds
    .map((kind) => {
      const qs = all.filter((q) => q.kind === kind);
      return {
        kind,
        questions: qs.length,
        answers: qs.reduce((a, q) => a + q.n, 0),
        meanDifficulty: mean(qs.flatMap((q) => (q.difficulty === null ? [] : [q.difficulty]))),
        meanDiscrimination: mean(
          qs.flatMap((q) => (q.discrimination === null ? [] : [q.discrimination])),
        ),
      };
    })
    .sort((a, b) => b.questions - a.questions);
}
