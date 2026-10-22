import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { workerEnv } from '@webdizayn/check-engine';
import { and, eq } from 'drizzle-orm';
import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { APP_CONFIG, type AppConfig } from '../config';
import { DbService } from '../db/db.module';
import { books } from '../db/schema';
import { bookPaths } from './book-files';
import type { RasterizeResult } from './rasterize';

const ERROR_TEXT: Record<string, string> = {
  NOT_PDF: 'PDF faylni o‘qib bo‘lmadi (buzilgan yoki PDF emas)',
  ENCRYPTED: 'PDF parol bilan himoyalangan — parolsiz nusxasini yuklang',
  TOO_MANY_PAGES: 'Betlar soni ruxsat etilganidan ko‘p',
  RENDER: 'Betlarni rasmga aylantirib bo‘lmadi',
  TIMEOUT: 'Qayta ishlash juda uzoq davom etdi',
};

type WorkerReply =
  { ok: true; result: RasterizeResult & { customCover: boolean } } | { ok: false; code: string };

/** The compiled worker next to this file, or the TS source through swc (tests, `pnpm dev`). */
function workerArgs(): string[] {
  return __filename.endsWith('.ts')
    ? ['-r', '@swc-node/register', join(__dirname, 'rasterize-main.ts')]
    : [join(__dirname, 'rasterize-main.js')];
}

/**
 * Renders uploaded PDFs one at a time in a separate Node process: no database URL or secrets
 * in its environment, a heap limit, a hard kill timer and capped output. Books left
 * PROCESSING by a restart are picked up again on start (single API instance, like CHECK).
 */
@Injectable()
export class BookProcessor implements OnModuleInit {
  private readonly log = new Logger('BookProcessor');
  private queue: string[] = [];
  private running: Promise<void> | null = null;

  constructor(
    private readonly dbs: DbService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  async onModuleInit() {
    const pending = await this.dbs.db
      .select({ id: books.id })
      .from(books)
      .where(eq(books.status, 'PROCESSING'));
    for (const b of pending) this.enqueue(b.id);
  }

  enqueue(bookId: string) {
    this.queue.push(bookId);
    this.running ??= this.drain().finally(() => (this.running = null));
  }

  /** Resolves when the queue is empty (tests, graceful shutdown). */
  async idle() {
    while (this.running) await this.running;
  }

  private async drain() {
    for (let id = this.queue.shift(); id; id = this.queue.shift()) {
      try {
        await this.process(id);
      } catch (e) {
        this.log.error(`book processing failed: ${(e as Error).name}`);
        await this.fail(id, 'RENDER');
      }
    }
  }

  private async process(bookId: string) {
    const paths = bookPaths(this.config.BOOKS_DIR, bookId);
    await rm(paths.pages, { recursive: true, force: true });
    const [row] = await this.dbs.db
      .select({ hasCover: books.hasCover })
      .from(books)
      .where(eq(books.id, bookId));
    if (!row) return; // deleted meanwhile

    const reply = await this.run({
      pdfPath: paths.original,
      outDir: paths.pages,
      maxPages: this.config.BOOK_MAX_PAGES,
      coverUpload: row.hasCover ? paths.coverUpload : null,
      coverOut: paths.cover,
    });
    if (!reply.ok) return this.fail(bookId, reply.code);
    const r = reply.result;
    const updated = await this.dbs.db
      .update(books)
      .set({
        status: 'READY',
        error: null,
        pageCount: r.pageCount,
        pageWidth: Math.round(r.width),
        pageHeight: Math.round(r.height),
        toc: r.toc.filter((t) => t.page >= 1 && t.page <= r.pageCount),
        hasCover: r.customCover,
        updatedAt: new Date(),
      })
      .where(and(eq(books.id, bookId), eq(books.status, 'PROCESSING')))
      .returning({ id: books.id });
    await rm(paths.coverUpload, { force: true });
    if (updated.length === 0) await rm(paths.dir, { recursive: true, force: true });
  }

  private async fail(bookId: string, code: string) {
    await this.dbs.db
      .update(books)
      .set({
        status: 'FAILED',
        error: ERROR_TEXT[code] ?? ERROR_TEXT.RENDER!,
        updatedAt: new Date(),
      })
      .where(eq(books.id, bookId));
    await rm(bookPaths(this.config.BOOKS_DIR, bookId).pages, { recursive: true, force: true });
  }

  private run(input: object): Promise<WorkerReply> {
    return new Promise((resolve) => {
      const child = spawn(process.execPath, ['--max-old-space-size=768', ...workerArgs()], {
        env: workerEnv(),
        stdio: ['pipe', 'pipe', 'ignore'],
        windowsHide: true,
      });
      let out = '';
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, this.config.BOOK_PROCESS_TIMEOUT_MS);
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (d: string) => {
        out += d;
        if (out.length > 512 * 1024) child.kill('SIGKILL');
      });
      child.on('error', () => {
        clearTimeout(timer);
        resolve({ ok: false, code: 'RENDER' });
      });
      child.on('close', () => {
        clearTimeout(timer);
        if (timedOut) return resolve({ ok: false, code: 'TIMEOUT' });
        resolve(parseReply(out));
      });
      child.stdin.on('error', () => {});
      child.stdin.end(JSON.stringify(input));
    });
  }
}

/** Accepts only a well-formed reply; anything else counts as a render failure. */
export function parseReply(raw: string): WorkerReply {
  try {
    const r = JSON.parse(raw) as WorkerReply;
    if (r.ok === false) return { ok: false, code: String(r.code) };
    const x = r.result;
    if (
      r.ok === true &&
      Number.isInteger(x.pageCount) &&
      x.pageCount > 0 &&
      x.width > 0 &&
      x.height > 0 &&
      Array.isArray(x.toc)
    ) {
      const toc = x.toc
        .filter((t) => typeof t.title === 'string' && Number.isInteger(t.page))
        .slice(0, 300)
        .map((t) => ({
          title: t.title.slice(0, 200),
          page: t.page,
          level: Math.min(3, Math.max(1, Number(t.level) || 1)),
        }));
      return { ok: true, result: { ...x, toc, customCover: x.customCover === true } };
    }
  } catch {
    // fall through
  }
  return { ok: false, code: 'RENDER' };
}
