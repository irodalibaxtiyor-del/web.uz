import { createCanvas, loadImage } from '@napi-rs/canvas';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, sep } from 'node:path';

/** Rendered widths: large for desktop/zoom, small for phones, thumbnails and the cover. */
export const PAGE_WIDTH = { lg: 1400, sm: 700 } as const;
const MAX_HEIGHT = 2400;
const WEBP_QUALITY = 80;

export interface TocEntry {
  title: string;
  page: number;
  level: number;
}

export interface RasterizeResult {
  pageCount: number;
  /** Aspect of the first page (points). */
  width: number;
  height: number;
  toc: TocEntry[];
}

export class RasterizeError extends Error {
  constructor(
    readonly code: 'NOT_PDF' | 'ENCRYPTED' | 'TOO_MANY_PAGES' | 'RENDER',
    message: string,
  ) {
    super(message);
  }
}

/** pdf.js wants a directory with a trailing "/" (it reads the files with fs in Node). */
const dirUrl = (root: string, name: string) => `${join(root, name).split(sep).join('/')}/`;

type PdfJs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');

// pdf.js is ESM-only; Node 22+ can require() it from this CommonJS build.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const loadPdfJs = (): PdfJs => require('pdfjs-dist/legacy/build/pdf.mjs') as PdfJs;

/**
 * Renders every page of `pdfPath` to `<outDir>/<n>-lg.webp` and `<n>-sm.webp` (1-based) and
 * reads the outline. Runs inside the isolated child process (`rasterize-main`), never in the
 * API process: a hostile PDF can only crash or stall that process.
 *
 * pdf.js runs with scripting and XFA off (v6 has no eval path); it never fetches anything (fonts come from the
 * bundled standard fonts on disk).
 */
export async function rasterize(
  pdfPath: string,
  outDir: string,
  maxPages: number,
): Promise<RasterizeResult> {
  const pdfjs = loadPdfJs();
  const root = dirname(require.resolve('pdfjs-dist/package.json'));
  const data = new Uint8Array(await readFile(pdfPath));
  let doc: Awaited<ReturnType<PdfJs['getDocument']>['promise']>;
  let task: ReturnType<PdfJs['getDocument']>;
  try {
    task = pdfjs.getDocument({
      data,
      enableXfa: false,
      useSystemFonts: false,
      disableFontFace: true,
      standardFontDataUrl: dirUrl(root, 'standard_fonts'),
      cMapUrl: dirUrl(root, 'cmaps'),
      cMapPacked: true,
      verbosity: 0,
    });
    doc = await task.promise;
  } catch (e) {
    const name = (e as { name?: string }).name;
    if (name === 'PasswordException') {
      throw new RasterizeError('ENCRYPTED', 'PDF parol bilan himoyalangan');
    }
    throw new RasterizeError('NOT_PDF', 'PDF faylni o‘qib bo‘lmadi');
  }
  if (doc.numPages > maxPages) {
    throw new RasterizeError('TOO_MANY_PAGES', `PDF ${maxPages} betdan oshmasin`);
  }
  await mkdir(outDir, { recursive: true });

  let first = { width: 0, height: 0 };
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const base = page.getViewport({ scale: 1 });
    if (n === 1) first = { width: base.width, height: base.height };
    const scale = Math.min(PAGE_WIDTH.lg / base.width, MAX_HEIGHT / base.height);
    const viewport = page.getViewport({ scale });
    const w = Math.max(1, Math.round(viewport.width));
    const h = Math.max(1, Math.round(viewport.height));
    const lg = createCanvas(w, h);
    const ctx = lg.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    try {
      await page.render({
        canvas: lg as unknown as HTMLCanvasElement,
        canvasContext: ctx as unknown as CanvasRenderingContext2D,
        viewport,
      }).promise;
    } catch {
      throw new RasterizeError('RENDER', `${n}-betni chizib bo‘lmadi`);
    }
    const smW = Math.round((w * PAGE_WIDTH.sm) / PAGE_WIDTH.lg);
    const smH = Math.round((h * PAGE_WIDTH.sm) / PAGE_WIDTH.lg);
    const sm = createCanvas(Math.max(1, smW), Math.max(1, smH));
    sm.getContext('2d').drawImage(lg, 0, 0, sm.width, sm.height);
    await writeFile(join(outDir, `${n}-lg.webp`), await lg.encode('webp', WEBP_QUALITY));
    await writeFile(join(outDir, `${n}-sm.webp`), await sm.encode('webp', WEBP_QUALITY));
    page.cleanup();
  }

  const toc = await readOutline(doc);
  await task.destroy();
  return { pageCount: doc.numPages, ...first, toc };
}

type Doc = Awaited<ReturnType<PdfJs['getDocument']>['promise']>;
type OutlineNode = Awaited<ReturnType<Doc['getOutline']>>[number];

/** Flattened outline (3 levels, 300 entries); entries without a resolvable page are skipped. */
async function readOutline(doc: Doc): Promise<TocEntry[]> {
  const out: TocEntry[] = [];
  let outline: OutlineNode[] | null = null;
  try {
    outline = await doc.getOutline();
  } catch {
    return out;
  }
  const walk = async (items: OutlineNode[], level: number) => {
    for (const item of items) {
      if (out.length >= 300) return;
      const page = await destPage(doc, item.dest);
      const title = String(item.title ?? '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 200);
      if (page && title) out.push({ title, page, level });
      if (level < 3 && item.items?.length) await walk(item.items, level + 1);
    }
  };
  if (outline) await walk(outline, 1);
  return out;
}

async function destPage(doc: Doc, dest: OutlineNode['dest']): Promise<number | null> {
  try {
    const explicit = typeof dest === 'string' ? await doc.getDestination(dest) : dest;
    const ref = explicit?.[0];
    if (ref == null) return null;
    if (typeof ref === 'number') return ref + 1;
    return (await doc.getPageIndex(ref as Parameters<Doc['getPageIndex']>[0])) + 1;
  } catch {
    return null;
  }
}

const COVER_WIDTH = 600;

/**
 * Cover image: the uploaded picture re-encoded (EXIF and anything else dropped, at most 600px
 * wide), or the first page when there is none or it cannot be decoded.
 */
export async function makeCover(
  upload: string | null,
  firstPage: string,
  out: string,
): Promise<boolean> {
  if (upload) {
    try {
      const img = await loadImage(await readFile(upload));
      const scale = Math.min(1, COVER_WIDTH / img.width);
      const canvas = createCanvas(
        Math.max(1, Math.round(img.width * scale)),
        Math.max(1, Math.round(img.height * scale)),
      );
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      await writeFile(out, await canvas.encode('webp', WEBP_QUALITY));
      return true;
    } catch {
      // fall through to the first page
    }
  }
  await copyFile(firstPage, out);
  return false;
}
