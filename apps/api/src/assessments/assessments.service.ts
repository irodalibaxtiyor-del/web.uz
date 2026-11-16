import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, inArray, isNotNull, sql } from 'drizzle-orm';
import {
  ASSESSMENT_GRACE_SECONDS,
  gradeQuiz,
  hakeGain,
  summarizeAssessment,
  toStudentQuestion,
  type AssessmentAdmin,
  type AssessmentKind,
  type AssessmentResultRow,
  type AssessmentResults,
  type AssessmentStudentView,
  type AssessmentSummary,
  type QuizAnswer,
  type UpsertAssessmentInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import { activeSecondsByUser } from '../activity/activity';
import { LearningService } from '../courses/learning.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  assessmentAttempts,
  courseAssessments,
  enrollments,
  groups,
  groupStudents,
  users,
} from '../db/schema';

type AssessmentRow = typeof courseAssessments.$inferSelect;
type AttemptRow = typeof assessmentAttempts.$inferSelect;

const NOT_FOUND = 'Test topilmadi';
const LOCKED = {
  message: 'Talabalar testni boshlagan: savollarni endi o‘zgartirib bo‘lmaydi',
  code: 'ASSESSMENT_LOCKED',
};

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly learning: LearningService,
    private readonly audit: AuditService,
  ) {}

  // ---- Staff ------------------------------------------------------------

  async list(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
  ): Promise<AssessmentAdmin[]> {
    await this.access.manageableCourse(auth, m, courseId);
    const rows = await this.dbs.db
      .select()
      .from(courseAssessments)
      .where(eq(courseAssessments.courseId, courseId));
    const counts = await this.counts(rows.map((r) => r.id));
    return rows
      .sort((a, b) => (a.kind === 'PRETEST' ? -1 : 1) - (b.kind === 'PRETEST' ? -1 : 1))
      .map((r) => this.toAdmin(r, counts.get(r.id)));
  }

  /** Creates or updates the course's test of `kind`. Questions freeze once anyone started. */
  async upsert(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    kind: AssessmentKind,
    input: UpsertAssessmentInput,
  ): Promise<AssessmentAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const row = await db.transaction(async (tx) => {
      const t = tx as unknown as Db;
      const [existing] = await t
        .select()
        .from(courseAssessments)
        .where(and(eq(courseAssessments.courseId, courseId), eq(courseAssessments.kind, kind)))
        .for('update');
      if (!existing) {
        const [created] = await t
          .insert(courseAssessments)
          .values({ ...input, courseId, kind })
          .returning();
        return created!;
      }
      const [{ n } = { n: 0 }] = await t
        .select({ n: sql<number>`count(*)::int` })
        .from(assessmentAttempts)
        .where(eq(assessmentAttempts.assessmentId, existing.id));
      if (n > 0) {
        // The instrument must stay identical for every student; only availability may change.
        const changed =
          canonical(existing.questions) !== canonical(input.questions) ||
          existing.timeLimitMinutes !== input.timeLimitMinutes;
        if (changed) throw new ConflictException(LOCKED);
      }
      const [updated] = await t
        .update(courseAssessments)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(courseAssessments.id, existing.id))
        .returning();
      return updated!;
    });
    await this.audit.record({
      action: 'assessment.save',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course_assessment',
      targetId: row.id,
      metadata: { kind, isOpen: row.isOpen, questions: row.questions.length },
    });
    const counts = await this.counts([row.id]);
    return this.toAdmin(row, counts.get(row.id));
  }

  /** Pre/post comparison for the course, optionally limited to one group. */
  async results(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    groupId?: string,
  ): Promise<AssessmentResults> {
    await this.access.manageableCourse(auth, m, courseId);
    const rows = await this.resultRows(this.dbs.db, m.organizationId, courseId, groupId);
    return summarizeAssessment(rows);
  }

  /** Rows for the results table and the experiment statistics (also used by the export). */
  async resultRows(
    db: Db,
    orgId: string,
    courseId: string,
    groupId?: string,
  ): Promise<
    (AssessmentResultRow & {
      groupId: string | null;
      prePassed: boolean | null;
      postPassed: boolean | null;
    })[]
  > {
    const tests = await db
      .select()
      .from(courseAssessments)
      .where(eq(courseAssessments.courseId, courseId));
    const byKind = new Map(tests.map((t) => [t.kind, t]));
    const learners = await db
      .select({
        userId: users.id,
        name: users.fullName,
        groupId: groupStudents.groupId,
        group: groups.name,
      })
      .from(enrollments)
      .innerJoin(users, eq(users.id, enrollments.userId))
      .leftJoin(
        groupStudents,
        and(eq(groupStudents.userId, users.id), eq(groupStudents.organizationId, orgId)),
      )
      .leftJoin(groups, eq(groups.id, groupStudents.groupId))
      .where(
        and(
          eq(enrollments.courseId, courseId),
          groupId ? eq(groupStudents.groupId, groupId) : undefined,
        ),
      );
    const ids = tests.map((t) => t.id);
    const attempts = ids.length
      ? await db
          .select()
          .from(assessmentAttempts)
          .where(
            and(
              inArray(assessmentAttempts.assessmentId, ids),
              isNotNull(assessmentAttempts.submittedAt),
            ),
          )
      : [];
    const active = await activeSecondsByUser(db, courseId);
    const key = (a: string, u: string) => `${a}:${u}`;
    const att = new Map(attempts.map((a) => [key(a.assessmentId, a.userId), a]));
    const pick = (kind: AssessmentKind, userId: string) => {
      const t = byKind.get(kind);
      return t ? att.get(key(t.id, userId)) : undefined;
    };
    const minutes = (a: AttemptRow | undefined) =>
      a?.submittedAt
        ? Math.round(((a.submittedAt.getTime() - a.startedAt.getTime()) / 60_000) * 10) / 10
        : null;
    const passed = (kind: AssessmentKind, a: AttemptRow | undefined) =>
      a?.score === null || a?.score === undefined
        ? null
        : a.score >= byKind.get(kind)!.passingPercent;
    return learners
      .map((l) => {
        const pre = pick('PRETEST', l.userId);
        const post = pick('POSTTEST', l.userId);
        const preScore = pre?.score ?? null;
        const postScore = post?.score ?? null;
        const both = preScore !== null && postScore !== null;
        return {
          userId: l.userId,
          name: l.name,
          group: l.group,
          groupId: l.groupId,
          pre: preScore,
          post: postScore,
          gain: both ? postScore - preScore : null,
          normalizedGain: both ? hakeGain(preScore, postScore) : null,
          preMinutes: minutes(pre),
          postMinutes: minutes(post),
          activeMinutes: active.has(l.userId)
            ? Math.round((active.get(l.userId)! / 60) * 10) / 10
            : null,
          prePassed: passed('PRETEST', pre),
          postPassed: passed('POSTTEST', post),
        };
      })
      .sort((a, b) => (a.group ?? '').localeCompare(b.group ?? '') || a.name.localeCompare(b.name));
  }

  // ---- Learners -----------------------------------------------------------

  /** Open (or already taken) tests of the course, for the course map. */
  async mine(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
  ): Promise<AssessmentSummary[]> {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const tests = await db
      .select()
      .from(courseAssessments)
      .where(eq(courseAssessments.courseId, courseId));
    const out: AssessmentSummary[] = [];
    for (const t of tests.sort((a) => (a.kind === 'PRETEST' ? -1 : 1))) {
      const a = await this.attemptOf(db, t.id, auth.userId);
      if (!t.isOpen && !a?.submittedAt) continue;
      out.push({
        kind: t.kind,
        title: t.title,
        status: status(a),
        score: a?.submittedAt ? a.score : null,
      });
    }
    return out;
  }

  async view(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    kind: AssessmentKind,
  ): Promise<AssessmentStudentView> {
    const { test, attempt } = await this.learnerTest(auth, m, courseId, kind);
    return this.toStudent(test, attempt, auth.userId);
  }

  /** Starts the single attempt (idempotent); the clock runs from the first start. */
  async start(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    kind: AssessmentKind,
  ): Promise<AssessmentStudentView> {
    const { test, attempt } = await this.learnerTest(auth, m, courseId, kind);
    if (attempt) return this.toStudent(test, attempt, auth.userId);
    const [created] = await this.dbs.db
      .insert(assessmentAttempts)
      .values({ assessmentId: test.id, userId: auth.userId, courseId })
      .onConflictDoNothing()
      .returning();
    const row = created ?? (await this.attemptOf(this.dbs.db, test.id, auth.userId))!;
    return this.toStudent(test, row, auth.userId);
  }

  /** Grades the single attempt. A second submission is refused. */
  async submit(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    kind: AssessmentKind,
    answers: QuizAnswer[],
  ): Promise<AssessmentStudentView> {
    const { test } = await this.learnerTest(auth, m, courseId, kind);
    const db = this.dbs.db;
    const row = await db.transaction(async (tx) => {
      const t = tx as unknown as Db;
      const [a] = await t
        .select()
        .from(assessmentAttempts)
        .where(
          and(
            eq(assessmentAttempts.assessmentId, test.id),
            eq(assessmentAttempts.userId, auth.userId),
          ),
        )
        .for('update');
      if (!a)
        throw new ConflictException({
          message: 'Avval testni boshlang',
          code: 'ASSESSMENT_NOT_STARTED',
        });
      if (a.submittedAt) {
        throw new ConflictException({
          message: 'Bu test allaqachon topshirilgan',
          code: 'ASSESSMENT_SUBMITTED',
        });
      }
      const graded = gradeQuiz(test.questions, answers, test.passingPercent);
      const now = new Date();
      const late =
        test.timeLimitMinutes !== null &&
        now.getTime() >
          a.startedAt.getTime() + (test.timeLimitMinutes * 60 + ASSESSMENT_GRACE_SECONDS) * 1000;
      const [updated] = await t
        .update(assessmentAttempts)
        .set({
          submittedAt: now,
          answers,
          results: graded.results,
          correct: graded.correct,
          total: graded.total,
          score: graded.score,
          late,
        })
        .where(eq(assessmentAttempts.id, a.id))
        .returning();
      return updated!;
    });
    return this.toStudent(test, row, auth.userId);
  }

  // ---- Helpers ----------------------------------------------------------

  private async learnerTest(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    kind: AssessmentKind,
  ): Promise<{ test: AssessmentRow; attempt: AttemptRow | undefined }> {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const [test] = await db
      .select()
      .from(courseAssessments)
      .where(and(eq(courseAssessments.courseId, courseId), eq(courseAssessments.kind, kind)))
      .limit(1);
    if (!test) throw new NotFoundException(NOT_FOUND);
    const attempt = await this.attemptOf(db, test.id, auth.userId);
    // A closed test stays readable only for those who already submitted it (their score);
    // closing it also ends unfinished attempts.
    if (!test.isOpen && !attempt?.submittedAt) {
      throw new NotFoundException(NOT_FOUND);
    }
    return { test, attempt };
  }

  private async attemptOf(db: Db, assessmentId: string, userId: string) {
    const [a] = await db
      .select()
      .from(assessmentAttempts)
      .where(
        and(
          eq(assessmentAttempts.assessmentId, assessmentId),
          eq(assessmentAttempts.userId, userId),
        ),
      )
      .limit(1);
    return a;
  }

  private async counts(ids: string[]) {
    if (!ids.length) return new Map<string, { started: number; submitted: number }>();
    const rows = await this.dbs.db
      .select({
        id: assessmentAttempts.assessmentId,
        started: sql<number>`count(*)::int`,
        submitted: sql<number>`(count(*) filter (where ${assessmentAttempts.submittedAt} is not null))::int`,
      })
      .from(assessmentAttempts)
      .where(inArray(assessmentAttempts.assessmentId, ids))
      .groupBy(assessmentAttempts.assessmentId);
    return new Map(rows.map((r) => [r.id, { started: r.started, submitted: r.submitted }]));
  }

  private toAdmin(
    r: AssessmentRow,
    c: { started: number; submitted: number } | undefined,
  ): AssessmentAdmin {
    return {
      id: r.id,
      courseId: r.courseId,
      kind: r.kind,
      title: r.title,
      description: r.description,
      questions: r.questions,
      timeLimitMinutes: r.timeLimitMinutes,
      passingPercent: r.passingPercent,
      isOpen: r.isOpen,
      started: c?.started ?? 0,
      submitted: c?.submitted ?? 0,
      locked: (c?.started ?? 0) > 0,
    };
  }

  private toStudent(
    t: AssessmentRow,
    a: AttemptRow | undefined,
    userId: string,
  ): AssessmentStudentView {
    const st = status(a);
    const deadline =
      a && t.timeLimitMinutes !== null
        ? new Date(a.startedAt.getTime() + t.timeLimitMinutes * 60_000).toISOString()
        : null;
    return {
      kind: t.kind,
      title: t.title,
      description: t.description,
      questionCount: t.questions.length,
      timeLimitMinutes: t.timeLimitMinutes,
      status: st,
      startedAt: a ? a.startedAt.toISOString() : null,
      deadline,
      // Questions only during the attempt; no answers, no per-question feedback (measurement).
      questions:
        st === 'IN_PROGRESS'
          ? t.questions.map((q) => toStudentQuestion(q, `${t.id}:${userId}`))
          : null,
      result:
        a?.submittedAt && a.score !== null
          ? {
              score: a.score,
              correct: a.correct ?? 0,
              total: a.total ?? 0,
              submittedAt: a.submittedAt.toISOString(),
              late: a.late,
            }
          : null,
    };
  }
}

/** JSON with sorted object keys: jsonb does not keep key order, so plain stringify would differ. */
function canonical(v: unknown): string {
  return JSON.stringify(v, (_k, x: unknown) =>
    x && typeof x === 'object' && !Array.isArray(x)
      ? Object.fromEntries(
          Object.entries(x as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)),
        )
      : x,
  );
}

function status(a: AttemptRow | undefined) {
  return !a ? 'NOT_STARTED' : a.submittedAt ? 'SUBMITTED' : 'IN_PROGRESS';
}
