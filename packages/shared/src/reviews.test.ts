import { describe, expect, it } from 'vitest';
import { gradeSubmissionSchema, scoreTotal } from './reviews';

const policy = { maxScore: 100, passingScore: 60, allowLate: false };
const rubric = [
  { id: 'a', title: 'Tuzilma', description: '', maxPoints: 60 },
  { id: 'b', title: 'Dizayn', description: '', maxPoints: 40 },
];

describe('scoreTotal', () => {
  it('sums rubric scores within each criterion maximum', () => {
    expect(
      scoreTotal(rubric, policy, {
        scores: [
          { criterionId: 'a', points: 50 },
          { criterionId: 'b', points: 30 },
        ],
      }),
    ).toEqual({ ok: true, total: 80 });
  });

  it('rejects missing, duplicate, unknown or excessive criterion scores', () => {
    const bad = [
      [{ criterionId: 'a', points: 50 }],
      [
        { criterionId: 'a', points: 1 },
        { criterionId: 'a', points: 1 },
      ],
      [
        { criterionId: 'a', points: 1 },
        { criterionId: 'x', points: 1 },
      ],
      [
        { criterionId: 'a', points: 61 },
        { criterionId: 'b', points: 0 },
      ],
    ];
    for (const scores of bad) expect(scoreTotal(rubric, policy, { scores }).ok).toBe(false);
    expect(scoreTotal(rubric, policy, { score: 80 }).ok).toBe(false);
  });

  it('uses a single score without a rubric', () => {
    expect(scoreTotal([], policy, { score: 70 })).toEqual({ ok: true, total: 70 });
    expect(scoreTotal([], policy, { score: 101 }).ok).toBe(false);
  });

  it('requires exactly one of scores or score', () => {
    expect(gradeSubmissionSchema.safeParse({ version: 1 }).success).toBe(false);
    expect(gradeSubmissionSchema.safeParse({ version: 1, score: 1, scores: [] }).success).toBe(
      false,
    );
    expect(gradeSubmissionSchema.safeParse({ version: 1, score: 1 }).success).toBe(true);
  });
});
