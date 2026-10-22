import type { BookSummary } from '@webdizayn/shared';
import { describe, expect, it } from 'vitest';
import { filterBooks, isBlockedShortcut, pagesToLoad, visiblePages } from './books';

const book = (over: Partial<BookSummary>): BookSummary => ({
  id: over.title ?? 'x',
  title: 'Kitob',
  author: '',
  year: null,
  description: '',
  direction: null,
  course: null,
  pageCount: 10,
  progress: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...over,
});

describe('filterBooks', () => {
  const books = [
    book({
      title: 'HTML asoslari',
      author: 'Karimov',
      year: 2020,
      createdAt: '2026-01-02T00:00:00Z',
      direction: { slug: 'html', title: 'HTML' },
    }),
    book({
      title: 'O‘zbek tilida CSS',
      author: 'Aliyeva',
      year: 2024,
      createdAt: '2026-01-01T00:00:00Z',
      direction: { slug: 'css', title: 'CSS' },
      progress: { page: 3, percent: 30 },
    }),
    book({ title: 'JavaScript', author: '', year: null, createdAt: '2026-01-03T00:00:00Z' }),
  ];
  const titles = (r: BookSummary[]) => r.map((b) => b.title);

  it('searches without caring about case or apostrophe form', () => {
    expect(titles(filterBooks(books, "o'zbek", '', 'title'))).toEqual(['O‘zbek tilida CSS']);
    expect(titles(filterBooks(books, 'OʻZBEK', '', 'title'))).toEqual(['O‘zbek tilida CSS']);
    expect(titles(filterBooks(books, 'karimov', '', 'title'))).toEqual(['HTML asoslari']);
    expect(filterBooks(books, '  ', '', 'title')).toHaveLength(3);
  });

  it('filters by direction', () => {
    expect(titles(filterBooks(books, '', 'css', 'title'))).toEqual(['O‘zbek tilida CSS']);
    expect(filterBooks(books, '', 'php', 'title')).toEqual([]);
  });

  it('sorts', () => {
    expect(titles(filterBooks(books, '', '', 'recent'))).toEqual([
      'JavaScript',
      'HTML asoslari',
      'O‘zbek tilida CSS',
    ]);
    expect(titles(filterBooks(books, '', '', 'year'))[0]).toBe('O‘zbek tilida CSS');
    expect(titles(filterBooks(books, '', '', 'reading'))[0]).toBe('O‘zbek tilida CSS');
    // Books without an author go last.
    expect(titles(filterBooks(books, '', '', 'author')).at(-1)).toBe('JavaScript');
  });

  it('does not mutate the input', () => {
    const copy = [...books];
    filterBooks(books, '', '', 'title');
    expect(books).toEqual(copy);
  });
});

describe('page windows', () => {
  it('shows one page in portrait and a spread otherwise', () => {
    expect(visiblePages(0, 10, true)).toEqual([1]);
    expect(visiblePages(2, 10, false)).toEqual([3, 4]);
    expect(visiblePages(9, 10, false)).toEqual([10]);
  });

  it('loads the view and two pages on each side, inside the book', () => {
    expect(pagesToLoad(0, 10, true)).toEqual([1, 2, 3]);
    expect(pagesToLoad(4, 10, true)).toEqual([3, 4, 5, 6, 7]);
    expect(pagesToLoad(4, 10, false)).toEqual([3, 4, 5, 6, 7, 8]);
    expect(pagesToLoad(9, 10, false)).toEqual([8, 9, 10]);
    expect(pagesToLoad(0, 1, false)).toEqual([1]);
  });
});

describe('isBlockedShortcut', () => {
  const k = (
    key: string,
    mods: Partial<Record<'ctrlKey' | 'metaKey' | 'shiftKey', boolean>> = {},
  ) => ({
    key,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    ...mods,
  });

  it('blocks save, print, source and devtools', () => {
    for (const e of [
      k('s', { ctrlKey: true }),
      k('P', { metaKey: true }),
      k('u', { ctrlKey: true }),
      k('I', { ctrlKey: true, shiftKey: true }),
      k('j', { metaKey: true, shiftKey: true }),
      k('F12'),
    ]) {
      expect(isBlockedShortcut(e), JSON.stringify(e)).toBe(true);
    }
  });

  it('leaves ordinary keys alone', () => {
    for (const e of [
      k('s'),
      k('ArrowRight'),
      k('c', { ctrlKey: true }),
      k('i', { ctrlKey: true }),
      k('Home'),
    ]) {
      expect(isBlockedShortcut(e), JSON.stringify(e)).toBe(false);
    }
  });
});
