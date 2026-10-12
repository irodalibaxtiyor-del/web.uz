import { describe, expect, it } from 'vitest';
import { looksLikeFullSolution, MODE_LABEL } from './tutor-panel';

describe('tutor panel', () => {
  it('hides long code answers for assignments only', () => {
    const code =
      '```html\n' + Array.from({ length: 9 }, (_, i) => `<p>${i}</p>`).join('\n') + '\n```';
    expect(looksLikeFullSolution(code, 'ASSIGNMENT')).toBe(true);
    expect(looksLikeFullSolution(code, 'EXERCISE')).toBe(false);
    expect(looksLikeFullSolution('<!DOCTYPE html><html></html>', 'ASSIGNMENT')).toBe(true);
    expect(looksLikeFullSolution('`h1` tegini qo‘shing', 'ASSIGNMENT')).toBe(false);
  });

  it('labels every request mode in Uzbek', () => {
    expect(Object.values(MODE_LABEL).every((l) => l.length > 3)).toBe(true);
  });
});
