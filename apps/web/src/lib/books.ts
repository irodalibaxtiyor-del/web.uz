import type { BookSummary } from '@webdizayn/shared';

export type BookSort = 'recent' | 'title' | 'author' | 'year' | 'reading';

export const BOOK_SORTS: { value: BookSort; label: string }[] = [
  { value: 'recent', label: 'Yangi qo‘shilgan' },
  { value: 'reading', label: 'O‘qiyotganlarim avval' },
  { value: 'title', label: 'Nomi bo‘yicha' },
  { value: 'author', label: 'Muallif bo‘yicha' },
  { value: 'year', label: 'Yili (yangi avval)' },
];

export const collator = new Intl.Collator('uz');

/** Case- and apostrophe-insensitive search key (o‘, o', oʻ all match). */
const key = (s: string) => s.toLowerCase().replace(/[‘’ʻʼ`']/g, '');

export function filterBooks(
  books: BookSummary[],
  q: string,
  direction: string,
  sort: BookSort,
): BookSummary[] {
  const needle = key(q.trim());
  const out = books.filter(
    (b) =>
      (!direction || b.direction?.slug === direction) &&
      (!needle || key(`${b.title} ${b.author} ${b.description}`).includes(needle)),
  );
  const by: Record<BookSort, (a: BookSummary, b: BookSummary) => number> = {
    recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
    title: (a, b) => collator.compare(a.title, b.title),
    author: (a, b) => collator.compare(a.author || '￿', b.author || '￿'),
    year: (a, b) => (b.year ?? 0) - (a.year ?? 0),
    reading: (a, b) => Number(Boolean(b.progress)) - Number(Boolean(a.progress)),
  };
  return out.sort((a, b) => by[sort](a, b) || collator.compare(a.title, b.title));
}

/** Pages shown together: one in portrait, a spread (1-2 | 3-4 …, no cover page) otherwise. */
export function visiblePages(index: number, pageCount: number, portrait: boolean): number[] {
  const first = index + 1;
  if (portrait) return [first];
  return [first, first + 1].filter((p) => p >= 1 && p <= pageCount);
}

/** Pages to have ready around the current view: the view itself and two on each side. */
export function pagesToLoad(index: number, pageCount: number, portrait: boolean): number[] {
  const view = visiblePages(index, pageCount, portrait);
  const from = Math.max(1, view[0]! - 2);
  const to = Math.min(pageCount, view.at(-1)! + 2);
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
}

/** Keys that would save, print or open the source/devtools — refused inside the reader. */
export function isBlockedShortcut(
  e: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'shiftKey'>,
) {
  const k = e.key.toLowerCase();
  const mod = e.ctrlKey || e.metaKey;
  if (k === 'f12') return true;
  if (mod && ['s', 'p', 'u'].includes(k)) return true;
  if (mod && e.shiftKey && ['i', 'j', 'c'].includes(k)) return true;
  return false;
}
