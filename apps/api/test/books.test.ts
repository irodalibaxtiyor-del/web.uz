import { createCanvas, loadImage } from '@napi-rs/canvas';
import { eq } from 'drizzle-orm';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bookPaths } from '../src/books/book-files';
import { BookProcessor } from '../src/books/book-processor';
import { makePdf } from '../src/books/make-pdf';
import { auditEvents, courses, organizations } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let dir: string;
let platform: string;
let otherOrg: string;
let admin: Member;
let teacher: Member;
let student: Member;
let student2: Member;
let outsider: Member; // only in another organization
let otherAdmin: Member;
let bookId: string;

const PDF = makePdf({
  pages: ['Birinchi bet', 'Ikkinchi bet', 'Uchinchi bet', 'Tortinchi bet', 'Beshinchi bet'],
  outline: [
    { title: 'Kirish', page: 1 },
    { title: 'Asosiy qism', page: 3 },
  ],
});

const admBase = (org = platform) => `/orgs/${org}/admin/books`;
const get = (who: Member, path: string) => ctx.http().get(path).set('Cookie', who.cookie);
const json = (who: Member, method: 'patch' | 'put', path: string, body: object) =>
  ctx.http()[method](path).set('Cookie', who.cookie).send(body);
const binary = {
  buffer: true,
  parser: (res: NodeJS.ReadableStream, cb: (e: Error | null, b: Buffer) => void) => {
    const chunks: Buffer[] = [];
    res.on('data', (c: Buffer) => chunks.push(c));
    res.on('end', () => cb(null, Buffer.concat(chunks)));
  },
};

function upload(
  who: Member,
  fields: Record<string, string>,
  file?: { data: Buffer; name: string; type: string },
  cover?: { data: Buffer; name: string; type: string },
  org = platform,
) {
  let r = ctx.http().post(admBase(org)).set('Cookie', who.cookie);
  for (const [k, v] of Object.entries(fields)) r = r.field(k, v);
  if (file) r = r.attach('file', file.data, { filename: file.name, contentType: file.type });
  if (cover) r = r.attach('cover', cover.data, { filename: cover.name, contentType: cover.type });
  return r;
}
const pdfFile = (data = PDF) => ({ data, name: 'darslik.pdf', type: 'application/pdf' });
const idle = () => ctx.app.get(BookProcessor).idle();

async function pageImage(who: Member, id: string, page: number) {
  const urls = (await get(who, `/books/${id}/pages?from=${page}&to=${page}`).expect(200)).body;
  return { url: urls.pages[0].url.replace(/^\/api/, '') as string };
}

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), 'wd-books-'));
  ctx = await setup({ BOOKS_DIR: dir, BOOK_MAX_MB: '1', BOOK_PAGE_RATE_PER_MINUTE: '10' });
  const [org] = await ctx.handle.db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, ctx.config.DEFAULT_ORG_SLUG));
  platform = org!.id;
  otherOrg = await createOrg(ctx, 'boshqa-maktab');
  admin = await createMember(ctx, 'admin@kitob.uz', platform, 'ORG_ADMIN');
  teacher = await createMember(ctx, 'teacher@kitob.uz', platform, 'TEACHER');
  student = await createMember(ctx, 'student@kitob.uz', platform, 'STUDENT');
  student2 = await createMember(ctx, 'student2@kitob.uz', platform, 'STUDENT');
  outsider = await createMember(ctx, 'student@boshqa.uz', otherOrg, 'STUDENT');
  otherAdmin = await createMember(ctx, 'admin@boshqa.uz', otherOrg, 'ORG_ADMIN');
});
afterAll(async () => {
  await ctx.app.close();
  rmSync(dir, { recursive: true, force: true });
});

describe('book upload', () => {
  it('is for organization administrators only', async () => {
    await ctx.http().post(admBase()).field('title', 'Kitob').expect(401);
    await upload(teacher, { title: 'Kitob' }, pdfFile()).expect(403);
    await upload(student, { title: 'Kitob' }, pdfFile()).expect(403);
    await upload(otherAdmin, { title: 'Kitob' }, pdfFile()).expect(404);
    await get(teacher, admBase()).expect(403);
  });

  it('accepts only real PDFs within the size limit', async () => {
    const code = async (r: ReturnType<typeof upload>) => (await r.expect(400)).body.code;
    expect(await code(upload(admin, { title: 'Kitob' }))).toBe('FILE_REQUIRED');
    const fake = Buffer.from('<html>not a pdf</html>');
    expect(await code(upload(admin, { title: 'Kitob' }, pdfFile(fake)))).toBe('NOT_PDF');
    expect(
      await code(
        upload(admin, { title: 'Kitob' }, { data: PDF, name: 'k.exe', type: 'application/pdf' }),
      ),
    ).toBe('NOT_PDF');
    expect(
      await code(
        upload(admin, { title: 'Kitob' }, { data: PDF, name: 'k.pdf', type: 'text/html' }),
      ),
    ).toBe('NOT_PDF');
    const big = Buffer.concat([PDF, Buffer.alloc(1.2 * 1024 * 1024, 32)]);
    expect(await code(upload(admin, { title: 'Kitob' }, pdfFile(big)))).toBe('FILE_TOO_LARGE');
    const badCover = { data: Buffer.from('GIF89a....'), name: 'c.png', type: 'image/png' };
    expect(await code(upload(admin, { title: 'Kitob' }, pdfFile(), badCover))).toBe('BAD_COVER');
    await upload(admin, { title: 'K' }, pdfFile()).expect(400);
    await upload(admin, { title: 'Kitob', year: '1700' }, pdfFile()).expect(400);
  });

  it('refuses a course from another organization', async () => {
    const [c] = await ctx.handle.db
      .insert(courses)
      .values({ organizationId: otherOrg, slug: 'begona', title: 'Begona' })
      .returning({ id: courses.id });
    const res = await upload(admin, { title: 'Kitob', courseId: c!.id }, pdfFile()).expect(400);
    expect(res.body.code).toBe('BAD_COURSE');
  });

  it('renders pages to WebP in two sizes, reads the outline and keeps it hidden', async () => {
    const canvas = createCanvas(300, 400);
    const g = canvas.getContext('2d');
    g.fillStyle = '#0071dc';
    g.fillRect(0, 0, 300, 400);
    const cover = { data: await canvas.encode('png'), name: 'muqova.png', type: 'image/png' };
    const res = await upload(
      admin,
      { title: 'HTML darsligi', author: 'Muallif', year: '2026', description: 'Tavsif' },
      pdfFile(),
      cover,
    ).expect(201);
    expect(res.body).toMatchObject({
      status: 'PROCESSING',
      published: false,
      title: 'HTML darsligi',
    });
    bookId = res.body.id;
    await idle();

    const list = (await get(admin, admBase()).expect(200)).body;
    const book = list.books.find((b: { id: string }) => b.id === bookId);
    expect(book).toMatchObject({ status: 'READY', pageCount: 5, year: 2026, error: null });
    const paths = bookPaths(dir, bookId);
    for (const size of ['sm', 'lg'] as const) {
      const img = await loadImage(readFileSync(paths.page(3, size)));
      expect(img.width).toBe(size === 'lg' ? 1400 : 700);
    }
    expect(existsSync(paths.coverUpload)).toBe(false);
    // The admin list never exposes storage paths.
    expect(JSON.stringify(list)).not.toContain(dir.slice(-10));

    // Not published yet: readers do not see it, the organization's admin can preview it.
    expect((await get(student, '/books').expect(200)).body).toEqual([]);
    await get(student, `/books/${bookId}`).expect(404);
    const preview = (await get(admin, `/books/${bookId}`).expect(200)).body;
    expect(preview.toc).toEqual([
      { title: 'Kirish', page: 1, level: 1 },
      { title: 'Asosiy qism', page: 3, level: 1 },
    ]);
  });

  it('marks a broken PDF as failed and does not let it be published', async () => {
    const broken = Buffer.from('%PDF-1.4\nthis is not really a pdf\n%%EOF');
    const res = await upload(admin, { title: 'Buzilgan' }, pdfFile(broken)).expect(201);
    await idle();
    const book = (await get(admin, admBase()).expect(200)).body.books.find(
      (b: { id: string }) => b.id === res.body.id,
    );
    expect(book.status).toBe('FAILED');
    expect(book.error).toMatch(/PDF/);
    const pub = await json(admin, 'patch', `${admBase()}/${res.body.id}`, { published: true });
    expect(pub.status).toBe(409);
    expect(pub.body.code).toBe('BOOK_NOT_READY');
  });
});

describe('reading', () => {
  it('lists published books for every signed-in user of the platform and other schools', async () => {
    await json(admin, 'patch', `${admBase()}/${bookId}`, { published: true }).expect(200);
    await ctx.http().get('/books').expect(401);
    for (const who of [student, teacher, outsider]) {
      const list = (await get(who, '/books').expect(200)).body;
      expect(list.map((b: { id: string }) => b.id)).toEqual([bookId]);
      expect(list[0]).toMatchObject({ pageCount: 5, progress: null });
    }
    const audit = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.action, 'book.publish'));
    expect(audit).toHaveLength(1);
  });

  it('keeps books of another school inside that school', async () => {
    const res = await upload(
      otherAdmin,
      { title: 'Maktab kitobi' },
      pdfFile(),
      undefined,
      otherOrg,
    ).expect(201);
    await idle();
    await json(otherAdmin, 'patch', `${admBase(otherOrg)}/${res.body.id}`, {
      published: true,
    }).expect(200);
    expect((await get(outsider, '/books').expect(200)).body).toHaveLength(2);
    expect((await get(student, '/books').expect(200)).body).toHaveLength(1);
    await get(student, `/books/${res.body.id}`).expect(404);
    await get(student, `/books/${res.body.id}/pages?from=1&to=1`).expect(404);
    await get(admin, `${admBase()}/${res.body.id}/cover`).expect(404);
  });

  it('serves pages only as watermarked images through signed, short-lived URLs', async () => {
    const detail = (await get(student, `/books/${bookId}`).expect(200)).body;
    expect(detail.watermark).toContain('student');
    expect(detail.watermark).toContain(student.userId.slice(0, 8));
    expect(JSON.stringify(detail)).not.toMatch(/original|\.pdf|pages\//);

    const urls = (await get(student, `/books/${bookId}/pages?from=4&to=9&size=sm`).expect(200))
      .body;
    expect(urls.pages.map((p: { page: number }) => p.page)).toEqual([4, 5]);
    expect(new Date(urls.expiresAt).getTime() - Date.now()).toBeLessThanOrEqual(300_000);
    await get(student, `/books/${bookId}/pages?from=1&to=40`).expect(400);

    const { url } = await pageImage(student, bookId, 2);
    const res = await get(student, url).buffer(true).parse(binary.parser).expect(200);
    expect(res.headers['content-type']).toBe('image/webp');
    expect(res.headers['cache-control']).toBe('no-store, private');
    expect(res.headers['content-disposition']).toBe('inline');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    const body = res.body as Buffer;
    expect(body.subarray(0, 4).toString('latin1')).toBe('RIFF');
    // The stored page is not handed out as is: the watermark changes the image.
    expect(body.equals(readFileSync(bookPaths(dir, bookId).page(2, 'lg')))).toBe(false);
    const img = await loadImage(body);
    expect(img.width).toBe(1400);
  });

  it('refuses tampered, foreign or expired page URLs', async () => {
    const { url } = await pageImage(student, bookId, 1);
    const u = new URL(url, 'http://x');
    const sig = u.searchParams.get('sig')!;
    const withParam = (k: string, v: string) => {
      const c = new URL(u);
      c.searchParams.set(k, v);
      return c.pathname + c.search;
    };
    const flip = sig.slice(0, -1) + (sig.endsWith('A') ? 'B' : 'A');
    for (const bad of [
      withParam('sig', flip),
      withParam('size', 'sm'),
      withParam('exp', String(Number(u.searchParams.get('exp')) + 60)),
      withParam('exp', String(Math.floor(Date.now() / 1000) - 10)),
      url.replace('/pages/1?', '/pages/2?'),
    ]) {
      expect((await get(student, bad)).status, bad).toBe(403);
    }
    // Same URL, another reader or another session of the same reader.
    expect((await get(student2, url)).status).toBe(403);
    const again = await createSession('student@kitob.uz');
    expect((await ctx.http().get(url).set('Cookie', again)).status).toBe(403);
    await ctx.http().get(url).expect(401);
    // There is no route to the original file.
    for (const p of ['original', 'original.pdf', 'file', 'download']) {
      expect((await get(admin, `/books/${bookId}/${p}`)).status).toBe(404);
    }
  });

  it('limits page requests per reader and alerts administrators once', async () => {
    const reader = await createMember(ctx, 'tez@kitob.uz', platform, 'STUDENT');
    const statuses: number[] = [];
    for (let i = 0; i < 13; i++) {
      const { url } = await pageImage(reader, bookId, (i % 5) + 1);
      const r = await get(reader, url);
      statuses.push(r.status);
      if (r.status === 429) expect(r.body.code).toBe('BOOK_RATE_LIMITED');
    }
    expect(statuses.slice(0, 10).every((s) => s === 200)).toBe(true);
    expect(statuses.slice(10)).toEqual([429, 429, 429]);
    const alerts = (await get(admin, admBase()).expect(200)).body.alerts;
    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({ bookId, bookTitle: 'HTML darsligi', userName: 'tez' });
    // Another reader is not affected.
    const { url } = await pageImage(student2, bookId, 1);
    await get(student2, url).expect(200);
  });

  it('remembers the last page per reader', async () => {
    await json(student, 'put', `/books/${bookId}/progress`, { page: 3 }).expect(200);
    await json(student, 'put', `/books/${bookId}/progress`, { page: 0 }).expect(400);
    expect(
      (await json(student, 'put', `/books/${bookId}/progress`, { page: 99 }).expect(200)).body,
    ).toEqual({ page: 5, percent: 100 });
    await json(student, 'put', `/books/${bookId}/progress`, { page: 3 }).expect(200);
    const mine = (await get(student, '/books').expect(200)).body[0];
    expect(mine.progress).toEqual({ page: 3, percent: 60 });
    expect((await get(student2, '/books').expect(200)).body[0].progress).toBeNull();
  });

  it('serves the cover to readers', async () => {
    const res = await get(student, `/books/${bookId}/cover`)
      .buffer(true)
      .parse(binary.parser)
      .expect(200);
    const img = await loadImage(res.body as Buffer);
    expect(img.width).toBe(300);
  });
});

describe('book administration', () => {
  it('edits metadata, hides and deletes', async () => {
    const res = await json(admin, 'patch', `${admBase()}/${bookId}`, {
      title: 'HTML darsligi (2-nashr)',
      year: null,
    }).expect(200);
    expect(res.body).toMatchObject({ title: 'HTML darsligi (2-nashr)', year: null });
    await json(teacher, 'patch', `${admBase()}/${bookId}`, { title: 'Boshqa' }).expect(403);
    await json(otherAdmin, 'patch', `${admBase(otherOrg)}/${bookId}`, { title: 'Boshqa' }).expect(
      404,
    );

    await json(admin, 'patch', `${admBase()}/${bookId}`, { published: false }).expect(200);
    await get(student, `/books/${bookId}`).expect(404);

    await ctx.http().delete(`${admBase()}/${bookId}`).set('Cookie', teacher.cookie).expect(403);
    await ctx.http().delete(`${admBase()}/${bookId}`).set('Cookie', admin.cookie).expect(204);
    expect(existsSync(bookPaths(dir, bookId).dir)).toBe(false);
    await get(admin, `/books/${bookId}`).expect(404);
  });
});

async function createSession(email: string) {
  const res = await ctx
    .http()
    .post('/auth/login')
    .send({ email, password: 'correct-horse-battery' })
    .expect(200);
  const raw = res.headers['set-cookie'] as unknown as string[];
  return raw.find((c) => c.startsWith('wd_session='))!.split(';')[0]!;
}
