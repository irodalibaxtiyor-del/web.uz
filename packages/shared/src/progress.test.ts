import { describe, expect, it } from 'vitest';
import { computeLessonStates, progressPercent, type ProgressStatus } from './progress';

const ids = ['a', 'b', 'c', 'd'];
const states = (p: Record<string, ProgressStatus>) =>
  Object.fromEntries(computeLessonStates(ids, new Map(Object.entries(p))));

describe('computeLessonStates', () => {
  it('opens only the first lesson for a new student', () => {
    expect(states({})).toEqual({ a: 'AVAILABLE', b: 'LOCKED', c: 'LOCKED', d: 'LOCKED' });
  });

  it('advances the frontier after completion', () => {
    expect(states({ a: 'COMPLETED', b: 'IN_PROGRESS' })).toEqual({
      a: 'COMPLETED',
      b: 'IN_PROGRESS',
      c: 'LOCKED',
      d: 'LOCKED',
    });
  });

  it('keeps completed lessons open when a new lesson is inserted before them', () => {
    expect(states({ a: 'COMPLETED', c: 'COMPLETED' })).toEqual({
      a: 'COMPLETED',
      b: 'AVAILABLE',
      c: 'COMPLETED',
      d: 'LOCKED',
    });
  });

  it('marks everything completed at the end', () => {
    const all = { a: 'COMPLETED', b: 'COMPLETED', c: 'COMPLETED', d: 'COMPLETED' } as const;
    expect(Object.values(states(all))).toEqual([
      'COMPLETED',
      'COMPLETED',
      'COMPLETED',
      'COMPLETED',
    ]);
  });

  it('never unlocks a lesson that is merely in progress beyond the frontier', () => {
    expect(states({ c: 'IN_PROGRESS' })).toEqual({
      a: 'AVAILABLE',
      b: 'LOCKED',
      c: 'LOCKED',
      d: 'LOCKED',
    });
  });
});

describe('progressPercent', () => {
  it('handles empty courses and rounds', () => {
    expect(progressPercent(0, 0)).toBe(0);
    expect(progressPercent(1, 3)).toBe(33);
    expect(progressPercent(3, 3)).toBe(100);
  });
});
