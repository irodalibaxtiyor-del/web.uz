import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import type { BookPageSize } from '@webdizayn/shared';

/** Where a book's files live. `bookId` is always a validated UUID (no path tricks). */
export function bookPaths(root: string, bookId: string) {
  const dir = join(resolve(root), bookId);
  return {
    dir,
    original: join(dir, 'original.pdf'),
    coverUpload: join(dir, 'cover-upload'),
    pages: join(dir, 'pages'),
    page: (n: number, size: BookPageSize) => join(dir, 'pages', `${n}-${size}.webp`),
    cover: join(dir, 'cover.webp'),
  };
}

// ---- Upload sniffing (the declared MIME type and extension are checked too) ----

export const isPdf = (b: Buffer) => b.subarray(0, 5).toString('latin1') === '%PDF-';

export function imageKind(b: Buffer): 'png' | 'jpeg' | 'webp' | null {
  if (b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return 'png';
  }
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (
    b.length >= 12 &&
    b.subarray(0, 4).toString('latin1') === 'RIFF' &&
    b.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return 'webp';
  }
  return null;
}

// ---- Signed page URLs ----

/**
 * HMAC over everything the URL grants: reader, session, book, page, size and expiry. A URL
 * copied to another browser or account fails (the page endpoint also requires that session).
 */
export class PageSigner {
  private readonly key: Buffer;

  constructor(secret: string | undefined) {
    this.key = secret ? Buffer.from(secret, 'utf8') : randomBytes(32);
  }

  sign(p: SignedPage): string {
    return createHmac('sha256', this.key).update(payload(p)).digest('base64url');
  }

  verify(p: SignedPage, sig: string, now = Date.now()): boolean {
    if (!Number.isInteger(p.exp) || p.exp * 1000 < now) return false;
    const expected = Buffer.from(this.sign(p));
    const given = Buffer.from(sig);
    return given.length === expected.length && timingSafeEqual(given, expected);
  }
}

export interface SignedPage {
  userId: string;
  sessionId: string;
  bookId: string;
  page: number;
  size: BookPageSize;
  /** Unix seconds. */
  exp: number;
}

const payload = (p: SignedPage) =>
  [p.userId, p.sessionId, p.bookId, p.page, p.size, p.exp].join(':');

// ---- Watermark ----

const FONT = 'WD Watermark';
let fontReady = false;

/** A bundled font (Liberation Sans from pdf.js), so containers without system fonts still draw text. */
function ensureFont() {
  if (fontReady) return;
  const root = dirname(require.resolve('pdfjs-dist/package.json'));
  GlobalFonts.registerFromPath(join(root, 'standard_fonts', 'LiberationSans-Regular.ttf'), FONT);
  fontReady = true;
}

/**
 * Stamps the reader's name/ID and the time into the page image: faint diagonal text over the
 * whole page plus a readable line at the bottom. Done per request, so every copy of a page
 * carries who fetched it.
 */
export async function watermark(image: Buffer, text: string): Promise<Buffer> {
  ensureFont();
  const img = await loadImage(image);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const size = Math.max(12, Math.round(img.width / 42));
  ctx.font = `${size}px "${FONT}"`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.09)';
  const step = Math.max(ctx.measureText(text).width + size * 4, img.width / 2);
  ctx.save();
  ctx.translate(img.width / 2, img.height / 2);
  ctx.rotate(-Math.PI / 6);
  const span = Math.hypot(img.width, img.height);
  for (let y = -span / 2; y < span / 2; y += size * 7) {
    const shift = (Math.round(y / (size * 7)) % 2) * (step / 2);
    for (let x = -span / 2 - step + shift; x < span / 2; x += step) ctx.fillText(text, x, y);
  }
  ctx.restore();

  const band = Math.round(size * 1.8);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fillRect(0, img.height - band, img.width, band);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
  ctx.font = `${Math.round(size * 0.8)}px "${FONT}"`;
  ctx.fillText(text, size, img.height - band / 2);
  return canvas.encode('webp', 80);
}
