import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { and, asc, count, eq, inArray, max, sql } from 'drizzle-orm';
import {
  progressPercent,
  slugCandidate,
  slugify,
  type SlugSuggestion,
  type CourseStructure,
  type CourseSummary,
  type CreateCourseInput,
  type CreateLessonInput,
  type CreateModuleInput,
  type UpdateCourseInput,
  type UpdateLessonInput,
  type UpdateModuleInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  courseSlugRedirects,
  courses,
  courseTeachers,
  enrollments,
  lessonProgress,
  lessons,
  modules,
} from '../db/schema';
import { CourseAccessService } from './course-access.service';

/** How many "-n" variants are tried before giving up (a real catalogue never gets close). */
const SLUG_TRIES = 200;

const slugLock = (orgId: string) =>
  sql`select pg_advisory_xact_lock(hashtext(${`course-slugs:${orgId}`}))`;

@Injectable()
export class CoursesService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly audit: AuditService,
  ) {}

  async list(auth: AuthContext, m: MembershipContext): Promise<CourseSummary[]> {
    const db = this.dbs.db;
    const base = {
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      description: courses.description,
      status: courses.status,
    };

    if (m.role === 'STUDENT') {
      const rows = await db
        .select(base)
        .from(courses)
        .where(and(eq(courses.organizationId, m.organizationId), eq(courses.status, 'PUBLISHED')))
        .orderBy(asc(courses.position), asc(courses.title));
      if (!rows.length) return [];
      const ids = rows.map((r) => r.id);
      const enrolled = new Set(
        (
          await db
            .select({ courseId: enrollments.courseId })
            .from(enrollments)
            .where(and(eq(enrollments.userId, auth.userId), inArray(enrollments.courseId, ids)))
        ).map((e) => e.courseId),
      );
      const totals = new Map(
        (
          await db
            .select({ courseId: lessons.courseId, n: count() })
            .from(lessons)
            .where(inArray(lessons.courseId, ids))
            .groupBy(lessons.courseId)
        ).map((r) => [r.courseId, r.n]),
      );
      const done = new Map(
        (
          await db
            .select({ courseId: lessonProgress.courseId, n: count() })
            .from(lessonProgress)
            .where(
              and(
                eq(lessonProgress.userId, auth.userId),
                eq(lessonProgress.status, 'COMPLETED'),
                inArray(lessonProgress.courseId, ids),
              ),
            )
            .groupBy(lessonProgress.courseId)
        ).map((r) => [r.courseId, r.n]),
      );
      return rows.map((r) => ({
        ...r,
        enrolled: enrolled.has(r.id),
        progressPercent: progressPercent(done.get(r.id) ?? 0, totals.get(r.id) ?? 0),
      }));
    }

    const rows = await db
      .select(base)
      .from(courses)
      .where(eq(courses.organizationId, m.organizationId))
      .orderBy(asc(courses.position), asc(courses.title));
    if (m.role === 'ORG_ADMIN') return rows.map((r) => ({ ...r, canManage: true }));
    const mine = new Set(
      (
        await db
          .select({ courseId: courseTeachers.courseId })
          .from(courseTeachers)
          .where(eq(courseTeachers.userId, auth.userId))
      ).map((r) => r.courseId),
    );
    return rows.map((r) => ({ ...r, canManage: mine.has(r.id) }));
  }

  async create(auth: AuthContext, m: MembershipContext, input: CreateCourseInput) {
    const base = input.slug ?? (slugify(input.title) || 'kurs');
    const created = await this.dbs.db.transaction(async (tx) => {
      // Serializes slug allocation in the organization: two "HTML" courses created at once
      // get "html" and "html-2", not a unique-index error.
      await tx.execute(slugLock(m.organizationId));
      const slug = await this.freeSlug(tx, m.organizationId, base);
      if (!slug) return null;
      const [course] = await tx
        .insert(courses)
        .values({
          title: input.title,
          description: input.description,
          slug,
          organizationId: m.organizationId,
          createdBy: auth.userId,
        })
        .returning({ id: courses.id });
      await tx.insert(courseTeachers).values({ courseId: course!.id, userId: auth.userId });
      return course!;
    });
    if (!created) throw new ConflictException('Bu slug bilan kurs allaqachon mavjud');
    await this.audit.record({
      action: 'course.create',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course',
      targetId: created.id,
    });
    return this.structure(auth, m, created.id);
  }

  /** Slugs (of `candidates`) used by another course now or in the past. */
  private async takenSlugs(db: Db, orgId: string, candidates: string[], exceptCourseId?: string) {
    const other = (col: typeof courses.id | typeof courseSlugRedirects.courseId) =>
      exceptCourseId ? sql`${col} <> ${exceptCourseId}` : sql`true`;
    const [live, old] = await Promise.all([
      db
        .select({ slug: courses.slug })
        .from(courses)
        .where(
          and(
            eq(courses.organizationId, orgId),
            inArray(courses.slug, candidates),
            other(courses.id),
          ),
        ),
      db
        .select({ slug: courseSlugRedirects.slug })
        .from(courseSlugRedirects)
        .where(
          and(
            eq(courseSlugRedirects.organizationId, orgId),
            inArray(courseSlugRedirects.slug, candidates),
            other(courseSlugRedirects.courseId),
          ),
        ),
    ]);
    return new Set([...live, ...old].map((r) => r.slug));
  }

  /** `base`, else the first free "base-2", "base-3"… (null if all tries are taken). */
  private async freeSlug(db: Db, orgId: string, base: string, exceptCourseId?: string) {
    for (let start = 1; start <= SLUG_TRIES; start += 50) {
      const candidates = Array.from({ length: 50 }, (_, i) => slugCandidate(base, start + i));
      const taken = await this.takenSlugs(db, orgId, candidates, exceptCourseId);
      const free = candidates.find((c) => !taken.has(c));
      if (free) return free;
    }
    return null;
  }

  /** Live preview for the course form: the slug the server would give right now. */
  async suggestSlug(
    m: MembershipContext,
    q: { title?: string; slug?: string; courseId?: string },
  ): Promise<SlugSuggestion> {
    const requested = q.slug ?? slugify(q.title ?? '');
    if (!requested) return { requested: '', slug: '', available: false };
    const db = this.dbs.db;
    const taken = await this.takenSlugs(db, m.organizationId, [requested], q.courseId);
    const available = !taken.has(requested);
    const slug = available
      ? requested
      : ((await this.freeSlug(db, m.organizationId, requested, q.courseId)) ?? '');
    return { requested, slug, available };
  }

  async update(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    input: UpdateCourseInput,
  ) {
    const before = await this.access.manageableCourse(auth, m, courseId);
    // The catalogue order is organization-wide: a teacher must not push their course first.
    if (input.position !== undefined && m.role !== 'ORG_ADMIN') {
      throw new ForbiddenException('Kurslar tartibini faqat administrator o‘zgartiradi');
    }
    const slugChanged = input.slug !== undefined && input.slug !== before.slug;
    await this.dbs.db.transaction(async (tx) => {
      if (slugChanged) {
        await tx.execute(slugLock(m.organizationId));
        const taken = await this.takenSlugs(tx, m.organizationId, [input.slug!], courseId);
        if (taken.size > 0) {
          throw new ConflictException({
            statusCode: 409,
            code: 'SLUG_TAKEN',
            message: 'Bu manzil boshqa kursda band (yoki avval ishlatilgan)',
          });
        }
        // Taking back one of its own former slugs: that redirect is no longer needed.
        await tx
          .delete(courseSlugRedirects)
          .where(
            and(
              eq(courseSlugRedirects.organizationId, m.organizationId),
              eq(courseSlugRedirects.slug, input.slug!),
            ),
          );
        // Links to a published course may be out in the world: keep the old slug redirecting.
        if (before.status === 'PUBLISHED') {
          await tx
            .insert(courseSlugRedirects)
            .values({ organizationId: m.organizationId, slug: before.slug, courseId })
            .onConflictDoNothing();
        }
      }
      await tx
        .update(courses)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(courses.id, courseId));
    });
    if (slugChanged) {
      await this.audit.record({
        action: 'course.slug_change',
        actorUserId: auth.userId,
        organizationId: m.organizationId,
        targetType: 'course',
        targetId: courseId,
        metadata: { from: before.slug, to: input.slug, redirect: before.status === 'PUBLISHED' },
      });
    }
    if (input.status && input.status !== before.status) {
      await this.audit.record({
        action: 'course.status_change',
        actorUserId: auth.userId,
        organizationId: m.organizationId,
        targetType: 'course',
        targetId: courseId,
        metadata: { from: before.status, to: input.status },
      });
    }
    return this.structure(auth, m, courseId);
  }

  async structure(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
  ): Promise<CourseStructure> {
    const course = await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const mods = await db
      .select({ id: modules.id, title: modules.title, position: modules.position })
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(asc(modules.position), asc(modules.createdAt));
    const less = await db
      .select({
        id: lessons.id,
        moduleId: lessons.moduleId,
        title: lessons.title,
        position: lessons.position,
        contentLength: sql<number>`char_length(${lessons.content})`.mapWith(Number),
      })
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.position), asc(lessons.createdAt));
    return {
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        status: course.status,
      },
      modules: mods.map((mod) => ({
        ...mod,
        lessons: less.filter((l) => l.moduleId === mod.id).map(({ moduleId: _, ...l }) => l),
      })),
    };
  }

  async createModule(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    input: CreateModuleInput,
  ) {
    await this.access.manageableCourse(auth, m, courseId);
    const position =
      input.position ?? (await this.nextPosition(modules, modules.courseId, courseId));
    const [row] = await this.dbs.db
      .insert(modules)
      .values({ courseId, title: input.title, position })
      .returning({ id: modules.id, title: modules.title, position: modules.position });
    return row!;
  }

  async updateModule(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    moduleId: string,
    input: UpdateModuleInput,
  ) {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.moduleInCourse(courseId, moduleId);
    const [row] = await this.dbs.db
      .update(modules)
      .set(input)
      .where(eq(modules.id, moduleId))
      .returning({ id: modules.id, title: modules.title, position: modules.position });
    return row!;
  }

  async createLesson(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    moduleId: string,
    input: CreateLessonInput,
  ) {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.moduleInCourse(courseId, moduleId);
    const position =
      input.position ?? (await this.nextPosition(lessons, lessons.moduleId, moduleId));
    const [row] = await this.dbs.db
      .insert(lessons)
      .values({ courseId, moduleId, title: input.title, content: input.content, position })
      .returning({ id: lessons.id, title: lessons.title, position: lessons.position });
    return row!;
  }

  async getLessonForEdit(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    lessonId: string,
  ) {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    const [row] = await this.dbs.db
      .select({
        id: lessons.id,
        moduleId: lessons.moduleId,
        title: lessons.title,
        content: lessons.content,
        position: lessons.position,
      })
      .from(lessons)
      .where(eq(lessons.id, lessonId));
    return row!;
  }

  async updateLesson(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    lessonId: string,
    input: UpdateLessonInput,
  ) {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    const [row] = await this.dbs.db
      .update(lessons)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(lessons.id, lessonId))
      .returning({ id: lessons.id, title: lessons.title, position: lessons.position });
    return row!;
  }

  private async nextPosition(
    table: typeof modules | typeof lessons,
    parentColumn: typeof modules.courseId | typeof lessons.moduleId,
    parentId: string,
  ): Promise<number> {
    const [row] = await this.dbs.db
      .select({ max: max(table.position) })
      .from(table)
      .where(eq(parentColumn, parentId));
    return row?.max === null || row?.max === undefined ? 0 : row.max + 1;
  }
}
