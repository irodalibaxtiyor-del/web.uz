import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, count, countDistinct, desc, eq, gte, inArray, max, sql } from 'drizzle-orm';
import {
  gradeQuiz,
  type CreateQuizInput,
  type QuizAdmin,
  type QuizView,
  type SubmitQuizInput,
  type UpdateQuizInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import { LearningService, LOCKED } from '../courses/learning.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import { quizAttempts, quizzes } from '../db/schema';

type QuizRow = typeof quizzes.$inferSelect;

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_LIMITED = {
  message: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring',
  code: 'QUIZ_RATE_LIMITED',
};

@Injectable()
export class QuizzesService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly learning: LearningService,
    private readonly audit: AuditService,
  ) {}

  // ---- Staff ------------------------------------------------------------

  async create(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    lessonId: string,
    input: CreateQuizInput,
  ): Promise<QuizAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    const db = this.dbs.db;
    let position = input.position;
    if (position === undefined) {
      const [row] = await db
        .select({ max: max(quizzes.position) })
        .from(quizzes)
        .where(eq(quizzes.lessonId, lessonId));
      position = row?.max === null || row?.max === undefined ? 0 : row.max + 1;
    }
    const [created] = await db
      .insert(quizzes)
      .values({ ...input, position, lessonId, courseId })
      .returning();
    await this.audit.record({
      action: 'quiz.create',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'quiz',
      targetId: created!.id,
    });
    return this.toAdmin(created!, new Map());
  }

  async listForLesson(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    lessonId: string,
  ): Promise<QuizAdmin[]> {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    const rows = await this.dbs.db
      .select()
      .from(quizzes)
      .where(eq(quizzes.lessonId, lessonId))
      .orderBy(asc(quizzes.position), asc(quizzes.createdAt));
    const stats = await this.stats(rows.map((r) => r.id));
    return rows.map((r) => this.toAdmin(r, stats));
  }

  async getForEdit(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    quizId: string,
  ): Promise<QuizAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    const q = await this.quizInCourse(this.dbs.db, courseId, quizId);
    return this.toAdmin(q, await this.stats([q.id]));
  }

  async update(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    quizId: string,
    input: UpdateQuizInput,
  ): Promise<QuizAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    const q = await this.quizInCourse(this.dbs.db, courseId, quizId);
    // An active quiz gates its lesson, so it must stay answerable.
    if ((input.isActive ?? q.isActive) && (input.questions ?? q.questions).length === 0) {
      throw new BadRequestException('Faol testda kamida bitta savol bo‘lishi kerak');
    }
    const [row] = await this.dbs.db
      .update(quizzes)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(quizzes.id, q.id))
      .returning();
    return this.toAdmin(row!, await this.stats([q.id]));
  }

  // ---- Student ----------------------------------------------------------

  async view(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    quizId: string,
  ): Promise<QuizView> {
    const q = await this.accessibleQuiz(auth, m, courseId, quizId);
    return this.toView(this.dbs.db, q, auth.userId);
  }

  /** Grades on the server. The response reveals totals only, never which answers are right. */
  async submit(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    quizId: string,
    input: SubmitQuizInput,
  ): Promise<QuizView> {
    const q = await this.accessibleQuiz(auth, m, courseId, quizId);
    const db = this.dbs.db;
    const [recent] = await db
      .select({ n: count() })
      .from(quizAttempts)
      .where(
        and(
          eq(quizAttempts.userId, auth.userId),
          eq(quizAttempts.quizId, q.id),
          gte(quizAttempts.createdAt, new Date(Date.now() - RATE_WINDOW_MS)),
        ),
      );
    if ((recent?.n ?? 0) >= RATE_LIMIT) {
      throw new HttpException(RATE_LIMITED, HttpStatus.TOO_MANY_REQUESTS);
    }
    const result = gradeQuiz(q.questions, input.answers, q.passingPercent);
    await db.transaction(async (tx) => {
      const t = tx as unknown as Db;
      await t.insert(quizAttempts).values({
        quizId: q.id,
        userId: auth.userId,
        courseId,
        answers: input.answers,
        ...result,
      });
      if (result.passed) {
        await this.learning.completeIfRequirementsMet(t, auth.userId, courseId, q.lessonId);
      }
    });
    return this.toView(db, q, auth.userId);
  }

  // ---- Helpers ----------------------------------------------------------

  /** Published course, enrolled learner, active quiz, and its lesson unlocked. */
  private async accessibleQuiz(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    quizId: string,
  ): Promise<QuizRow> {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    const q = await this.quizInCourse(db, courseId, quizId);
    if (!q.isActive) throw new NotFoundException('Test topilmadi');
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const state = await this.learning.lessonState(db, auth.userId, courseId, q.lessonId);
    if (state === 'LOCKED') throw new ForbiddenException(LOCKED);
    return q;
  }

  private async quizInCourse(db: Db, courseId: string, quizId: string) {
    const [row] = await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, quizId), eq(quizzes.courseId, courseId)))
      .limit(1);
    if (!row) throw new NotFoundException('Test topilmadi');
    return row;
  }

  private async stats(ids: string[]) {
    if (ids.length === 0) return new Map<string, { attempted: number; passed: number }>();
    const rows = await this.dbs.db
      .select({
        quizId: quizAttempts.quizId,
        attempted: countDistinct(quizAttempts.userId),
        passed: sql<number>`count(distinct ${quizAttempts.userId}) filter (where ${quizAttempts.passed})`,
      })
      .from(quizAttempts)
      .where(inArray(quizAttempts.quizId, ids))
      .groupBy(quizAttempts.quizId);
    return new Map(
      rows.map((r) => [r.quizId, { attempted: r.attempted, passed: Number(r.passed) }]),
    );
  }

  private async toView(db: Db, q: QuizRow, userId: string): Promise<QuizView> {
    const attempts = await db
      .select({
        correct: quizAttempts.correct,
        total: quizAttempts.total,
        score: quizAttempts.score,
        passed: quizAttempts.passed,
        createdAt: quizAttempts.createdAt,
      })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, q.id)))
      .orderBy(desc(quizAttempts.createdAt));
    const last = attempts[0];
    return {
      id: q.id,
      lessonId: q.lessonId,
      title: q.title,
      description: q.description,
      passingPercent: q.passingPercent,
      // Answers are stripped: only ids, prompts and option texts leave the server.
      questions: q.questions.map((x) => ({
        id: x.id,
        prompt: x.prompt,
        kind: x.kind,
        options: x.options.map((o) => ({ id: o.id, text: o.text })),
      })),
      status:
        attempts.length === 0
          ? 'NOT_STARTED'
          : attempts.some((a) => a.passed)
            ? 'PASSED'
            : 'FAILED',
      bestScore: attempts.length ? Math.max(...attempts.map((a) => a.score)) : null,
      attempts: attempts.length,
      lastAttempt: last ? { ...last, createdAt: last.createdAt.toISOString() } : null,
    };
  }

  private toAdmin(
    q: QuizRow,
    stats: Map<string, { attempted: number; passed: number }>,
  ): QuizAdmin {
    const s = stats.get(q.id);
    return {
      id: q.id,
      lessonId: q.lessonId,
      title: q.title,
      description: q.description,
      questions: q.questions,
      passingPercent: q.passingPercent,
      isActive: q.isActive,
      position: q.position,
      attemptedBy: s?.attempted ?? 0,
      passedBy: s?.passed ?? 0,
    };
  }
}
