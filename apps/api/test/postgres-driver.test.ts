import 'reflect-metadata';
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MockProvider } from '../src/ai/provider';
import { createApp } from '../src/app';
import type { CheckExecutor } from '../src/checks/check-executor';
import { loadConfig } from '../src/config';
import { createDb } from '../src/db/client';
import { PASSWORD } from './helpers';

/**
 * Phase 14C: everything else runs on the PGlite driver. This file drives the production
 * code path — the `pg` (node-postgres) driver over the Postgres wire protocol — with a pool
 * of ONE connection, so any query issued outside its transaction would deadlock the test.
 */
const PORT = 55_000 + Math.floor(Math.random() * 5_000);
const URL = `postgres://postgres:postgres@127.0.0.1:${PORT}/postgres`;

let pglite: PGlite;
let server: PGLiteSocketServer;
let app: NestExpressApplication;
const http = () => request(app.getHttpServer());

const passing: CheckExecutor = {
  run: async (_files, rules) => ({
    status: 'PASSED',
    errorCode: null,
    results: rules.map((r) => ({ id: r.id, passed: true })),
    durationMs: 1,
  }),
};

beforeAll(async () => {
  pglite = new PGlite();
  server = new PGLiteSocketServer({ db: pglite, port: PORT, host: '127.0.0.1', maxConnections: 4 });
  await server.start();
  const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: URL, DATABASE_POOL_MAX: '1' });
  app = await createApp(config, { checkExecutor: passing, aiProvider: new MockProvider() });
  await app.init();
}, 60_000);
afterAll(async () => {
  await app?.close();
  await server?.stop();
  await pglite?.close();
});

describe('node-postgres driver (production path)', () => {
  it('migrations are idempotent and serialized', async () => {
    const handle = createDb(URL, { poolMax: 1 });
    await handle.migrate(); // already applied by createApp: must be a no-op
    await handle.ping();
    await handle.close();
  });

  it('runs the core learning flow with one pooled connection', async () => {
    const reg = await http()
      .post('/auth/register')
      .send({ email: 'teacher@pg.uz', password: PASSWORD, fullName: 'Ustoz' })
      .expect(201);
    // Registration makes a STUDENT; promote directly for this test.
    await pglite.query(`update memberships set role = 'TEACHER' where user_id = $1`, [reg.body.id]);
    const login = async (email: string) => {
      const res = await http().post('/auth/login').send({ email, password: PASSWORD }).expect(200);
      return (res.headers['set-cookie'] as unknown as string[])
        .find((c) => c.startsWith('wd_session='))!
        .split(';')[0]!;
    };
    const teacher = await login('teacher@pg.uz');
    const orgId = reg.body.memberships[0].organizationId;
    const s = await http()
      .post('/auth/register')
      .send({ email: 'talaba@pg.uz', password: PASSWORD, fullName: 'Talaba' })
      .expect(201);
    const student = await login('talaba@pg.uz');
    expect(s.body.memberships[0].organizationId).toBe(orgId);

    const t = (
      method: 'post' | 'patch' | 'put' | 'get',
      path: string,
      body?: object,
      who = teacher,
    ) => {
      const r = http()[method](path).set('Cookie', who);
      return body ? r.send(body) : r;
    };
    const c = (
      await t('post', `/orgs/${orgId}/courses`, { title: 'PG kurs', slug: 'pg-kurs' }).expect(201)
    ).body.course.id;
    const base = `/orgs/${orgId}/courses/${c}`;
    const m = (await t('post', `${base}/modules`, { title: 'Modul' }).expect(201)).body.id;
    const l = (await t('post', `${base}/modules/${m}/lessons`, { title: 'Dars' }).expect(201)).body
      .id;
    const e = (
      await t('post', `${base}/lessons/${l}/exercises`, {
        title: 'Mashq',
        checks: [{ id: 'h1', title: 'h1', assert: { type: 'count', selector: 'h1' } }],
      }).expect(201)
    ).body.id;
    await t('patch', base, { status: 'PUBLISHED' }).expect(200);

    // Student: enroll, save, CHECK (FOR UPDATE transaction), lesson completes.
    await t('post', `${base}/enroll`, undefined, student).expect(201);
    await t(
      'put',
      `${base}/exercises/${e}/workspace`,
      { files: [{ path: 'index.html', content: '<h1>x</h1>' }] },
      student,
    ).expect(200);
    await t('post', `${base}/exercises/${e}/checks`, undefined, student).expect(202);
    let status = 'QUEUED';
    for (let i = 0; i < 40 && status !== 'PASSED'; i++) {
      await new Promise((r) => setTimeout(r, 100));
      status = (await t('get', `${base}/exercises/${e}/checks/latest`, undefined, student)).body.run
        ?.status;
    }
    expect(status).toBe('PASSED');
    const map = await t('get', `${base}/map`, undefined, student).expect(200);
    expect(map.body.modules[0].lessons[0].state).toBe('COMPLETED');

    // AI tutor (advisory-lock quota reservation) and analytics (aggregate SQL).
    const ai = await t(
      'post',
      `${base}/tutor/ask`,
      { targetKind: 'EXERCISE', targetId: e, mode: 'HINT' },
      student,
    ).expect(200);
    expect(ai.body.hintNumber).toBe(1);
    const an = await t('get', `${base}/analytics`).expect(200);
    expect(an.body).toMatchObject({ students: 1, progress: { completedCount: 1 } });
    const me = await t('get', '/analytics/me', undefined, student).expect(200);
    expect(me.body.courses[0].progress.percent).toBe(100);
  });

  it('enforces database-backed rate limits through the pg driver', async () => {
    for (let i = 0; i < 5; i++) {
      await http()
        .post('/auth/login')
        .send({ email: 'talaba@pg.uz', password: 'wrong-password-1' })
        .expect(401);
    }
    await http()
      .post('/auth/login')
      .send({ email: 'talaba@pg.uz', password: PASSWORD })
      .expect(429);
  });
});
