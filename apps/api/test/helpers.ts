import 'reflect-metadata';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Role } from '@webdizayn/shared';
import request from 'supertest';
import { createApp } from '../src/app';
import type { CheckExecutor } from '../src/checks/check-executor';
import { PasswordService } from '../src/auth/password.service';
import { loadConfig, type AppConfig } from '../src/config';
import { createDb, type DbHandle } from '../src/db/client';
import { memberships, organizations, users } from '../src/db/schema';

export const PASSWORD = 'correct-horse-battery';

export interface TestContext {
  app: NestExpressApplication;
  handle: DbHandle;
  config: AppConfig;
  http: () => ReturnType<typeof request>;
}

export async function setup(
  env: Record<string, string> = {},
  opts: { checkExecutor?: CheckExecutor } = {},
): Promise<TestContext> {
  const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: 'pglite://memory', ...env });
  const handle = createDb(config.DATABASE_URL);
  const app = await createApp(config, { handle, ...opts });
  await app.init();
  return { app, handle, config, http: () => request(app.getHttpServer()) };
}

/** Returns the session cookie from a login/register response. */
export function sessionCookie(res: { headers: Record<string, unknown> }): string {
  const raw = res.headers['set-cookie'] as string[] | undefined;
  const cookie = raw?.find((c) => c.startsWith('wd_session='));
  if (!cookie) throw new Error('No session cookie in response');
  return cookie.split(';')[0]!;
}

export async function createOrg(ctx: TestContext, slug: string) {
  const [org] = await ctx.handle.db
    .insert(organizations)
    .values({ slug, name: slug })
    .returning({ id: organizations.id });
  return org!.id;
}

/** Inserts a user directly with the given role and returns a logged-in cookie. */
export async function createMember(ctx: TestContext, email: string, orgId: string, role: Role) {
  const passwordHash = await new PasswordService().hash(PASSWORD);
  const [u] = await ctx.handle.db
    .insert(users)
    .values({ email, fullName: email.split('@')[0]!, passwordHash })
    .returning({ id: users.id });
  await ctx.handle.db.insert(memberships).values({ userId: u!.id, organizationId: orgId, role });
  const res = await ctx.http().post('/auth/login').send({ email, password: PASSWORD }).expect(200);
  return { userId: u!.id, cookie: sessionCookie(res) };
}
