import { describe, expect, it } from 'vitest';
import { EXAMPLE_RULES, parseRules } from './check-rules';

describe('parseRules', () => {
  it('accepts the bundled example and an empty editor', () => {
    const res = parseRules(JSON.stringify(EXAMPLE_RULES));
    expect(res.ok && res.rules.map((r) => r.id)).toEqual([
      'has-h1',
      'h1-text',
      'mobile-font',
      'button-click',
    ]);
    expect(parseRules('')).toEqual({ ok: true, rules: [] });
  });

  it('reports JSON and schema errors with their path', () => {
    expect(parseRules('[{')).toEqual({ ok: false, errors: ['JSON formati noto‘g‘ri'] });
    const res = parseRules(JSON.stringify([{ id: 'a', title: 'aa', assert: { type: 'count' } }]));
    expect(res.ok).toBe(false);
    expect(!res.ok && res.errors[0]).toMatch(/^0\.assert\.selector: /);
  });
});
