import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, countDistinct, desc, eq, inArray, max, sql } from 'drizzle-orm';
import {
  PORTFOLIO_MAX_ITEMS,
  type Achievement,
  type AddPortfolioItemInput,
  type CompletedCourse,
  type MyPortfolio,
  type PortfolioCandidate,
  type PortfolioItemDetail,
  type PortfolioItemSummary,
  type PortfolioProfile,
  type ProjectFile,
  type PublicPortfolio,
  type UpdatePortfolioInput,
  type UpdatePortfolioItemInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../common/types';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  assignments,
  courses,
  enrollments,
  exercises,
  lessonProgress,
  lessons,
  portfolioItems,
  portfolios,
  quizAttempts,
  studentExercises,
  submissionVersions,
  submissions,
  users,
} from '../db/schema';

type PortfolioRow = typeof portfolios.$inferSelect;
type ItemRow = typeof portfolioItems.$inferSelect;

/** Submissions a teacher has graded; only these count as finished assignment work. */
const GRADED = ['GRADED', 'FINALIZED'] as const;

const NOT_FOUND = { message: 'Portfolio topilmadi', code: 'PORTFOLIO_NOT_FOUND' };

@Injectable()
export class PortfolioService {
  constructor(
    private readonly dbs: DbService,
    private readonly audit: AuditService,
  ) {}

  private get db(): Db {
    return this.dbs.db;
  }

  // ---- Owner --------------------------------------------------------------

  async mine(auth: AuthContext): Promise<MyPortfolio> {
    const p = await this.ensure(auth.userId);
    const [items, candidates, stats] = await Promise.all([
      this.items(auth.userId),
      this.candidates(auth.userId),
      this.stats(auth.userId),
    ]);
    return { profile: toProfile(p), items, candidates, ...stats };
  }

  async update(auth: AuthContext, input: UpdatePortfolioInput): Promise<PortfolioProfile> {
    await this.ensure(auth.userId);
    if (input.slug === null) {
      const [p] = await this.db
        .select({ isPublished: portfolios.isPublished })
        .from(portfolios)
        .where(eq(portfolios.userId, auth.userId));
      if (p?.isPublished) {
        throw new ConflictException({
          message: 'E’lon qilingan portfolio manzilsiz bo‘lolmaydi. Avval yashiring',
          code: 'SLUG_REQUIRED',
        });
      }
    }
    if (input.slug) {
      const [owner] = await this.db
        .select({ userId: portfolios.userId })
        .from(portfolios)
        .where(eq(portfolios.slug, input.slug));
      if (owner && owner.userId !== auth.userId) {
        throw new ConflictException({ message: 'Bu manzil band', code: 'SLUG_TAKEN' });
      }
    }
    try {
      const [row] = await this.db
        .update(portfolios)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(portfolios.userId, auth.userId))
        .returning();
      return toProfile(row!);
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ConflictException({ message: 'Bu manzil band', code: 'SLUG_TAKEN' });
      }
      throw err;
    }
  }

  async publish(auth: AuthContext, publish: boolean): Promise<PortfolioProfile> {
    const p = await this.ensure(auth.userId);
    if (publish && !p.slug) {
      throw new ConflictException({
        message: 'E’lon qilishdan oldin ochiq manzil (slug) tanlang',
        code: 'SLUG_REQUIRED',
      });
    }
    if (p.isPublished === publish) return toProfile(p);
    const [row] = await this.db
      .update(portfolios)
      .set({
        isPublished: publish,
        publishedAt: publish ? new Date() : p.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(portfolios.userId, auth.userId))
      .returning();
    await this.audit.record({
      action: publish ? 'portfolio.publish' : 'portfolio.unpublish',
      actorUserId: auth.userId,
      targetType: 'portfolio',
      targetId: auth.userId,
      metadata: { slug: p.slug },
    });
    return toProfile(row!);
  }

  async addItem(auth: AuthContext, input: AddPortfolioItemInput): Promise<PortfolioItemSummary> {
    await this.ensure(auth.userId);
    const source = await this.source(auth.userId, input.kind, input.sourceId);
    if (!source) {
      // Not the caller's finished work (or not theirs at all): indistinguishable on purpose.
      throw new NotFoundException({
        message: 'Bu ish portfolioga qo‘shib bo‘lmaydi',
        code: 'NOT_ELIGIBLE',
      });
    }

    return this.db.transaction(async (tx) => {
      // Serialize per owner so the item cap and positions stay consistent.
      await tx
        .select({ id: portfolios.userId })
        .from(portfolios)
        .where(eq(portfolios.userId, auth.userId))
        .for('update');
      const [stat] = await tx
        .select({ n: count(), pos: max(portfolioItems.position) })
        .from(portfolioItems)
        .where(eq(portfolioItems.userId, auth.userId));
      if ((stat?.n ?? 0) >= PORTFOLIO_MAX_ITEMS) {
        throw new ConflictException({
          message: `Portfolioda ${PORTFOLIO_MAX_ITEMS} tadan ortiq ish bo‘lolmaydi`,
          code: 'PORTFOLIO_FULL',
        });
      }
      const [row] = await tx
        .insert(portfolioItems)
        .values({
          userId: auth.userId,
          kind: input.kind,
          sourceId: input.sourceId,
          title: input.title ?? source.title,
          description: input.description ?? '',
          courseTitle: source.courseTitle,
          files: source.files,
          position: stat?.pos === null || stat?.pos === undefined ? 0 : stat.pos + 1,
        })
        .onConflictDoNothing()
        .returning();
      if (!row) {
        throw new ConflictException({
          message: 'Bu ish portfolioda allaqachon bor',
          code: 'ALREADY_ADDED',
        });
      }
      return toItem(row);
    });
  }

  async getItem(auth: AuthContext, itemId: string): Promise<PortfolioItemDetail> {
    const row = await this.ownItem(auth.userId, itemId);
    return { ...toItem(row), files: row.files };
  }

  async updateItem(
    auth: AuthContext,
    itemId: string,
    input: UpdatePortfolioItemInput,
  ): Promise<PortfolioItemSummary> {
    await this.ownItem(auth.userId, itemId);
    const [row] = await this.db
      .update(portfolioItems)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq(portfolioItems.id, itemId), eq(portfolioItems.userId, auth.userId)))
      .returning();
    return toItem(row!);
  }

  async removeItem(auth: AuthContext, itemId: string): Promise<void> {
    await this.ownItem(auth.userId, itemId);
    await this.db
      .delete(portfolioItems)
      .where(and(eq(portfolioItems.id, itemId), eq(portfolioItems.userId, auth.userId)));
  }

  // ---- Public -------------------------------------------------------------

  async publicView(slug: string): Promise<PublicPortfolio> {
    const p = await this.published(slug);
    const [items, stats] = await Promise.all([this.items(p.userId), this.stats(p.userId)]);
    return {
      slug: p.slug!,
      displayName: p.displayName,
      headline: p.headline,
      bio: p.bio,
      skills: p.skills,
      achievements: stats.achievements,
      completedCourses: stats.completedCourses,
      items,
      publishedAt: p.publishedAt!.toISOString(),
    };
  }

  async publicItem(slug: string, itemId: string): Promise<PortfolioItemDetail> {
    const p = await this.published(slug);
    const [row] = await this.db
      .select()
      .from(portfolioItems)
      .where(and(eq(portfolioItems.id, itemId), eq(portfolioItems.userId, p.userId)));
    if (!row) throw new NotFoundException(NOT_FOUND);
    return { ...toItem(row), files: row.files };
  }

  // ---- Internals ----------------------------------------------------------

  /** Unpublished and missing portfolios look the same to the public. */
  private async published(slug: string): Promise<PortfolioRow> {
    const normalized = slug.trim().toLowerCase();
    const [p] = await this.db
      .select()
      .from(portfolios)
      .where(and(eq(portfolios.slug, normalized), eq(portfolios.isPublished, true)));
    if (!p) throw new NotFoundException(NOT_FOUND);
    return p;
  }

  private async ensure(userId: string): Promise<PortfolioRow> {
    const [existing] = await this.db.select().from(portfolios).where(eq(portfolios.userId, userId));
    if (existing) return existing;
    const [user] = await this.db
      .select({ fullName: users.fullName })
      .from(users)
      .where(eq(users.id, userId));
    await this.db
      .insert(portfolios)
      .values({ userId, displayName: user?.fullName.slice(0, 80) || 'Talaba' })
      .onConflictDoNothing();
    const [row] = await this.db.select().from(portfolios).where(eq(portfolios.userId, userId));
    return row!;
  }

  private async ownItem(userId: string, itemId: string): Promise<ItemRow> {
    const [row] = await this.db
      .select()
      .from(portfolioItems)
      .where(and(eq(portfolioItems.id, itemId), eq(portfolioItems.userId, userId)));
    if (!row) throw new NotFoundException({ message: 'Ish topilmadi', code: 'ITEM_NOT_FOUND' });
    return row;
  }

  private async items(userId: string): Promise<PortfolioItemSummary[]> {
    const rows = await this.db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.userId, userId))
      .orderBy(asc(portfolioItems.position), asc(portfolioItems.createdAt));
    return rows.map(toItem);
  }

  /** The caller's finished work for one source, re-validated on the server. */
  private async source(
    userId: string,
    kind: AddPortfolioItemInput['kind'],
    sourceId: string,
  ): Promise<{ title: string; courseTitle: string; files: ProjectFile[] } | null> {
    if (kind === 'EXERCISE') {
      const [row] = await this.db
        .select({
          title: exercises.title,
          courseTitle: courses.title,
          files: studentExercises.files,
        })
        .from(studentExercises)
        .innerJoin(exercises, eq(exercises.id, studentExercises.exerciseId))
        .innerJoin(courses, eq(courses.id, studentExercises.courseId))
        .where(
          and(
            eq(studentExercises.userId, userId),
            eq(studentExercises.exerciseId, sourceId),
            eq(studentExercises.status, 'PASSED'),
          ),
        );
      return row ?? null;
    }

    const [sub] = await this.db
      .select({ id: submissions.id, title: assignments.title, courseTitle: courses.title })
      .from(submissions)
      .innerJoin(assignments, eq(assignments.id, submissions.assignmentId))
      .innerJoin(courses, eq(courses.id, submissions.courseId))
      .where(
        and(
          eq(submissions.userId, userId),
          eq(submissions.assignmentId, sourceId),
          inArray(submissions.status, [...GRADED]),
        ),
      );
    if (!sub) return null;
    // The graded version is the latest one (review actions reject stale versions).
    const [version] = await this.db
      .select({ files: submissionVersions.files })
      .from(submissionVersions)
      .where(eq(submissionVersions.submissionId, sub.id))
      .orderBy(desc(submissionVersions.version))
      .limit(1);
    if (!version) return null;
    return { title: sub.title, courseTitle: sub.courseTitle, files: version.files };
  }

  private async candidates(userId: string): Promise<PortfolioCandidate[]> {
    const added = await this.db
      .select({ kind: portfolioItems.kind, sourceId: portfolioItems.sourceId })
      .from(portfolioItems)
      .where(eq(portfolioItems.userId, userId));
    const taken = new Set(added.map((a) => `${a.kind}:${a.sourceId}`));

    const [passed, graded] = await Promise.all([
      this.db
        .select({
          sourceId: studentExercises.exerciseId,
          title: exercises.title,
          courseTitle: courses.title,
          finishedAt: studentExercises.passedAt,
        })
        .from(studentExercises)
        .innerJoin(exercises, eq(exercises.id, studentExercises.exerciseId))
        .innerJoin(courses, eq(courses.id, studentExercises.courseId))
        .where(and(eq(studentExercises.userId, userId), eq(studentExercises.status, 'PASSED')))
        .orderBy(desc(studentExercises.passedAt)),
      this.db
        .select({
          sourceId: submissions.assignmentId,
          title: assignments.title,
          courseTitle: courses.title,
          finishedAt: submissions.updatedAt,
        })
        .from(submissions)
        .innerJoin(assignments, eq(assignments.id, submissions.assignmentId))
        .innerJoin(courses, eq(courses.id, submissions.courseId))
        .where(and(eq(submissions.userId, userId), inArray(submissions.status, [...GRADED])))
        .orderBy(desc(submissions.updatedAt)),
    ]);

    const out: PortfolioCandidate[] = [];
    for (const r of graded) {
      if (!taken.has(`ASSIGNMENT:${r.sourceId}`)) {
        out.push({ kind: 'ASSIGNMENT', ...r, finishedAt: r.finishedAt?.toISOString() ?? null });
      }
    }
    for (const r of passed) {
      if (!taken.has(`EXERCISE:${r.sourceId}`)) {
        out.push({ kind: 'EXERCISE', ...r, finishedAt: r.finishedAt?.toISOString() ?? null });
      }
    }
    return out;
  }

  /** Achievements and completed courses, derived from learning records on every read. */
  private async stats(
    userId: string,
  ): Promise<{ achievements: Achievement[]; completedCourses: CompletedCourse[] }> {
    const [[ex], [qz], [asg], completedCourses] = await Promise.all([
      this.db
        .select({ n: count() })
        .from(studentExercises)
        .where(and(eq(studentExercises.userId, userId), eq(studentExercises.status, 'PASSED'))),
      this.db
        .select({ n: countDistinct(quizAttempts.quizId) })
        .from(quizAttempts)
        .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.passed, true))),
      this.db
        .select({ n: count() })
        .from(submissions)
        .where(and(eq(submissions.userId, userId), inArray(submissions.status, [...GRADED]))),
      this.completedCourses(userId),
    ]);

    const achievements: Achievement[] = [];
    if ((ex?.n ?? 0) >= 1) achievements.push('FIRST_EXERCISE');
    if ((ex?.n ?? 0) >= 10) achievements.push('TEN_EXERCISES');
    if ((qz?.n ?? 0) >= 5) achievements.push('QUIZ_MASTER');
    if ((asg?.n ?? 0) >= 1) achievements.push('FIRST_GRADED_ASSIGNMENT');
    if (completedCourses.length >= 1) achievements.push('COURSE_COMPLETED');
    return { achievements, completedCourses };
  }

  /** Published courses the user is enrolled in where every lesson is completed. */
  private async completedCourses(userId: string): Promise<CompletedCourse[]> {
    const total = this.db
      .select({ courseId: lessons.courseId, n: count().as('total_n') })
      .from(lessons)
      .groupBy(lessons.courseId)
      .as('total');
    const done = this.db
      .select({
        courseId: lessonProgress.courseId,
        n: count().as('done_n'),
        last: max(lessonProgress.completedAt).as('last_at'),
      })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.status, 'COMPLETED')))
      .groupBy(lessonProgress.courseId)
      .as('done');

    const rows = await this.db
      .select({ title: courses.title, completedAt: done.last })
      .from(enrollments)
      .innerJoin(courses, eq(courses.id, enrollments.courseId))
      .innerJoin(total, eq(total.courseId, enrollments.courseId))
      .innerJoin(done, eq(done.courseId, enrollments.courseId))
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(courses.status, 'PUBLISHED'),
          sql`${done.n} >= ${total.n}`,
        ),
      )
      .orderBy(desc(done.last));
    return rows.map((r) => ({
      title: r.title,
      completedAt: toIso(r.completedAt),
    }));
  }
}

function toProfile(p: PortfolioRow): PortfolioProfile {
  return {
    slug: p.slug,
    displayName: p.displayName,
    headline: p.headline,
    bio: p.bio,
    skills: p.skills,
    isPublished: p.isPublished,
    publishedAt: p.publishedAt?.toISOString() ?? null,
  };
}

function toItem(r: ItemRow): PortfolioItemSummary {
  return {
    id: r.id,
    kind: r.kind,
    title: r.title,
    description: r.description,
    courseTitle: r.courseTitle,
    position: r.position,
    addedAt: r.createdAt.toISOString(),
  };
}

/** Aggregates over timestamptz come back as strings from some drivers. */
function toIso(v: Date | string | null): string {
  if (!v) return new Date(0).toISOString();
  return (v instanceof Date ? v : new Date(v)).toISOString();
}

function isUniqueViolation(err: unknown): boolean {
  const code = (e: unknown) =>
    typeof e === 'object' && e !== null && 'code' in e ? (e as { code: unknown }).code : undefined;
  return code(err) === '23505' || code((err as { cause?: unknown } | null)?.cause) === '23505';
}
