import { z } from 'zod';
import { normalizeBookText } from './books';

/**
 * Course glossary and spaced repetition.
 *
 * Every term may belong to a lesson. A student reviews a term only after completing its
 * lesson (terms without a lesson are open at once): repetition strengthens what was learned,
 * it does not teach ahead. Scheduling is a small SM-2 variant with four answer buttons.
 */

export const TERM_MAX = 120;
export const DEFINITION_MAX = 2000;
export const TERM_EXAMPLE_MAX = 4000;

export const upsertTermSchema = z.object({
  term: z.string().trim().min(1, 'Atamani yozing').max(TERM_MAX),
  definition: z.string().trim().min(3, 'Ta’rifni yozing').max(DEFINITION_MAX),
  example: z.string().max(TERM_EXAMPLE_MAX).default(''),
  lessonId: z.string().uuid().nullable().default(null),
});
export type UpsertTermInput = z.infer<typeof upsertTermSchema>;

/** Key that makes "Atribut", "atribut" and "atribut " the same term within a course. */
export function termKey(term: string): string {
  return normalizeBookText(term).replace(/\s+/g, ' ').trim();
}

export interface TermView {
  id: string;
  term: string;
  definition: string;
  example: string;
  lessonId: string | null;
  lessonTitle: string | null;
  /** Student view: the term's lesson is completed (or it has none), so it can be reviewed. */
  learned: boolean;
}

export interface GlossaryView {
  terms: TermView[];
  /** Staff only: lessons to attach terms to. */
  lessons?: { id: string; title: string; module: string }[];
}

// ---- Spaced repetition ------------------------------------------------------

export const REVIEW_GRADES = ['AGAIN', 'HARD', 'GOOD', 'EASY'] as const;
export type ReviewGrade = (typeof REVIEW_GRADES)[number];
export const REVIEW_GRADE_LABEL: Record<ReviewGrade, string> = {
  AGAIN: 'Eslay olmadim',
  HARD: 'Qiyin',
  GOOD: 'Esladim',
  EASY: 'Juda oson',
};

export const reviewAnswerSchema = z.object({ grade: z.enum(REVIEW_GRADES) });
export type ReviewAnswerInput = z.infer<typeof reviewAnswerSchema>;

/** New cards a student meets per (Tashkent) day, and cards served per request. */
export const REVIEW_NEW_PER_DAY = 10;
export const REVIEW_BATCH = 30;
export const REVIEW_MAX_INTERVAL_DAYS = 365;
/** A forgotten card comes back in the same session. */
export const REVIEW_RELEARN_MINUTES = 10;

const DAY = 86_400_000;
const START_EASE = 2.5;
const MIN_EASE = 1.3;

export interface ReviewState {
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
  dueAt: Date;
}

/** Next state of a card after an answer. `prev` is null for a card seen for the first time. */
export function scheduleReview(
  prev: Omit<ReviewState, 'dueAt'> | null,
  grade: ReviewGrade,
  now: Date,
): ReviewState {
  const ease0 = prev?.ease ?? START_EASE;
  const reps0 = prev?.reps ?? 0;
  const interval0 = prev?.intervalDays ?? 0;
  const lapses0 = prev?.lapses ?? 0;

  if (grade === 'AGAIN') {
    return {
      ease: Math.max(MIN_EASE, round2(ease0 - 0.2)),
      intervalDays: 0,
      reps: 0,
      lapses: prev ? lapses0 + 1 : 0,
      dueAt: new Date(now.getTime() + REVIEW_RELEARN_MINUTES * 60_000),
    };
  }

  let ease = ease0;
  let interval: number;
  if (grade === 'HARD') {
    ease = Math.max(MIN_EASE, round2(ease0 - 0.15));
    interval = reps0 === 0 ? 1 : Math.max(interval0 + 1, Math.round(interval0 * 1.2));
  } else if (grade === 'GOOD') {
    interval = reps0 === 0 ? 1 : reps0 === 1 ? 3 : Math.round(interval0 * ease0);
  } else {
    ease = round2(ease0 + 0.15);
    interval = reps0 === 0 ? 4 : Math.round(Math.max(interval0, 1) * ease0 * 1.3);
  }
  // A longer answer button never schedules sooner than a shorter one did before.
  interval = Math.min(REVIEW_MAX_INTERVAL_DAYS, Math.max(1, interval));
  return {
    ease,
    intervalDays: interval,
    reps: reps0 + 1,
    lapses: lapses0,
    dueAt: addDays(now, interval),
  };
}

/** "10 daq.", "1 kun", "3 kun", "2 oy" — shown under each answer button. */
export function formatInterval(state: ReviewState, now: Date): string {
  const ms = state.dueAt.getTime() - now.getTime();
  if (ms < DAY) return `${Math.max(1, Math.round(ms / 60_000))} daq.`;
  const days = Math.round(ms / DAY);
  if (days < 30) return `${days} kun`;
  if (days < 365) return `${Math.round(days / 30)} oy`;
  return `${Math.round(days / 365)} yil`;
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY);
}
function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

export interface ReviewCard {
  termId: string;
  term: string;
  definition: string;
  example: string;
  lessonTitle: string | null;
  isNew: boolean;
  /** Current scheduling state (null for a new card): the client previews intervals with it. */
  state: { ease: number; intervalDays: number; reps: number; lapses: number } | null;
}

export interface ReviewQueue {
  cards: ReviewCard[];
  counts: {
    /** Learned (reviewable) terms / all terms of the course. */
    learned: number;
    total: number;
    due: number;
    newToday: number;
    /** Cards ever reviewed by the student. */
    started: number;
  };
  /** Earliest future due time when nothing is due now. */
  nextDueAt: string | null;
}

/** Glossary search (Latin/Cyrillic and apostrophes insensitive) over term and definition. */
export function filterTerms<T extends { term: string; definition: string }>(
  terms: T[],
  query: string,
): T[] {
  const q = normalizeBookText(query).trim();
  if (!q) return terms;
  const inTerm: T[] = [];
  const inDef: T[] = [];
  for (const t of terms) {
    if (normalizeBookText(t.term).includes(q)) inTerm.push(t);
    else if (normalizeBookText(t.definition).includes(q)) inDef.push(t);
  }
  return [...inTerm, ...inDef];
}

/** First letter for the A–Z index; Uzbek digraphs (O‘, G‘, Sh, Ch) count as one letter. */
export function termLetter(term: string): string {
  const t = bareTerm(term);
  const m = /^(sh|ch|o['‘’ʻ]|g['‘’ʻ])/i.exec(t);
  if (m) {
    const s = m[1]!;
    return s[0]!.toUpperCase() + (/[a-z]/i.test(s[1]!) ? s[1]!.toLowerCase() : '‘');
  }
  const c = t.charAt(0);
  if (!c) return '#';
  return /\p{L}/u.test(c) ? c.toUpperCase() : '#';
}

/** Term without leading markup symbols: `<nav>` → `nav>`, `&nbsp;` → `nbsp;`. */
function bareTerm(term: string): string {
  return term.trim().replace(/^[<`'"(/.@#&-]+/, '');
}

/** Latin letters, then the Uzbek ones (O‘, G‘, Sh, Ch), then everything else. */
const LETTER_ORDER = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), 'O‘', 'G‘', 'Sh', 'Ch'];

/** Sorts terms for the glossary: by index letter (Uzbek alphabet), then alphabetically. */
export function compareTerms(a: string, b: string): number {
  const rank = (t: string) => {
    const i = LETTER_ORDER.indexOf(termLetter(t));
    return i === -1 ? LETTER_ORDER.length : i;
  };
  return (
    rank(a) - rank(b) ||
    normalizeBookText(bareTerm(a)).localeCompare(normalizeBookText(bareTerm(b)), 'en') ||
    a.localeCompare(b)
  );
}
