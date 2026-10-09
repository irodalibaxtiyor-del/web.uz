import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { and, asc, eq, inArray } from 'drizzle-orm';
import {
  computeLessonStates,
  type AssignmentSummary,
  progressPercent,
  type CourseMap,
  type ExerciseSummary,
  type LessonState,
  type LessonView,
  type ProgressStatus,
} from '@webdizayn/shared';
import type { AuthContext, MembershipContext } from '../common/types';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  assignments,
  enrollments,
  exercises,
  lessonProgress,
  lessons,
  studentExercises,
  submissions,
} from '../db/schema';
import { CourseAccessService, type OrderedLesson } from './course-access.service';

export const LOCKED = {
  message: 'Bu dars hali yopiq. Avvalgi darslarni tugating',
  code: 'LESSON_LOCKED',
};
const NOT_ENROLLED = { message: 'Avval kursga yoziling', code: 'NOT_ENROLLED' };
const EXERCISES_REQUIRED = {
  message: 'Darsni tugatish uchun barcha mashqlardan o‘ting',
  code: 'EXERCISES_REQUIRED',
};

@Injectable()
export class LearningService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
  ) {}

  async enroll(auth: AuthContext, m: MembershipContext, courseId: string) {
    await this.access.publishedCourse(m.organizationId, courseId);
    await this.dbs.db
      .insert(enrollments)
      .values({ userId: auth.userId, courseId })
      .onConflictDoNothing();
    return this.map(auth, m, courseId);
  }

  async map(auth: AuthContext, m: MembershipContext, courseId: string): Promise<CourseMap> {
    const course = await this.access.publishedCourse(m.organizationId, courseId);
    await this.requireEnrollment(this.dbs.db, auth.userId, courseId);
    const { ordered, states } = await this.states(this.dbs.db, auth.userId, courseId);

    const modulesOut: CourseMap['modules'] = [];
    for (const l of ordered) {
      let mod = modulesOut.at(-1);
      if (!mod || mod.id !== l.moduleId) {
        mod = { id: l.moduleId, title: l.moduleTitle, lessons: [] };
        modulesOut.push(mod);
      }
      mod.lessons.push({ id: l.id, title: l.title, state: states.get(l.id)! });
    }
    const completed = [...states.values()].filter((s) => s === 'COMPLETED').length;
    return {
      course: { id: course.id, title: course.title, description: course.description },
      modules: modulesOut,
      completedLessons: completed,
      totalLessons: ordered.length,
      progressPercent: progressPercent(completed, ordered.length),
    };
  }

  /** Opening an accessible lesson marks it IN_PROGRESS; locked lessons never return content. */
  async lesson(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    lessonId: string,
  ): Promise<LessonView> {
    await this.access.publishedCourse(m.organizationId, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    const db = this.dbs.db;
    await this.requireEnrollment(db, auth.userId, courseId);
    const { ordered, states } = await this.states(db, auth.userId, courseId);

    let state = states.get(lessonId)!;
    if (state === 'LOCKED') throw new ForbiddenException(LOCKED);
    if (state === 'AVAILABLE') {
      await db
        .insert(lessonProgress)
        .values({ userId: auth.userId, lessonId, courseId, status: 'IN_PROGRESS' })
        .onConflictDoNothing();
      state = 'IN_PROGRESS';
    }

    const [row] = await db
      .select({ title: lessons.title, content: lessons.content })
      .from(lessons)
      .where(eq(lessons.id, lessonId));
    const idx = ordered.findIndex((l) => l.id === lessonId);
    const next = ordered[idx + 1];
    return {
      id: lessonId,
      title: row!.title,
      content: row!.content,
      state,
      moduleTitle: ordered[idx]!.moduleTitle,
      prevLessonId: ordered[idx - 1]?.id ?? null,
      // Only reveal the next lesson's id once it is reachable.
      nextLessonId: next && state === 'COMPLETED' ? next.id : null,
      exercises: await this.exerciseSummaries(db, auth.userId, lessonId),
      assignments: await this.assignmentSummaries(db, auth.userId, lessonId),
    };
  }

  /**
   * Manual completion. Allowed only for accessible lessons whose active exercises (if any)
   * are all PASSED. Lessons with exercises normally complete automatically on the last pass.
   */
  async complete(auth: AuthContext, m: MembershipContext, courseId: string, lessonId: string) {
    await this.access.publishedCourse(m.organizationId, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    await this.dbs.db.transaction(async (tx) => {
      const db = tx as unknown as Db;
      await this.requireEnrollment(db, auth.userId, courseId);
      const state = await this.lessonState(db, auth.userId, courseId, lessonId);
      if (state === 'LOCKED') throw new ForbiddenException(LOCKED);
      if (state === 'COMPLETED') return;
      const summaries = await this.exerciseSummaries(db, auth.userId, lessonId);
      if (summaries.some((e) => e.status !== 'PASSED')) {
        throw new ConflictException(EXERCISES_REQUIRED);
      }
      await this.markCompleted(db, auth.userId, courseId, lessonId);
    });
    return this.map(auth, m, courseId);
  }

  /** Called after an exercise reaches PASSED; completes the lesson when every exercise passed. */
  async completeIfExercisesPassed(db: Db, userId: string, courseId: string, lessonId: string) {
    const state = await this.lessonState(db, userId, courseId, lessonId);
    if (state === 'LOCKED' || state === 'COMPLETED') return;
    const summaries = await this.exerciseSummaries(db, userId, lessonId);
    if (summaries.length && summaries.every((e) => e.status === 'PASSED')) {
      await this.markCompleted(db, userId, courseId, lessonId);
    }
  }

  async requireEnrollment(db: Db, userId: string, courseId: string) {
    const [row] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
      .limit(1);
    if (!row) throw new ForbiddenException(NOT_ENROLLED);
  }

  async lessonState(
    db: Db,
    userId: string,
    courseId: string,
    lessonId: string,
  ): Promise<LessonState> {
    const { states } = await this.states(db, userId, courseId);
    return states.get(lessonId) ?? 'LOCKED';
  }

  async exerciseSummaries(db: Db, userId: string, lessonId: string): Promise<ExerciseSummary[]> {
    const rows = await db
      .select({
        id: exercises.id,
        title: exercises.title,
        difficulty: exercises.difficulty,
        status: studentExercises.status,
      })
      .from(exercises)
      .leftJoin(
        studentExercises,
        and(eq(studentExercises.exerciseId, exercises.id), eq(studentExercises.userId, userId)),
      )
      .where(and(eq(exercises.lessonId, lessonId), eq(exercises.isActive, true)))
      .orderBy(asc(exercises.position), asc(exercises.createdAt));
    return rows.map((r) => ({ ...r, status: r.status ?? 'NOT_STARTED' }));
  }

  /** Published and closed assignments only; drafts stay invisible to learners. */
  private async assignmentSummaries(
    db: Db,
    userId: string,
    lessonId: string,
  ): Promise<AssignmentSummary[]> {
    const rows = await db
      .select({
        id: assignments.id,
        title: assignments.title,
        deadline: assignments.deadline,
        status: assignments.status,
        submissionStatus: submissions.status,
      })
      .from(assignments)
      .leftJoin(
        submissions,
        and(eq(submissions.assignmentId, assignments.id), eq(submissions.userId, userId)),
      )
      .where(
        and(
          eq(assignments.lessonId, lessonId),
          inArray(assignments.status, ['PUBLISHED', 'CLOSED']),
        ),
      )
      .orderBy(asc(assignments.position), asc(assignments.createdAt));
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      deadline: r.deadline?.toISOString() ?? null,
      status: r.status as AssignmentSummary['status'],
      submissionStatus: r.submissionStatus,
    }));
  }

  private async markCompleted(db: Db, userId: string, courseId: string, lessonId: string) {
    const now = new Date();
    await db
      .insert(lessonProgress)
      .values({ userId, lessonId, courseId, status: 'COMPLETED', startedAt: now, completedAt: now })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonId],
        set: { status: 'COMPLETED', completedAt: now },
      });
  }

  private async states(db: Db, userId: string, courseId: string) {
    const ordered: OrderedLesson[] = await this.access.orderedLessons(courseId, db);
    const rows = await db
      .select({ lessonId: lessonProgress.lessonId, status: lessonProgress.status })
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.courseId, courseId)));
    const progress = new Map<string, ProgressStatus>(rows.map((r) => [r.lessonId, r.status]));
    return {
      ordered,
      states: computeLessonStates(
        ordered.map((l) => l.id),
        progress,
      ),
    };
  }
}
