import { afterEach, describe, expect, it } from 'vitest';
import { MockProvider, type AiProvider, type ProviderRequest } from '../src/ai/provider';
import { loadConfig } from '../src/config';
import { createMember, createOrg, PASSWORD, setup, type TestContext } from './helpers';

/** Phase 14A: hardening found during the security audit. */

let open: TestContext[] = [];
async function app(env: Record<string, string> = {}, aiProvider?: AiProvider) {
  const ctx = await setup(env, aiProvider ? { aiProvider } : {});
  open.push(ctx);
  return ctx;
}
afterEach(async () => {
  for (const c of open) await c.app.close();
  open = [];
});

const login = (ctx: TestContext, email: string, password: string, ip: string) =>
  ctx.http().post('/auth/login').set('X-Forwarded-For', ip).send({ email, password });

describe('client IP behind the Next.js proxy', () => {
  it('an attacker cannot lock a victim out from another IP', async () => {
    const ctx = await app();
    const org = await createOrg(ctx, 'org');
    await createMember(ctx, 'victim@a.uz', org, 'STUDENT');
    for (let i = 0; i < 5; i++) {
      await login(ctx, 'victim@a.uz', 'wrong-password-123', '203.0.113.9').expect(401);
    }
    await login(ctx, 'victim@a.uz', 'wrong-password-123', '203.0.113.9').expect(429);
    // The victim, from their own address, still logs in.
    await login(ctx, 'victim@a.uz', PASSWORD, '198.51.100.7').expect(200);
  });

  it('without trusting the proxy every client shares one bucket (the old behaviour)', async () => {
    const ctx = await app({ TRUST_PROXY: 'false' });
    const org = await createOrg(ctx, 'org');
    await createMember(ctx, 'victim@a.uz', org, 'STUDENT');
    for (let i = 0; i < 5; i++) {
      await login(ctx, 'victim@a.uz', 'wrong-password-123', '203.0.113.9').expect(401);
    }
    await login(ctx, 'victim@a.uz', PASSWORD, '198.51.100.7').expect(429);
  });

  it('validates TRUST_PROXY', () => {
    expect(loadConfig({}).trustProxy).toEqual(['loopback']);
    expect(loadConfig({ TRUST_PROXY: '2' }).trustProxy).toBe(2);
    expect(loadConfig({ TRUST_PROXY: 'false' }).trustProxy).toBe(false);
    expect(loadConfig({ TRUST_PROXY: 'loopback, 10.0.0.0/8' }).trustProxy).toEqual([
      'loopback',
      '10.0.0.0/8',
    ]);
    expect(() => loadConfig({ TRUST_PROXY: 'x;y' })).toThrow(/TRUST_PROXY/);
  });
});

describe('anonymous endpoints are rate-limited per client', () => {
  it('limits sign-ups per IP', async () => {
    const ctx = await app({ REGISTER_MAX_PER_HOUR: '2' });
    const reg = (n: number, ip: string) =>
      ctx
        .http()
        .post('/auth/register')
        .set('X-Forwarded-For', ip)
        .send({ email: `u${n}@a.uz`, password: PASSWORD, fullName: `User ${n}` });
    await reg(1, '203.0.113.1').expect(201);
    await reg(2, '203.0.113.1').expect(201);
    const res = await reg(3, '203.0.113.1').expect(429);
    expect(res.body.code).toBe('REGISTER_RATE_LIMITED');
    await reg(4, '203.0.113.2').expect(201);
  });

  it('limits public portfolio lookups per IP', async () => {
    const ctx = await app({ PUBLIC_RATE_PER_MINUTE: '3' });
    const get = (ip: string) =>
      ctx.http().get('/portfolio/public/yoq-slug').set('X-Forwarded-For', ip);
    for (let i = 0; i < 3; i++) await get('203.0.113.5').expect(404);
    expect((await get('203.0.113.5').expect(429)).body.code).toBe('PUBLIC_RATE_LIMITED');
    await get('203.0.113.6').expect(404);
  });
});

describe('AI quota under concurrency', () => {
  class SlowProvider implements AiProvider {
    readonly name = 'mock' as const;
    readonly model = 'slow';
    private readonly mock = new MockProvider();
    async complete(req: ProviderRequest) {
      await new Promise((r) => setTimeout(r, 150));
      return this.mock.complete(req);
    }
  }

  it('lets exactly the daily number of parallel requests through', async () => {
    const ctx = await app(
      { AI_DAILY_REQUESTS: '2', AI_RATE_PER_MINUTE: '100' },
      new SlowProvider(),
    );
    const org = await createOrg(ctx, 'org');
    const t = await createMember(ctx, 't@a.uz', org, 'TEACHER');
    const s = await createMember(ctx, 's@a.uz', org, 'STUDENT');
    const r = (who: { cookie: string }, method: 'post' | 'patch', path: string, body?: object) => {
      const http = ctx.http();
      return http[method](path)
        .set('Cookie', who.cookie)
        .send(body ?? {});
    };
    const c = (await r(t, 'post', `/orgs/${org}/courses`, { title: 'Kurs', slug: 'kurs' })).body
      .course.id;
    const base = `/orgs/${org}/courses/${c}`;
    const m = (await r(t, 'post', `${base}/modules`, { title: 'Modul' })).body.id;
    const l = (await r(t, 'post', `${base}/modules/${m}/lessons`, { title: 'Dars' })).body.id;
    const e = (await r(t, 'post', `${base}/lessons/${l}/exercises`, { title: 'Mashq' })).body.id;
    await r(t, 'patch', base, { status: 'PUBLISHED' });
    await r(s, 'post', `${base}/enroll`);

    const results = await Promise.all(
      Array.from({ length: 6 }, () =>
        r(s, 'post', `${base}/tutor/ask`, {
          targetKind: 'EXERCISE',
          targetId: e,
          mode: 'CODE_EXPLANATION',
        }),
      ),
    );
    const statuses = results.map((x) => x.status).sort();
    expect(statuses).toEqual([200, 200, 429, 429, 429, 429]);
  });
});
