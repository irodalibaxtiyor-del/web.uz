import { createCheckWorkerServer } from '@webdizayn/check-engine';
import { checkRulesSchema } from '@webdizayn/shared';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RemoteCheckExecutor } from '../src/checks/check-executor';
import { loadConfig } from '../src/config';
import { createMember, createOrg, setup, type TestContext } from './helpers';

/** Phase 14B: CHECK through the separate worker service (production layout). */
const TOKEN = 't'.repeat(48);
const rules = checkRulesSchema.parse([
  { id: 'h1', title: 'Sarlavha bor', assert: { type: 'count', selector: 'h1' } },
]);
const files = [{ path: 'index.html', content: '<h1>Salom</h1>' }];

let real: Server;
let forged: Server;
let realUrl = '';
let forgedUrl = '';

async function listen(s: Server) {
  await new Promise<void>((r) => s.listen(0, '127.0.0.1', r));
  return `http://127.0.0.1:${(s.address() as AddressInfo).port}`;
}

beforeAll(async () => {
  real = createCheckWorkerServer({
    token: TOKEN,
    engine: { chromePath: process.env.CHECK_CHROME_PATH, budgetMs: 15_000 },
  });
  realUrl = await listen(real);
  // A compromised worker that claims PASSED while the rule failed.
  forged = createCheckWorkerServer({
    token: TOKEN,
    run: async (_f, r) => ({
      status: 'PASSED',
      errorCode: null,
      results: r.map((x) => ({ id: x.id, passed: false })),
      durationMs: 1,
    }),
  });
  forgedUrl = await listen(forged);
});
afterAll(async () => {
  await new Promise((r) => real.close(r));
  await new Promise((r) => forged.close(r));
});

const executor = (url: string, token = TOKEN) =>
  new RemoteCheckExecutor({
    CHECK_WORKER_URL: url,
    CHECK_WORKER_TOKEN: token,
    CHECK_BUDGET_MS: 15_000,
  });

describe('remote CHECK executor', () => {
  it('requires a worker URL and token when CHECK_ENGINE=remote', () => {
    expect(() => loadConfig({ CHECK_ENGINE: 'remote' })).toThrow(/CHECK_WORKER_URL/);
    expect(() =>
      loadConfig({
        CHECK_ENGINE: 'remote',
        CHECK_WORKER_URL: realUrl,
        CHECK_WORKER_TOKEN: 'short',
      }),
    ).toThrow(/CHECK_WORKER_TOKEN/);
  });

  it('gets a real verdict from the worker', async () => {
    expect(await executor(realUrl).run(files, rules)).toMatchObject({ status: 'PASSED' });
  });

  it('never accepts a PASS that is not backed by every rule', async () => {
    expect(await executor(forgedUrl).run(files, rules)).toMatchObject({
      status: 'FAILED',
      results: [{ id: 'h1', passed: false }],
    });
  });

  it('fails closed on a wrong token or an unreachable worker', async () => {
    await expect(executor(realUrl, 'x'.repeat(48)).run(files, rules)).rejects.toThrow(/401/);
    await expect(executor('http://127.0.0.1:1').run(files, rules)).rejects.toThrow();
  });
});

describe('API with CHECK_ENGINE=remote', () => {
  let ctx: TestContext;
  afterAll(async () => ctx?.app.close());

  it('runs a student CHECK through the worker end to end', async () => {
    ctx = await setup({
      CHECK_ENGINE: 'remote',
      CHECK_WORKER_URL: realUrl,
      CHECK_WORKER_TOKEN: TOKEN,
    });
    const org = await createOrg(ctx, 'org');
    const t = await createMember(ctx, 't@a.uz', org, 'TEACHER');
    const s = await createMember(ctx, 's@a.uz', org, 'STUDENT');
    const r = (
      who: { cookie: string },
      method: 'get' | 'post' | 'patch' | 'put',
      path: string,
      body?: object,
    ) => {
      const http = ctx.http();
      const req = http[method](path).set('Cookie', who.cookie);
      return body ? req.send(body) : req;
    };
    const c = (await r(t, 'post', `/orgs/${org}/courses`, { title: 'Kurs', slug: 'kurs' })).body
      .course.id;
    const base = `/orgs/${org}/courses/${c}`;
    const m = (await r(t, 'post', `${base}/modules`, { title: 'Modul' })).body.id;
    const l = (await r(t, 'post', `${base}/modules/${m}/lessons`, { title: 'Dars' })).body.id;
    const e = (
      await r(t, 'post', `${base}/lessons/${l}/exercises`, { title: 'Mashq', checks: rules })
    ).body.id;
    await r(t, 'patch', base, { status: 'PUBLISHED' });
    await r(s, 'post', `${base}/enroll`);
    await r(s, 'put', `${base}/exercises/${e}/workspace`, { files }).expect(200);
    await r(s, 'post', `${base}/exercises/${e}/checks`).expect(202);

    let status = 'QUEUED';
    for (let i = 0; i < 60 && ['QUEUED', 'RUNNING'].includes(status); i++) {
      await new Promise((res) => setTimeout(res, 500));
      const latest = await r(s, 'get', `${base}/exercises/${e}/checks/latest`);
      status = latest.body.run?.status;
    }
    expect(status).toBe('PASSED');
    const ex = await r(s, 'get', `${base}/exercises/${e}`).expect(200);
    expect(ex.body.status).toBe('PASSED');
  });
});
