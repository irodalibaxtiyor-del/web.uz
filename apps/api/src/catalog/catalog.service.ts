import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CATALOG_SLUG_RE,
  type CourseCounts,
  type CourseMoved,
  type DirectionDetail,
  type DirectionSummary,
  type PublicCourseDetail,
  type PublicCourseSummary,
} from '@webdizayn/shared';
import { and, asc, count, eq, inArray } from 'drizzle-orm';
import { APP_CONFIG, type AppConfig } from '../config';
import { DbService } from '../db/db.module';
import {
  courseDirections,
  courseSlugRedirects,
  courses,
  directions,
  exercises,
  lessons,
  modules,
  organizations,
  quizzes,
} from '../db/schema';

const NOT_FOUND = 'Sahifa topilmadi';

const validSlug = (slug: string) => slug.length <= 80 && CATALOG_SLUG_RE.test(slug);

/**
 * Public, read-only catalogue: directions and the PUBLISHED courses of the platform (default)
 * organization. Exposes titles, descriptions and counts only — never lesson bodies, exercises,
 * CHECK rules, quiz answers or anything about learners.
 */
@Injectable()
export class CatalogService {
  constructor(
    private readonly dbs: DbService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  private get db() {
    return this.dbs.db;
  }

  private async platformOrgId(): Promise<string | null> {
    const [org] = await this.db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, this.config.DEFAULT_ORG_SLUG));
    return org?.id ?? null;
  }

  /** Published platform courses linked to the given directions, in catalogue order. */
  private async linkedCourses(orgId: string, directionIds: string[]) {
    if (directionIds.length === 0) return [];
    return this.db
      .select({
        directionId: courseDirections.directionId,
        id: courses.id,
        slug: courses.slug,
        title: courses.title,
        description: courses.description,
      })
      .from(courseDirections)
      .innerJoin(courses, eq(courses.id, courseDirections.courseId))
      .where(
        and(
          inArray(courseDirections.directionId, directionIds),
          eq(courses.organizationId, orgId),
          eq(courses.status, 'PUBLISHED'),
        ),
      )
      .orderBy(asc(courses.position), asc(courses.title));
  }

  private async counts(courseIds: string[]): Promise<Map<string, CourseCounts>> {
    const out = new Map<string, CourseCounts>();
    for (const id of courseIds) out.set(id, { modules: 0, lessons: 0, exercises: 0, quizzes: 0 });
    if (courseIds.length === 0) return out;
    const [m, l, e, q] = await Promise.all([
      this.db
        .select({ id: modules.courseId, n: count() })
        .from(modules)
        .where(inArray(modules.courseId, courseIds))
        .groupBy(modules.courseId),
      this.db
        .select({ id: lessons.courseId, n: count() })
        .from(lessons)
        .where(inArray(lessons.courseId, courseIds))
        .groupBy(lessons.courseId),
      this.db
        .select({ id: exercises.courseId, n: count() })
        .from(exercises)
        .where(and(inArray(exercises.courseId, courseIds), eq(exercises.isActive, true)))
        .groupBy(exercises.courseId),
      this.db
        .select({ id: quizzes.courseId, n: count() })
        .from(quizzes)
        .where(and(inArray(quizzes.courseId, courseIds), eq(quizzes.isActive, true)))
        .groupBy(quizzes.courseId),
    ]);
    for (const r of m) out.get(r.id)!.modules = r.n;
    for (const r of l) out.get(r.id)!.lessons = r.n;
    for (const r of e) out.get(r.id)!.exercises = r.n;
    for (const r of q) out.get(r.id)!.quizzes = r.n;
    return out;
  }

  async directions(): Promise<DirectionSummary[]> {
    const rows = await this.db
      .select({
        id: directions.id,
        slug: directions.slug,
        title: directions.title,
        summary: directions.summary,
      })
      .from(directions)
      .orderBy(asc(directions.position), asc(directions.title));
    const orgId = await this.platformOrgId();
    const linked = orgId
      ? await this.linkedCourses(
          orgId,
          rows.map((r) => r.id),
        )
      : [];
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      courseCount: linked.filter((c) => c.directionId === r.id).length,
    }));
  }

  async direction(slug: string): Promise<DirectionDetail> {
    if (!validSlug(slug)) throw new NotFoundException(NOT_FOUND);
    const [d] = await this.db.select().from(directions).where(eq(directions.slug, slug));
    if (!d) throw new NotFoundException(NOT_FOUND);
    const orgId = await this.platformOrgId();
    const linked = orgId ? await this.linkedCourses(orgId, [d.id]) : [];
    const counts = await this.counts(linked.map((c) => c.id));
    return {
      slug: d.slug,
      title: d.title,
      summary: d.summary,
      description: d.description,
      courses: linked.map((c): PublicCourseSummary => ({
        slug: c.slug,
        title: c.title,
        description: c.description,
        counts: counts.get(c.id)!,
      })),
    };
  }

  /** A former slug of a published course → its current slug (the page redirects permanently). */
  private async movedTo(orgId: string, slug: string): Promise<string | null> {
    const [row] = await this.db
      .select({ slug: courses.slug })
      .from(courseSlugRedirects)
      .innerJoin(courses, eq(courses.id, courseSlugRedirects.courseId))
      .where(
        and(
          eq(courseSlugRedirects.organizationId, orgId),
          eq(courseSlugRedirects.slug, slug),
          eq(courses.status, 'PUBLISHED'),
        ),
      );
    return row?.slug ?? null;
  }

  async course(slug: string): Promise<PublicCourseDetail | CourseMoved> {
    if (!validSlug(slug)) throw new NotFoundException(NOT_FOUND);
    const orgId = await this.platformOrgId();
    if (!orgId) throw new NotFoundException(NOT_FOUND);
    const [c] = await this.db
      .select({
        id: courses.id,
        slug: courses.slug,
        title: courses.title,
        description: courses.description,
      })
      .from(courses)
      .where(
        and(
          eq(courses.organizationId, orgId),
          eq(courses.slug, slug),
          eq(courses.status, 'PUBLISHED'),
        ),
      );
    if (!c) {
      const moved = await this.movedTo(orgId, slug);
      if (moved) return { movedTo: moved };
      throw new NotFoundException(NOT_FOUND);
    }

    const [mods, less, dirs, counts] = await Promise.all([
      this.db
        .select({ id: modules.id, title: modules.title })
        .from(modules)
        .where(eq(modules.courseId, c.id))
        .orderBy(asc(modules.position), asc(modules.createdAt)),
      this.db
        .select({ moduleId: lessons.moduleId, title: lessons.title })
        .from(lessons)
        .where(eq(lessons.courseId, c.id))
        .orderBy(asc(lessons.position), asc(lessons.createdAt)),
      this.db
        .select({ slug: directions.slug, title: directions.title })
        .from(courseDirections)
        .innerJoin(directions, eq(directions.id, courseDirections.directionId))
        .where(eq(courseDirections.courseId, c.id))
        .orderBy(asc(directions.position)),
      this.counts([c.id]),
    ]);

    return {
      id: c.id,
      organizationId: orgId,
      slug: c.slug,
      title: c.title,
      description: c.description,
      counts: counts.get(c.id)!,
      directions: dirs,
      modules: mods.map((m) => ({
        title: m.title,
        lessons: less.filter((l) => l.moduleId === m.id).map((l) => l.title),
      })),
    };
  }
}
