import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createSandboxServer, parseParents } from '../src/server.js';

let server;
let base;

beforeAll(async () => {
  server = createSandboxServer({ parents: ['http://localhost:3000'] });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
afterAll(() => new Promise((r) => server.close(r)));

describe('sandbox server', () => {
  it('serves the runner with strict security headers', async () => {
    const res = await fetch(`${base}/runner.html`);
    expect(res.status).toBe(200);
    const csp = res.headers.get('content-security-policy');
    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("connect-src 'none'");
    expect(csp).toContain("form-action 'none'");
    expect(csp).toContain('frame-ancestors http://localhost:3000');
    expect(csp).not.toContain('unsafe-eval');
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('referrer-policy')).toBe('no-referrer');
    expect(res.headers.get('permissions-policy')).toContain('camera=()');
    const body = await res.text();
    expect(body).toContain('content="[&quot;http://localhost:3000&quot;]"');
  });

  it('serves the runner modules as JavaScript', async () => {
    for (const f of ['runner.js', 'build.js', 'protocol.js']) {
      const res = await fetch(`${base}/${f}`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/javascript');
      expect(res.headers.get('access-control-allow-origin')).toBe('*');
    }
  });

  it('serves nothing outside the allow-list (no traversal)', async () => {
    for (const p of [
      '/package.json',
      '/../package.json',
      '/src/server.js',
      '/%2e%2e/package.json',
      '/public/runner.js',
    ]) {
      const res = await fetch(base + p);
      expect(res.status, p).toBe(404);
    }
  });

  it('rejects non-GET methods', async () => {
    expect((await fetch(`${base}/runner.html`, { method: 'POST' })).status).toBe(405);
  });
});

describe('parseParents', () => {
  it('validates origins', () => {
    expect(parseParents('http://localhost:3000, https://webdizayn.uz')).toEqual([
      'http://localhost:3000',
      'https://webdizayn.uz',
    ]);
    expect(() => parseParents('http://x.uz; script-src *')).toThrow();
    expect(() => parseParents('javascript:alert(1)')).toThrow();
  });
});
