import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import {
  scoreTotal,
  type GradeSubmissionInput,
  type RequestRevisionInput,
  type ReviewAction,
  type RubricScore,
  type StaffVersionView,
  type SubmissionReviewView,
  type SubmissionStatus,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  assignments,
  submissionChecks,
  submissionReviews,
  submissions,
  submissionVersions,
  users,
} from '../db/schema';

type AssignmentRow = typeof assignments.$inferSelect;
type SubmissionRow = typeof submissions.$inferSelect;
/** What the teacher looked at: the latest version and (optionally) the review history length. */
type Seen = { version: number; basedOn?: number };

const conflict = (code: string, message: string) => new ConflictException({ code, message });

/** Allowed source statuses for each teacher action. Everything else is 409. */
const FROM: Record<'start' | ReviewAction, readonly SubmissionStatus[]> = {
  start: ['SUBMITTED'],
  REVISION_REQUESTED: ['IN_REVIEW', 'GRADED'],
  GRADED: ['IN_REVIEW', 'GRADED'],
  FINALIZED: ['GRADED'],
};

const AUDIT: Record<'start' | ReviewAction, string> = {
  start: 'submission.review_start',
  REVISION_REQUESTED: 'submission.revision_request',
  GRADED: 'submission.grade',
  FINALIZED: 'submission.finalize',
};

/**
 * Teacher review workflow. Grades change only here, only for staff who manage the course,
 * and every step is recorded as an immutable review row plus an audit event.
 */
@Injectable()
export class ReviewsService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly audit: AuditService,
  ) {}

  async get(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    studentId: string,
  ): Promise<SubmissionReviewView> {
    await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const a = await this.assignmentInCourse(db, courseId, assignmentId);
    const sub = await this.submissionOf(db, a.id, studentId);
    const [student] = await db
      .select({ id: users.id, fullName: users.fullName })
      .from(users)
      .where(eq(users.id, studentId));

    const versions = await db
      .select({
        version: submissionVersions.version,
        submittedAt: submissionVersions.submittedAt,
        isLate: submissionVersions.isLate,
        check: submissionChecks,
      })
      .from(submissionVersions)
      .leftJoin(submissionChecks, eq(submissionChecks.versionId, submissionVersions.id))
      .where(eq(submissionVersions.submissionId, sub.id))
      .orderBy(desc(submissionVersions.version));

    const reviews = await db
      .select({
        action: submissionReviews.action,
        version: submissionVersions.version,
        reviewerName: users.fullName,
        feedback: submissionReviews.feedback,
        score: submissionReviews.score,
        scores: submissionReviews.scores,
        createdAt: submissionReviews.createdAt,
      })
      .from(submissionReviews)
      .innerJoin(submissionVersions, eq(submissionVersions.id, submissionReviews.versionId))
      .leftJoin(users, eq(users.id, submissionReviews.reviewerId))
      .where(eq(submissionReviews.submissionId, sub.id))
      .orderBy(asc(submissionReviews.createdAt));

    return {
      assignment: {
        id: a.id,
        title: a.title,
        rubric: a.rubric,
        gradingPolicy: a.gradingPolicy,
        deadline: a.deadline?.toISOString() ?? null,
      },
      student: student!,
      status: sub.status,
      score: sub.score,
      versions: versions.map((v) => {
        const passed = new Map((v.check?.results ?? []).map((r) => [r.id, r.passed]));
        return {
          version: v.version,
          submittedAt: v.submittedAt.toISOString(),
          isLate: v.isLate,
          check: v.check
            ? {
                status: v.check.status,
                errorCode: v.check.errorCode,
                durationMs: v.check.durationMs,
                checks: v.check.rules.map((r) => ({
                  id: r.id,
                  title: r.title,
                  hidden: r.hidden,
                  passed: passed.get(r.id) === true,
                })),
              }
            : null,
        };
      }),
      reviews: reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    };
  }

  /** Any version's files, for code preview. */
  async version(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    studentId: string,
    version: number,
  ): Promise<StaffVersionView> {
    await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const a = await this.assignmentInCourse(db, courseId, assignmentId);
    const sub = await this.submissionOf(db, a.id, studentId);
    const [row] = await db
      .select({
        version: submissionVersions.version,
        submittedAt: submissionVersions.submittedAt,
        isLate: submissionVersions.isLate,
        files: submissionVersions.files,
      })
      .from(submissionVersions)
      .where(
        and(eq(submissionVersions.submissionId, sub.id), eq(submissionVersions.version, version)),
      )
      .limit(1);
    if (!row) throw new NotFoundException('Versiya topilmadi');
    return { ...row, submittedAt: row.submittedAt.toISOString() };
  }

  /** SUBMITTED → IN_REVIEW. From now on the student cannot replace the work. */
  startReview(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    studentId: string,
    seen: Seen,
  ) {
    return this.act(auth, m, courseId, assignmentId, studentId, seen, 'start', async () => ({
      status: 'IN_REVIEW',
      score: null,
      review: null,
    }));
  }

  requestRevision(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    studentId: string,
    input: RequestRevisionInput,
  ) {
    return this.act(
      auth,
      m,
      courseId,
      assignmentId,
      studentId,
      input,
      'REVISION_REQUESTED',
      async () => ({
        status: 'REVISION_REQUESTED',
        score: null,
        review: { feedback: input.feedback, score: null, scores: null },
      }),
    );
  }

  grade(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    studentId: string,
    input: GradeSubmissionInput,
  ) {
    return this.act(auth, m, courseId, assignmentId, studentId, input, 'GRADED', async (a) => {
      const total = scoreTotal(a.rubric, a.gradingPolicy, input);
      if (!total.ok) throw new BadRequestException(`Ball noto‘g‘ri: ${total.error}`);
      return {
        status: 'GRADED',
        score: total.total,
        review: { feedback: input.feedback, score: total.total, scores: input.scores ?? null },
      };
    });
  }

  /** GRADED → FINALIZED. Carries the last grade forward; nothing can change afterwards. */
  finalize(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    studentId: string,
    seen: Seen,
  ) {
    return this.act(
      auth,
      m,
      courseId,
      assignmentId,
      studentId,
      seen,
      'FINALIZED',
      async (_a, sub, db) => {
        const [graded] = await db
          .select()
          .from(submissionReviews)
          .where(
            and(eq(submissionReviews.submissionId, sub.id), eq(submissionReviews.action, 'GRADED')),
          )
          .orderBy(desc(submissionReviews.createdAt))
          .limit(1);
        return {
          status: 'FINALIZED',
          score: sub.score,
          review: {
            feedback: graded?.feedback ?? '',
            score: sub.score,
            scores: graded?.scores ?? null,
          },
        };
      },
    );
  }

  // ---- Core -------------------------------------------------------------

  private async act(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    studentId: string,
    seen: Seen,
    action: 'start' | ReviewAction,
    decide: (
      a: AssignmentRow,
      sub: SubmissionRow,
      db: Db,
    ) => Promise<{
      status: SubmissionStatus;
      score: number | null;
      review: { feedback: string; score: number | null; scores: RubricScore[] | null } | null;
    }>,
  ): Promise<SubmissionReviewView> {
    await this.access.manageableCourse(auth, m, courseId);
    let score: number | null = null;
    await this.dbs.db.transaction(async (tx) => {
      const db = tx as unknown as Db;
      const a = await this.assignmentInCourse(db, courseId, assignmentId);
      const sub = await this.submissionOf(db, a.id, studentId, true);
      if (!FROM[action].includes(sub.status)) {
        throw conflict('INVALID_TRANSITION', `Bu amal ${sub.status} holatida mumkin emas`);
      }
      const [latest] = await db
        .select({ id: submissionVersions.id, version: submissionVersions.version })
        .from(submissionVersions)
        .where(eq(submissionVersions.submissionId, sub.id))
        .orderBy(desc(submissionVersions.version))
        .limit(1);
      if (!latest) throw conflict('INVALID_TRANSITION', 'Topshirilgan versiya yo‘q');
      // The teacher must be acting on what they actually looked at.
      if (latest.version !== seen.version) {
        throw conflict('STALE_VERSION', 'Talaba yangi versiya topshirgan. Sahifani yangilang');
      }
      // ...and on the review history they saw (no silent overwrite by a second teacher).
      if (seen.basedOn !== undefined) {
        const [counted] = await db
          .select({ n: sql<number>`count(*)::int` })
          .from(submissionReviews)
          .where(eq(submissionReviews.submissionId, sub.id));
        if ((counted?.n ?? 0) !== seen.basedOn) {
          throw conflict(
            'REVIEW_CHANGED',
            'Bu javobni boshqa o‘qituvchi hozirgina o‘zgartirdi. Sahifani yangilab, qayta ko‘rib chiqing',
          );
        }
      }
      const next = await decide(a, sub, db);
      score = next.score;
      await db
        .update(submissions)
        .set({ status: next.status, score: next.score, updatedAt: new Date() })
        .where(eq(submissions.id, sub.id));
      if (next.review && action !== 'start') {
        await db.insert(submissionReviews).values({
          submissionId: sub.id,
          versionId: latest.id,
          reviewerId: auth.userId,
          action,
          feedback: next.review.feedback,
          score: next.review.score,
          scores: next.review.scores,
        });
      }
    });
    await this.audit.record({
      action: AUDIT[action],
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'assignment',
      targetId: assignmentId,
      metadata: { studentId, version: seen.version, ...(score !== null ? { score } : {}) },
    });
    return this.get(auth, m, courseId, assignmentId, studentId);
  }

  private async assignmentInCourse(db: Db, courseId: string, assignmentId: string) {
    const [row] = await db
      .select()
      .from(assignments)
      .where(and(eq(assignments.id, assignmentId), eq(assignments.courseId, courseId)))
      .limit(1);
    if (!row) throw new NotFoundException('Topshiriq topilmadi');
    return row;
  }

  /** The student's submission for this assignment; `lock` serializes concurrent reviews. */
  private async submissionOf(db: Db, assignmentId: string, studentId: string, lock = false) {
    const q = db
      .select()
      .from(submissions)
      .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.userId, studentId)))
      .limit(1);
    const [row] = lock ? await q.for('update') : await q;
    if (!row) throw new NotFoundException('Javob topilmadi');
    return row;
  }
}
