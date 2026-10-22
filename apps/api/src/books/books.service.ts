import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  BOOK_URL_TTL_SECONDS,
  type BookAdmin,
  type BookAdminList,
  type BookAlert,
  type BookDetail,
  type BookMetaInput,
  type BookPageSize,
  type BookPagesQuery,
  type BookPageUrls,
  type BookSummary,
  type UpdateBookInput,
} from '@webdizayn/shared';
import { and, desc, eq, gte, inArray, sql, type SQL } from 'drizzle-orm';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { AuditService } from '../audit/audit.service';
import { RateLimiter } from '../common/rate-limiter';
import type { AuthContext, MembershipContext } from '../common/types';
import { APP_CONFIG, type AppConfig } from '../config';
import { DbService } from '../db/db.module';
import {
  auditEvents,
  bookProgress,
  books,
  courses,
  directions,
  memberships,
  organizations,
  users,
} from '../db/schema';
import { bookPaths, imageKind, isPdf, PageSigner, watermark } from './book-files';
import { BookProcessor } from './book-processor';

/** What multer hands over (memory storage). */
export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

const COVER_MAX_BYTES = 5 * 1024 * 1024;
const NOT_FOUND = 'Kitob topilmadi';
const RATE_CODE = 'BOOK_RATE_LIMITED';
/** One alert per reader per this window, however many requests were refused. */
const ALERT_WINDOW_MS = 10 * 60_000;

type BookRow = typeof books.$inferSelect;

const badRequest = (code: string, message: string) =>
  new BadRequestException({ statusCode: 400, code, message });

@Injectable()
export class BooksService {
  private readonly signer: PageSigner;

  constructor(
    private readonly dbs: DbService,
    private readonly audit: AuditService,
    private readonly limiter: RateLimiter,
    private readonly processor: BookProcessor,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {
    this.signer = new PageSigner(config.BOOK_URL_SECRET);
  }

  private get db() {
    return this.dbs.db;
  }

  private paths(id: string) {
    return bookPaths(this.config.BOOKS_DIR, id);
  }

  // =====================================================================
  // Administration (ORG_ADMIN of the book's organization)
  // =====================================================================

  async adminList(m: MembershipContext): Promise<BookAdminList> {
    const rows = await this.adminRows(eq(books.organizationId, m.organizationId));
    const [dirs, orgCourses, alerts] = await Promise.all([
      this.db
        .select({ id: directions.id, title: directions.title })
        .from(directions)
        .orderBy(directions.position),
      this.db
        .select({ id: courses.id, title: courses.title })
        .from(courses)
        .where(eq(courses.organizationId, m.organizationId))
        .orderBy(courses.position, courses.title),
      this.alerts(m.organizationId),
    ]);
    return {
      books: rows,
      alerts,
      directions: dirs,
      courses: orgCourses,
      limits: {
        maxBytes: this.config.BOOK_MAX_MB * 1024 * 1024,
        maxPages: this.config.BOOK_MAX_PAGES,
      },
    };
  }

  private async adminRows(where: SQL | undefined): Promise<BookAdmin[]> {
    const rows = await this.db
      .select({
        book: books,
        dirSlug: directions.slug,
        dirTitle: directions.title,
        courseTitle: courses.title,
      })
      .from(books)
      .leftJoin(directions, eq(directions.id, books.directionId))
      .leftJoin(courses, eq(courses.id, books.courseId))
      .where(where)
      .orderBy(desc(books.createdAt));
    return rows.map(({ book: b, dirSlug, dirTitle, courseTitle }) => ({
      ...this.base(b, dirSlug, dirTitle, courseTitle),
      status: b.status,
      error: b.error,
      published: b.published,
      fileSize: b.fileSize,
      directionId: b.directionId,
      courseId: b.courseId,
    }));
  }

  private base(
    b: BookRow,
    dirSlug: string | null,
    dirTitle: string | null,
    courseTitle: string | null,
  ): Omit<BookSummary, 'progress'> {
    return {
      id: b.id,
      title: b.title,
      author: b.author,
      year: b.year,
      description: b.description,
      direction: dirSlug && dirTitle ? { slug: dirSlug, title: dirTitle } : null,
      course: b.courseId && courseTitle ? { id: b.courseId, title: courseTitle } : null,
      pageCount: b.pageCount,
      createdAt: b.createdAt.toISOString(),
    };
  }

  private async alerts(orgId: string): Promise<BookAlert[]> {
    const rows = await this.db
      .select({
        at: auditEvents.createdAt,
        bookId: auditEvents.targetId,
        bookTitle: books.title,
        userName: users.fullName,
        userLogin: sql<string | null>`coalesce(${users.login}, ${users.email})`,
      })
      .from(auditEvents)
      .leftJoin(users, eq(users.id, auditEvents.actorUserId))
      .leftJoin(books, sql`${books.id}::text = ${auditEvents.targetId}`)
      .where(
        and(
          eq(auditEvents.action, 'book.rate_limited'),
          eq(auditEvents.organizationId, orgId),
          gte(auditEvents.createdAt, new Date(Date.now() - 30 * 86_400_000)),
        ),
      )
      .orderBy(desc(auditEvents.createdAt))
      .limit(50);
    return rows.map((r) => ({ ...r, at: r.at.toISOString() }));
  }

  /** Checks the referenced direction and course (the course must be in this organization). */
  private async checkLinks(
    orgId: string,
    v: { directionId?: string | null; courseId?: string | null },
  ) {
    if (v.directionId) {
      const [d] = await this.db
        .select({ id: directions.id })
        .from(directions)
        .where(eq(directions.id, v.directionId));
      if (!d) throw badRequest('BAD_DIRECTION', 'Yo‘nalish topilmadi');
    }
    if (v.courseId) {
      const [c] = await this.db
        .select({ id: courses.id })
        .from(courses)
        .where(and(eq(courses.id, v.courseId), eq(courses.organizationId, orgId)));
      if (!c) throw badRequest('BAD_COURSE', 'Kurs topilmadi');
    }
  }

  async upload(
    auth: AuthContext,
    m: MembershipContext,
    meta: BookMetaInput,
    pdf: UploadedFile | undefined,
    cover: UploadedFile | undefined,
  ): Promise<BookAdmin> {
    if (!pdf) throw badRequest('FILE_REQUIRED', 'PDF faylni tanlang');
    // Name, declared type and the bytes themselves must all say PDF.
    if (
      !/\.pdf$/i.test(pdf.originalname) ||
      pdf.mimetype !== 'application/pdf' ||
      !isPdf(pdf.buffer)
    ) {
      throw badRequest('NOT_PDF', 'Faqat PDF fayl yuklash mumkin');
    }
    if (pdf.size > this.config.BOOK_MAX_MB * 1024 * 1024) {
      throw badRequest('FILE_TOO_LARGE', `PDF ${this.config.BOOK_MAX_MB} MB dan oshmasin`);
    }
    if (cover) {
      const kind = imageKind(cover.buffer);
      if (
        !kind ||
        !/\.(png|jpe?g|webp)$/i.test(cover.originalname) ||
        !['image/png', 'image/jpeg', 'image/webp'].includes(cover.mimetype)
      ) {
        throw badRequest('BAD_COVER', 'Muqova PNG, JPEG yoki WebP rasm bo‘lsin');
      }
      if (cover.size > COVER_MAX_BYTES) throw badRequest('BAD_COVER', 'Muqova 5 MB dan oshmasin');
    }
    await this.checkLinks(m.organizationId, meta);

    const [row] = await this.db
      .insert(books)
      .values({
        organizationId: m.organizationId,
        title: meta.title,
        author: meta.author,
        year: meta.year ?? null,
        description: meta.description,
        directionId: meta.directionId ?? null,
        courseId: meta.courseId ?? null,
        fileSize: pdf.size,
        hasCover: Boolean(cover),
        createdBy: auth.userId,
      })
      .returning();
    const paths = this.paths(row!.id);
    try {
      await mkdir(paths.dir, { recursive: true });
      await writeFile(paths.original, pdf.buffer);
      if (cover) await writeFile(paths.coverUpload, cover.buffer);
    } catch (e) {
      await this.db.delete(books).where(eq(books.id, row!.id));
      await rm(paths.dir, { recursive: true, force: true });
      throw e;
    }
    this.processor.enqueue(row!.id);
    await this.audit.record({
      action: 'book.upload',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'book',
      targetId: row!.id,
      metadata: { bytes: pdf.size },
    });
    return this.adminOne(m, row!.id);
  }

  async adminOne(m: MembershipContext, id: string): Promise<BookAdmin> {
    const [row] = await this.adminRows(
      and(eq(books.id, id), eq(books.organizationId, m.organizationId)),
    );
    if (!row) throw new NotFoundException(NOT_FOUND);
    return row;
  }

  async update(auth: AuthContext, m: MembershipContext, id: string, input: UpdateBookInput) {
    const before = await this.adminOne(m, id);
    await this.checkLinks(m.organizationId, input);
    if (input.published === true && before.status !== 'READY') {
      throw new ConflictException({
        statusCode: 409,
        code: 'BOOK_NOT_READY',
        message: 'Kitob hali tayyor emas — betlar qayta ishlanmoqda yoki xato bilan tugagan',
      });
    }
    await this.db
      .update(books)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(books.id, id));
    if (input.published !== undefined && input.published !== before.published) {
      await this.audit.record({
        action: input.published ? 'book.publish' : 'book.unpublish',
        actorUserId: auth.userId,
        organizationId: m.organizationId,
        targetType: 'book',
        targetId: id,
      });
    }
    return this.adminOne(m, id);
  }

  async remove(auth: AuthContext, m: MembershipContext, id: string) {
    await this.adminOne(m, id);
    await this.db.delete(books).where(eq(books.id, id));
    await rm(this.paths(id).dir, { recursive: true, force: true });
    await this.audit.record({
      action: 'book.delete',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'book',
      targetId: id,
    });
  }

  async adminCover(m: MembershipContext, id: string): Promise<Buffer> {
    const b = await this.adminOne(m, id);
    if (b.status !== 'READY') throw new NotFoundException(NOT_FOUND);
    return readFile(this.paths(id).cover);
  }

  // =====================================================================
  // Reading (every signed-in user: the platform's books and those of their organizations)
  // =====================================================================

  /** Organizations whose published books this user may read, and where they are ORG_ADMIN. */
  private async scope(userId: string) {
    const rows = await this.db
      .select({ orgId: memberships.organizationId, role: memberships.role })
      .from(memberships)
      .where(eq(memberships.userId, userId));
    const [platform] = await this.db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, this.config.DEFAULT_ORG_SLUG));
    const orgs = new Set(rows.map((r) => r.orgId));
    if (platform) orgs.add(platform.id);
    const adminOf = new Set(rows.filter((r) => r.role === 'ORG_ADMIN').map((r) => r.orgId));
    return { orgs: [...orgs], adminOf };
  }

  /**
   * The book if this user may read it: READY, in one of their organizations (or the platform's),
   * and published — administrators of its organization may also preview it unpublished.
   * Everything else is the same 404.
   */
  private async readable(userId: string, id: string): Promise<BookRow> {
    const [b] = await this.db.select().from(books).where(eq(books.id, id));
    if (!b || b.status !== 'READY') throw new NotFoundException(NOT_FOUND);
    const { orgs, adminOf } = await this.scope(userId);
    if (!orgs.includes(b.organizationId)) throw new NotFoundException(NOT_FOUND);
    if (!b.published && !adminOf.has(b.organizationId)) throw new NotFoundException(NOT_FOUND);
    return b;
  }

  async list(auth: AuthContext): Promise<BookSummary[]> {
    const { orgs } = await this.scope(auth.userId);
    if (orgs.length === 0) return [];
    const rows = await this.db
      .select({
        book: books,
        dirSlug: directions.slug,
        dirTitle: directions.title,
        courseTitle: courses.title,
        page: bookProgress.page,
      })
      .from(books)
      .leftJoin(directions, eq(directions.id, books.directionId))
      .leftJoin(courses, eq(courses.id, books.courseId))
      .leftJoin(
        bookProgress,
        and(eq(bookProgress.bookId, books.id), eq(bookProgress.userId, auth.userId)),
      )
      .where(
        and(
          inArray(books.organizationId, orgs),
          eq(books.status, 'READY'),
          eq(books.published, true),
        ),
      )
      .orderBy(desc(books.createdAt));
    return rows.map((r) => ({
      ...this.base(r.book, r.dirSlug, r.dirTitle, r.courseTitle),
      progress: progressOf(r.page, r.book.pageCount),
    }));
  }

  async detail(auth: AuthContext, id: string): Promise<BookDetail> {
    const b = await this.readable(auth.userId, id);
    const [[dir], [course], [prog]] = await Promise.all([
      b.directionId
        ? this.db
            .select({ slug: directions.slug, title: directions.title })
            .from(directions)
            .where(eq(directions.id, b.directionId))
        : Promise.resolve([]),
      b.courseId
        ? this.db.select({ title: courses.title }).from(courses).where(eq(courses.id, b.courseId))
        : Promise.resolve([]),
      this.db
        .select({ page: bookProgress.page })
        .from(bookProgress)
        .where(and(eq(bookProgress.bookId, id), eq(bookProgress.userId, auth.userId))),
    ]);
    return {
      ...this.base(b, dir?.slug ?? null, dir?.title ?? null, course?.title ?? null),
      progress: progressOf(prog?.page ?? null, b.pageCount),
      toc: b.toc,
      pageWidth: b.pageWidth,
      pageHeight: b.pageHeight,
      watermark: await this.watermarkText(auth.userId),
    };
  }

  /** "Ism Familiya · ID 1a2b3c4d · 20.10.2026 18:40" (Tashkent time). */
  private async watermarkText(userId: string): Promise<string> {
    const [u] = await this.db
      .select({ name: users.fullName })
      .from(users)
      .where(eq(users.id, userId));
    const t = new Date(Date.now() + 5 * 3_600_000).toISOString();
    const stamp = `${t.slice(8, 10)}.${t.slice(5, 7)}.${t.slice(0, 4)} ${t.slice(11, 16)}`;
    return `${u?.name ?? ''} · ID ${userId.slice(0, 8)} · ${stamp}`;
  }

  async pageUrls(auth: AuthContext, id: string, q: BookPagesQuery): Promise<BookPageUrls> {
    const b = await this.readable(auth.userId, id);
    const exp = Math.floor(Date.now() / 1000) + BOOK_URL_TTL_SECONDS;
    const pages: BookPageUrls['pages'] = [];
    for (let page = q.from; page <= Math.min(q.to, b.pageCount); page++) {
      const sig = this.signer.sign({
        userId: auth.userId,
        sessionId: auth.sessionId,
        bookId: id,
        page,
        size: q.size,
        exp,
      });
      pages.push({
        page,
        url: `/api/books/${id}/pages/${page}?size=${q.size}&exp=${exp}&sig=${sig}`,
      });
    }
    return { expiresAt: new Date(exp * 1000).toISOString(), pages };
  }

  /**
   * One page image, watermarked for this reader. Every request is authorized again (session,
   * signature, access to the book) and counted; over the limit the reader gets 429 and the
   * organization's administrators get an alert.
   */
  async page(
    auth: AuthContext,
    id: string,
    page: number,
    q: { size: BookPageSize; exp: number; sig: string },
  ): Promise<Buffer> {
    const signed = { userId: auth.userId, sessionId: auth.sessionId, bookId: id, page, ...q };
    if (!this.signer.verify(signed, q.sig)) {
      throw new ForbiddenException({
        statusCode: 403,
        code: 'BAD_SIGNATURE',
        message: 'Havola eskirgan yoki noto‘g‘ri',
      });
    }
    const b = await this.readable(auth.userId, id);
    if (page < 1 || page > b.pageCount) throw new NotFoundException(NOT_FOUND);
    await this.countPage(auth.userId, b);
    const image = await readFile(this.paths(id).page(page, q.size));
    return watermark(image, await this.watermarkText(auth.userId));
  }

  private async countPage(userId: string, b: BookRow) {
    try {
      await this.limiter.consume(
        `book-pages:${userId}`,
        this.config.BOOK_PAGE_RATE_PER_MINUTE,
        60_000,
        RATE_CODE,
      );
    } catch (e) {
      if (e instanceof HttpException && e.getStatus() === HttpStatus.TOO_MANY_REQUESTS) {
        await this.alert(userId, b);
      }
      throw e;
    }
  }

  /** Records a "possible mass download" alert unless one exists for this reader recently. */
  private async alert(userId: string, b: BookRow) {
    const [recent] = await this.db
      .select({ id: auditEvents.id })
      .from(auditEvents)
      .where(
        and(
          eq(auditEvents.action, 'book.rate_limited'),
          eq(auditEvents.actorUserId, userId),
          gte(auditEvents.createdAt, new Date(Date.now() - ALERT_WINDOW_MS)),
        ),
      )
      .limit(1);
    if (recent) return;
    await this.audit.record({
      action: 'book.rate_limited',
      actorUserId: userId,
      organizationId: b.organizationId,
      targetType: 'book',
      targetId: b.id,
      metadata: { limitPerMinute: this.config.BOOK_PAGE_RATE_PER_MINUTE },
    });
  }

  async cover(auth: AuthContext, id: string): Promise<Buffer> {
    await this.readable(auth.userId, id);
    return readFile(this.paths(id).cover);
  }

  async saveProgress(auth: AuthContext, id: string, page: number) {
    const b = await this.readable(auth.userId, id);
    const p = Math.min(page, b.pageCount);
    await this.db
      .insert(bookProgress)
      .values({ userId: auth.userId, bookId: id, page: p })
      .onConflictDoUpdate({
        target: [bookProgress.userId, bookProgress.bookId],
        set: { page: p, updatedAt: new Date() },
      });
    return progressOf(p, b.pageCount);
  }
}

function progressOf(page: number | null, pageCount: number) {
  if (page == null || pageCount <= 0) return null;
  const p = Math.min(Math.max(1, page), pageCount);
  return { page: p, percent: Math.round((p / pageCount) * 100) };
}
