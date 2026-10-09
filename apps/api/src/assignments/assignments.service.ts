import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { and, asc, count, desc, eq, inArray, isNotNull, max, sql } from 'drizzle-orm';
import {
  rubricMatchesPolicy,
  SUBMISSION_MAX_VERSIONS,
  SUBMITTABLE_STATUSES,
  type AssignmentAdmin,
  type AssignmentSubmissionRow,
  type AssignmentView,
  type CheckPreviewResult,
  type CreateAssignmentInput,
  type ProjectFile,
  type SubmissionVersionView,
  type StudentReview,
  type SubmitBlocker,
  type UpdateAssignmentInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import { CHECK_EXECUTOR, runSafely, type CheckExecutor } from '../checks/check-executor';
import { CheckQueue } from '../checks/check-queue';
import { ChecksService, toView } from '../checks/checks.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import { LearningService, LOCKED } from '../courses/learning.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  assignments,
  enrollments,
  submissionChecks,
  submissionReviews,
  submissions,
  submissionVersions,
  users,
} from '../db/schema';

type AssignmentRow = typeof assignments.$inferSelect;
type SubmissionRow = typeof submissions.$inferSelect;

const NOT_FOUND = 'Topshiriq topilmadi';
const BLOCKER_MESSAGES: Record<SubmitBlocker, string> = {
  ASSIGNMENT_CLOSED: 'Topshiriq yopilgan, yangi javob qabul qilinmaydi',
  SUBMISSION_LOCKED: 'Javobingiz ko‘rib chiqilmoqda yoki baholangan, hozir o‘zgartirib bo‘lmaydi',
  ATTEMPTS_EXHAUSTED: 'Urinishlar soni tugagan',
  DEADLINE_PASSED: 'Topshirish muddati o‘tgan',
};
const conflict = (code: string, message: string) => new ConflictException({ code, message });

/** Whether a submit is possible now and whether it would be late. Pure, so it is easy to test. */
export function submitState(
  a: Pick<AssignmentRow, 'status' | 'deadline' | 'maxAttempts' | 'gradingPolicy'>,
  sub: Pick<SubmissionRow, 'status'>,
  attemptsUsed: number,
  now = new Date(),
): { blockedBy: SubmitBlocker | null; late: boolean } {
  if (a.status !== 'PUBLISHED') return { blockedBy: 'ASSIGNMENT_CLOSED', late: false };
  if (!SUBMITTABLE_STATUSES.includes(sub.status)) {
    return { blockedBy: 'SUBMISSION_LOCKED', late: false };
  }
  // A revision the teacher asked for always earns one more submission (within a hard cap).
  const limit = sub.status === 'REVISION_REQUESTED' ? SUBMISSION_MAX_VERSIONS : a.maxAttempts;
  if (attemptsUsed >= Math.min(limit, SUBMISSION_MAX_VERSIONS)) {
    return { blockedBy: 'ATTEMPTS_EXHAUSTED', late: false };
  }
  // A revision the teacher asked for is not bound by the original deadline.
  const past = a.deadline !== null && now > a.deadline && sub.status !== 'REVISION_REQUESTED';
  if (past && !a.gradingPolicy.allowLate) return { blockedBy: 'DEADLINE_PASSED', late: false };
  return { blockedBy: null, late: past };
}

const sameFiles = (a: ProjectFile[], b: ProjectFile[]) =>
  a.length === b.length && a.every((f, i) => f.path === b[i]!.path && f.content === b[i]!.content);

@Injectable()
export class AssignmentsService implements OnModuleInit {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly learning: LearningService,
    private readonly checks: ChecksService,
    private readonly queue: CheckQueue,
    private readonly audit: AuditService,
    @Inject(CHECK_EXECUTOR) private readonly executor: CheckExecutor,
  ) {}

  /** Submission CHECKs left over from a previous process are closed as ERROR. */
  async onModuleInit(): Promise<void> {
    await this.dbs.db
      .update(submissionChecks)
      .set({ status: 'ERROR', errorCode: 'ENGINE', finishedAt: new Date() })
      .where(inArray(submissionChecks.status, ['QUEUED', 'RUNNING']));
  }

  // ---- Staff ------------------------------------------------------------

  async create(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    lessonId: string,
    input: CreateAssignmentInput,
  ): Promise<AssignmentAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    const db = this.dbs.db;
    let position = input.position;
    if (position === undefined) {
      const [row] = await db
        .select({ max: max(assignments.position) })
        .from(assignments)
        .where(eq(assignments.lessonId, lessonId));
      position = row?.max === null || row?.max === undefined ? 0 : row.max + 1;
    }
    const [created] = await db
      .insert(assignments)
      .values({
        ...input,
        deadline: input.deadline ? new Date(input.deadline) : null,
        position,
        lessonId,
        courseId,
        createdBy: auth.userId,
      })
      .returning();
    await this.audit.record({
      action: 'assignment.create',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'assignment',
      targetId: created!.id,
    });
    return this.toAdmin(created!, 0);
  }

  async listForLesson(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    lessonId: string,
  ): Promise<AssignmentAdmin[]> {
    await this.access.manageableCourse(auth, m, courseId);
    await this.access.lessonInCourse(courseId, lessonId);
    const rows = await this.dbs.db
      .select()
      .from(assignments)
      .where(eq(assignments.lessonId, lessonId))
      .orderBy(asc(assignments.position), asc(assignments.createdAt));
    const counts = await this.submittedCounts(rows.map((r) => r.id));
    return rows.map((r) => this.toAdmin(r, counts.get(r.id) ?? 0));
  }

  async getForEdit(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
  ): Promise<AssignmentAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    const a = await this.assignmentInCourse(this.dbs.db, courseId, assignmentId);
    const counts = await this.submittedCounts([a.id]);
    return this.toAdmin(a, counts.get(a.id) ?? 0);
  }

  async update(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    input: UpdateAssignmentInput,
  ): Promise<AssignmentAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    const a = await this.assignmentInCourse(this.dbs.db, courseId, assignmentId);
    const submitted = (await this.submittedCounts([a.id])).get(a.id) ?? 0;
    // Grading terms are part of the contract once students have handed in work.
    if (submitted > 0 && (input.rubric !== undefined || input.gradingPolicy !== undefined)) {
      throw conflict(
        'GRADING_LOCKED',
        'Javoblar topshirilgandan keyin rubrika va baholash siyosatini o‘zgartirib bo‘lmaydi',
      );
    }
    if (!rubricMatchesPolicy(input.rubric ?? a.rubric, input.gradingPolicy ?? a.gradingPolicy)) {
      throw new BadRequestException(
        'Rubrika ballari yig‘indisi maksimal ballga teng bo‘lishi kerak',
      );
    }
    const { deadline, ...rest } = input;
    const [row] = await this.dbs.db
      .update(assignments)
      .set({
        ...rest,
        ...(deadline !== undefined ? { deadline: deadline ? new Date(deadline) : null } : {}),
        updatedAt: new Date(),
      })
      .where(eq(assignments.id, a.id))
      .returning();
    return this.toAdmin(row!, submitted);
  }

  /** DRAFT → PUBLISHED → CLOSED, forward only. */
  async transition(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    to: 'PUBLISHED' | 'CLOSED',
  ): Promise<AssignmentAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    const a = await this.assignmentInCourse(this.dbs.db, courseId, assignmentId);
    const from = to === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    if (a.status !== from) {
      throw conflict('INVALID_TRANSITION', `Holatni ${a.status} dan ${to} ga o‘tkazib bo‘lmaydi`);
    }
    if (to === 'PUBLISHED' && a.instructions.trim() === '') {
      throw conflict('INSTRUCTIONS_REQUIRED', 'E’lon qilishdan oldin ko‘rsatma yozing');
    }
    const now = new Date();
    const [row] = await this.dbs.db
      .update(assignments)
      .set({
        status: to,
        updatedAt: now,
        ...(to === 'PUBLISHED' ? { publishedAt: now } : { closedAt: now }),
      })
      // Guarded update: a concurrent transition cannot apply twice.
      .where(and(eq(assignments.id, a.id), eq(assignments.status, from)))
      .returning();
    if (!row) throw conflict('INVALID_TRANSITION', 'Holat allaqachon o‘zgargan');
    await this.audit.record({
      action: to === 'PUBLISHED' ? 'assignment.publish' : 'assignment.close',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'assignment',
      targetId: a.id,
    });
    const counts = await this.submittedCounts([a.id]);
    return this.toAdmin(row, counts.get(a.id) ?? 0);
  }

  /** Enrolled students and their submission progress. No files or emails (review is 12E). */
  async submissionsOverview(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
  ): Promise<AssignmentSubmissionRow[]> {
    await this.access.manageableCourse(auth, m, courseId);
    await this.assignmentInCourse(this.dbs.db, courseId, assignmentId);
    const db = this.dbs.db;
    const rows = await db
      .select({
        userId: users.id,
        fullName: users.fullName,
        submissionId: submissions.id,
        status: submissions.status,
        score: submissions.score,
        lastSubmittedAt: submissions.lastSubmittedAt,
      })
      .from(enrollments)
      .innerJoin(users, eq(users.id, enrollments.userId))
      .leftJoin(
        submissions,
        and(eq(submissions.userId, enrollments.userId), eq(submissions.assignmentId, assignmentId)),
      )
      .where(eq(enrollments.courseId, courseId))
      .orderBy(asc(users.fullName));
    const ids = rows.map((r) => r.submissionId).filter((x): x is string => x !== null);
    const latest = ids.length
      ? await db
          .select({
            submissionId: submissionVersions.submissionId,
            version: submissionVersions.version,
            isLate: submissionVersions.isLate,
          })
          .from(submissionVersions)
          .where(inArray(submissionVersions.submissionId, ids))
          .orderBy(desc(submissionVersions.version))
      : [];
    const last = new Map<string, { version: number; isLate: boolean }>();
    for (const v of latest) if (!last.has(v.submissionId)) last.set(v.submissionId, v);
    return rows.map((r) => {
      const v = r.submissionId ? last.get(r.submissionId) : undefined;
      return {
        userId: r.userId,
        fullName: r.fullName,
        status: r.status,
        versions: v?.version ?? 0,
        lastSubmittedAt: r.lastSubmittedAt?.toISOString() ?? null,
        lastIsLate: v?.isLate ?? false,
        score: r.score,
      };
    });
  }

  async previewChecks(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    input: { files: ProjectFile[]; checks?: AssignmentRow['checks'] },
  ): Promise<CheckPreviewResult> {
    await this.access.manageableCourse(auth, m, courseId);
    const a = await this.assignmentInCourse(this.dbs.db, courseId, assignmentId);
    return this.checks.previewRules(auth.userId, input.files, input.checks ?? a.checks);
  }

  // ---- Student ----------------------------------------------------------

  async view(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
  ): Promise<AssignmentView> {
    const a = await this.accessibleAssignment(auth, m, courseId, assignmentId);
    const sub = await this.ensureSubmission(this.dbs.db, auth.userId, a);
    return this.toView(a, sub);
  }

  async saveDraft(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    files: ProjectFile[],
  ): Promise<AssignmentView> {
    const a = await this.accessibleAssignment(auth, m, courseId, assignmentId);
    if (a.status !== 'PUBLISHED') {
      throw conflict('ASSIGNMENT_CLOSED', BLOCKER_MESSAGES.ASSIGNMENT_CLOSED);
    }
    const db = this.dbs.db;
    const sub = await this.ensureSubmission(db, auth.userId, a);
    if (!SUBMITTABLE_STATUSES.includes(sub.status)) {
      throw conflict('SUBMISSION_LOCKED', BLOCKER_MESSAGES.SUBMISSION_LOCKED);
    }
    const [row] = await db
      .update(submissions)
      .set({ files, updatedAt: new Date() })
      .where(eq(submissions.id, sub.id))
      .returning();
    return this.toView(a, row!);
  }

  /** Snapshots the saved draft as a new immutable version. */
  async submit(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
  ): Promise<AssignmentView> {
    const a = await this.accessibleAssignment(auth, m, courseId, assignmentId);
    const created = await this.dbs.db.transaction(async (tx) => {
      const db = tx as unknown as Db;
      const current = await this.ensureSubmission(db, auth.userId, a);
      // Serializes concurrent submits so version numbers and attempt counts stay exact.
      await db.execute(sql`select 1 from submissions where id = ${current.id} for update`);
      const [sub] = await db.select().from(submissions).where(eq(submissions.id, current.id));
      const [fresh] = await db.select().from(assignments).where(eq(assignments.id, a.id));
      const versions = await db
        .select({ version: submissionVersions.version, files: submissionVersions.files })
        .from(submissionVersions)
        .where(eq(submissionVersions.submissionId, sub!.id))
        .orderBy(desc(submissionVersions.version))
        .limit(1);
      const used = versions[0]?.version ?? 0;
      const state = submitState(fresh!, sub!, used);
      if (state.blockedBy) throw conflict(state.blockedBy, BLOCKER_MESSAGES[state.blockedBy]);
      if (versions[0] && sameFiles(versions[0].files, sub!.files)) {
        throw conflict('NO_CHANGES', 'Oldingi topshirilgan versiyadan farq yo‘q');
      }
      const now = new Date();
      const [version] = await db
        .insert(submissionVersions)
        .values({
          submissionId: sub!.id,
          assignmentId: a.id,
          userId: auth.userId,
          version: used + 1,
          files: sub!.files,
          isLate: state.late,
          submittedAt: now,
        })
        .returning();
      await db
        .update(submissions)
        .set({ status: 'SUBMITTED', lastSubmittedAt: now, updatedAt: now })
        .where(eq(submissions.id, sub!.id));
      let checkId: string | null = null;
      if (fresh!.checks.length > 0) {
        const [chk] = await db
          .insert(submissionChecks)
          .values({ versionId: version!.id, rules: fresh!.checks })
          .returning({ id: submissionChecks.id });
        checkId = chk!.id;
      }
      return { version: version!, checkId };
    });

    if (created.checkId) {
      const checkId = created.checkId;
      this.queue.enqueue(() => this.runCheck(checkId, created.version.files));
    }
    await this.audit.record({
      action: 'submission.submit',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'assignment',
      targetId: a.id,
      metadata: { version: created.version.version, isLate: created.version.isLate },
    });
    return this.view(auth, m, courseId, assignmentId);
  }

  async version(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
    version: number,
  ): Promise<SubmissionVersionView> {
    const a = await this.accessibleAssignment(auth, m, courseId, assignmentId);
    const [row] = await this.dbs.db
      .select({
        version: submissionVersions.version,
        files: submissionVersions.files,
        isLate: submissionVersions.isLate,
        submittedAt: submissionVersions.submittedAt,
      })
      .from(submissionVersions)
      .where(
        and(
          eq(submissionVersions.assignmentId, a.id),
          eq(submissionVersions.userId, auth.userId),
          eq(submissionVersions.version, version),
        ),
      )
      .limit(1);
    if (!row) throw new NotFoundException('Versiya topilmadi');
    return { ...row, submittedAt: row.submittedAt.toISOString() };
  }

  // ---- Helpers ----------------------------------------------------------

  private async runCheck(checkId: string, files: ProjectFile[]): Promise<void> {
    const db = this.dbs.db;
    const [chk] = await db
      .update(submissionChecks)
      .set({ status: 'RUNNING', startedAt: new Date() })
      .where(and(eq(submissionChecks.id, checkId), eq(submissionChecks.status, 'QUEUED')))
      .returning();
    if (!chk) return;
    const result = await runSafely(this.executor, files, chk.rules);
    await db
      .update(submissionChecks)
      .set({
        status: result.status,
        errorCode: result.errorCode,
        results: result.results,
        durationMs: result.durationMs,
        finishedAt: new Date(),
      })
      .where(eq(submissionChecks.id, checkId));
  }

  /** Published course, enrolled learner, non-draft assignment, and its lesson unlocked. */
  private async accessibleAssignment(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    assignmentId: string,
  ): Promise<AssignmentRow> {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    const a = await this.assignmentInCourse(db, courseId, assignmentId);
    if (a.status === 'DRAFT') throw new NotFoundException(NOT_FOUND);
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const state = await this.learning.lessonState(db, auth.userId, courseId, a.lessonId);
    if (state === 'LOCKED') throw new ForbiddenException(LOCKED);
    return a;
  }

  private async assignmentInCourse(db: Db, courseId: string, assignmentId: string) {
    const [row] = await db
      .select()
      .from(assignments)
      .where(and(eq(assignments.id, assignmentId), eq(assignments.courseId, courseId)))
      .limit(1);
    if (!row) throw new NotFoundException(NOT_FOUND);
    return row;
  }

  private async ensureSubmission(db: Db, userId: string, a: AssignmentRow): Promise<SubmissionRow> {
    await db
      .insert(submissions)
      .values({ assignmentId: a.id, userId, courseId: a.courseId, files: a.starterFiles })
      .onConflictDoNothing();
    const [row] = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.assignmentId, a.id), eq(submissions.userId, userId)));
    return row!;
  }

  private async submittedCounts(ids: string[]): Promise<Map<string, number>> {
    if (ids.length === 0) return new Map();
    const rows = await this.dbs.db
      .select({ assignmentId: submissions.assignmentId, n: count() })
      .from(submissions)
      .where(and(inArray(submissions.assignmentId, ids), isNotNull(submissions.lastSubmittedAt)))
      .groupBy(submissions.assignmentId);
    return new Map(rows.map((r) => [r.assignmentId, r.n]));
  }

  private async toView(a: AssignmentRow, sub: SubmissionRow): Promise<AssignmentView> {
    const versions = await this.dbs.db
      .select({
        version: submissionVersions.version,
        isLate: submissionVersions.isLate,
        submittedAt: submissionVersions.submittedAt,
        check: submissionChecks,
      })
      .from(submissionVersions)
      .leftJoin(submissionChecks, eq(submissionChecks.versionId, submissionVersions.id))
      .where(eq(submissionVersions.submissionId, sub.id))
      .orderBy(desc(submissionVersions.version));
    const used = versions[0]?.version ?? 0;
    const state = submitState(a, sub, used);
    const [latest] = await this.dbs.db
      .select({
        action: submissionReviews.action,
        feedback: submissionReviews.feedback,
        score: submissionReviews.score,
        scores: submissionReviews.scores,
        createdAt: submissionReviews.createdAt,
        version: submissionVersions.version,
      })
      .from(submissionReviews)
      .innerJoin(submissionVersions, eq(submissionVersions.id, submissionReviews.versionId))
      .where(eq(submissionReviews.submissionId, sub.id))
      .orderBy(desc(submissionReviews.createdAt))
      .limit(1);
    // Reviewer identity is not shown to the student.
    const review: StudentReview | null = latest
      ? {
          action: latest.action,
          version: latest.version,
          feedback: latest.feedback,
          createdAt: latest.createdAt.toISOString(),
          grade:
            latest.action === 'REVISION_REQUESTED' || latest.score === null
              ? null
              : {
                  score: latest.score,
                  maxScore: a.gradingPolicy.maxScore,
                  passed: latest.score >= a.gradingPolicy.passingScore,
                  final: latest.action === 'FINALIZED',
                  scores: latest.scores,
                },
        }
      : null;
    return {
      id: a.id,
      lessonId: a.lessonId,
      title: a.title,
      instructions: a.instructions,
      requirements: a.requirements,
      rubric: a.rubric,
      gradingPolicy: a.gradingPolicy,
      deadline: a.deadline?.toISOString() ?? null,
      maxAttempts: a.maxAttempts,
      status: a.status as AssignmentView['status'],
      checkAvailable: a.checks.length > 0,
      submission: {
        status: sub.status,
        files: sub.files,
        attemptsUsed: used,
        updatedAt: sub.updatedAt.toISOString(),
        blockedBy: state.blockedBy,
        wouldBeLate: state.late,
      },
      versions: versions.map((v) => ({
        version: v.version,
        isLate: v.isLate,
        submittedAt: v.submittedAt.toISOString(),
        check: v.check ? toView(v.check) : null,
      })),
      review,
    };
  }

  private toAdmin(a: AssignmentRow, submittedCount: number): AssignmentAdmin {
    return {
      id: a.id,
      lessonId: a.lessonId,
      title: a.title,
      instructions: a.instructions,
      requirements: a.requirements,
      starterFiles: a.starterFiles,
      rubric: a.rubric,
      gradingPolicy: a.gradingPolicy,
      deadline: a.deadline?.toISOString() ?? null,
      maxAttempts: a.maxAttempts,
      checks: a.checks,
      position: a.position,
      status: a.status,
      publishedAt: a.publishedAt?.toISOString() ?? null,
      closedAt: a.closedAt?.toISOString() ?? null,
      submittedCount,
    };
  }
}
