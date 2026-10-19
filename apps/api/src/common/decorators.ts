import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import type { Request } from 'express';
import type { Role } from '@webdizayn/shared';
import type { AuthContext, MembershipContext } from './types';

export const IS_PUBLIC = 'isPublic';
/** Marks a route as reachable without a session. Everything else requires one. */
export const Public = () => SetMetadata(IS_PUBLIC, true);

export const ALLOW_PENDING_PASSWORD = 'allowPendingPassword';
/** Routes still reachable while the user must replace a temporary password. */
export const AllowPendingPasswordChange = () => SetMetadata(ALLOW_PENDING_PASSWORD, true);

export const ORG_ROLES = 'orgRoles';
/**
 * Requires membership in the organization from the `:orgId` route param with one of the roles.
 * The role is always read from the database, never from the request.
 */
export const OrgRoles = (...roles: Role[]) => SetMetadata(ORG_ROLES, roles);

export const CurrentAuth = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthContext => {
    const auth = ctx.switchToHttp().getRequest<Request>().auth;
    if (!auth) throw new Error('CurrentAuth used on a route without AuthGuard');
    return auth;
  },
);

export const CurrentMembership = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): MembershipContext => {
    const membership = ctx.switchToHttp().getRequest<Request>().membership;
    if (!membership) throw new Error('CurrentMembership used on a route without OrgRoles');
    return membership;
  },
);
