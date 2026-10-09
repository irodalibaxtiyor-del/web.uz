import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { and, eq } from 'drizzle-orm';
import type { Request } from 'express';
import type { Role } from '@webdizayn/shared';
import { ORG_ROLES } from '../common/decorators';
import { DbService } from '../db/db.module';
import { memberships } from '../db/schema';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolves the caller's membership in `:orgId` from the database.
 * Non-members get 404 so organization existence is not revealed; members
 * with an insufficient role get 403.
 */
@Injectable()
export class OrgRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dbs: DbService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(ORG_ROLES, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const orgId = req.params.orgId;
    if (!req.auth) throw new ForbiddenException();
    if (typeof orgId !== 'string' || !UUID_RE.test(orgId)) throw new NotFoundException();

    const [row] = await this.dbs.db
      .select({ role: memberships.role })
      .from(memberships)
      .where(and(eq(memberships.userId, req.auth.userId), eq(memberships.organizationId, orgId)))
      .limit(1);
    if (!row) throw new NotFoundException();
    if (!roles.includes(row.role)) throw new ForbiddenException("Ruxsat yo'q");

    req.membership = { organizationId: orgId, role: row.role };
    return true;
  }
}
