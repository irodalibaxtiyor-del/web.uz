'use client';

import type { BookDetail, BookPageSize, BookPageUrls } from '@webdizayn/shared';
import Link from 'next/link';
import type { PageFlip } from 'page-flip';
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { api, send } from '@/lib/api';
import { isBlockedShortcut, pagesToLoad, visiblePages } from '@/lib/books';
import { Dialog } from './dialog';
import { Icon, type IconName } from './icons';

const ZOOMS = [1, 1.25, 1.5, 2] as const;
/** Below this stage width the book shows one page at a time. */
const SPREAD_MIN_WIDTH = 768;
/** Decoded pages kept around the current view (memory stays bounded on long books). */
const KEEP_RADIUS = 6;

type Layout = { portrait: boolean; width: number };
type Cached = { size: BookPageSize; bitmap: ImageBitmap };

/**
 * Flipbook reader. Pages arrive as watermarked images through short-lived signed URLs and are
 * drawn into <canvas> elements (no <img> to save or drag). The page-flip widget and its pages
 * are created imperatively inside a React-owned host, because the widget moves and removes
 * those nodes itself.
 *
 * The copy guards here (context menu, drag, selection, save/print/devtools shortcuts, blank
 * print) only make casual copying harder; the real protection is on the server: per-page
 * authorization, signed URLs, rate limits and the watermark.
 */
export function BookReader({ book }: { book: BookDetail }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const canvases = useRef(new Map<number, HTMLCanvasElement>());
  const cache = useRef(new Map<number, Cached>());
  const inflight = useRef(new Set<string>());
  const startIndex = Math.max(0, (book.progress?.page ?? 1) - 1);
  const indexRef = useRef(startIndex);

  const [layout, setLayout] = useState<Layout | null>(null);
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(1);
  const [index, setIndex] = useState(startIndex);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const aspect = book.pageHeight / Math.max(1, book.pageWidth) || 1.414;
  const n = book.pageCount;

  // ---- Layout: fit the page or spread into the stage, then apply zoom ----
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      const w = stage.clientWidth - 16;
      const h = stage.clientHeight - 16;
      const portrait = stage.clientWidth < SPREAD_MIN_WIDTH;
      const perRow = portrait ? 1 : 2;
      const width = Math.max(200, Math.floor(Math.min(w, (h / aspect) * perRow)));
      setLayout((prev) =>
        prev && prev.portrait === portrait && Math.abs(prev.width - width) < 24
          ? prev
          : { portrait, width },
      );
    };
    measure();
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(measure, 150);
    });
    ro.observe(stage);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [aspect]);

  const draw = useCallback((page: number) => {
    const canvas = canvases.current.get(page);
    const c = cache.current.get(page);
    if (!canvas || !c) return;
    canvas.width = c.bitmap.width;
    canvas.height = c.bitmap.height;
    canvas.getContext('2d')?.drawImage(c.bitmap, 0, 0);
    canvas.parentElement?.classList.remove('is-loading');
  }, []);

  // ---- The flipbook itself (re-created when the layout or zoom changes) ----
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !layout) return;
    let disposed = false;
    let flip: PageFlip | null = null;
    const bookEl = document.createElement('div');
    bookEl.className = 'book-flip';
    const hostWidth = Math.round(layout.width * zoom);
    host.style.width = `${hostWidth}px`;
    host.appendChild(bookEl);
    const pageEls: HTMLElement[] = [];
    canvases.current.clear();
    for (let p = 1; p <= n; p++) {
      const el = document.createElement('div');
      el.className = 'book-page is-loading';
      el.setAttribute('aria-hidden', 'true');
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      el.append(canvas);
      bookEl.append(el);
      pageEls.push(el);
      canvases.current.set(p, canvas);
    }
    for (const p of cache.current.keys()) draw(p);

    void import('page-flip').then(({ PageFlip }) => {
      if (disposed) return;
      const coarse = matchMedia('(pointer: coarse)').matches;
      flip = new PageFlip(bookEl, {
        width: 1000,
        height: Math.round(1000 * aspect),
        size: 'stretch',
        // In 'stretch' mode the widget turns to single pages only when its block is narrower
        // than 2 × minWidth, so in portrait minWidth is the whole host width.
        minWidth: layout.portrait ? hostWidth : 100,
        maxWidth: 4000,
        minHeight: 100,
        maxHeight: 6000,
        autoSize: true,
        showCover: false,
        usePortrait: layout.portrait,
        startPage: Math.min(indexRef.current, n - 1),
        drawShadow: true,
        maxShadowOpacity: 0.3,
        flippingTime: 550,
        mobileScrollSupport: false,
        showPageCorners: !coarse,
        swipeDistance: 30,
        // Zoomed in, a drag means "pan", not "turn the page".
        useMouseEvents: zoom === 1,
      });
      flip.loadFromHTML(pageEls);
      flip.on('flip', (e) => {
        indexRef.current = e.data;
        setIndex(e.data);
      });
      flipRef.current = flip;
      indexRef.current = flip.getCurrentPageIndex();
      setIndex(indexRef.current);
      setReady(true);
    });
    return () => {
      disposed = true;
      setReady(false);
      flipRef.current = null;
      try {
        flip?.destroy();
      } catch {
        // the widget may already have removed its nodes
      }
      host.replaceChildren();
    };
  }, [layout, zoom, n, aspect, draw]);

  // ---- Lazy loading: the current view ±2 pages, through fresh signed URLs ----
  useEffect(() => {
    if (!ready || !layout) return;
    const portrait = layout.portrait;
    const pageCss = (layout.width * zoom) / (portrait ? 1 : 2);
    const size: BookPageSize = pageCss * (window.devicePixelRatio || 1) > 760 ? 'lg' : 'sm';
    const wanted = pagesToLoad(index, n, portrait);

    // Forget pages far from the view.
    for (const p of [...cache.current.keys()]) {
      if (Math.abs(p - (index + 1)) > KEEP_RADIUS) {
        cache.current.get(p)!.bitmap.close();
        cache.current.delete(p);
        const canvas = canvases.current.get(p);
        if (canvas) {
          canvas.width = 1;
          canvas.height = 1;
          canvas.parentElement?.classList.add('is-loading');
        }
      }
    }
    const missing = wanted.filter((p) => {
      const c = cache.current.get(p);
      return (!c || (size === 'lg' && c.size === 'sm')) && !inflight.current.has(`${p}-${size}`);
    });
    if (missing.length === 0) return;
    const from = missing[0]!;
    const to = missing.at(-1)!;
    for (let p = from; p <= to; p++) inflight.current.add(`${p}-${size}`);
    let cancelled = false;

    void (async () => {
      const res = await api<BookPageUrls>(
        `/books/${book.id}/pages?from=${from}&to=${to}&size=${size}`,
      );
      if (!res.ok) {
        for (let p = from; p <= to; p++) inflight.current.delete(`${p}-${size}`);
        setNotice(res.message);
        return;
      }
      await Promise.all(
        res.data.pages.map(async ({ page, url }) => {
          try {
            const r = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
            if (r.status === 429) {
              setNotice('Betlar juda tez so‘ralmoqda. Bir daqiqadan keyin davom eting.');
              return;
            }
            if (!r.ok) throw new Error(String(r.status));
            const bitmap = await createImageBitmap(await r.blob());
            if (cancelled && Math.abs(page - (indexRef.current + 1)) > KEEP_RADIUS) {
              bitmap.close();
              return;
            }
            cache.current.get(page)?.bitmap.close();
            cache.current.set(page, { size, bitmap });
            draw(page);
          } catch {
            setNotice('Ba’zi betlarni yuklab bo‘lmadi. Sahifani yangilab ko‘ring.');
          } finally {
            inflight.current.delete(`${page}-${size}`);
          }
        }),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, layout, zoom, index, n, book.id, draw]);

  // Free decoded pages when leaving the reader.
  useEffect(() => {
    const c = cache.current;
    return () => {
      for (const v of c.values()) v.bitmap.close();
      c.clear();
    };
  }, []);

  // ---- Remember the page (debounced) ----
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      void send('PUT', `/books/${book.id}/progress`, { page: index + 1 });
    }, 800);
    return () => clearTimeout(t);
  }, [index, ready, book.id]);

  // ---- Keyboard: turning pages, and refusing save/print/source shortcuts ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isBlockedShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, select, dialog')) return;
      const f = flipRef.current;
      if (!f) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') f.flipNext();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') f.flipPrev();
      else if (e.key === 'Home') f.turnToPage(0);
      else if (e.key === 'End') f.turnToPage(n - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [n]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const goTo = (page: number) => {
    const f = flipRef.current;
    if (!f) return;
    const target = Math.min(Math.max(1, page), n) - 1;
    if (Math.abs(target - indexRef.current) <= 2) f.flip(target);
    else f.turnToPage(target);
    indexRef.current = f.getCurrentPageIndex();
    setIndex(indexRef.current);
  };

  const shown = visiblePages(index, n, layout?.portrait ?? true);
  const label = shown.length > 1 ? `${shown[0]}–${shown[1]}` : `${shown[0] ?? 1}`;
  const zi = ZOOMS.indexOf(zoom);

  return (
    <div
      ref={rootRef}
      className="book-reader flex h-full min-h-[24rem] flex-col bg-canvas select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      <header className="flex items-center gap-3 border-b border-line bg-panel px-4 py-2">
        <Link
          href="/kitoblar"
          className="btn btn-ghost min-w-11 px-2"
          aria-label="Darsliklar ro‘yxati"
        >
          <Icon name="arrowLeft" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-semibold sm:text-lg">{book.title}</h1>
          {book.author && <p className="truncate text-sm text-muted">{book.author}</p>}
        </div>
      </header>

      <div
        ref={stageRef}
        className="relative flex-1 overflow-auto"
        role="region"
        aria-roledescription="kitob"
        aria-label={`${book.title}: ${label}-bet, jami ${n}`}
      >
        <div className="flex min-h-full min-w-fit items-center justify-center p-2">
          <div ref={hostRef} className="book-host" />
        </div>
        {!ready && (
          <div className="absolute inset-0 grid place-items-center" role="status">
            <div className="skeleton h-3/4 w-1/2 max-w-md" aria-hidden="true" />
            <span className="sr-only">Kitob ochilmoqda…</span>
          </div>
        )}
      </div>

      {notice && (
        <p
          role="alert"
          className="border-t border-line bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200"
        >
          {notice}{' '}
          <button type="button" className="underline" onClick={() => setNotice(null)}>
            Yopish
          </button>
        </p>
      )}

      <footer className="flex flex-wrap items-center justify-center gap-2 border-t border-line bg-panel px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <ToolButton
          icon="chevronLeft"
          label="Oldingi bet"
          onClick={() => flipRef.current?.flipPrev()}
          disabled={!ready || index === 0}
        />
        <p className="min-w-20 text-center text-sm tabular-nums" aria-live="polite">
          {label} / {n}
        </p>
        <ToolButton
          icon="chevronRight"
          label="Keyingi bet"
          onClick={() => flipRef.current?.flipNext()}
          disabled={!ready || shown.at(-1)! >= n}
        />
        <GoToPage pageCount={n} onGo={goTo} disabled={!ready} />
        {book.toc.length > 0 && (
          <ToolButton
            icon="list"
            label="Mundarija"
            onClick={() => setTocOpen(true)}
            disabled={!ready}
          />
        )}
        <span className="flex items-center gap-1">
          <ToolButton
            icon="zoomOut"
            label="Kichiklashtirish"
            onClick={() => setZoom(ZOOMS[zi - 1]!)}
            disabled={zi <= 0}
          />
          <span className="w-12 text-center text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
          <ToolButton
            icon="zoomIn"
            label="Kattalashtirish"
            onClick={() => setZoom(ZOOMS[zi + 1]!)}
            disabled={zi >= ZOOMS.length - 1}
          />
        </span>
        <ToolButton
          icon={fullscreen ? 'minimize' : 'maximize'}
          label={fullscreen ? 'To‘liq ekrandan chiqish' : 'To‘liq ekran'}
          onClick={() =>
            fullscreen ? document.exitFullscreen() : rootRef.current?.requestFullscreen?.()
          }
        />
      </footer>

      <Dialog open={tocOpen} onClose={() => setTocOpen(false)} title="Mundarija">
        <ol className="space-y-1">
          {book.toc.map((t, i) => (
            <li key={i} style={{ paddingLeft: `${(t.level - 1) * 1}rem` }}>
              <button
                type="button"
                data-autofocus={i === 0 ? true : undefined}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-control px-3 text-left hover:bg-subtle"
                onClick={() => {
                  setTocOpen(false);
                  goTo(t.page);
                }}
              >
                <span>{t.title}</span>
                <span className="text-sm text-muted tabular-nums">{t.page}</span>
              </button>
            </li>
          ))}
        </ol>
      </Dialog>
    </div>
  );
}

function ToolButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="btn btn-ghost min-w-11 px-2"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon name={icon} />
    </button>
  );
}

function GoToPage({
  pageCount,
  onGo,
  disabled,
}: {
  pageCount: number;
  onGo: (page: number) => void;
  disabled: boolean;
}) {
  const id = useId();
  const [value, setValue] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const p = Number(value);
    if (Number.isInteger(p) && p >= 1 && p <= pageCount) {
      onGo(p);
      setValue('');
    }
  };
  return (
    <form onSubmit={submit} className="flex items-center gap-1">
      <label htmlFor={id} className="sr-only">
        Betga o‘tish (1–{pageCount})
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={pageCount}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Bet"
        className="field h-11 w-20"
        disabled={disabled}
      />
      <button type="submit" className="btn btn-outline min-w-11 px-3" disabled={disabled}>
        O‘tish
      </button>
    </form>
  );
}
