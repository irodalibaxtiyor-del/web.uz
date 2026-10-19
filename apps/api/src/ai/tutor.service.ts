import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { randomBytes } from 'node:crypto';
import {
  MAX_HINTS,
  type CheckRule,
  type CheckRunView,
  type HandoffCategory,
  type TutorAsk,
  type TutorExchange,
  type TutorHandoffView,
  type TutorReply,
  type TutorRequestMode,
  type TutorState,
  type TutorTargetKind,
} from '@webdizayn/shared';
import { AssignmentsService } from '../assignments/assignments.service';
import { AuditService } from '../audit/audit.service';
import { ChecksService } from '../checks/checks.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { APP_CONFIG, type AppConfig } from '../config';
import { CourseAccessService } from '../courses/course-access.service';
import { DbService } from '../db/db.module';
import {
  aiFeedback,
  aiHandoffs,
  aiHintStates,
  aiInteractions,
  assignments,
  courses,
  exercises,
  lessons,
  modules,
  users,
} from '../db/schema';
import { ExercisesService } from '../exercises/exercises.service';
import { BLOCKED_REPLY, guardReply, hiddenRuleStrings } from './guard';
import {
  buildPrompt,
  decide,
  fallbackQuestion,
  nextHint,
  parseAnswer,
  type TutorContext,
  type TutorPlan,
} from './pedagogy';
import { AI_PROVIDER, AiProviderError, type AiProvider } from './provider';
import { AiUsageService } from './usage.service';

const LESSON_CHARS = 2500;
const FILE_CHARS = 6000;
const FILES_TOTAL_CHARS = 12000;
const FEEDBACK_CHARS = 500;
const HISTORY = 20;

const UNAVAILABLE = {
  message: 'AI yordamchi hozir javob bera olmadi. Birozdan keyin urinib ko‘ring.',
  code: 'AI_UNAVAILABLE',
};

const HANDOFF_REPLY =
  'So‘rovingiz o‘qituvchiga yuborildi. U ishingizni ko‘rib, sizga yordam beradi. ' +
  'Bu bahoga yoki progressga ta’sir qilmaydi.';
const OUT_OF_SCOPE_REPLY =
  'Men faqat shu kurs bo‘yicha — HTML, CSS, JavaScript va mashqlaringiz haqida yordam bera olaman. ' +
  'Savolingizni mashq yoki dars bilan bog‘lab bering.';

interface Target {
  kind: TutorTargetKind;
  id: string;
  lessonId: string;
  ctx: Omit<TutorContext, 'courseTitle' | 'moduleTitle' | 'lessonTitle' | 'lessonText'>;
  hiddenRules: CheckRule[];
}

@Injectable()
export class TutorService {
  /** Per-process marker inside the system prompt; seeing it in an answer means leakage. */
  private readonly canary = `wd-${randomBytes(6).toString('hex')}`;

  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly exercisesService: ExercisesService,
    private readonly checks: ChecksService,
    private readonly assignmentsService: AssignmentsService,
    private readonly usage: AiUsageService,
    private readonly audit: AuditService,
    @Inject(AI_PROVIDER) private readonly provider: AiProvider,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  // ---------------------------------------------------------------- student

  async state(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    kind: TutorTargetKind,
    targetId: string,
  ): Promise<TutorState> {
    await this.loadTarget(auth, m, courseId, kind, targetId);
    const [hints, quota, rows] = await Promise.all([
      this.hintsUsed(auth.userId, kind, targetId),
      this.usage.quota(auth.userId),
      this.dbs.db
        .select({ i: aiInteractions, f: aiFeedback })
        .from(aiInteractions)
        .leftJoin(aiFeedback, eq(aiFeedback.interactionId, aiInteractions.id))
        .where(
          and(
            eq(aiInteractions.userId, auth.userId),
            eq(aiInteractions.courseId, courseId),
            eq(aiInteractions.targetKind, kind),
            eq(aiInteractions.targetId, targetId),
          ),
        )
        .orderBy(desc(aiInteractions.createdAt))
        .limit(HISTORY),
    ]);
    const handoffs = await this.handoffIds(rows.map((r) => r.i.id));
    return {
      provider: this.provider.name,
      hintsUsed: hints,
      maxHints: MAX_HINTS,
      quota,
      history: rows.reverse().map((r): TutorExchange => ({
        request: {
          mode: r.i.requestMode as TutorRequestMode,
          message: r.i.message,
          createdAt: r.i.createdAt.toISOString(),
        },
        reply: toReply(r.i, handoffs.get(r.i.id) ?? null, r.f ? { helpful: r.f.helpful } : null),
      })),
    };
  }

  async ask(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    body: TutorAsk,
  ): Promise<TutorReply> {
    const target = await this.loadTarget(auth, m, courseId, body.targetKind, body.targetId);
    await this.usage.assertAllowed(auth.userId);
    const decision = decide(body.mode, body.message);
    const base = {
      userId: auth.userId,
      organizationId: m.organizationId,
      courseId,
      targetKind: target.kind,
      targetId: target.id,
      requestMode: body.mode,
      level: body.level,
      message: body.message,
    };

    if (decision.mode === 'TEACHER_HANDOFF') {
      const category: HandoffCategory = body.handoffCategory ?? 'STUCK';
      const [row] = await this.dbs.db
        .insert(aiInteractions)
        .values({ ...base, mode: 'TEACHER_HANDOFF', reply: HANDOFF_REPLY, provider: 'none' })
        .returning();
      const [handoff] = await this.dbs.db
        .insert(aiHandoffs)
        .values({
          userId: auth.userId,
          organizationId: m.organizationId,
          courseId,
          interactionId: row!.id,
          targetKind: target.kind,
          targetId: target.id,
          category,
          note: body.message.slice(0, FEEDBACK_CHARS),
        })
        .returning({ id: aiHandoffs.id });
      await this.audit.record({
        action: 'ai.handoff',
        actorUserId: auth.userId,
        organizationId: m.organizationId,
        targetType: target.kind.toLowerCase(),
        targetId: target.id,
        metadata: { category },
      });
      return toReply(row!, handoff!.id, null);
    }

    if (decision.mode === 'OUT_OF_SCOPE') {
      const [row] = await this.dbs.db
        .insert(aiInteractions)
        .values({
          ...base,
          mode: 'OUT_OF_SCOPE',
          refused: 'OUT_OF_SCOPE',
          reply: OUT_OF_SCOPE_REPLY,
          provider: 'none',
        })
        .returning();
      return toReply(row!, null, null);
    }

    const { ctx, lessonFull } = await this.context(courseId, target, body.run?.errors ?? null);
    const used = await this.hintsUsed(auth.userId, target.kind, target.id);
    const hintNumber = decision.advancesHint ? nextHint(used) : null;
    const plan: TutorPlan = {
      mode: decision.mode,
      level: body.level,
      hintNumber,
      refused: decision.refused,
      message: body.message,
      ctx,
      question: fallbackQuestion(decision.mode, body.level) ?? '',
    };
    const prompt = buildPrompt(plan, this.canary);
    const promptChars = prompt.system.length + prompt.user.length;
    const usageId = await this.usage.reserve(
      auth.userId,
      m.organizationId,
      promptChars,
      this.provider.name,
      this.provider.model,
    );

    let result;
    try {
      result = await this.provider.complete({ ...prompt, plan });
    } catch (e) {
      await this.usage.finish(usageId, {
        interactionId: null,
        model: this.provider.model,
        status: 'ERROR',
        completionChars: 0,
        attempts: e instanceof AiProviderError ? e.attempts : 1,
      });
      throw new ServiceUnavailableException(UNAVAILABLE);
    }

    const parsed = parseAnswer(result.text, plan.question || null);
    const reasons = guardReply(`${parsed.answer}\n${parsed.question ?? ''}`, {
      canary: this.canary,
      systemPrompt: prompt.system,
      hiddenStrings: hiddenRuleStrings(target.hiddenRules),
      visibleText: this.visibleText(ctx, lessonFull),
      secrets: [this.config.AI_PROVIDER_API_KEY ?? ''],
      targetKind: target.kind,
    });
    const blocked = reasons.length > 0;

    const row = await this.dbs.db.transaction(async (tx) => {
      if (!blocked && hintNumber !== null) {
        await tx
          .insert(aiHintStates)
          .values({
            userId: auth.userId,
            targetKind: target.kind,
            targetId: target.id,
            hintsUsed: hintNumber,
          })
          .onConflictDoUpdate({
            target: [aiHintStates.userId, aiHintStates.targetKind, aiHintStates.targetId],
            set: { hintsUsed: hintNumber, updatedAt: new Date() },
          });
      }
      const [inserted] = await tx
        .insert(aiInteractions)
        .values({
          ...base,
          mode: decision.mode,
          hintNumber: blocked ? null : hintNumber,
          reply: blocked ? BLOCKED_REPLY : parsed.answer,
          comprehensionQuestion: blocked ? null : parsed.question,
          refused: decision.refused,
          blocked,
          guardReasons: reasons,
          provider: this.provider.name,
        })
        .returning();
      return inserted!;
    });
    await this.usage.finish(usageId, {
      interactionId: row.id,
      model: result.model,
      status: blocked ? 'BLOCKED' : 'OK',
      completionChars: result.text.length,
      attempts: result.attempts,
    });
    if (blocked) {
      await this.audit.record({
        action: 'ai.output_blocked',
        actorUserId: auth.userId,
        organizationId: m.organizationId,
        targetType: target.kind.toLowerCase(),
        targetId: target.id,
        metadata: { reasons },
      });
    }
    return toReply(row, null, null);
  }

  /** Helpful / not helpful on the student's own interaction. No effect on grades or progress. */
  async feedback(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    interactionId: string,
    helpful: boolean,
    reason: string | undefined,
  ): Promise<{ helpful: boolean }> {
    const [row] = await this.dbs.db
      .select({ id: aiInteractions.id })
      .from(aiInteractions)
      .where(
        and(
          eq(aiInteractions.id, interactionId),
          eq(aiInteractions.userId, auth.userId),
          eq(aiInteractions.courseId, courseId),
          eq(aiInteractions.organizationId, m.organizationId),
        ),
      )
      .limit(1);
    if (!row) throw new NotFoundException('Javob topilmadi');
    await this.dbs.db
      .insert(aiFeedback)
      .values({ interactionId, userId: auth.userId, helpful, reason: reason || null })
      .onConflictDoUpdate({
        target: aiFeedback.interactionId,
        set: { helpful, reason: reason || null, updatedAt: new Date() },
      });
    return { helpful };
  }

  // ---------------------------------------------------------------- staff

  /** Teacher handoff requests for a course the caller manages. */
  async handoffs(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
  ): Promise<TutorHandoffView[]> {
    await this.access.manageableCourse(auth, m, courseId);
    const resolver = alias(users, 'resolver');
    const rows = await this.dbs.db
      .select({ h: aiHandoffs, name: users.fullName, resolvedByName: resolver.fullName })
      .from(aiHandoffs)
      .innerJoin(users, eq(users.id, aiHandoffs.userId))
      .leftJoin(resolver, eq(resolver.id, aiHandoffs.resolvedBy))
      .where(eq(aiHandoffs.courseId, courseId))
      // Open requests first, newest first within each.
      .orderBy(sql`${aiHandoffs.resolvedAt} is not null`, desc(aiHandoffs.createdAt))
      .limit(100);
    const exIds = rows.filter((r) => r.h.targetKind === 'EXERCISE').map((r) => r.h.targetId);
    const asIds = rows.filter((r) => r.h.targetKind === 'ASSIGNMENT').map((r) => r.h.targetId);
    const titles = new Map<string, string>();
    if (exIds.length) {
      for (const e of await this.dbs.db
        .select({ id: exercises.id, title: exercises.title })
        .from(exercises)
        .where(inArray(exercises.id, exIds))) {
        titles.set(e.id, e.title);
      }
    }
    if (asIds.length) {
      for (const a of await this.dbs.db
        .select({ id: assignments.id, title: assignments.title })
        .from(assignments)
        .where(inArray(assignments.id, asIds))) {
        titles.set(a.id, a.title);
      }
    }
    return rows.map((r) => ({
      id: r.h.id,
      studentId: r.h.userId,
      studentName: r.name,
      targetKind: r.h.targetKind,
      targetId: r.h.targetId,
      targetTitle: titles.get(r.h.targetId) ?? '',
      category: r.h.category,
      note: r.h.note,
      createdAt: r.h.createdAt.toISOString(),
      resolvedAt: r.h.resolvedAt?.toISOString() ?? null,
      resolvedByName: r.h.resolvedAt ? r.resolvedByName : null,
    }));
  }

  /** Marks a handoff of this course handled, or reopens it. Grades and progress are untouched. */
  async resolveHandoff(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    handoffId: string,
    resolved: boolean,
  ): Promise<TutorHandoffView> {
    await this.access.manageableCourse(auth, m, courseId);
    const [row] = await this.dbs.db
      .update(aiHandoffs)
      .set(
        resolved
          ? { resolvedAt: new Date(), resolvedBy: auth.userId }
          : { resolvedAt: null, resolvedBy: null },
      )
      .where(
        and(
          eq(aiHandoffs.id, handoffId),
          eq(aiHandoffs.courseId, courseId),
          eq(aiHandoffs.organizationId, m.organizationId),
        ),
      )
      .returning({ id: aiHandoffs.id });
    if (!row) throw new NotFoundException('Murojaat topilmadi');
    await this.audit.record({
      action: resolved ? 'ai.handoff_resolve' : 'ai.handoff_reopen',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'ai_handoff',
      targetId: handoffId,
      metadata: {},
    });
    const view = (await this.handoffs(auth, m, courseId)).find((h) => h.id === handoffId);
    if (!view) throw new NotFoundException('Murojaat topilmadi');
    return view;
  }

  // ---------------------------------------------------------------- context

  /**
   * Re-uses the student-facing services, so the same access rules apply (published course,
   * enrollment, unlocked lesson, active exercise / non-draft assignment) and only
   * student-safe data is ever read: hidden CHECK rules are not part of these views.
   */
  private async loadTarget(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    kind: TutorTargetKind,
    id: string,
  ): Promise<Target> {
    const db = this.dbs.db;
    if (kind === 'EXERCISE') {
      const view = await this.exercisesService.view(auth, m, courseId, id);
      const check = await this.checks.latest(auth, m, courseId, id);
      const [row] = await db
        .select({ checks: exercises.checks })
        .from(exercises)
        .where(and(eq(exercises.id, id), eq(exercises.courseId, courseId)));
      return {
        kind,
        id,
        lessonId: view.lessonId,
        hiddenRules: row?.checks ?? [],
        ctx: {
          target: {
            kind,
            title: view.title,
            instructions: [view.description, view.instructions].filter(Boolean).join('\n\n'),
            expectedBehavior: view.expectedBehavior,
            requirements: [],
            status: view.status,
          },
          files: boundFiles(view.files),
          check: summarize(check),
          run: null,
          teacherFeedback: view.teacherNote?.slice(0, FEEDBACK_CHARS) ?? null,
        },
      };
    }
    const view = await this.assignmentsService.view(auth, m, courseId, id);
    const [row] = await db
      .select({ checks: assignments.checks })
      .from(assignments)
      .where(and(eq(assignments.id, id), eq(assignments.courseId, courseId)));
    if (!row) throw new ForbiddenException();
    return {
      kind,
      id,
      lessonId: view.lessonId,
      hiddenRules: row.checks,
      ctx: {
        target: {
          kind,
          title: view.title,
          instructions: view.instructions,
          expectedBehavior: '',
          requirements: view.requirements,
          status: view.submission.status,
        },
        files: boundFiles(view.submission.files),
        check: summarize(view.versions.at(-1)?.check ?? null),
        run: null,
        teacherFeedback: view.review?.feedback.slice(0, FEEDBACK_CHARS) ?? null,
      },
    };
  }

  private async context(
    courseId: string,
    target: Target,
    runErrors: string[] | null,
  ): Promise<{ ctx: TutorContext; lessonFull: string }> {
    const lesson = await this.lessonInfo(courseId, target.lessonId);
    return {
      lessonFull: lesson.content,
      ctx: {
        courseTitle: lesson.courseTitle,
        moduleTitle: lesson.moduleTitle,
        lessonTitle: lesson.title,
        lessonText: lesson.content.slice(0, LESSON_CHARS),
        ...target.ctx,
        run: runErrors && runErrors.length ? { errors: runErrors } : null,
      },
    };
  }

  private async lessonInfo(courseId: string, lessonId: string) {
    const [row] = await this.dbs.db
      .select({
        title: lessons.title,
        content: lessons.content,
        moduleTitle: modules.title,
        courseTitle: courses.title,
      })
      .from(lessons)
      .innerJoin(modules, eq(modules.id, lessons.moduleId))
      .innerJoin(courses, eq(courses.id, lessons.courseId))
      .where(and(eq(lessons.id, lessonId), eq(lessons.courseId, courseId)));
    if (!row) throw new NotFoundException('Dars topilmadi');
    return row;
  }

  /** What the student can already see; hidden-rule strings found here are not secrets. */
  private visibleText(ctx: TutorContext, lessonFull: string): string {
    return [
      lessonFull,
      ctx.target.title,
      ctx.target.instructions,
      ctx.target.expectedBehavior,
      ...ctx.target.requirements,
      ...ctx.files.map((f) => f.content),
      ...(ctx.check?.failing.map((f) => `${f.title} ${f.hint ?? ''}`) ?? []),
      ...(ctx.check?.passing ?? []),
      ctx.teacherFeedback ?? '',
    ].join('\n');
  }

  private async hintsUsed(userId: string, kind: TutorTargetKind, targetId: string) {
    const [row] = await this.dbs.db
      .select({ n: aiHintStates.hintsUsed })
      .from(aiHintStates)
      .where(
        and(
          eq(aiHintStates.userId, userId),
          eq(aiHintStates.targetKind, kind),
          eq(aiHintStates.targetId, targetId),
        ),
      );
    return row?.n ?? 0;
  }

  private async handoffIds(interactionIds: string[]): Promise<Map<string, string>> {
    if (interactionIds.length === 0) return new Map();
    const rows = await this.dbs.db
      .select({ id: aiHandoffs.id, interactionId: aiHandoffs.interactionId })
      .from(aiHandoffs)
      .where(inArray(aiHandoffs.interactionId, interactionIds));
    return new Map(rows.map((r) => [r.interactionId!, r.id]));
  }
}

function boundFiles(files: { path: string; content: string }[]): TutorContext['files'] {
  let budget = FILES_TOTAL_CHARS;
  return files.map((f) => {
    const limit = Math.max(0, Math.min(FILE_CHARS, budget));
    budget -= Math.min(f.content.length, limit);
    return {
      path: f.path,
      content: f.content.slice(0, limit),
      truncated: f.content.length > limit,
    };
  });
}

function summarize(check: CheckRunView | null): TutorContext['check'] {
  if (!check) return null;
  return {
    status: check.status,
    passed: check.passedCount,
    total: check.total,
    failing: check.checks.filter((c) => !c.passed).map((c) => ({ title: c.title, hint: c.hint })),
    passing: check.checks.filter((c) => c.passed).map((c) => c.title),
    hiddenFailed: check.hidden.total - check.hidden.passed,
  };
}

function toReply(
  row: typeof aiInteractions.$inferSelect,
  handoffId: string | null,
  feedback: { helpful: boolean } | null,
): TutorReply {
  return {
    interactionId: row.id,
    mode: row.mode,
    level: row.level,
    hintNumber: row.hintNumber,
    message: row.reply,
    comprehensionQuestion: row.comprehensionQuestion,
    refused: (row.refused as TutorReply['refused']) ?? null,
    blocked: row.blocked,
    handoffId,
    createdAt: row.createdAt.toISOString(),
    feedback,
  };
}
