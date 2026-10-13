import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMember, createOrg, setup, type TestContext } from './helpers';

/** Phase 14C: production readiness (logging, errors, monitoring, configuration). */
let open: TestContext[] = [];
afterEach(async () => {
  vi.restoreAllMocks();
  for (const c of open) await c.app.close().catch(() => {});
  open = [];
});
async function app(env: Record<string, string> = {}) {
  const ctx = await setup(env);
  open.push(ctx);
  return ctx;
}

function captureLogs() {
  const lines: string[] = [];
  const grab = (chunk: unknown) => {
    lines.push(String(chunk));
    return true;
  };
  vi.spyOn(process.stdout, 'write').mockImplementation(grab as never);
  vi.spyOn(process.stderr, 'write').mockImplementation(grab as never);
  return lines;
}

describe('request id', () => {
  it('generates one, keeps a well-formed incoming one and replaces a malformed one', async () => {
    const ctx = await app();
    const a = await ctx.http().get('/health').expect(200);
    expect(a.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
    const b = await ctx.http().get('/health').set('X-Request-Id', 'trace-1234567').expect(200);
    expect(b.headers['x-request-id']).toBe('trace-1234567');
    const c = await ctx.http().get('/health').set('X-Request-Id', 'bad id <script>').expect(200);
    expect(c.headers['x-request-id']).not.toContain('<');
  });
});

describe('structured logs', () => {
  it('log one JSON line per request without cookies, queries or bodies', async () => {
    const ctx = await app({ LOG_LEVEL: 'info', LOG_FORMAT: 'json' });
    const org = await createOrg(ctx, 'org');
    const s = await createMember(ctx, 's@a.uz', org, 'STUDENT');
    const lines = captureLogs();
    await ctx
      .http()
      .get('/auth/me?token=supersecret')
      .set('Cookie', s.cookie)
      .set('X-Request-Id', 'req-abcdef12')
      .expect(200);
    await ctx.http().post('/auth/login').send({ email: 's@a.uz', password: 'parol-sir-123' });
    vi.restoreAllMocks();
    const all = lines.join('');
    const entry = lines.map((l) => JSON.parse(l)).find((l) => l.requestId === 'req-abcdef12');
    expect(entry).toMatchObject({
      level: 'info',
      msg: 'request',
      method: 'GET',
      path: '/auth/me',
      status: 200,
    });
    for (const secret of ['supersecret', 'wd_session', s.cookie, 'parol-sir-123', 's@a.uz']) {
      expect(all).not.toContain(secret);
    }
  });
});

describe('errors', () => {
  it('answers unexpected failures with a generic 500 that carries only the request id', async () => {
    const ctx = await app({ LOG_LEVEL: 'error', LOG_FORMAT: 'json' });
    const org = await createOrg(ctx, 'org');
    const s = await createMember(ctx, 's@a.uz', org, 'STUDENT');
    await ctx.handle.close(); // the database disappears under a running app
    const lines = captureLogs();
    const res = await ctx
      .http()
      .get('/auth/me')
      .set('Cookie', s.cookie)
      .set('X-Request-Id', 'req-500-test');
    vi.restoreAllMocks();
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      statusCode: 500,
      message: 'Ichki xatolik yuz berdi',
      requestId: 'req-500-test',
    });
    const logged = lines.map((l) => JSON.parse(l)).find((l) => l.msg === 'unhandled_error');
    expect(logged).toMatchObject({
      level: 'error',
      requestId: 'req-500-test',
      error: 'DrizzleQueryError',
    });
    // A failed query's message carries its SQL parameters (here the session token hash).
    const token = /wd_session=([^;]+)/.exec(s.cookie)![1]!;
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const all = lines.join('\n');
    expect(all).not.toContain(tokenHash);
    expect(all).not.toContain('params:');
  });

  it('keeps client errors from middleware as 4xx', async () => {
    const ctx = await app();
    const res = await ctx
      .http()
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send('{"email": broken');
    expect(res.status).toBe(400);
  });
});

describe('monitoring', () => {
  const TOKEN = 'm'.repeat(40);

  it('/metrics is hidden unless a token is configured', async () => {
    const ctx = await app();
    await ctx.http().get('/metrics').expect(404);
  });

  it('/metrics requires the token and exposes request and CHECK queue metrics', async () => {
    const ctx = await app({ METRICS_TOKEN: TOKEN });
    await ctx.http().get('/health').expect(200);
    await ctx.http().get('/metrics').expect(401);
    await ctx
      .http()
      .get('/metrics')
      .set('Authorization', `Bearer ${'x'.repeat(40)}`)
      .expect(401);
    const res = await ctx
      .http()
      .get('/metrics')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toMatch(/http_requests_total\{method="GET",status="2xx"\} \d+/);
    expect(res.text).toContain('check_queue_pending 0');
    expect(res.text).toContain('process_resident_memory_bytes');
  });

  it('readiness reports an unreachable CHECK worker without failing', async () => {
    const ctx = await app({
      CHECK_ENGINE: 'remote',
      CHECK_WORKER_URL: 'http://127.0.0.1:1',
      CHECK_WORKER_TOKEN: 'w'.repeat(40),
    });
    const res = await ctx.http().get('/health/ready').expect(200);
    expect(res.body).toEqual({
      status: 'ready',
      checks: { database: 'ok', checkWorker: 'unavailable' },
    });
  });
});

describe('configuration', () => {
  it('documents every API environment variable in .env.example', () => {
    const config = readFileSync(join(__dirname, '..', 'src', 'config.ts'), 'utf8');
    const example = readFileSync(join(__dirname, '..', '..', '..', '.env.example'), 'utf8');
    const keys = [...config.matchAll(/^ {2}([A-Z][A-Z0-9_]+): z/gm)].map((m) => m[1]!);
    expect(keys.length).toBeGreaterThan(30);
    const missing = keys.filter((k) => !new RegExp(`^${k}=`, 'm').test(example));
    expect(missing).toEqual([]);
  });
});

describe('.env.example as a starting point', () => {
  it('loads when copied verbatim (empty values mean "not set")', async () => {
    const { loadConfig } = await import('../src/config');
    const example = readFileSync(join(__dirname, '..', '..', '..', '.env.example'), 'utf8');
    const env = Object.fromEntries(
      example
        .split('\n')
        .filter((l) => /^[A-Z][A-Z0-9_]*=/.test(l))
        .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
    );
    const c = loadConfig(env);
    expect(c).toMatchObject({ aiMode: 'mock', CHECK_ENGINE: 'process' });
    expect(c.METRICS_TOKEN).toBeUndefined();
  });
});
