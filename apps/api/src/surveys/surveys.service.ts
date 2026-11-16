import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import {
  analyzeSurvey,
  validateSurveyAnswers,
  type CreateSurveyInput,
  type SurveyAdmin,
  type SurveyResponseInput,
  type SurveyResponseRow,
  type SurveyResults,
  type SurveyStudentView,
  type SurveySummary,
  type UpdateSurveyInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { CourseAccessService } from '../courses/course-access.service';
import { LearningService } from '../courses/learning.service';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import {
  courseExperimentGroups,
  courseSurveys,
  enrollments,
  groupStudents,
  surveyResponses,
} from '../db/schema';

type SurveyRow = typeof courseSurveys.$inferSelect;

const NOT_FOUND = 'So‘rovnoma topilmadi';
const LOCKED = {
  message: 'Javoblar kelgan: savollarni endi o‘zgartirib bo‘lmaydi',
  code: 'SURVEY_LOCKED',
};

/** jsonb does not keep object key order; compare canonically. */
function canonical(v: unknown): string {
  return JSON.stringify(v, (_k, x: unknown) =>
    x && typeof x === 'object' && !Array.isArray(x)
      ? Object.fromEntries(
          Object.entries(x as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)),
        )
      : x,
  );
}

@Injectable()
export class SurveysService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
    private readonly learning: LearningService,
    private readonly audit: AuditService,
  ) {}

  // ---- Staff ------------------------------------------------------------

  async list(auth: AuthContext, m: MembershipContext, courseId: string): Promise<SurveyAdmin[]> {
    await this.access.manageableCourse(auth, m, courseId);
    const rows = await this.dbs.db
      .select()
      .from(courseSurveys)
      .where(eq(courseSurveys.courseId, courseId))
      .orderBy(asc(courseSurveys.createdAt));
    const counts = await this.counts(rows.map((r) => r.id));
    return rows.map((r) => this.toAdmin(r, counts.get(r.id) ?? 0));
  }

  async get(auth: AuthContext, m: MembershipContext, courseId: string, id: string) {
    await this.access.manageableCourse(auth, m, courseId);
    const row = await this.surveyInCourse(this.dbs.db, courseId, id);
    return this.toAdmin(row, (await this.counts([row.id])).get(row.id) ?? 0);
  }

  async create(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    input: CreateSurveyInput,
  ): Promise<SurveyAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    const [row] = await this.dbs.db
      .insert(courseSurveys)
      .values({ ...input, courseId })
      .returning();
    await this.audit.record({
      action: 'survey.create',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course_survey',
      targetId: row!.id,
    });
    return this.toAdmin(row!, 0);
  }

  async update(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    id: string,
    input: UpdateSurveyInput,
  ): Promise<SurveyAdmin> {
    await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const row = await db.transaction(async (tx) => {
      const t = tx as unknown as Db;
      const [s] = await t
        .select()
        .from(courseSurveys)
        .where(and(eq(courseSurveys.id, id), eq(courseSurveys.courseId, courseId)))
        .for('update');
      if (!s) throw new NotFoundException(NOT_FOUND);
      const items = input.items ?? s.items;
      if ((input.isOpen ?? s.isOpen) && items.length === 0) {
        throw new BadRequestException('Ochiq so‘rovnomada kamida bitta savol bo‘lishi kerak');
      }
      if (input.items && canonical(input.items) !== canonical(s.items)) {
        const [{ n } = { n: 0 }] = await t
          .select({ n: sql<number>`count(*)::int` })
          .from(surveyResponses)
          .where(eq(surveyResponses.surveyId, s.id));
        if (n > 0) throw new ConflictException(LOCKED);
      }
      const [u] = await t
        .update(courseSurveys)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(courseSurveys.id, s.id))
        .returning();
      return u!;
    });
    return this.toAdmin(row, (await this.counts([row.id])).get(row.id) ?? 0);
  }

  async results(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    id: string,
  ): Promise<SurveyResults> {
    await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const s = await this.surveyInCourse(db, courseId, id);
    const responses = await db
      .select({
        userId: surveyResponses.userId,
        answers: surveyResponses.answers,
        role: courseExperimentGroups.role,
      })
      .from(surveyResponses)
      .leftJoin(
        groupStudents,
        and(
          eq(groupStudents.userId, surveyResponses.userId),
          eq(groupStudents.organizationId, m.organizationId),
        ),
      )
      .leftJoin(
        courseExperimentGroups,
        and(
          eq(courseExperimentGroups.groupId, groupStudents.groupId),
          eq(courseExperimentGroups.courseId, courseId),
        ),
      )
      .where(eq(surveyResponses.surveyId, s.id));
    const rows: SurveyResponseRow[] = responses.map((r) => ({
      userId: r.userId,
      role: r.role ?? null,
      answers: r.answers,
    }));
    const [{ n: enrolled } = { n: 0 }] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));
    const analysis = analyzeSurvey(s.items, rows);
    return {
      survey: { id: s.id, title: s.title, phase: s.phase, anonymous: s.anonymous },
      respondents: rows.length,
      enrolled,
      ...analysis,
    };
  }

  // ---- Learners -----------------------------------------------------------

  async mine(auth: AuthContext, m: MembershipContext, courseId: string): Promise<SurveySummary[]> {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const rows = await db
      .select({
        id: courseSurveys.id,
        title: courseSurveys.title,
        phase: courseSurveys.phase,
        responded: surveyResponses.id,
      })
      .from(courseSurveys)
      .leftJoin(
        surveyResponses,
        and(
          eq(surveyResponses.surveyId, courseSurveys.id),
          eq(surveyResponses.userId, auth.userId),
        ),
      )
      .where(and(eq(courseSurveys.courseId, courseId), eq(courseSurveys.isOpen, true)))
      .orderBy(asc(courseSurveys.createdAt));
    return rows.map((r) => ({ id: r.id, title: r.title, phase: r.phase, answered: !!r.responded }));
  }

  async view(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    id: string,
  ): Promise<SurveyStudentView> {
    const s = await this.learnerSurvey(auth, m, courseId, id);
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      // Reverse flags and subscales stay on the server: they could bias the answers.
      items: s.items.map(({ id: itemId, text, kind, required }) => ({
        id: itemId,
        text,
        kind,
        required,
      })),
      answered: !!(await this.responseOf(this.dbs.db, s.id, auth.userId)),
    };
  }

  async respond(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    id: string,
    input: SurveyResponseInput,
  ): Promise<SurveyStudentView> {
    const s = await this.learnerSurvey(auth, m, courseId, id);
    const problem = validateSurveyAnswers(s.items, input.answers);
    if (problem) throw new BadRequestException(problem);
    const answers = Object.fromEntries(
      Object.entries(input.answers).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
    );
    const [row] = await this.dbs.db
      .insert(surveyResponses)
      .values({ surveyId: s.id, userId: auth.userId, answers })
      .onConflictDoNothing()
      .returning();
    if (!row) {
      throw new ConflictException({
        message: 'Siz bu so‘rovnomaga javob bergansiz',
        code: 'SURVEY_ANSWERED',
      });
    }
    return this.view(auth, m, courseId, id);
  }

  // ---- Helpers ----------------------------------------------------------

  private async learnerSurvey(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
    id: string,
  ) {
    await this.access.publishedCourse(m.organizationId, courseId);
    const db = this.dbs.db;
    await this.learning.requireEnrollment(db, auth.userId, courseId);
    const s = await this.surveyInCourse(db, courseId, id);
    if (!s.isOpen) throw new NotFoundException(NOT_FOUND);
    return s;
  }

  private async surveyInCourse(db: Db, courseId: string, id: string): Promise<SurveyRow> {
    const [s] = await db
      .select()
      .from(courseSurveys)
      .where(and(eq(courseSurveys.id, id), eq(courseSurveys.courseId, courseId)))
      .limit(1);
    if (!s) throw new NotFoundException(NOT_FOUND);
    return s;
  }

  private async responseOf(db: Db, surveyId: string, userId: string) {
    const [r] = await db
      .select({ id: surveyResponses.id })
      .from(surveyResponses)
      .where(and(eq(surveyResponses.surveyId, surveyId), eq(surveyResponses.userId, userId)))
      .limit(1);
    return r;
  }

  private async counts(ids: string[]) {
    if (!ids.length) return new Map<string, number>();
    const rows = await this.dbs.db
      .select({ id: surveyResponses.surveyId, n: sql<number>`count(*)::int` })
      .from(surveyResponses)
      .where(inArray(surveyResponses.surveyId, ids))
      .groupBy(surveyResponses.surveyId);
    return new Map(rows.map((r) => [r.id, r.n]));
  }

  private toAdmin(r: SurveyRow, responses: number): SurveyAdmin {
    return {
      id: r.id,
      courseId: r.courseId,
      title: r.title,
      description: r.description,
      phase: r.phase,
      items: r.items,
      anonymous: r.anonymous,
      isOpen: r.isOpen,
      responses,
      locked: responses > 0,
    };
  }
}
