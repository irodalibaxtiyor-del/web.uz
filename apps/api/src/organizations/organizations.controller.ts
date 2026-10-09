import { Controller, Get } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CurrentMembership, OrgRoles } from '../common/decorators';
import type { MembershipContext } from '../common/types';
import { DbService } from '../db/db.module';
import { memberships, users } from '../db/schema';

@Controller('orgs/:orgId')
export class OrganizationsController {
  constructor(private readonly dbs: DbService) {}

  /** Teachers and admins can see who is in their organization; students cannot. */
  @Get('members')
  @OrgRoles('TEACHER', 'ORG_ADMIN')
  members(@CurrentMembership() m: MembershipContext) {
    return this.dbs.db
      .select({ userId: users.id, fullName: users.fullName, role: memberships.role })
      .from(memberships)
      .innerJoin(users, eq(users.id, memberships.userId))
      .where(eq(memberships.organizationId, m.organizationId))
      .orderBy(users.fullName);
  }
}
