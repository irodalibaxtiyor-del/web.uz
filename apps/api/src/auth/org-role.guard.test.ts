import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import type { DbService } from '../db/db.module';
import { OrgRoleGuard } from './org-role.guard';

const ORG = '00000000-0000-4000-8000-000000000001';

function ctxFor(params: Record<string, string>): ExecutionContext {
  const req = { params, auth: { userId: 'u1' } };
  return {
    getHandler: () => () => undefined,
    getClass: () => class {},
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
}

// No @OrgRoles metadata anywhere; the database must not even be consulted.
const guard = new OrgRoleGuard(new Reflector(), {} as DbService);

describe('OrgRoleGuard without @OrgRoles', () => {
  it('fails closed on an org-scoped route', async () => {
    await expect(guard.canActivate(ctxFor({ orgId: ORG }))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('lets routes without :orgId through (AuthGuard still applies)', async () => {
    await expect(guard.canActivate(ctxFor({}))).resolves.toBe(true);
  });
});
