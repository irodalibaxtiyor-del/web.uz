import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { and, count, desc, eq, gte, inArray, lt, sql } from 'drizzle-orm';
import type {
  CheckEngineResult,
  CheckPreviewResult,
  CheckRule,
  CheckRunView,
  PreviewChecksInput,
  ProjectFile,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { APP_CONFIG, type AppConfig } from '../config';
import { CourseAccessService } from '../courses/course-access.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import { checkRuns, studentExercises } from '../db/schema';
import { ExercisesService } from '../exercises/exercises.service';
import { CHECK_EXECUTOR, runSafely, type CheckExecutor } from './check-executor';
import { CheckQueue } from './check-queue';
import { staleCutoff, startSweep } from './stale';

export const NOT_CONFIGURED = {
  message: 'Bu mashq uchun avtomatik tekshiruv sozlanmagan',
  code: 'CHECK_NOT_CONFIGURED',
};
const IN_PROGRESS = { message: 'Tekshiruv allaqachon bajarilmoqda', code: 'CHECK_IN_PROGRESS' };
const RATE_LIMITED = {
  message: 'Juda ko‘p tekshiruv. Birozdan keyin urinib ko‘ring',
  code: 'CHECK_RATE_LIMITED',
};
const RATE_WINDOW_MS = 10 * 60_000;

type RunRow = typeof checkRuns.$inferSelect;

@Injectable()
export class ChecksService implements OnModuleInit, OnModuleDestroy {
  /** Staff dry-runs in flight, one per user. */
  private readonly previews = new Set<string>();

  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly exercises: ExercisesService,
    private readonly queue: CheckQueue,
    private readonly audit: AuditService,
    @Inject(CHECK_EXECUTOR) private readonly executor: CheckExecutor,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  private stopSweep: (() => void) | null = null;

  /** Closes abandoned runs now and then every minute (see `stale.ts`). */
  async onModuleInit(): Promise<void> {
    await this.closeStale();
    this.stopSweep = startSweep(() => this.closeStale());
  }

  onModuleDestroy(): void {
    this.stopSweep?.();
  }

  /** Runs whose process is gone can never finish; close them honestly as ERROR, never PASS. */
  async closeStale(now = new Date()): Promise<number> {
    const rows = await this.dbs.db
      .update(checkRuns)
      .set({ status: 'ERROR', errorCode: 'ENGINE', finishedAt: now })
      .where(
        and(
          inArray(checkRuns.status, ['QUEUED', 'RUNNING']),
          lt(
            sql`coalesce(${checkRuns.startedAt}, ${checkRuns.createdAt})`,
            staleCutoff(this.config, now),
          ),
        ),
      )
      .returning({ id: checkRuns.id });
    return rows.length;
  }

  // ---- Student ----------------------------------------------------------

  /** Queues a CHECK of the student's saved workspace (never of client-supplied files). */
  async start(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
  ): Promise<CheckRunView> {
    const exercise = await this.exercises.accessibleExercise(auth, m, courseId, exerciseId);
    if (exercise.checks.length === 0) throw new ConflictException(NOT_CONFIGURED);

    const run = await this.dbs.db.transaction(async (tx) => {
      const db = tx as unknown as Db;
      const workspace = await this.exercises.ensureWorkspace(db, auth.userId, courseId, exercise);
      // Serializes concurrent starts for the same student + exercise.
      await db.execute(sql`select 1 from student_exercises where id = ${workspace.id} for update`);

      const [active] = await db
        .select({ id: checkRuns.id })
        .from(checkRuns)
        .where(
          and(
            eq(checkRuns.userId, auth.userId),
            eq(checkRuns.exerciseId, exerciseId),
            inArray(checkRuns.status, ['QUEUED', 'RUNNING']),
          ),
        )
        .limit(1);
      if (active) throw new ConflictException(IN_PROGRESS);

      const [recent] = await db
        .select({ n: count() })
        .from(checkRuns)
        .where(
          and(
            eq(checkRuns.userId, auth.userId),
            gte(checkRuns.createdAt, new Date(Date.now() - RATE_WINDOW_MS)),
          ),
        );
      if ((recent?.n ?? 0) >= this.config.CHECK_RATE_LIMIT) {
        throw new HttpException(RATE_LIMITED, HttpStatus.TOO_MANY_REQUESTS);
      }

      const [row] = await db
        .insert(checkRuns)
        .values({
          userId: auth.userId,
          exerciseId,
          courseId,
          files: workspace.files,
          rules: exercise.checks,
        })
        .returning();
      return row!;
    });

    this.queue.enqueue(() => this.execute(run.id, m.organizationId));
    return toView(run);
  }

  async get(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
    runId: string,
  ): Promise<CheckRunView> {
    await this.exercises.accessibleExercise(auth, m, courseId, exerciseId);
    const [row] = await this.dbs.db
      .select()
      .from(checkRuns)
      .where(
        and(
          eq(checkRuns.id, runId),
          eq(checkRuns.userId, auth.userId),
          eq(checkRuns.exerciseId, exerciseId),
          eq(checkRuns.courseId, courseId),
        ),
      )
      .limit(1);
    if (!row) throw new NotFoundException('Tekshiruv topilmadi');
    return toView(row);
  }

  async latest(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
  ): Promise<CheckRunView | null> {
    await this.exercises.accessibleExercise(auth, m, courseId, exerciseId);
    const [row] = await this.dbs.db
      .select()
      .from(checkRuns)
      .where(
        and(
          eq(checkRuns.userId, auth.userId),
          eq(checkRuns.exerciseId, exerciseId),
          eq(checkRuns.courseId, courseId),
        ),
      )
      .orderBy(desc(checkRuns.createdAt))
      .limit(1);
    return row ? toView(row) : null;
  }

  // ---- Staff ------------------------------------------------------------

  /** Dry-run of (possibly unsaved) rules against given files. Full detail, nothing stored. */
  async preview(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    exerciseId: string,
    input: PreviewChecksInput,
  ): Promise<CheckPreviewResult> {
    await this.access.manageableCourse(auth, m, courseId);
    const exercise = await this.exercises.exerciseInCourse(this.dbs.db, courseId, exerciseId);
    return this.previewRules(auth.userId, input.files, input.checks ?? exercise.checks);
  }

  /** Shared by exercise and assignment dry-runs. The caller must have authorized staff access. */
  async previewRules(
    userId: string,
    files: ProjectFile[],
    rules: CheckRule[],
  ): Promise<CheckPreviewResult> {
    if (rules.length === 0) throw new ConflictException(NOT_CONFIGURED);
    if (this.previews.has(userId)) throw new ConflictException(IN_PROGRESS);

    this.previews.add(userId);
    try {
      const result = await this.queue.submit(() => runSafely(this.executor, files, rules));
      const passed = new Map(result.results.map((r) => [r.id, r.passed]));
      return {
        status: result.status,
        errorCode: result.errorCode,
        durationMs: result.durationMs,
        checks: rules.map((r) => ({
          id: r.id,
          title: r.title,
          hidden: r.hidden,
          passed: passed.get(r.id) ?? false,
        })),
      };
    } finally {
      this.previews.delete(userId);
    }
  }

  // ---- Execution --------------------------------------------------------

  private async execute(runId: string, organizationId: string): Promise<void> {
    const db = this.dbs.db;
    const [run] = await db
      .update(checkRuns)
      .set({ status: 'RUNNING', startedAt: new Date() })
      .where(and(eq(checkRuns.id, runId), eq(checkRuns.status, 'QUEUED')))
      .returning();
    if (!run) return;

    const result = await runSafely(this.executor, run.files, run.rules);
    let passedNow = false;
    await db.transaction(async (tx) => {
      const t = tx as unknown as Db;
      await t
        .update(checkRuns)
        .set({
          status: result.status,
          errorCode: result.errorCode,
          results: result.results,
          durationMs: result.durationMs,
          finishedAt: new Date(),
        })
        .where(eq(checkRuns.id, runId));
      passedNow = await this.applyResult(t, run, result);
    });
    if (passedNow) {
      await this.audit.record({
        action: 'exercise.status_set',
        // System actor: the verdict came from CHECK, not from a person.
        actorUserId: null,
        organizationId,
        targetType: 'exercise',
        targetId: run.exerciseId,
        metadata: { source: 'check', checkRunId: run.id, studentId: run.userId, status: 'PASSED' },
      });
    }
  }

  /**
   * PASSED marks the exercise passed (and may complete the lesson). FAILED asks for
   * improvement unless it already passed: progress never moves backwards automatically.
   * ERROR / TIMEOUT are not the student's verdict and change nothing.
   */
  private async applyResult(db: Db, run: RunRow, result: CheckEngineResult): Promise<boolean> {
    if (result.status !== 'PASSED' && result.status !== 'FAILED') return false;
    const exercise = await this.exercises.exerciseInCourse(db, run.courseId, run.exerciseId);
    const [current] = await db
      .select({ status: studentExercises.status })
      .from(studentExercises)
      .where(
        and(
          eq(studentExercises.userId, run.userId),
          eq(studentExercises.exerciseId, run.exerciseId),
        ),
      )
      .limit(1);
    if (current?.status === 'PASSED') return false;
    const status = result.status === 'PASSED' ? 'PASSED' : 'NEEDS_IMPROVEMENT';
    await this.exercises.applyStatus(db, run.userId, run.courseId, exercise, status);
    return status === 'PASSED';
  }
}

/** Fields of a stored CHECK (exercise run or submission check) needed for the safe view. */
export type StoredCheck = Pick<
  RunRow,
  'id' | 'status' | 'errorCode' | 'rules' | 'results' | 'createdAt' | 'finishedAt'
>;

/** Student-safe projection: visible check titles and hints, hidden checks only as counts. */
export function toView(run: StoredCheck): CheckRunView {
  const passed = new Map((run.results ?? []).map((r) => [r.id, r.passed]));
  const visible = run.rules.filter((r) => !r.hidden);
  const hidden = run.rules.filter((r) => r.hidden);
  const ok = (r: CheckRule) => passed.get(r.id) === true;
  return {
    id: run.id,
    status: run.status,
    errorCode: run.errorCode,
    createdAt: run.createdAt.toISOString(),
    finishedAt: run.finishedAt?.toISOString() ?? null,
    passedCount: run.rules.filter(ok).length,
    total: run.rules.length,
    checks: visible.map((r) => ({
      title: r.title,
      passed: ok(r),
      hint: run.status === 'FAILED' && !ok(r) ? (r.hint ?? null) : null,
    })),
    hidden: { passed: hidden.filter(ok).length, total: hidden.length },
  };
}
