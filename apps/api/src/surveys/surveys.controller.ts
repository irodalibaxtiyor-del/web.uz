import { Body, Controller, Get, HttpCode, Param, Patch, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  alphaLabel,
  createSurveySchema,
  LIKERT_LABELS,
  surveyResponseSchema,
  updateSurveySchema,
  type CreateSurveyInput,
  type SurveyResponseInput,
  type UpdateSurveyInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { attachmentHeader, buildXlsx, XLSX_MIME, type Cell } from '../common/xlsx';
import { ZodPipe } from '../common/zod.pipe';
import { SurveysService } from './surveys.service';

const n = (x: number | null | undefined, digits = 2): Cell =>
  x === null || x === undefined || !Number.isFinite(x) ? null : Number(x.toFixed(digits));

@Controller('orgs/:orgId/courses/:courseId/surveys')
export class SurveysController {
  constructor(
    private readonly surveys: SurveysService,
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
    return this.surveys.list(auth, m, courseId);
  }

  @Post()
  @HttpCode(201)
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  create(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Body(new ZodPipe(createSurveySchema)) body: CreateSurveyInput,
  ) {
    return this.surveys.create(auth, m, courseId, body);
  }

  @Get('mine')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  mine(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.surveys.mine(auth, m, courseId);
  }

  @Get(':surveyId/edit')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  get(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('surveyId', Id) id: string,
  ) {
    return this.surveys.get(auth, m, courseId, id);
  }

  @Patch(':surveyId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  update(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('surveyId', Id) id: string,
    @Body(new ZodPipe(updateSurveySchema)) body: UpdateSurveyInput,
  ) {
    return this.surveys.update(auth, m, courseId, id, body);
  }

  @Get(':surveyId/results')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  results(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('surveyId', Id) id: string,
  ) {
    return this.surveys.results(auth, m, courseId, id);
  }

  @Get(':surveyId/results.xlsx')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  async export(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('surveyId', Id) id: string,
    @Res() res: Response,
  ) {
    const r = await this.surveys.results(auth, m, courseId, id);
    const likert = r.items.filter((i) => i.kind === 'LIKERT');
    const texts = r.items.filter((i) => i.kind === 'TEXT');
    const data = buildXlsx([
      {
        name: 'Subshkalalar',
        headerRows: 1,
        widths: [28, 10, 8, 10, 10, 12, 16, 12, 12, 12, 10, 10],
        rows: [
          [
            'Subshkala',
            'Bandlar',
            'n',
            "O'rtacha",
            'SD',
            'Cronbach α',
            'Ishonchlilik',
            "Tajriba o'rt.",
            "Nazorat o'rt.",
            'Welch t',
            'p',
            'Cohen d',
          ],
          ...r.scales.map((s) => [
            s.scale,
            s.items,
            s.n,
            n(s.mean),
            n(s.sd),
            n(s.alpha, 3),
            alphaLabel(s.alpha),
            n(s.experiment?.mean),
            n(s.control?.mean),
            n(s.test?.t),
            s.test ? Number(s.test.p.toPrecision(3)) : null,
            n(s.d),
          ]),
        ],
      },
      {
        name: 'Bandlar',
        headerRows: 1,
        widths: [60, 16, 10, 6, 10, 8, 8, 8, 8, 8, 8],
        rows: [
          [
            'Band',
            'Subshkala',
            'Teskari',
            'n',
            "O'rtacha",
            'SD',
            ...LIKERT_LABELS.map((_, i) => String(i + 1)),
          ],
          ...likert.map((i) => [
            i.text,
            i.scale || 'Umumiy',
            i.reverse ? 'ha' : '',
            i.n,
            n(i.mean),
            n(i.sd),
            ...(i.distribution ?? []),
          ]),
        ],
      },
      {
        name: 'Ochiq javoblar',
        headerRows: 1,
        widths: [50, 90],
        rows: [
          ['Savol', 'Javob'],
          ...texts.flatMap((i) => (i.texts ?? []).map((t) => [i.text, t])),
        ],
      },
    ]);
    await this.audit.record({
      action: 'survey.export',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course_survey',
      targetId: id,
    });
    res.setHeader('Content-Type', XLSX_MIME);
    res.setHeader('Content-Disposition', attachmentHeader('sorovnoma-natijalari.xlsx'));
    res.setHeader('Cache-Control', 'no-store');
    res.send(data);
  }

  // ---- Learners -----------------------------------------------------------

  @Get(':surveyId')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  view(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('surveyId', Id) id: string,
  ) {
    return this.surveys.view(auth, m, courseId, id);
  }

  @Post(':surveyId/responses')
  @HttpCode(201)
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  respond(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Param('surveyId', Id) id: string,
    @Body(new ZodPipe(surveyResponseSchema)) body: SurveyResponseInput,
  ) {
    return this.surveys.respond(auth, m, courseId, id, body);
  }
}
