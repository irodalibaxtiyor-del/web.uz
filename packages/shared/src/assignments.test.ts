import { describe, expect, it } from 'vitest';
import { createAssignmentSchema, gradingPolicySchema, updateAssignmentSchema } from './assignments';

describe('assignment schemas', () => {
  it('applies defaults', () => {
    const a = createAssignmentSchema.parse({ title: 'Portfolio sahifa' });
    expect(a).toMatchObject({
      maxAttempts: 3,
      deadline: null,
      rubric: [],
      requirements: [],
      checks: [],
      gradingPolicy: { maxScore: 100, passingScore: 60, allowLate: false },
    });
  });

  it('requires the rubric to add up to maxScore', () => {
    const rubric = [
      { id: 'layout', title: 'Joylashuv', maxPoints: 60 },
      { id: 'style', title: 'Dizayn', maxPoints: 40 },
    ];
    expect(createAssignmentSchema.safeParse({ title: 'Ish', rubric }).success).toBe(true);
    expect(
      createAssignmentSchema.safeParse({ title: 'Ish', rubric: rubric.slice(0, 1) }).success,
    ).toBe(false);
  });

  it('rejects bad deadlines, attempts, duplicate criteria and inconsistent policy', () => {
    const bad = [
      { title: 'Ish', deadline: 'ertaga' },
      { title: 'Ish', maxAttempts: 0 },
      { title: 'Ish', maxAttempts: 21 },
      {
        title: 'Ish',
        gradingPolicy: { maxScore: 20 },
        rubric: [
          { id: 'a', title: 'aa', maxPoints: 10 },
          { id: 'a', title: 'bb', maxPoints: 10 },
        ],
      },
    ];
    for (const b of bad)
      expect(createAssignmentSchema.safeParse(b).success, JSON.stringify(b)).toBe(false);
    expect(gradingPolicySchema.safeParse({ maxScore: 10, passingScore: 11 }).success).toBe(false);
    expect(
      createAssignmentSchema.safeParse({ title: 'Ish', deadline: '2026-12-01T18:00:00+05:00' })
        .success,
    ).toBe(true);
    expect(updateAssignmentSchema.safeParse({}).success).toBe(false);
  });
});
