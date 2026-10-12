import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { desc, eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { aiUsage } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

/**
 * The real HTTP provider over real sockets, against a local OpenAI-compatible fake.
 * Verifies what actually leaves the server: headers, body, retries and error handling.
 */
const KEY = 'test-provider-key-0123456789';

interface Seen {
  auth: string | undefined;
  body: string;
}
let fake: Server;
let seen: Seen[] = [];
let plan: Array<{ status: number; content?: string }> = [];

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => resolve(data));
  });
}

let ctx: TestContext;
let ask: (body?: object) => ReturnType<ReturnType<TestContext['http']>['post']>;
let studentId: string;

beforeAll(async () => {
  fake = createServer(async (req, res) => {
    seen.push({ auth: req.headers.authorization, body: await readBody(req) });
    const next = plan.shift() ?? {
      status: 200,
      content: JSON.stringify({
        answer: 'HTTP javob: `h1` tegini ko‘rib chiqing.',
        question: 'Nima uchun?',
      }),
    };
    res.statusCode = next.status;
    res.setHeader('content-type', 'application/json');
    res.end(
      next.status === 200
        ? JSON.stringify({ choices: [{ message: { content: next.content } }] })
        : JSON.stringify({ error: `upstream detail with ${KEY}` }),
    );
  });
  await new Promise<void>((r) => fake.listen(0, '127.0.0.1', r));
  const port = (fake.address() as AddressInfo).port;

  ctx = await setup({
    AI_PROVIDER: 'http',
    AI_ALLOW_REAL_STUDENT_DATA: 'true',
    AI_PROVIDER_URL: `http://127.0.0.1:${port}/v1/chat/completions`,
    AI_PROVIDER_API_KEY: KEY,
    AI_PROVIDER_MODEL: 'fake-model',
    AI_MAX_ATTEMPTS: '3',
    AI_REQUEST_TIMEOUT_MS: '2000',
    AI_RATE_PER_MINUTE: '100',
  });
  expect(ctx.config.aiMode).toBe('http');

  const org = await createOrg(ctx, 'org');
  const t = await createMember(ctx, 't@a.uz', org, 'TEACHER');
  const s = await createMember(ctx, 's@a.uz', org, 'STUDENT');
  studentId = s.userId;
  const r = (
    who: { cookie: string },
    method: 'post' | 'patch' | 'put',
    path: string,
    body?: object,
  ) => {
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
  const e = (
    await r(t, 'post', `${base}/lessons/${l}/exercises`, {
      title: 'Mashq',
      checks: [
        {
          id: 'h',
          title: 'Yashirin qoida',
          hidden: true,
          assert: { type: 'count', selector: '.juda-maxfiy', min: 1 },
        },
      ],
    })
  ).body.id;
  await r(t, 'patch', base, { status: 'PUBLISHED' });
  await r(s, 'post', `${base}/enroll`);
  await r(s, 'put', `${base}/exercises/${e}/workspace`, {
    files: [{ path: 'index.html', content: '<p>talaba kodi</p>' }],
  });
  ask = (body = {}) =>
    r(s, 'post', `${base}/tutor/ask`, {
      targetKind: 'EXERCISE',
      targetId: e,
      mode: 'CODE_EXPLANATION',
      ...body,
    });
});
afterAll(async () => {
  await ctx.app.close();
  await new Promise((r) => fake.close(r));
});

describe('HTTP AI provider end to end', () => {
  it('sends the key only in the Authorization header and returns the model’s answer', async () => {
    seen = [];
    const res = await ask().expect(200);
    expect(res.body).toMatchObject({ blocked: false, comprehensionQuestion: 'Nima uchun?' });
    expect(res.body.message).toContain('HTTP javob');
    expect(seen).toHaveLength(1);
    expect(seen[0]!.auth).toBe(`Bearer ${KEY}`);
    expect(seen[0]!.body).not.toContain(KEY);
    const body = JSON.parse(seen[0]!.body);
    expect(body.model).toBe('fake-model');
    expect(body.messages[1].content).toContain('talaba kodi');
    expect(seen[0]!.body).not.toContain('.juda-maxfiy');
    expect(seen[0]!.body).not.toContain('s@a.uz');
  });

  it('retries transient upstream errors and records the attempts', async () => {
    seen = [];
    plan = [{ status: 503 }, { status: 502 }];
    await ask().expect(200);
    expect(seen).toHaveLength(3);
    const [usage] = await ctx.handle.db
      .select({ attempts: aiUsage.attempts, status: aiUsage.status })
      .from(aiUsage)
      .where(eq(aiUsage.userId, studentId))
      .orderBy(desc(aiUsage.createdAt))
      .limit(1);
    expect(usage).toEqual({ attempts: 3, status: 'OK' });
  });

  it('turns an upstream failure into a safe 503 without leaking details', async () => {
    plan = [{ status: 500 }, { status: 500 }, { status: 500 }];
    const res = await ask().expect(503);
    expect(res.body.code).toBe('AI_UNAVAILABLE');
    expect(JSON.stringify(res.body)).not.toContain(KEY);
    expect(JSON.stringify(res.body)).not.toContain('upstream');
  });

  it('blocks a real model answer that leaks a hidden check', async () => {
    plan = [
      {
        status: 200,
        content: JSON.stringify({ answer: 'Sizga .juda-maxfiy elementi kerak', question: 'Nima?' }),
      },
    ];
    const res = await ask().expect(200);
    expect(res.body.blocked).toBe(true);
    expect(res.body.message).not.toContain('.juda-maxfiy');
  });
});
