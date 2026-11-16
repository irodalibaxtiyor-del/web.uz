import { Body, Controller, Get, Param, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  EXPERIMENT_ROLE_LABEL,
  setExperimentGroupsSchema,
  type Comparison,
  type SetExperimentGroupsInput,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { attachmentHeader, buildXlsx, XLSX_MIME, type Cell } from '../common/xlsx';
import { ZodPipe } from '../common/zod.pipe';
import { DbService } from '../db/db.module';
import { AssessmentsService } from './assessments.service';
import { ExperimentService } from './experiment.service';

const n = (x: number | null | undefined, digits = 2): Cell =>
  x === null || x === undefined || !Number.isFinite(x) ? null : Number(x.toFixed(digits));
const p = (x: number | null | undefined): Cell =>
  x === null || x === undefined ? null : Number(x.toPrecision(3));

function comparisonRow(label: string, c: Comparison): Cell[] {
  return [
    label,
    n(c.difference),
    n(c.test?.t),
    n(c.test?.df, 1),
    p(c.test?.p),
    n(c.d),
    n(c.mannWhitney?.z),
    p(c.mannWhitney?.p),
    p(c.normalityP.experiment),
    p(c.normalityP.control),
    c.recommended === 'WELCH' ? 'Welch t' : 'Mann–Whitney U',
  ];
}

@Controller('orgs/:orgId/courses/:courseId/experiment')
export class ExperimentController {
  constructor(
    private readonly experiment: ExperimentService,
    private readonly assessments: AssessmentsService,
    private readonly dbs: DbService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  view(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
  ) {
    return this.experiment.view(auth, m, courseId);
  }

  @Put('groups')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  setGroups(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Body(new ZodPipe(setExperimentGroupsSchema)) body: SetExperimentGroupsInput,
  ) {
    return this.experiment.setGroups(auth, m, courseId, body);
  }

  @Get('report.xlsx')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  async report(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('courseId', Id) courseId: string,
    @Res() res: Response,
  ) {
    const v = await this.experiment.view(auth, m, courseId);
    const s = v.stats;
    const role = new Map(v.groups.map((g) => [g.id, g.role]));
    const rows = await this.assessments.resultRows(this.dbs.db, m.organizationId, courseId);
    const desc = (label: string, e: Cell, c: Cell): Cell[] => [label, e, c];
    const data = buildXlsx([
      {
        name: 'Xulosa',
        widths: [110],
        rows: [['Pedagogik tajriba: avtomatik xulosa'], ...v.conclusions.map((c) => [c])],
        headerRows: 1,
      },
      {
        name: 'Tavsifiy statistika',
        headerRows: 1,
        widths: [40, 18, 18],
        rows: [
          ["Ko'rsatkich", EXPERIMENT_ROLE_LABEL.EXPERIMENT, EXPERIMENT_ROLE_LABEL.CONTROL],
          desc('Talabalar soni', s.experiment.rows.length, s.control.rows.length),
          desc('Ikkala testni topshirgan (n)', s.experiment.paired, s.control.paired),
          desc("Kirish testi: o'rtacha", n(s.experiment.preMean), n(s.control.preMean)),
          desc('Kirish testi: SD', n(s.experiment.preSd), n(s.control.preSd)),
          desc("Yakuniy test: o'rtacha", n(s.experiment.postMean), n(s.control.postMean)),
          desc('Yakuniy test: SD', n(s.experiment.postSd), n(s.control.postSd)),
          desc("O'rtacha o'sish (punkt)", n(s.experiment.meanGain), n(s.control.meanGain)),
          desc(
            'Hake g (o‘rtacha)',
            n(s.experiment.meanNormalizedGain, 3),
            n(s.control.meanNormalizedGain, 3),
          ),
          desc('Guruh ichida juftlangan t', n(s.experiment.t), n(s.control.t)),
          desc(
            "Faol vaqt, o'rtacha (daq.)",
            n(s.experiment.meanActiveMinutes, 1),
            n(s.control.meanActiveMinutes, 1),
          ),
          desc(
            'Vaqt ↔ yakuniy natija (r)',
            n(s.experiment.timePostCorrelation, 3),
            n(s.control.timePostCorrelation, 3),
          ),
          desc('Guruh ichida p', p(s.experiment.p), p(s.control.p)),
          desc(
            `Yakuniy testdan o'tgan (≥ ${v.postPassingPercent}%)`,
            `${s.passRate.experiment.passed}/${s.passRate.experiment.total}`,
            `${s.passRate.control.passed}/${s.passRate.control.total}`,
          ),
        ],
      },
      {
        name: 'Taqqoslash',
        headerRows: 1,
        widths: [44, 12, 10, 8, 12, 10, 14, 10, 12, 12, 18],
        rows: [
          [
            'Taqqoslash (tajriba − nazorat)',
            'Farq',
            'Welch t',
            'df',
            'p (Welch)',
            'Cohen d',
            'Mann–Whitney z',
            'p (MW)',
            'SW p tajriba',
            'SW p nazorat',
            'Asosiy mezon',
          ],
          comparisonRow('Kirish testi (boshlang‘ich tenglik)', s.baseline),
          comparisonRow('Yakuniy test', s.post),
          comparisonRow("O'sish (yakuniy − kirish)", s.gain),
          comparisonRow('Hake g', s.normalizedGain),
          comparisonRow('Faol vaqt (daq.)', s.time),
          [],
          ['Yakuniy testdan o‘tish ulushi, Pearson χ² (2×2)', 'χ²', 'p'],
          ['', n(s.passRate.chi2, 3), p(s.passRate.p)],
        ],
      },
      {
        name: 'Talabalar',
        headerRows: 1,
        widths: [32, 14, 18, 12, 12, 12, 10],
        rows: [
          [
            'Talaba',
            'Guruh',
            'Rol',
            'Kirish %',
            'Yakuniy %',
            "O'sish",
            'Hake g',
            'Faol vaqt (daq.)',
          ],
          ...rows.map((r) => {
            const rr = r.groupId ? role.get(r.groupId) : null;
            return [
              r.name,
              r.group,
              rr ? EXPERIMENT_ROLE_LABEL[rr] : 'Tajribada emas',
              r.pre,
              r.post,
              r.gain,
              n(r.normalizedGain, 3),
              r.activeMinutes,
            ];
          }),
        ],
      },
    ]);
    await this.audit.record({
      action: 'experiment.export',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'course',
      targetId: courseId,
    });
    res.setHeader('Content-Type', XLSX_MIME);
    res.setHeader('Content-Disposition', attachmentHeader('pedagogik-tajriba.xlsx'));
    res.setHeader('Cache-Control', 'no-store');
    res.send(data);
  }
}
