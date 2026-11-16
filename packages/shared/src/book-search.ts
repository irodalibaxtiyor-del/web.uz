import { normalizeBookText, type BookRect } from './books';

/**
 * Text layer of a book page, built when the PDF is processed and used for search.
 *
 * `display` is the original text (items joined by spaces), `text` its normalized form
 * (`normalizeBookText`). Each span maps one PDF text item to both strings and to its box on the
 * page: `[textStart, textEnd, displayStart, displayEnd, x, y, w, h]`, box in page fractions.
 */
export interface PageText {
  text: string;
  display: string;
  spans: number[][];
}

export interface TextItem {
  str: string;
  /** Box in page fractions (0..1), y from the top. */
  x: number;
  y: number;
  w: number;
  h: number;
}

const r4 = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 10_000) / 10_000;

export function buildPageText(items: TextItem[]): PageText {
  let text = '';
  let display = '';
  const spans: number[][] = [];
  for (const it of items) {
    const raw = it.str.replace(/\s+/g, ' ').trim();
    if (!raw) continue;
    const norm = normalizeBookText(raw).trim();
    if (!norm) continue;
    if (text) {
      text += ' ';
      display += ' ';
    }
    spans.push([
      text.length,
      text.length + norm.length,
      display.length,
      display.length + raw.length,
      r4(it.x),
      r4(it.y),
      r4(it.w),
      r4(it.h),
    ]);
    text += norm;
    display += raw;
  }
  return { text, display, spans };
}

const SNIPPET = 70;
const MAX_MATCHES_PER_PAGE = 20;

/** Matches of `query` (already normalized) on a page: count, highlight boxes, a snippet. */
export function searchPageText(
  page: PageText,
  query: string,
): { count: number; rects: BookRect[]; before: string; match: string; after: string } | null {
  if (!query) return null;
  const starts: number[] = [];
  for (let i = page.text.indexOf(query); i >= 0; i = page.text.indexOf(query, i + query.length)) {
    starts.push(i);
    if (starts.length >= MAX_MATCHES_PER_PAGE) break;
  }
  if (starts.length === 0) return null;
  const rects: BookRect[] = [];
  // Display range of the first match (for the snippet).
  let ms = Infinity;
  let me = -1;
  for (const s0 of starts) {
    const e0 = s0 + query.length;
    for (const sp of page.spans) {
      const [ts, te, ds, de, x, y, w, h] = sp as [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ];
      if (te <= s0 || ts >= e0) continue;
      // Part of the item covered by the match, proportionally to its normalized length.
      const len = Math.max(1, te - ts);
      const a = (Math.max(s0, ts) - ts) / len;
      const b = (Math.min(e0, te) - ts) / len;
      rects.push([r4(x + w * a), y, r4(w * (b - a)), h]);
      if (s0 === starts[0]) {
        const dl = de - ds;
        ms = Math.min(ms, ds + Math.floor(dl * a));
        me = Math.max(me, ds + Math.ceil(dl * b));
      }
    }
  }
  if (me < 0) return null;
  const from = Math.max(0, ms - SNIPPET);
  const to = Math.min(page.display.length, me + SNIPPET);
  return {
    count: starts.length,
    rects,
    before: (from > 0 ? '…' : '') + page.display.slice(from, ms),
    match: page.display.slice(ms, me),
    after: page.display.slice(me, to) + (to < page.display.length ? '…' : ''),
  };
}
