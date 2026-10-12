import { describe, expect, it } from 'vitest';
import {
  BEHIND_BY_PERCENT,
  progressBucket,
  rate,
  struggleReasons,
  trendWeeks,
  weekStartOf,
  type StruggleSignals,
} from './analytics';

const now = new Date('2026-10-14T10:00:00Z'); // Wednesday

function signals(over: Partial<StruggleSignals> = {}): StruggleSignals {
  return {
    progressPercent: 50,
    classAveragePercent: 50,
    lastActivityAt: new Date('2026-10-13T10:00:00Z'),
    enrolledAt: new Date('2026-09-01T00:00:00Z'),
    maxFailuresOnUnpassedExercise: 0,
    needsImprovement: 0,
    revisionRequested: 0,
    failedUnpassedQuizzes: 0,
    ...over,
  };
}

describe('analytics helpers', () => {
  it('rate is null instead of a fake 0 when there is no data', () => {
    expect(rate(0, 0)).toBeNull();
    expect(rate(1, 4)).toBe(0.25);
  });

  it('weeks start on Monday (UTC) and the trend ends with the current week', () => {
    expect(weekStartOf(now)).toBe('2026-10-12');
    expect(weekStartOf(new Date('2026-10-12T00:00:00Z'))).toBe('2026-10-12');
    expect(weekStartOf(new Date('2026-10-11T23:59:59Z'))).toBe('2026-10-05');
    const weeks = trendWeeks(now, 3);
    expect(weeks).toEqual(['2026-09-28', '2026-10-05', '2026-10-12']);
  });

  it('puts progress into buckets', () => {
    expect([0, 1, 24, 25, 74, 75, 99, 100].map(progressBucket)).toEqual([
      '0',
      '1-24',
      '1-24',
      '25-49',
      '50-74',
      '75-99',
      '75-99',
      '100',
    ]);
  });

  it('explains why a student is struggling', () => {
    expect(struggleReasons(signals(), now)).toEqual([]);
    expect(
      struggleReasons(
        signals({
          lastActivityAt: new Date('2026-10-01T00:00:00Z'),
          progressPercent: 50 - BEHIND_BY_PERCENT,
          maxFailuresOnUnpassedExercise: 3,
          needsImprovement: 1,
          revisionRequested: 1,
          failedUnpassedQuizzes: 1,
        }),
        now,
      ),
    ).toEqual([
      'INACTIVE',
      'BEHIND',
      'STUCK_ON_CHECK',
      'NEEDS_IMPROVEMENT',
      'REVISION_REQUESTED',
      'QUIZ_NOT_PASSED',
    ]);
  });

  it('uses the enrollment date when the student never did anything', () => {
    const fresh = signals({ lastActivityAt: null, enrolledAt: new Date('2026-10-13T00:00:00Z') });
    expect(struggleReasons(fresh, now)).toEqual([]);
    const stale = signals({ lastActivityAt: null, enrolledAt: new Date('2026-09-01T00:00:00Z') });
    expect(struggleReasons(stale, now)).toEqual(['INACTIVE']);
  });

  it('never flags a student who finished the course', () => {
    expect(
      struggleReasons(
        signals({ progressPercent: 100, lastActivityAt: null, needsImprovement: 2 }),
        now,
      ),
    ).toEqual([]);
  });
});
