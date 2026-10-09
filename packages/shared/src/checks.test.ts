import { describe, expect, it } from 'vitest';
import { CHECK_MAX_RULES, checkRuleSchema, checkRulesSchema } from './checks';

const rule = (over: Record<string, unknown> = {}) => ({
  id: 'h1',
  title: 'Sahifada sarlavha bor',
  assert: { type: 'count', selector: 'h1' },
  ...over,
});

describe('check rules', () => {
  it('applies defaults', () => {
    const r = checkRuleSchema.parse(rule());
    expect(r.hidden).toBe(false);
    expect(r.actions).toEqual([]);
    expect(r.assert).toEqual({ type: 'count', selector: 'h1', min: 1 });
  });

  it('accepts every assertion and action type', () => {
    const rules = [
      rule({ id: 'a', assert: { type: 'text', selector: 'h1', value: 'Salom' } }),
      rule({ id: 'b', assert: { type: 'attribute', selector: 'img', name: 'alt' } }),
      rule({ id: 'c', assert: { type: 'style', selector: 'p', property: 'color', value: 'red' } }),
      rule({ id: 'd', assert: { type: 'noConsoleErrors' } }),
      rule({
        id: 'e',
        viewport: { width: 375, height: 667 },
        actions: [
          { type: 'click', selector: 'button' },
          { type: 'fill', selector: 'input', value: 'x' },
          { type: 'press', selector: 'input', key: 'Enter' },
          { type: 'hover', selector: 'a' },
          { type: 'wait', ms: 100 },
        ],
      }),
    ];
    expect(checkRulesSchema.safeParse(rules).success).toBe(true);
  });

  it('rejects duplicate ids, bad ids, unknown types and out-of-range values', () => {
    expect(checkRulesSchema.safeParse([rule(), rule()]).success).toBe(false);
    expect(checkRuleSchema.safeParse(rule({ id: 'Bad Id' })).success).toBe(false);
    expect(checkRuleSchema.safeParse(rule({ assert: { type: 'script', code: '1' } })).success).toBe(
      false,
    );
    expect(
      checkRuleSchema.safeParse(rule({ assert: { type: 'count', selector: 'p', min: 3, max: 1 } }))
        .success,
    ).toBe(false);
    expect(
      checkRuleSchema.safeParse(rule({ actions: [{ type: 'wait', ms: 60_000 }] })).success,
    ).toBe(false);
    expect(
      checkRuleSchema.safeParse(
        rule({ assert: { type: 'style', selector: 'p', property: 'color;x', value: 'red' } }),
      ).success,
    ).toBe(false);
    expect(
      checkRuleSchema.safeParse(rule({ viewport: { width: 10_000, height: 500 } })).success,
    ).toBe(false);
  });

  it('caps the number of rules', () => {
    const many = Array.from({ length: CHECK_MAX_RULES + 1 }, (_, i) => rule({ id: `r${i}` }));
    expect(checkRulesSchema.safeParse(many).success).toBe(false);
  });
});
