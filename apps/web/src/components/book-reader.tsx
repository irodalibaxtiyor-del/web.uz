'use client';

import type {
  BookDetail,
  BookPageSize,
  BookPageUrls,
  BookRect,
  BookSearchResponse,
} from '@webdizayn/shared';
import Link from 'next/link';
import type { PageFlip } from 'page-flip';
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { api, send } from '@/lib/api';
import { isBlockedShortcut, pagesToLoad, visiblePages } from '@/lib/books';
import { Dialog } from './dialog';
import { Icon, type IconName } from './icons';

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3] as const;
type Zoom = (typeof ZOOMS)[number];
/** Below this stage width "auto" shows one page at a time. */
const SPREAD_MIN_WIDTH = 768;
/** Decoded pages kept around the current view (memory stays bounded on long books). */
const KEEP_RADIUS = 6;

type Layout = { portrait: boolean; width: number };
type Cached = { size: BookPageSize; bitmap: ImageBitmap };

/** Reader preferences, kept in this browser (localStorage) for every book. */
type View = 'auto' | 'single' | 'double';
type Fit = 'page' | 'width';
type Tone = 'light' | 'sepia' | 'dark';
type Prefs = { view: View; fit: Fit; tone: Tone; zoom: Zoom };
const DEFAULT_PREFS: Prefs = { view: 'auto', fit: 'page', tone: 'light', zoom: 1 };
const PREFS_KEY = 'wd-book-reader';

function loadPrefs(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}') as Partial<Prefs>;
    return {
      view: (['auto', 'single', 'double'] as const).find((v) => v === raw.view) ?? 'auto',
      fit: (['page', 'width'] as const).find((v) => v === raw.fit) ?? 'page',
      tone: (['light', 'sepia', 'dark'] as const).find((v) => v === raw.tone) ?? 'light',
      zoom: ZOOMS.find((z) => z === raw.zoom) ?? 1,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

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
  const overlays = useRef(new Map<number, HTMLDivElement>());
  const highlightsRef = useRef(new Map<number, BookRect[]>());
  const cache = useRef(new Map<number, Cached>());
  const inflight = useRef(new Set<string>());
  const startIndex = Math.max(0, (book.progress?.page ?? 1) - 1);
  const indexRef = useRef(startIndex);

  const [layout, setLayout] = useState<Layout | null>(null);
  // The reader only renders in the browser (the book is fetched client-side), so the saved
  // preferences can be read for the first render.
  const [prefs, setPrefsState] = useState<Prefs>(() =>
    typeof window === 'undefined' ? DEFAULT_PREFS : loadPrefs(),
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { zoom, view, fit, tone } = prefs;
  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefsState((p) => {
      const next = { ...p, ...patch };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {
        // storage may be unavailable (private mode); the choice still applies now
      }
      return next;
    });
  }, []);
  const setZoom = useCallback((z: Zoom) => setPrefs({ zoom: z }), [setPrefs]);
  const zoomRef = useRef<Zoom>(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  const [index, setIndex] = useState(startIndex);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlights, setHighlights] = useState(new Map<number, BookRect[]>());
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
      const portrait =
        view === 'single' || (view === 'auto' && stage.clientWidth < SPREAD_MIN_WIDTH);
      const perRow = portrait ? 1 : 2;
      // "page": the whole page (or spread) fits the screen; "width": it fills the width and
      // the reader scrolls down — larger text on wide screens.
      const width = Math.max(
        200,
        Math.floor(fit === 'width' ? w : Math.min(w, (h / aspect) * perRow)),
      );
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
  }, [aspect, view, fit]);

  const draw = useCallback(
    (page: number) => {
      const canvas = canvases.current.get(page);
      const c = cache.current.get(page);
      if (!canvas || !c) return;
      canvas.width = c.bitmap.width;
      canvas.height = c.bitmap.height;
      canvas.getContext('2d')?.drawImage(c.bitmap, 0, 0);
      canvas.parentElement?.classList.remove('is-loading');
      // The image keeps its own proportions inside the page box (object-fit: contain), so a
      // page of another size (a landscape cover) is letterboxed, never stretched. The search
      // highlight layer follows the image's box.
      const layer = overlays.current.get(page);
      if (layer) {
        const own = c.bitmap.height / Math.max(1, c.bitmap.width);
        const box = { left: 0, top: 0, width: 1, height: 1 };
        if (own > aspect) {
          box.width = aspect / own;
          box.left = (1 - box.width) / 2;
        } else {
          box.height = own / aspect;
          box.top = (1 - box.height) / 2;
        }
        layer.style.left = `${box.left * 100}%`;
        layer.style.top = `${box.top * 100}%`;
        layer.style.width = `${box.width * 100}%`;
        layer.style.height = `${box.height * 100}%`;
      }
    },
    [aspect],
  );

  /** Draws the search matches over every page that has some (boxes in page fractions). */
  const paint = useCallback(() => {
    for (const [page, layer] of overlays.current) {
      layer.replaceChildren();
      for (const [x, y, w, h] of highlightsRef.current.get(page) ?? []) {
        const mark = document.createElement('span');
        // A little slack: glyph widths are estimated from the item width.
        mark.style.left = `${(x - 0.003) * 100}%`;
        mark.style.top = `${y * 100}%`;
        mark.style.width = `${(w + 0.006) * 100}%`;
        mark.style.height = `${h * 100}%`;
        layer.append(mark);
      }
    }
  }, []);

  useEffect(() => {
    highlightsRef.current = highlights;
    paint();
  }, [highlights, paint]);

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
    overlays.current.clear();
    for (let p = 1; p <= n; p++) {
      const el = document.createElement('div');
      el.className = 'book-page is-loading';
      el.setAttribute('aria-hidden', 'true');
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const layer = document.createElement('div');
      layer.className = 'book-hl';
      el.append(canvas, layer);
      bookEl.append(el);
      pageEls.push(el);
      canvases.current.set(p, canvas);
      overlays.current.set(p, layer);
    }
    for (const p of cache.current.keys()) draw(p);
    paint();

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
  }, [layout, zoom, n, aspect, draw, paint]);

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
      // Ctrl/Cmd+F opens the in-book search (the page images have no text for the browser's).
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === 'f' &&
        book.searchable
      ) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (isBlockedShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, select, dialog')) return;
      const f = flipRef.current;
      if (!f) return;
      if (!e.ctrlKey && !e.metaKey && !e.altKey && ['+', '=', '-', '0'].includes(e.key)) {
        const i = ZOOMS.indexOf(zoomRef.current);
        if (e.key === '0') setZoom(1);
        else if (e.key === '-') setZoom(ZOOMS[Math.max(0, i - 1)]!);
        else setZoom(ZOOMS[Math.min(ZOOMS.length - 1, i + 1)]!);
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') f.flipNext();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') f.flipPrev();
      else if (e.key === 'Home') f.turnToPage(0);
      else if (e.key === 'End') f.turnToPage(n - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [n, book.searchable, setZoom]);

  // Ctrl + mouse wheel (or a trackpad pinch) zooms the book, not the whole site.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const i = ZOOMS.indexOf(zoomRef.current);
      const next = ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, i + (e.deltaY < 0 ? 1 : -1)))]!;
      if (next !== zoomRef.current) setZoom(next);
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [setZoom]);

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
      data-tone={tone}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      <header className="flex items-center gap-3 border-b border-line bg-panel px-4 py-2">
        <Link
          href={book.collection === 'AUTHOR' ? `/muallif-kitoblari/${book.id}` : '/kitoblar'}
          className="btn btn-ghost min-w-11 px-2"
          aria-label={
            book.collection === 'AUTHOR' ? 'Kitob sahifasiga qaytish' : 'Darsliklar ro‘yxati'
          }
        >
          <Icon name="arrowLeft" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-semibold sm:text-lg">{book.title}</h1>
          {book.author && <p className="truncate text-sm text-muted">{book.author}</p>}
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <div
          ref={stageRef}
          className="relative min-w-0 flex-1 overflow-auto"
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
        {searchOpen && (
          <SearchPanel
            bookId={book.id}
            current={index + 1}
            onGo={goTo}
            onHighlights={setHighlights}
            onClose={() => setSearchOpen(false)}
          />
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
        {book.searchable && (
          <ToolButton
            icon="search"
            label="Kitob ichidan qidirish"
            onClick={() => setSearchOpen((o) => !o)}
            disabled={!ready}
          />
        )}
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
          icon="settings"
          label="Ko‘rinish sozlamalari"
          onClick={() => setSettingsOpen(true)}
        />
        <ToolButton
          icon={fullscreen ? 'minimize' : 'maximize'}
          label={fullscreen ? 'To‘liq ekrandan chiqish' : 'To‘liq ekran'}
          onClick={() =>
            fullscreen ? document.exitFullscreen() : rootRef.current?.requestFullscreen?.()
          }
        />
      </footer>

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Ko‘rinish sozlamalari"
        description="Tanlovingiz shu brauzerda eslab qolinadi."
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setPrefs(DEFAULT_PREFS)}>
              Asl holiga qaytarish
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setSettingsOpen(false)}
            >
              Tayyor
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <Choice
            legend="Betlar"
            value={view}
            onChange={(v) => setPrefs({ view: v })}
            options={[
              { value: 'auto', label: 'Avtomatik', hint: 'Keng ekranda ikki bet, telefonda bitta' },
              { value: 'single', label: 'Bitta bet' },
              { value: 'double', label: 'Ikki bet (yoyilgan kitob)' },
            ]}
          />
          <Choice
            legend="Joylashuv"
            value={fit}
            onChange={(v) => setPrefs({ fit: v })}
            options={[
              { value: 'page', label: 'Bet ekranga to‘liq sig‘sin' },
              {
                value: 'width',
                label: 'Kenglik bo‘yicha',
                hint: 'Yozuvlar kattaroq, pastga aylantirib o‘qiladi',
              },
            ]}
          />
          <Choice
            legend="O‘qish rangi"
            value={tone}
            onChange={(v) => setPrefs({ tone: v })}
            options={[
              { value: 'light', label: 'Oq' },
              { value: 'sepia', label: 'Sepiya', hint: 'Ko‘zga yumshoqroq' },
              { value: 'dark', label: 'Tungi', hint: 'Qorong‘ida o‘qish uchun' },
            ]}
          />
          <div>
            <p className="mb-2 font-semibold">Kattalik: {Math.round(zoom * 100)}%</p>
            <div className="flex flex-wrap gap-2">
              {ZOOMS.map((z) => (
                <button
                  key={z}
                  type="button"
                  aria-pressed={z === zoom}
                  className={`btn min-w-14 px-2 ${z === zoom ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setZoom(z)}
                >
                  {Math.round(z * 100)}%
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted">
              Klaviaturada “+” va “−”, “0” — 100%. Ctrl + sichqoncha g‘ildiragi ham ishlaydi.
            </p>
          </div>
        </div>
      </Dialog>

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

function Choice<T extends string>({
  legend,
  value,
  onChange,
  options,
}: {
  legend: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; hint?: string }[];
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-start gap-2 rounded-xl border border-line p-3 has-checked:border-brand-500 has-checked:bg-brand-50 dark:has-checked:bg-brand-950"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-medium">{o.label}</span>
              {o.hint && <span className="block text-xs text-muted">{o.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
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

/**
 * Search inside the book: results list (page + snippet), next/previous match, and the matches
 * highlighted on the pages. Only snippets come from the server, never whole pages of text.
 */
function SearchPanel({
  bookId,
  current,
  onGo,
  onHighlights,
  onClose,
}: {
  bookId: string;
  current: number;
  onGo: (page: number) => void;
  onHighlights: (h: Map<number, BookRect[]>) => void;
  onClose: () => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [res, setRes] = useState<BookSearchResponse | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function run(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (query.length < 2) return setError('Kamida 2 ta harf yozing');
    setPending(true);
    setError(null);
    const r = await api<BookSearchResponse>(
      `/books/${bookId}/search?q=${encodeURIComponent(query)}`,
    );
    setPending(false);
    if (!r.ok) {
      setRes(null);
      onHighlights(new Map());
      return setError(
        r.status === 429 ? 'Juda tez qidirilmoqda. Bir daqiqadan keyin urinib ko‘ring.' : r.message,
      );
    }
    setRes(r.data);
    onHighlights(new Map(r.data.hits.map((h) => [h.page, h.rects])));
    // Jump to the first match at or after the current page.
    const next = r.data.hits.findIndex((h) => h.page >= current);
    const first = next >= 0 ? next : 0;
    setActive(r.data.hits.length ? first : -1);
    if (r.data.hits[first]) onGo(r.data.hits[first].page);
  }

  function open(i: number) {
    const hit = res?.hits[i];
    if (!hit) return;
    setActive(i);
    onGo(hit.page);
    // On a phone the panel covers the book: close it, the match stays highlighted.
    if (window.innerWidth < 640) onClose();
  }

  function clear() {
    setQ('');
    setRes(null);
    setActive(-1);
    onHighlights(new Map());
    inputRef.current?.focus();
  }

  const hits = res?.hits ?? [];
  return (
    <aside
      aria-label="Kitob ichidan qidirish"
      className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col border-l border-line bg-panel shadow-overlay"
    >
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2">
        <h2 className="font-semibold">Kitob ichidan qidirish</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Qidiruvni yopish"
          className="btn btn-ghost min-w-11 px-2"
        >
          <Icon name="x" />
        </button>
      </div>
      <form onSubmit={run} className="flex gap-2 border-b border-line p-3" role="search">
        <label htmlFor={id} className="sr-only">
          Qidiriladigan so‘z
        </label>
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={q}
          maxLength={100}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Masalan: flexbox"
          className="field h-11 min-w-0 flex-1"
        />
        <button type="submit" className="btn btn-primary min-w-11 px-3" disabled={pending}>
          <Icon name="search" className="size-4" />
          <span className="sr-only sm:not-sr-only">Topish</span>
        </button>
      </form>
      <div className="flex items-center justify-between gap-2 px-4 py-2 text-sm" aria-live="polite">
        <span className="text-muted">
          {pending
            ? 'Qidirilmoqda…'
            : res
              ? hits.length
                ? `${res.pages} ta betda topildi${res.truncated ? ` (birinchi ${hits.length} tasi)` : ''}`
                : 'Hech narsa topilmadi'
              : 'So‘z yoki ibora yozing (lotin yoki kirill)'}
        </span>
        {hits.length > 0 && (
          <span className="flex items-center gap-1">
            <button
              type="button"
              className="btn btn-ghost min-w-11 px-2"
              aria-label="Oldingi natija"
              onClick={() => open((active - 1 + hits.length) % hits.length)}
            >
              <Icon name="chevronUp" />
            </button>
            <button
              type="button"
              className="btn btn-ghost min-w-11 px-2"
              aria-label="Keyingi natija"
              onClick={() => open((active + 1) % hits.length)}
            >
              <Icon name="chevronDown" />
            </button>
            <button type="button" className="btn btn-ghost px-2 text-sm" onClick={clear}>
              Tozalash
            </button>
          </span>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="mx-4 rounded-control bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </p>
      )}
      <ol className="flex-1 space-y-1 overflow-y-auto p-2">
        {hits.map((h, i) => (
          <li key={h.page}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-current={i === active || undefined}
              className={`w-full rounded-control px-3 py-2 text-left text-sm hover:bg-subtle ${
                i === active ? 'bg-brand-50 ring-2 ring-brand-500 dark:bg-brand-950' : ''
              }`}
            >
              <span className="mb-1 flex items-center justify-between font-semibold">
                <span>{h.page}-bet</span>
                {h.count > 1 && <span className="text-xs text-muted">{h.count} marta</span>}
              </span>
              <span className="block text-muted">
                {h.before}
                <mark className="rounded bg-accent-300 px-0.5 text-ink">{h.match}</mark>
                {h.after}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}
