import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, eq, sql } from 'drizzle-orm';
import {
  compareTerms,
  REVIEW_BATCH,
  REVIEW_NEW_PER_DAY,
  scheduleReview,
  termKey,
  type GlossaryView,
  type ReviewAnswerInput,
  type ReviewCard,
  type ReviewQueue,
  type TermView,
  type UpsertTermInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import { RateLimiter } from '../common/rate-limiter';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import { LearningService } from '../courses/learning.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import { courseTerms, lessonProgress, termReviews } from '../db/schema';

type TermRow = typeof courseTerms.$inferSelect;

const NOT_FOUND = 'Atama topilmadi';
/** Review answers per student per minute: far above a real pace (about one card a second). */
export const REVIEW_ANSWERS_PER_MINUTE = 120;
const DUPLICATE = { message: 'Bu kursda shunday atama bor', code: 'TERM_EXISTS' };

/** Start of the current Asia/Tashkent day (UTC+5, no DST). */
export function tashkentDayStart(now: Date): Date {
  const shift = 5 * 3_600_000;
  const local = now.getTime() + shift;
  return new Date(local - (local % 86_400_000) - shift);
}

@Injectable()
export class GlossaryService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly learning: LearningService,
    private readonly audit: AuditService,
    private readonly limiter: RateLimiter,
  ) {}

  // ---- Glossary -----------------------------------------------------------

  /** Staff of the course see every term and the lesson list; learners see learned flags. */
  async glossary(auth: AuthContext, m: MembershipContext, courseId: string): Promise<GlossaryView> {
    await this.access.courseInOrg(m.organizationId, courseId);
    const db = this.dbs.db;
    const ordered = await this.access.orderedLessons(courseId, db);
    const titles = new Map(ordered.map((l) => [l.id, l.title]));
    const order = new Map(ordered.map((l, i) => [l.id, i]));

    if (await this.access.canManage(auth, m, courseId)) {
      const rows = await this.rows(db, courseId);
      return {
        terms: sortTerms(rows).map((r) => this.toView(r, titles, true)),
        lessons: ordered.map((l) => ({ id: l.id, title: l.title, module: l.moduleTitle })),
      };
    }

    await this.access.publishedCourse(m.organizationId, courseId);
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const learned = await this.completedLessons(db, auth.userId, courseId);
    const rows = (await this.rows(db, courseId)).filter(
      (r) => !r.lessonId || order.has(r.lessonId),
    );
    return {
      terms: sortTerms(rows).map((r) =>
        this.toView(r, titles, !r.lessonId || learned.has(r.lessonId)),
      ),
    };
  }

  async create(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    input: UpsertTermInput,
  ): Promise<TermView> {
    await this.access.manageableCourse(auth, m, courseId);
    if (input.lessonId) await this.access.lessonInCourse(courseId, input.lessonId);
    const [row] = await this.dbs.db
      .insert(courseTerms)
      .values({ ...this.values(input), courseId })
      .onConflictDoNothing()
      .returning();
    if (!row) throw new ConflictException(DUPLICATE);
    await this.audit.record({
      action: 'glossary.term_create',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course_term',
      targetId: row.id,
    });
    return this.toView(row, await this.titles(courseId), true);
  }

  async update(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    id: string,
    input: UpsertTermInput,
  ): Promise<TermView> {
    await this.access.manageableCourse(auth, m, courseId);
    if (input.lessonId) await this.access.lessonInCourse(courseId, input.lessonId);
    const db = this.dbs.db;
    await this.termInCourse(db, courseId, id);
    const values = this.values(input);
    const [clash] = await db
      .select({ id: courseTerms.id })
      .from(courseTerms)
      .where(and(eq(courseTerms.courseId, courseId), eq(courseTerms.termKey, values.termKey)))
      .limit(1);
    if (clash && clash.id !== id) throw new ConflictException(DUPLICATE);
    const [row] = await db
      .update(courseTerms)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(courseTerms.id, id))
      .returning();
    await this.audit.record({
      action: 'glossary.term_update',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course_term',
      targetId: id,
    });
    return this.toView(row!, await this.titles(courseId), true);
  }

  async remove(auth: AuthContext, m: MembershipContext, courseId: string, id: string) {
    await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    await this.termInCourse(db, courseId, id);
    await db.delete(courseTerms).where(eq(courseTerms.id, id));
    await this.audit.record({
      action: 'glossary.term_delete',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course_term',
      targetId: id,
    });
  }

  // ---- Spaced repetition --------------------------------------------------

  async queue(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    now = new Date(),
  ): Promise<ReviewQueue> {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const ordered = await this.access.orderedLessons(courseId, db);
    const titles = new Map(ordered.map((l) => [l.id, l.title]));
    const order = new Map(ordered.map((l, i) => [l.id, i]));
    const learned = await this.completedLessons(db, auth.userId, courseId);

    const terms = (await this.rows(db, courseId)).filter(
      (r) => !r.lessonId || order.has(r.lessonId),
    );
    const open = terms.filter((r) => !r.lessonId || learned.has(r.lessonId));
    const reviews = await db
      .select()
      .from(termReviews)
      .where(and(eq(termReviews.userId, auth.userId), eq(termReviews.courseId, courseId)));
    const byTerm = new Map(reviews.map((r) => [r.termId, r]));
    const dayStart = tashkentDayStart(now);
    const newToday = reviews.filter((r) => r.createdAt >= dayStart).length;

    const card = (t: TermRow): ReviewCard => {
      const r = byTerm.get(t.id);
      return {
        termId: t.id,
        term: t.term,
        definition: t.definition,
        example: t.example,
        lessonTitle: t.lessonId ? (titles.get(t.lessonId) ?? null) : null,
        isNew: !r,
        state: r
          ? { ease: r.ease, intervalDays: r.intervalDays, reps: r.reps, lapses: r.lapses }
          : null,
      };
    };

    const due = open
      .filter((t) => {
        const r = byTerm.get(t.id);
        return r && r.dueAt <= now;
      })
      .sort((a, b) => byTerm.get(a.id)!.dueAt.getTime() - byTerm.get(b.id)!.dueAt.getTime());
    // New cards follow the course order, so the earliest lessons are practised first.
    const fresh = open
      .filter((t) => !byTerm.has(t.id))
      .sort(
        (a, b) =>
          (a.lessonId ? (order.get(a.lessonId) ?? 0) : -1) -
            (b.lessonId ? (order.get(b.lessonId) ?? 0) : -1) ||
          a.createdAt.getTime() - b.createdAt.getTime() ||
          a.term.localeCompare(b.term),
      );
    const newLeft = Math.max(0, REVIEW_NEW_PER_DAY - newToday);
    const cards = [...due.slice(0, REVIEW_BATCH), ...fresh.slice(0, newLeft)]
      .slice(0, REVIEW_BATCH)
      .map(card);

    const openIds = new Set(open.map((t) => t.id));
    const future = reviews
      .filter((r) => openIds.has(r.termId) && r.dueAt > now)
      .map((r) => r.dueAt.getTime());
    return {
      cards,
      counts: {
        learned: open.length,
        total: terms.length,
        due: due.length,
        newToday,
        started: reviews.filter((r) => openIds.has(r.termId)).length,
      },
      nextDueAt:
        cards.length === 0 && future.length ? new Date(Math.min(...future)).toISOString() : null,
    };
  }

  async answer(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    termId: string,
    input: ReviewAnswerInput,
    now = new Date(),
  ) {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const term = await this.termInCourse(db, courseId, termId);
    await this.limiter.consume(
      `review-answer:${auth.userId}`,
      REVIEW_ANSWERS_PER_MINUTE,
      60_000,
      'REVIEW_RATE_LIMITED',
      now,
    );
    if (term.lessonId) {
      const learned = await this.completedLessons(db, auth.userId, courseId);
      if (!learned.has(term.lessonId)) {
        throw new ForbiddenException({
          message: 'Bu atama darsini hali tugatmagansiz',
          code: 'TERM_LOCKED',
        });
      }
    }
    return db.transaction(async (tx) => {
      const [prev] = await tx
        .select()
        .from(termReviews)
        .where(and(eq(termReviews.userId, auth.userId), eq(termReviews.termId, termId)))
        .limit(1);
      const next = scheduleReview(prev ?? null, input.grade, now);
      const values = {
        ease: next.ease,
        intervalDays: next.intervalDays,
        reps: next.reps,
        lapses: next.lapses,
        dueAt: next.dueAt,
        lastGrade: input.grade,
        reviewedAt: now,
      };
      await tx
        .insert(termReviews)
        .values({ ...values, userId: auth.userId, termId, courseId })
        .onConflictDoUpdate({
          target: [termReviews.userId, termReviews.termId],
          set: { ...values, reviewCount: sql`${termReviews.reviewCount} + 1` },
        });
      return {
        termId,
        grade: input.grade,
        intervalDays: next.intervalDays,
        dueAt: next.dueAt.toISOString(),
      };
    });
  }

  // ---- Helpers ------------------------------------------------------------

  private rows(db: Db, courseId: string) {
    return db
      .select()
      .from(courseTerms)
      .where(eq(courseTerms.courseId, courseId))
      .orderBy(asc(courseTerms.term));
  }

  private async completedLessons(db: Db, userId: string, courseId: string) {
    const rows = await db
      .select({ lessonId: lessonProgress.lessonId })
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.courseId, courseId),
          eq(lessonProgress.status, 'COMPLETED'),
        ),
      );
    return new Set(rows.map((r) => r.lessonId));
  }

  private async termInCourse(db: Db, courseId: string, id: string): Promise<TermRow> {
    const [t] = await db
      .select()
      .from(courseTerms)
      .where(and(eq(courseTerms.id, id), eq(courseTerms.courseId, courseId)))
      .limit(1);
    if (!t) throw new NotFoundException(NOT_FOUND);
    return t;
  }

  private async titles(courseId: string) {
    const ordered = await this.access.orderedLessons(courseId);
    return new Map(ordered.map((l) => [l.id, l.title]));
  }

  private values(input: UpsertTermInput) {
    return {
      term: input.term.trim(),
      termKey: termKey(input.term),
      definition: input.definition.trim(),
      example: input.example.replace(/\s+$/, ''),
      lessonId: input.lessonId,
    };
  }

  private toView(r: TermRow, titles: Map<string, string>, learned: boolean): TermView {
    return {
      id: r.id,
      term: r.term,
      definition: r.definition,
      example: r.example,
      lessonId: r.lessonId,
      lessonTitle: r.lessonId ? (titles.get(r.lessonId) ?? null) : null,
      learned,
    };
  }
}

/** Glossary order: index letter (Uzbek alphabet), then alphabetical. */
function sortTerms(rows: TermRow[]): TermRow[] {
  return [...rows].sort((a, b) => compareTerms(a.term, b.term));
}
