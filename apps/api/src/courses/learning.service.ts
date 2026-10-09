import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { and, asc, eq, inArray, max, sql } from 'drizzle-orm';
import {
  computeLessonStates,
  type AssignmentSummary,
  progressPercent,
  type CourseMap,
  type CourseMapLesson,
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
  quizAttempts,
  quizzes,
  studentExercises,
  submissions,
} from '../db/schema';
import { CourseAccessService, type OrderedLesson } from './course-access.service';

export const LOCKED = {
  message: 'Bu dars hali yopiq. Avvalgi darslarni tugating',
  code: 'LESSON_LOCKED',
};
const NOT_ENROLLED = { message: 'Avval kursga yoziling', code: 'NOT_ENROLLED' };
// The code predates quizzes; kept for API compatibility.
const REQUIREMENTS_NOT_MET = {
  message: 'Darsni tugatish uchun barcha mashq va testlardan o‘ting',
  code: 'EXERCISES_REQUIRED',
};

type LessonItems = Pick<CourseMapLesson, 'exercises' | 'quizzes' | 'assignments'>;
const EMPTY_ITEMS: LessonItems = { exercises: [], quizzes: [], assignments: [] };

const requirementsMet = (it: LessonItems) =>
  it.exercises.every((e) => e.status === 'PASSED') &&
  it.quizzes.every((q) => q.status === 'PASSED');

/** An open lesson with work to fix is shown as NEEDS_IMPROVEMENT; access is unchanged. */
function decorate(state: LessonState, it: LessonItems): LessonState {
  if (state !== 'AVAILABLE' && state !== 'IN_PROGRESS') return state;
  const fix =
    it.exercises.some((e) => e.status === 'NEEDS_IMPROVEMENT') ||
    it.quizzes.some((q) => q.status === 'FAILED');
  return fix ? 'NEEDS_IMPROVEMENT' : state;
}

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
    const db = this.dbs.db;
    await this.requireEnrollment(db, auth.userId, courseId);
    const { ordered, states } = await this.states(db, auth.userId, courseId);
    const items = await this.items(db, auth.userId, { courseId });

    const modulesOut: CourseMap['modules'] = [];
    const stats: CourseMap['stats'] = {
      lessons: { done: 0, total: ordered.length },
      exercises: { done: 0, total: 0 },
      quizzes: { done: 0, total: 0 },
      assignments: { done: 0, total: 0 },
    };
    for (const l of ordered) {
      let mod = modulesOut.at(-1);
      if (!mod || mod.id !== l.moduleId) {
        mod = { id: l.moduleId, title: l.moduleTitle, lessons: [] };
        modulesOut.push(mod);
      }
      const it = items.get(l.id) ?? EMPTY_ITEMS;
      const state = decorate(states.get(l.id)!, it);
      mod.lessons.push({ id: l.id, title: l.title, state, ...it });
      if (state === 'COMPLETED') stats.lessons.done++;
      stats.exercises.total += it.exercises.length;
      stats.exercises.done += it.exercises.filter((e) => e.status === 'PASSED').length;
      stats.quizzes.total += it.quizzes.length;
      stats.quizzes.done += it.quizzes.filter((q) => q.status === 'PASSED').length;
      stats.assignments.total += it.assignments.length;
      stats.assignments.done += it.assignments.filter(
        (a) => a.submissionStatus === 'GRADED' || a.submissionStatus === 'FINALIZED',
      ).length;
    }
    return {
      course: { id: course.id, title: course.title, description: course.description },
      modules: modulesOut,
      completedLessons: stats.lessons.done,
      totalLessons: ordered.length,
      progressPercent: progressPercent(stats.lessons.done, ordered.length),
      stats,
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
    const it = (await this.items(db, auth.userId, { lessonId })).get(lessonId) ?? EMPTY_ITEMS;
    const idx = ordered.findIndex((l) => l.id === lessonId);
    const next = ordered[idx + 1];
    return {
      id: lessonId,
      title: row!.title,
      content: row!.content,
      state: decorate(state, it) as LessonView['state'],
      moduleTitle: ordered[idx]!.moduleTitle,
      prevLessonId: ordered[idx - 1]?.id ?? null,
      // Only reveal the next lesson's id once it is reachable.
      nextLessonId: next && state === 'COMPLETED' ? next.id : null,
      ...it,
    };
  }

  /**
   * Manual completion. Allowed only for accessible lessons whose active exercises and quizzes
   * (if any) are all PASSED. Lessons with requirements normally complete automatically.
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
      const it = (await this.items(db, auth.userId, { lessonId })).get(lessonId) ?? EMPTY_ITEMS;
      if (!requirementsMet(it)) throw new ConflictException(REQUIREMENTS_NOT_MET);
      await this.markCompleted(db, auth.userId, courseId, lessonId);
    });
    return this.map(auth, m, courseId);
  }

  /**
   * Called after an exercise or quiz is passed; completes the lesson once every active
   * exercise and quiz in it has been passed.
   */
  async completeIfRequirementsMet(db: Db, userId: string, courseId: string, lessonId: string) {
    const state = await this.lessonState(db, userId, courseId, lessonId);
    if (state === 'LOCKED' || state === 'COMPLETED') return;
    const it = (await this.items(db, userId, { lessonId })).get(lessonId) ?? EMPTY_ITEMS;
    if (it.exercises.length + it.quizzes.length > 0 && requirementsMet(it)) {
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

  /** Learner-visible exercises, quizzes and assignments per lesson, for one lesson or a course. */
  private async items(
    db: Db,
    userId: string,
    scope: { lessonId: string } | { courseId: string },
  ): Promise<Map<string, LessonItems>> {
    const byLesson = 'lessonId' in scope;
    const id = byLesson ? scope.lessonId : scope.courseId;
    const out = new Map<string, LessonItems>();
    const slot = (lessonId: string) => {
      let it = out.get(lessonId);
      if (!it) out.set(lessonId, (it = { exercises: [], quizzes: [], assignments: [] }));
      return it;
    };

    const ex = await db
      .select({
        lessonId: exercises.lessonId,
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
      .where(
        and(
          byLesson ? eq(exercises.lessonId, id) : eq(exercises.courseId, id),
          eq(exercises.isActive, true),
        ),
      )
      .orderBy(asc(exercises.position), asc(exercises.createdAt));
    for (const { lessonId, status, ...e } of ex) {
      slot(lessonId).exercises.push({ ...e, status: status ?? 'NOT_STARTED' });
    }

    const qs = await db
      .select({ lessonId: quizzes.lessonId, id: quizzes.id, title: quizzes.title })
      .from(quizzes)
      .where(
        and(
          byLesson ? eq(quizzes.lessonId, id) : eq(quizzes.courseId, id),
          eq(quizzes.isActive, true),
        ),
      )
      .orderBy(asc(quizzes.position), asc(quizzes.createdAt));
    const attempts = qs.length
      ? await db
          .select({
            quizId: quizAttempts.quizId,
            best: max(quizAttempts.score),
            passed: sql<boolean>`bool_or(${quizAttempts.passed})`,
          })
          .from(quizAttempts)
          .where(
            and(
              eq(quizAttempts.userId, userId),
              inArray(
                quizAttempts.quizId,
                qs.map((q) => q.id),
              ),
            ),
          )
          .groupBy(quizAttempts.quizId)
      : [];
    const byQuiz = new Map(attempts.map((a) => [a.quizId, a]));
    for (const q of qs) {
      const a = byQuiz.get(q.id);
      slot(q.lessonId).quizzes.push({
        id: q.id,
        title: q.title,
        status: !a ? 'NOT_STARTED' : a.passed ? 'PASSED' : 'FAILED',
        bestScore: a?.best ?? null,
      });
    }

    // Published and closed assignments only; drafts stay invisible to learners.
    const as = await db
      .select({
        lessonId: assignments.lessonId,
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
          byLesson ? eq(assignments.lessonId, id) : eq(assignments.courseId, id),
          inArray(assignments.status, ['PUBLISHED', 'CLOSED']),
        ),
      )
      .orderBy(asc(assignments.position), asc(assignments.createdAt));
    for (const a of as) {
      slot(a.lessonId).assignments.push({
        id: a.id,
        title: a.title,
        deadline: a.deadline?.toISOString() ?? null,
        status: a.status as AssignmentSummary['status'],
        submissionStatus: a.submissionStatus,
      });
    }
    return out;
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
