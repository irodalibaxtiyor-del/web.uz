import { describe, expect, it } from 'vitest';
import { buildPageText, searchPageText } from './book-search';
import { bookSearchQuerySchema, normalizeBookText } from './books';

const item = (str: string, x: number, y = 0.1) => ({ str, x, y, w: 0.2, h: 0.02 });

describe('book text layer', () => {
  it('normalizes Cyrillic, apostrophes and case', () => {
    expect(normalizeBookText('Ўзбек  тили')).toBe('ozbek tili');
    expect(normalizeBookText('O‘zbek TILI')).toBe('ozbek tili');
  });

  it('maps items to both strings and boxes', () => {
    const p = buildPageText([item('Flexbox  maket', 0.1), item('', 0.3), item('Grid', 0.5)]);
    expect(p.display).toBe('Flexbox maket Grid');
    expect(p.text).toBe('flexbox maket grid');
    expect(p.spans).toHaveLength(2);
    expect(p.spans[1]!.slice(0, 4)).toEqual([14, 18, 14, 18]);
  });

  it('finds matches across scripts with boxes and a snippet', () => {
    const p = buildPageText([
      item('Kirish qismi.', 0.1, 0.1),
      item('Ўзбек тилида веб дизайн', 0.1, 0.2),
      item('o‘zbek tili misollari', 0.1, 0.3),
    ]);
    const r = searchPageText(p, normalizeBookText('ozbek tili'))!;
    expect(r.count).toBe(2);
    expect(r.rects).toHaveLength(2);
    expect(r.rects[0]![1]).toBe(0.2);
    expect(r.rects[1]![1]).toBe(0.3);
    expect(r.match.toLowerCase()).toContain('ўзбек');
    expect(searchPageText(p, 'yoq')).toBeNull();
  });

  it('highlights only the matched part of an item', () => {
    const p = buildPageText([{ str: 'abcdefghij', x: 0, y: 0, w: 1, h: 0.1 }]);
    const r = searchPageText(p, 'cde')!;
    expect(r.rects[0]![0]).toBeCloseTo(0.2, 4);
    expect(r.rects[0]![2]).toBeCloseTo(0.3, 4);
  });

  it('validates the query', () => {
    expect(bookSearchQuerySchema.safeParse({ q: 'a' }).success).toBe(false);
    expect(bookSearchQuerySchema.safeParse({ q: "''" }).success).toBe(false);
    expect(bookSearchQuerySchema.safeParse({ q: 'CSS' }).success).toBe(true);
  });
});
