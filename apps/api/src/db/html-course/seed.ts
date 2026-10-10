import { and, eq, inArray } from 'drizzle-orm';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  LESSON_CONTENT_MAX,
  createExerciseSchema,
  createQuizSchema,
  type CreateExerciseInput,
  type CreateQuizInput,
} from '@webdizayn/shared';
import type { Db } from '../client';
import {
  courseTeachers,
  courses,
  exercises,
  lessons,
  memberships,
  modules,
  quizzes,
} from '../schema';
import { HTML_COURSE, HTML_MODULES } from './manifest';

/** Works from both `src/db/html-course` and `dist/db/html-course`. */
export const HTML_CONTENT_DIR = join(__dirname, '..', '..', '..', 'content', 'html-course');

export interface PreparedLesson {
  slug: string;
  title: string;
  content: string;
  exercise: CreateExerciseInput | null;
  quiz: CreateQuizInput | null;
}

export interface PreparedModule {
  title: string;
  lessons: PreparedLesson[];
}

/**
 * Reads lesson bodies and validates the whole manifest with the same schemas the API uses.
 * Throws a single error listing every problem so content mistakes surface before any write.
 */
export function prepareHtmlCourse(contentDir = HTML_CONTENT_DIR): PreparedModule[] {
  const problems: string[] = [];
  const slugs = new Set<string>();

  const prepared = HTML_MODULES.map((m) => ({
    title: m.title,
    lessons: m.lessons.map((l): PreparedLesson => {
      if (slugs.has(l.slug)) problems.push(`${l.slug}: duplicate slug`);
      slugs.add(l.slug);

      const file = join(contentDir, `${l.slug}.md`);
      let content = '';
      if (!existsSync(file)) problems.push(`${l.slug}: missing ${l.slug}.md`);
      else content = readFileSync(file, 'utf8').trim();
      if (existsSync(file) && content.length === 0) problems.push(`${l.slug}: empty lesson`);
      if (content.length > LESSON_CONTENT_MAX) problems.push(`${l.slug}: lesson too long`);

      let exercise: CreateExerciseInput | null = null;
      if (l.exercise) {
        const r = createExerciseSchema.safeParse({ ...l.exercise, isActive: true, position: 0 });
        if (r.success) exercise = r.data;
        else problems.push(`${l.slug}: exercise ${r.error.message}`);
        if (l.exercise.checks.length === 0) problems.push(`${l.slug}: exercise without checks`);
      }

      let quiz: CreateQuizInput | null = null;
      if (l.quiz) {
        const r = createQuizSchema.safeParse({ ...l.quiz, isActive: true, position: 0 });
        if (r.success) quiz = r.data;
        else problems.push(`${l.slug}: quiz ${r.error.message}`);
      }

      return { slug: l.slug, title: l.title, content, exercise, quiz };
    }),
  }));

  if (problems.length > 0)
    throw new Error(`HTML course manifest is invalid:\n${problems.join('\n')}`);
  return prepared;
}

export interface SeedHtmlCourseOptions {
  organizationId: string;
  teacherId: string;
  /** Deletes an existing course with the same slug (and all student progress in it) first. */
  replace?: boolean;
  contentDir?: string;
}

export interface SeedHtmlCourseResult {
  courseId: string;
  modules: number;
  lessons: number;
  exercises: number;
  quizzes: number;
  replaced: boolean;
}

export class HtmlCourseExistsError extends Error {
  constructor() {
    super(`Course "${HTML_COURSE.slug}" already exists; rerun with --replace to recreate it`);
  }
}

/** Creates the published HTML course in one transaction. */
export async function seedHtmlCourse(
  db: Db,
  opts: SeedHtmlCourseOptions,
): Promise<SeedHtmlCourseResult> {
  const prepared = prepareHtmlCourse(opts.contentDir);

  return db.transaction(async (tx) => {
    const [teacher] = await tx
      .select({ role: memberships.role })
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, opts.teacherId),
          eq(memberships.organizationId, opts.organizationId),
          inArray(memberships.role, ['TEACHER', 'ORG_ADMIN']),
        ),
      );
    if (!teacher)
      throw new Error('Course owner must be a TEACHER or ORG_ADMIN of the organization');

    const [existing] = await tx
      .select({ id: courses.id })
      .from(courses)
      .where(
        and(eq(courses.organizationId, opts.organizationId), eq(courses.slug, HTML_COURSE.slug)),
      )
      .for('update');
    if (existing && !opts.replace) throw new HtmlCourseExistsError();
    if (existing) await tx.delete(courses).where(eq(courses.id, existing.id));

    const [course] = await tx
      .insert(courses)
      .values({
        organizationId: opts.organizationId,
        slug: HTML_COURSE.slug,
        title: HTML_COURSE.title,
        description: HTML_COURSE.description,
        status: 'PUBLISHED',
        createdBy: opts.teacherId,
      })
      .returning({ id: courses.id });
    const courseId = course!.id;
    await tx.insert(courseTeachers).values({ courseId, userId: opts.teacherId });

    const result: SeedHtmlCourseResult = {
      courseId,
      modules: 0,
      lessons: 0,
      exercises: 0,
      quizzes: 0,
      replaced: Boolean(existing),
    };

    for (const [mi, m] of prepared.entries()) {
      const [mod] = await tx
        .insert(modules)
        .values({ courseId, title: m.title, position: mi })
        .returning({ id: modules.id });
      result.modules++;

      for (const [li, l] of m.lessons.entries()) {
        const [lesson] = await tx
          .insert(lessons)
          .values({ courseId, moduleId: mod!.id, title: l.title, content: l.content, position: li })
          .returning({ id: lessons.id });
        result.lessons++;

        if (l.exercise) {
          const e = l.exercise;
          await tx.insert(exercises).values({
            courseId,
            lessonId: lesson!.id,
            title: e.title,
            description: e.description,
            instructions: e.instructions,
            expectedBehavior: e.expectedBehavior,
            starterFiles: e.starterFiles,
            difficulty: e.difficulty,
            position: 0,
            isActive: true,
            checks: e.checks,
          });
          result.exercises++;
        }
        if (l.quiz) {
          const qz = l.quiz;
          await tx.insert(quizzes).values({
            courseId,
            lessonId: lesson!.id,
            title: qz.title,
            description: qz.description,
            questions: qz.questions,
            passingPercent: qz.passingPercent,
            isActive: true,
            position: 0,
          });
          result.quizzes++;
        }
      }
    }
    return result;
  });
}
