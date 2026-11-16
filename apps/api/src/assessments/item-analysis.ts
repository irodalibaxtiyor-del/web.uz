import { Controller, Get, Injectable, Param, Res } from '@nestjs/common';
import { and, asc, eq, isNotNull } from 'drizzle-orm';
import type { Response } from 'express';
import {
  analyzeInstrument,
  ASSESSMENT_LABEL,
  ITEM_FLAG_LABEL,
  QUIZ_KIND_LABEL,
  summarizeByKind,
  type InstrumentAnalysis,
  type ItemAnalysisReport,
  type QuizQuestionResult,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { attachmentHeader, buildXlsx, XLSX_MIME, type Cell } from '../common/xlsx';
import { CourseAccessService } from '../courses/course-access.service';
import { DbService } from '../db/db.module';
import {
  assessmentAttempts,
  courseAssessments,
  lessons,
  quizAttempts,
  quizzes,
} from '../db/schema';

@Injectable()
export class ItemAnalysisService {
  constructor(
    private readonly dbs: DbService,
    private readonly access: CourseAccessService,
  ) {}

  async report(
    auth: AuthContext,
    m: MembershipContext,
    courseId: string,
  ): Promise<ItemAnalysisReport> {
    await this.access.manageableCourse(auth, m, courseId);
    const db = this.dbs.db;
    const instruments: InstrumentAnalysis[] = [];

    // Pre-/post-tests: one attempt per student by construction.
    const tests = await db
      .select()
      .from(courseAssessments)
      .where(eq(courseAssessments.courseId, courseId));
    for (const t of tests.sort((a) => (a.kind === 'PRETEST' ? -1 : 1))) {
      const rows = await db
        .select({ results: assessmentAttempts.results })
        .from(assessmentAttempts)
        .where(
          and(eq(assessmentAttempts.assessmentId, t.id), isNotNull(assessmentAttempts.submittedAt)),
        );
      instruments.push(
        analyzeInstrument(
          { id: t.id, source: t.kind, title: t.title, lessonTitle: null },
          t.questions,
          rows.map((r) => r.results ?? []).filter((r) => r.length > 0),
        ),
      );
    }

    // Lesson quizzes: each student's first graded attempt (later ones are practice).
    const qs = await db
      .select({ q: quizzes, lessonTitle: lessons.title })
      .from(quizzes)
      .innerJoin(lessons, eq(lessons.id, quizzes.lessonId))
      .where(eq(quizzes.courseId, courseId))
      .orderBy(asc(lessons.title));
    const attempts = await db
      .select({
        quizId: quizAttempts.quizId,
        userId: quizAttempts.userId,
        results: quizAttempts.results,
      })
      .from(quizAttempts)
      .where(eq(quizAttempts.courseId, courseId))
      .orderBy(asc(quizAttempts.createdAt));
    const first = new Map<string, Map<string, QuizQuestionResult[]>>();
    for (const a of attempts) {
      // Attempts stored before per-question results existed carry no item data.
      if (a.results.length === 0) continue;
      const byUser = first.get(a.quizId) ?? new Map<string, QuizQuestionResult[]>();
      if (!byUser.has(a.userId)) byUser.set(a.userId, a.results);
      first.set(a.quizId, byUser);
    }
    for (const { q, lessonTitle } of qs) {
      const rows = [...(first.get(q.id)?.values() ?? [])];
      if (rows.length === 0) continue;
      instruments.push(
        analyzeInstrument(
          { id: q.id, source: 'QUIZ', title: q.title, lessonTitle },
          q.questions,
          rows,
        ),
      );
    }
    return { instruments, byKind: summarizeByKind(instruments) };
  }
}

const n = (x: number | null | undefined, digits = 2): Cell =>
  x === null || x === undefined || !Number.isFinite(x) ? null : Number(x.toFixed(digits));

const SOURCE_LABEL = { QUIZ: 'Dars testi', ...ASSESSMENT_LABEL } as const;

@Controller('orgs/:orgId/courses/:courseId/item-analysis')
export class ItemAnalysisController {
  constructor(
    private readonly items: ItemAnalysisService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  report(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.items.report(auth, m, courseId);
  }

  @Get('report.xlsx')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  async export(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Res() res: Response,
  ) {
    const r = await this.items.report(auth, m, courseId);
    const data = buildXlsx([
      {
        name: 'Testlar',
        headerRows: 1,
        widths: [16, 40, 36, 12, 14, 16],
        rows: [
          ['Turi', 'Test', 'Dars', 'Javob berganlar', "O'rtacha %", 'Ishonchlilik (KR-20)'],
          ...r.instruments.map((x) => [
            SOURCE_LABEL[x.source],
            x.title,
            x.lessonTitle,
            x.respondents,
            n(x.meanScore, 1),
            n(x.reliability, 3),
          ]),
        ],
      },
      {
        name: 'Savollar',
        headerRows: 1,
        widths: [36, 60, 22, 8, 12, 14, 14, 40],
        rows: [
          ['Test', 'Savol', 'Turi', 'n', 'Qiyinlik p', 'Ajratish D', 'Biserial r', 'Belgi'],
          ...r.instruments.flatMap((x) =>
            x.questions.map((q) => [
              x.title,
              q.prompt,
              QUIZ_KIND_LABEL[q.kind],
              q.n,
              n(q.difficulty),
              n(q.discrimination),
              n(q.pointBiserial),
              q.flag ? ITEM_FLAG_LABEL[q.flag] : null,
            ]),
          ),
        ],
      },
      {
        name: 'Savol turlari',
        headerRows: 1,
        widths: [26, 10, 12, 16, 16],
        rows: [
          ['Savol turi', 'Savollar', 'Javoblar', "O'rtacha qiyinlik", "O'rtacha ajratish"],
          ...r.byKind.map((k) => [
            QUIZ_KIND_LABEL[k.kind],
            k.questions,
            k.answers,
            n(k.meanDifficulty),
            n(k.meanDiscrimination),
          ]),
        ],
      },
    ]);
    await this.audit.record({
      action: 'item_analysis.export',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course',
      targetId: courseId,
    });
    res.setHeader('Content-Type', XLSX_MIME);
    res.setHeader('Content-Disposition', attachmentHeader('test-savollari-tahlili.xlsx'));
    res.setHeader('Cache-Control', 'no-store');
    res.send(data);
  }
}
