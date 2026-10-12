import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { auditEvents, sessions, users } from '../src/db/schema';
import { PASSWORD, sessionCookie, setup, type TestContext } from './helpers';

let ctx: TestContext;

beforeAll(async () => {
  ctx = await setup({ LOGIN_MAX_FAILURES: '3' });
});
afterAll(async () => {
  await ctx.app.close();
});

const register = (email: string, extra: Record<string, unknown> = {}) =>
  ctx
    .http()
    .post('/auth/register')
    .send({ email, password: PASSWORD, fullName: 'Ali Valiyev', ...extra });

describe('health', () => {
  it('reports live and ready without a session', async () => {
    await ctx.http().get('/health').expect(200, { status: 'ok' });
    await ctx
      .http()
      .get('/health/ready')
      .expect(200, { status: 'ready', checks: { database: 'ok', checkWorker: 'not_used' } });
  });
});

describe('register', () => {
  it('creates a STUDENT in the default org and sets a hardened session cookie', async () => {
    const res = await register('Talaba1@Example.uz').expect(201);
    expect(res.body.email).toBe('talaba1@example.uz');
    expect(res.body.memberships).toHaveLength(1);
    expect(res.body.memberships[0].role).toBe('STUDENT');
    expect(JSON.stringify(res.body)).not.toMatch(/password|hash|token/i);

    const cookie = (res.headers['set-cookie'] as unknown as string[]).join(';');
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
  });

  it('stores an Argon2id hash, never the raw password', async () => {
    const [u] = await ctx.handle.db
      .select({ hash: users.passwordHash })
      .from(users)
      .where(eq(users.email, 'talaba1@example.uz'));
    expect(u!.hash.startsWith('$argon2id$')).toBe(true);
    expect(u!.hash).not.toContain(PASSWORD);
  });

  it('ignores a client-supplied role', async () => {
    const res = await register('hacker@example.uz', { role: 'ORG_ADMIN' }).expect(201);
    expect(res.body.memberships.map((m: { role: string }) => m.role)).toEqual(['STUDENT']);
  });

  it('rejects duplicate email case-insensitively', async () => {
    await register('TALABA1@example.uz').expect(409);
  });

  it('validates input', async () => {
    await ctx.http().post('/auth/register').send({ email: 'x', password: '1' }).expect(400);
  });

  it('writes an audit event', async () => {
    const rows = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.action, 'auth.register'));
    expect(rows.length).toBeGreaterThan(0);
  });
});

describe('login / me / logout', () => {
  it('logs in, reads /me, logs out and invalidates the session server-side', async () => {
    await register('talaba2@example.uz').expect(201);
    const res = await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'TALABA2@example.uz', password: PASSWORD })
      .expect(200);
    const cookie = sessionCookie(res);

    const me = await ctx.http().get('/auth/me').set('Cookie', cookie).expect(200);
    expect(me.body.email).toBe('talaba2@example.uz');

    await ctx.http().post('/auth/logout').set('Cookie', cookie).expect(204);
    await ctx.http().get('/auth/me').set('Cookie', cookie).expect(401);
  });

  it('returns the same neutral error for unknown email and wrong password', async () => {
    const a = await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'nobody@example.uz', password: PASSWORD })
      .expect(401);
    const b = await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'talaba2@example.uz', password: 'wrong-password-123' })
      .expect(401);
    expect(a.body.message).toBe(b.body.message);
  });

  it('rate-limits repeated failures for the same email', async () => {
    const attempt = () =>
      ctx
        .http()
        .post('/auth/login')
        .send({ email: 'limited@example.uz', password: 'wrong-password-123' });
    for (let i = 0; i < 3; i++) await attempt().expect(401);
    await attempt().expect(429);
  });

  it('rejects requests without a session', async () => {
    await ctx.http().get('/auth/me').expect(401);
  });

  it('rejects a forged or garbage cookie', async () => {
    await ctx.http().get('/auth/me').set('Cookie', 'wd_session=forged-token').expect(401);
  });

  it('rejects an expired session', async () => {
    const res = await register('talaba3@example.uz').expect(201);
    const cookie = sessionCookie(res);
    const [u] = await ctx.handle.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, 'talaba3@example.uz'));
    await ctx.handle.db
      .update(sessions)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(sessions.userId, u!.id));
    await ctx.http().get('/auth/me').set('Cookie', cookie).expect(401);
  });

  it('rejects an idle session', async () => {
    const res = await register('talaba4@example.uz').expect(201);
    const cookie = sessionCookie(res);
    const [u] = await ctx.handle.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, 'talaba4@example.uz'));
    await ctx.handle.db
      .update(sessions)
      .set({ lastSeenAt: new Date(Date.now() - 48 * 3600 * 1000) })
      .where(eq(sessions.userId, u!.id));
    await ctx.http().get('/auth/me').set('Cookie', cookie).expect(401);
  });
});

describe('origin check', () => {
  it('blocks state-changing requests from a foreign origin', async () => {
    await ctx
      .http()
      .post('/auth/login')
      .set('Origin', 'https://evil.example')
      .send({ email: 'talaba2@example.uz', password: PASSWORD })
      .expect(403);
  });

  it('allows the configured web origin', async () => {
    await ctx
      .http()
      .post('/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'talaba2@example.uz', password: PASSWORD })
      .expect(200);
  });
});
