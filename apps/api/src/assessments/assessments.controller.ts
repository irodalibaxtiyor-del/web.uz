import {
  Body,
  Controller,
  Get,
  HttpCode,
  Injectable,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  type PipeTransform,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ASSESSMENT_LABEL,
  assessmentKindFromSlug,
  submitQuizSchema,
  upsertAssessmentSchema,
  type AssessmentKind,
  type SubmitQuizInput,
  type UpsertAssessmentInput,
} from '@webdizayn/shared';
import { z } from 'zod';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { attachmentHeader, buildXlsx, XLSX_MIME } from '../common/xlsx';
import { ZodPipe } from '../common/zod.pipe';
import { AssessmentsService } from './assessments.service';

/** `kirish` → PRETEST, `yakuniy` → POSTTEST; anything else is a 404. */
@Injectable()
class KindPipe implements PipeTransform<string, AssessmentKind> {
  transform(value: string): AssessmentKind {
    const kind = assessmentKindFromSlug(value);
    if (!kind) throw new NotFoundException('Test topilmadi');
    return kind;
  }
}

const resultsQuerySchema = z.object({ groupId: z.string().uuid().optional() });
type ResultsQuery = z.infer<typeof resultsQuerySchema>;

const pct = (x: number | null) => (x === null ? null : Math.round(x * 10) / 10);
const r3 = (x: number | null) => (x === null ? null : Math.round(x * 1000) / 1000);

@Controller('orgs/:orgId/courses/:courseId/assessments')
export class AssessmentsController {
  constructor(
    private readonly assessments: AssessmentsService,
    private readonly audit: AuditService,
  ) {}

  // ---- Staff ------------------------------------------------------------

  @Get()
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  list(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.assessments.list(auth, m, courseId);
  }

  @Get('results')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  results(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Query(new ZodPipe(resultsQuerySchema)) q: ResultsQuery,
  ) {
    return this.assessments.results(auth, m, courseId, q.groupId);
  }

  @Get('results.xlsx')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  async export(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Query(new ZodPipe(resultsQuerySchema)) q: ResultsQuery,
    @Res() res: Response,
  ) {
    const r = await this.assessments.results(auth, m, courseId, q.groupId);
    const data = buildXlsx([
      {
        name: 'Natijalar',
        headerRows: 1,
        widths: [32, 14, 12, 12, 12, 12, 14, 14, 14],
        rows: [
          [
            'Talaba',
            'Guruh',
            `${ASSESSMENT_LABEL.PRETEST} (%)`,
            `${ASSESSMENT_LABEL.POSTTEST} (%)`,
            "O'sish (punkt)",
            'Hake g',
            'Kirish (daq.)',
            'Yakuniy (daq.)',
            'Faol vaqt (daq.)',
          ],
          ...r.rows.map((x) => [
            x.name,
            x.group,
            x.pre,
            x.post,
            x.gain,
            r3(x.normalizedGain),
            x.preMinutes,
            x.postMinutes,
            x.activeMinutes,
          ]),
        ],
      },
      {
        name: 'Statistika',
        headerRows: 1,
        widths: [44, 18],
        rows: [
          ["Ko'rsatkich", 'Qiymat'],
          ['Ikkala testni topshirganlar (n)', r.paired],
          ["Kirish testi: o'rtacha (%)", pct(r.preMean)],
          ['Kirish testi: standart chetlanish', pct(r.preSd)],
          ["Yakuniy test: o'rtacha (%)", pct(r.postMean)],
          ['Yakuniy test: standart chetlanish', pct(r.postSd)],
          ["O'rtacha o'sish (punkt)", pct(r.meanGain)],
          ["O'rtacha normallashtirilgan o'sish (Hake g)", r3(r.meanNormalizedGain)],
          ['Juftlangan t-mezoni: t', r3(r.t)],
          ['Erkinlik darajasi (df)', r.df],
          ['p-qiymat (ikki tomonlama)', r.p === null ? null : Number(r.p.toPrecision(3))],
          ['Effekt kattaligi (Cohen d_z)', r3(r.effectSize)],
          ['Wilcoxon: z', r3(r.wilcoxon?.z ?? null)],
          ['Wilcoxon: p', r.wilcoxon ? Number(r.wilcoxon.p.toPrecision(3)) : null],
          ['Farqlar normalligi, Shapiro–Wilk W', r3(r.diffNormality?.w ?? null)],
          ['Shapiro–Wilk p', r.diffNormality ? Number(r.diffNormality.p.toPrecision(3)) : null],
          [
            'Asosiy mezon',
            r.recommended === 'WILCOXON'
              ? 'Wilcoxon (normal emas)'
              : r.recommended
                ? 'Juftlangan t'
                : null,
          ],
          ["Faol vaqt, o'rtacha (daq.)", pct(r.meanActiveMinutes)],
          ['Faol vaqt ↔ yakuniy natija (Pearson r)', r3(r.timePostCorrelation)],
        ],
      },
    ]);
    await this.audit.record({
      action: 'assessment.export',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course',
      targetId: courseId,
      metadata: { rows: r.rows.length, groupId: q.groupId ?? null },
    });
    res.setHeader('Content-Type', XLSX_MIME);
    res.setHeader('Content-Disposition', attachmentHeader('kirish-yakuniy-test-natijalari.xlsx'));
    res.setHeader('Cache-Control', 'no-store');
    res.send(data);
  }

  @Put(':kind')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  upsert(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('kind', KindPipe) kind: AssessmentKind,
    @Body(new ZodPipe(upsertAssessmentSchema)) body: UpsertAssessmentInput,
  ) {
    return this.assessments.upsert(auth, m, courseId, kind, body);
  }

  // ---- Learners -----------------------------------------------------------

  @Get('mine')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  mine(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.assessments.mine(auth, m, courseId);
  }

  @Get(':kind')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  view(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('kind', KindPipe) kind: AssessmentKind,
  ) {
    return this.assessments.view(auth, m, courseId, kind);
  }

  @Post(':kind/start')
  @HttpCode(200)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  start(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('kind', KindPipe) kind: AssessmentKind,
  ) {
    return this.assessments.start(auth, m, courseId, kind);
  }

  @Post(':kind/submit')
  @HttpCode(200)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  submit(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('kind', KindPipe) kind: AssessmentKind,
    @Body(new ZodPipe(submitQuizSchema)) body: SubmitQuizInput,
  ) {
    return this.assessments.submit(auth, m, courseId, kind, body.answers);
  }
}
