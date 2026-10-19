import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { rosterImportSchema, type RosterImportInput } from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { GroupsService } from './groups.service';

/** Organization administrators only: groups and the student roster. */
@Controller('orgs/:orgId/admin')
export class AdminGroupsController {
  constructor(private readonly groups: GroupsService) {}

  @Get('groups')
  @OrgRoles('ORG_ADMIN')
  list(@CurrentMembership() m: MembershipContext) {
    return this.groups.list(m);
  }

  @Get('groups/:groupId/students')
  @OrgRoles('ORG_ADMIN')
  students(@CurrentMembership() m: MembershipContext, @Param('groupId', Id) groupId: string) {
    return this.groups.students(m, groupId);
  }

  /** Dry run: what the import would do. Writes nothing. */
  @Post('roster/preview')
  @HttpCode(200)
  @OrgRoles('ORG_ADMIN')
  preview(
    @CurrentMembership() m: MembershipContext,
    @Body(new ZodPipe(rosterImportSchema)) body: RosterImportInput,
  ) {
    return this.groups.previewRoster(m, body);
  }

  @Post('roster/import')
  @HttpCode(200)
  @OrgRoles('ORG_ADMIN')
  import(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Body(new ZodPipe(rosterImportSchema)) body: RosterImportInput,
  ) {
    return this.groups.importRoster(auth, m, body);
  }
}
