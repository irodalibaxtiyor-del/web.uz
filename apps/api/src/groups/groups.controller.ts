import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { groupExportQuerySchema, type GroupExportQuery } from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { attachmentHeader, XLSX_MIME } from '../common/xlsx';
import { ZodPipe } from '../common/zod.pipe';
import { DbService } from '../db/db.module';
import { auditEvents } from '../db/schema';
import { buildGroupExport } from './group-export';
import { MonitoringService } from './monitoring.service';

/**
 * Group panel for teachers (assigned groups only) and administrators (all groups). The role
 * check here admits both; MonitoringService decides which groups each caller can reach.
 */
@Controller('orgs/:orgId/groups')
export class GroupsController {
  constructor(
    private readonly monitoring: MonitoringService,
    private readonly dbs: DbService,
  ) {}

  @Get()
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  list(@CurrentAuth() auth: AuthContext, @CurrentMembership() m: MembershipContext) {
    return this.monitoring.accessibleGroups(auth, m);
  }

  @Get('export.xlsx')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  async export(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Query(new ZodPipe(groupExportQuerySchema)) q: GroupExportQuery,
    @Res() res: Response,
  ) {
    const file = await buildGroupExport(this.dbs.db, this.monitoring, auth, m, q);
    await this.dbs.db.insert(auditEvents).values({
      action: 'group.export',
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'organization',
      targetId: m.organizationId,
      metadata: file.meta,
    });
    res.setHeader('Content-Type', XLSX_MIME);
    res.setHeader('Content-Disposition', attachmentHeader(file.fileName));
    res.setHeader('Cache-Control', 'no-store');
    res.send(file.data);
  }

  @Get(':groupId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  overview(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
  ) {
    return this.monitoring.overview(auth, m, groupId);
  }

  @Get(':groupId/students/:studentId')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  student(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('studentId', Id) studentId: string,
  ) {
    return this.monitoring.student(auth, m, groupId, studentId);
  }
}
