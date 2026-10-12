import { checkRulesSchema } from '@webdizayn/shared';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createCheckWorkerServer } from '../src/server';

const TOKEN = 'w'.repeat(40);
let server: Server;
let url = '';

const rules = checkRulesSchema.parse([
  { id: 'h1', title: 'h1 bor', assert: { type: 'count', selector: 'h1' } },
]);
const files = [{ path: 'index.html', content: '<h1>Salom</h1>' }];
const post = (body: unknown, token: string | null = TOKEN, raw?: string) =>
  fetch(`${url}/run`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token === null ? {} : { authorization: `Bearer ${token}` }),
    },
    body: raw ?? JSON.stringify(body),
  });

beforeAll(async () => {
  server = createCheckWorkerServer({
    token: TOKEN,
    maxBodyBytes: 100_000,
    engine: { chromePath: process.env.CHROME_PATH, budgetMs: 15_000 },
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => new Promise<void>((r) => server.close(() => r())));

describe('CHECK worker service', () => {
  it('refuses weak tokens at startup', () => {
    expect(() => createCheckWorkerServer({ token: 'short' })).toThrow(/32/);
  });

  it('answers health checks and nothing but /run', async () => {
    expect((await fetch(`${url}/health`)).status).toBe(200);
    expect((await fetch(`${url}/etc/passwd`)).status).toBe(404);
    expect((await fetch(`${url}/run`)).status).toBe(405);
  });

  it('requires the shared token', async () => {
    expect((await post({ files, rules }, null)).status).toBe(401);
    expect((await post({ files, rules }, 'x'.repeat(40))).status).toBe(401);
  });

  it('validates the request like the API does', async () => {
    expect((await post(null, TOKEN, '{not json')).status).toBe(400);
    expect((await post({ files: [{ path: '../secret.html', content: '' }], rules })).status).toBe(
      400,
    );
    expect((await post({ files, rules: [{ id: 'x' }] })).status).toBe(400);
    expect(
      (await post({ files: [{ path: 'index.html', content: 'x'.repeat(200_000) }], rules })).status,
    ).toBe(413);
  });

  it('runs CHECK in real Chrome and returns the verdict', async () => {
    const res = await post({ files, rules });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      status: 'PASSED',
      results: [{ id: 'h1', passed: true }],
    });
  });
});
