import { describe, expect, it } from 'vitest';
import {
  compareTerms,
  filterTerms,
  formatInterval,
  REVIEW_MAX_INTERVAL_DAYS,
  scheduleReview,
  termKey,
  termLetter,
  upsertTermSchema,
} from './glossary';

const now = new Date('2026-11-19T10:00:00Z');
const days = (d: Date) => Math.round((d.getTime() - now.getTime()) / 86_400_000);

describe('scheduleReview', () => {
  it('schedules a new card by the answer', () => {
    expect(days(scheduleReview(null, 'GOOD', now).dueAt)).toBe(1);
    expect(days(scheduleReview(null, 'HARD', now).dueAt)).toBe(1);
    expect(days(scheduleReview(null, 'EASY', now).dueAt)).toBe(4);
    const again = scheduleReview(null, 'AGAIN', now);
    expect(again.dueAt.getTime() - now.getTime()).toBe(10 * 60_000);
    expect(again.lapses).toBe(0); // a new card is not a lapse
  });

  it('grows the interval with GOOD answers: 1, 3, then × ease', () => {
    let s = scheduleReview(null, 'GOOD', now);
    s = scheduleReview(s, 'GOOD', now);
    expect(s.intervalDays).toBe(3);
    s = scheduleReview(s, 'GOOD', now);
    expect(s.intervalDays).toBe(8); // round(3 × 2.5)
    expect(s.reps).toBe(3);
  });

  it('a forgotten card resets, lowers ease and counts a lapse', () => {
    let s = scheduleReview(null, 'GOOD', now);
    s = scheduleReview(s, 'GOOD', now);
    const f = scheduleReview(s, 'AGAIN', now);
    expect(f).toMatchObject({ reps: 0, intervalDays: 0, lapses: 1, ease: 2.3 });
    expect(scheduleReview(f, 'GOOD', now).intervalDays).toBe(1);
  });

  it('keeps ease above the floor and the interval under a year', () => {
    let s = scheduleReview(null, 'HARD', now);
    for (let i = 0; i < 20; i++) s = scheduleReview(s, 'HARD', now);
    expect(s.ease).toBe(1.3);
    let e = scheduleReview(null, 'EASY', now);
    for (let i = 0; i < 20; i++) e = scheduleReview(e, 'EASY', now);
    expect(e.intervalDays).toBe(REVIEW_MAX_INTERVAL_DAYS);
  });

  it('orders the buttons: AGAIN < HARD <= GOOD < EASY', () => {
    let s = scheduleReview(null, 'GOOD', now);
    s = scheduleReview(s, 'GOOD', now);
    const [a, h, g, e] = (['AGAIN', 'HARD', 'GOOD', 'EASY'] as const).map((x) =>
      scheduleReview(s, x, now).dueAt.getTime(),
    );
    expect(a).toBeLessThan(h!);
    expect(h).toBeLessThanOrEqual(g!);
    expect(g).toBeLessThan(e!);
  });

  it('formats intervals', () => {
    expect(formatInterval(scheduleReview(null, 'AGAIN', now), now)).toBe('10 daq.');
    expect(formatInterval(scheduleReview(null, 'EASY', now), now)).toBe('4 kun');
  });
});

describe('glossary helpers', () => {
  it('term keys ignore case, spaces and apostrophe variants', () => {
    expect(termKey('  Bo‘sh   element ')).toBe(termKey("bo'sh element"));
  });

  it('searches term first, then definition', () => {
    const terms = [
      { term: 'Teg', definition: 'Element belgisi' },
      { term: 'Element', definition: 'Teglar va mazmun' },
    ];
    expect(filterTerms(terms, 'element').map((t) => t.term)).toEqual(['Element', 'Teg']);
    expect(filterTerms(terms, '  ')).toHaveLength(2);
  });

  it('letters for the index', () => {
    expect(termLetter('atribut')).toBe('A');
    expect(termLetter('<div>')).toBe('D');
    expect(termLetter('Sharh')).toBe('Sh');
    expect(termLetter('o‘lcham')).toBe('O‘');
    expect(termLetter('404')).toBe('#');
  });

  it('sorts by index letter in the Uzbek alphabet, ignoring leading symbols', () => {
    const terms = ['o‘lcham', '<nav>', 'Atribut', '&nbsp;', 'Sharh', 'Brauzer', 'Ochiq', 'Ziyo'];
    expect([...terms].sort(compareTerms)).toEqual([
      'Atribut',
      'Brauzer',
      '<nav>',
      '&nbsp;',
      'Ochiq',
      'Ziyo',
      'o‘lcham',
      'Sharh',
    ]);
  });

  it('validates input', () => {
    expect(upsertTermSchema.safeParse({ term: '', definition: 'abc' }).success).toBe(false);
    expect(upsertTermSchema.parse({ term: 'Teg', definition: 'Belgi' })).toMatchObject({
      example: '',
      lessonId: null,
    });
  });
});
