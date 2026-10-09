import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import type { CourseStatus } from '@webdizayn/shared';
import type { AuthContext, MembershipContext } from '../common/types';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import { courses, courseTeachers, lessons, modules } from '../db/schema';

export interface CourseRow {
  id: string;
  organizationId: string;
  slug: string;
  title: string;
  description: string;
  status: CourseStatus;
}

export interface OrderedLesson {
  id: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
}

/**
 * Every course-scoped lookup goes through here so that IDs from the URL are always
 * re-bound to the organization (and course) they claim to belong to.
 */
@Injectable()
export class CourseAccessService {
  constructor(private readonly dbs: DbService) {}

  async courseInOrg(orgId: string, courseId: string): Promise<CourseRow> {
    const [row] = await this.dbs.db
      .select({
        id: courses.id,
        organizationId: courses.organizationId,
        slug: courses.slug,
        title: courses.title,
        description: courses.description,
        status: courses.status,
      })
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.organizationId, orgId)))
      .limit(1);
    if (!row) throw new NotFoundException('Kurs topilmadi');
    return row;
  }

  async canManage(auth: AuthContext, m: MembershipContext, courseId: string): Promise<boolean> {
    if (m.role === 'ORG_ADMIN') return true;
    if (m.role !== 'TEACHER') return false;
    const [row] = await this.dbs.db
      .select({ courseId: courseTeachers.courseId })
      .from(courseTeachers)
      .where(and(eq(courseTeachers.courseId, courseId), eq(courseTeachers.userId, auth.userId)))
      .limit(1);
    return Boolean(row);
  }

  /** Course must be in the org and the caller must be allowed to edit it. */
  async manageableCourse(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
  ): Promise<CourseRow> {
    const course = await this.courseInOrg(m.organizationId, courseId);
    if (!(await this.canManage(auth, m, courseId))) {
      throw new ForbiddenException("Bu kursni tahrirlashga ruxsat yo'q");
    }
    return course;
  }

  /** Learners only ever see published courses; drafts and archives are hidden as 404. */
  async publishedCourse(orgId: string, courseId: string): Promise<CourseRow> {
    const course = await this.courseInOrg(orgId, courseId);
    if (course.status !== 'PUBLISHED') throw new NotFoundException('Kurs topilmadi');
    return course;
  }

  async moduleInCourse(courseId: string, moduleId: string) {
    const [row] = await this.dbs.db
      .select({ id: modules.id })
      .from(modules)
      .where(and(eq(modules.id, moduleId), eq(modules.courseId, courseId)))
      .limit(1);
    if (!row) throw new NotFoundException('Modul topilmadi');
    return row;
  }

  async lessonInCourse(courseId: string, lessonId: string) {
    const [row] = await this.dbs.db
      .select({ id: lessons.id, moduleId: lessons.moduleId })
      .from(lessons)
      .where(and(eq(lessons.id, lessonId), eq(lessons.courseId, courseId)))
      .limit(1);
    if (!row) throw new NotFoundException('Dars topilmadi');
    return row;
  }

  /**
   * Canonical lesson order: module position, then lesson position; creation time breaks ties.
   * Pass the transaction handle when called inside one.
   */
  orderedLessons(courseId: string, db: Db = this.dbs.db): Promise<OrderedLesson[]> {
    return db
      .select({
        id: lessons.id,
        title: lessons.title,
        moduleId: modules.id,
        moduleTitle: modules.title,
      })
      .from(lessons)
      .innerJoin(modules, eq(modules.id, lessons.moduleId))
      .where(eq(lessons.courseId, courseId))
      .orderBy(
        asc(modules.position),
        asc(modules.createdAt),
        asc(lessons.position),
        asc(lessons.createdAt),
      );
  }
}
