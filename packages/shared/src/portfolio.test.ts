import { describe, expect, it } from 'vitest';
import { addPortfolioItemSchema, updatePortfolioSchema } from './portfolio';

describe('portfolio schemas', () => {
  it('normalizes and validates the public slug', () => {
    expect(updatePortfolioSchema.parse({ slug: ' Aziza-K ' }).slug).toBe('aziza-k');
    for (const bad of ['ab', '-aziza', 'aziza-', 'az--iza', 'aziza_k', 'a'.repeat(41), 'азиза']) {
      expect(updatePortfolioSchema.safeParse({ slug: bad }).success, bad).toBe(false);
    }
    expect(updatePortfolioSchema.parse({ slug: null }).slug).toBeNull();
  });

  it('limits skills and rejects duplicates regardless of case', () => {
    expect(updatePortfolioSchema.safeParse({ skills: ['HTML', 'html'] }).success).toBe(false);
    expect(
      updatePortfolioSchema.safeParse({ skills: Array.from({ length: 21 }, (_, i) => `s${i}`) })
        .success,
    ).toBe(false);
    expect(updatePortfolioSchema.safeParse({}).success).toBe(false);
  });

  it('accepts only known item kinds and uuid sources', () => {
    const sourceId = '7beea485-09d0-4299-9171-2a01c94d3017';
    expect(addPortfolioItemSchema.safeParse({ kind: 'EXERCISE', sourceId }).success).toBe(true);
    expect(addPortfolioItemSchema.safeParse({ kind: 'QUIZ', sourceId }).success).toBe(false);
    expect(addPortfolioItemSchema.safeParse({ kind: 'EXERCISE', sourceId: 'x' }).success).toBe(
      false,
    );
  });
});
