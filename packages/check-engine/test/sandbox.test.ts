import { checkRulesSchema, type CheckRuleInput } from '@webdizayn/shared';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { runChecks } from '../src/engine';

/**
 * Phase 14B: the CHECK browser as a sandbox. A local "canary" server on an IP literal (so DNS
 * blocking cannot be what stops it) must never receive a request, whatever the student code
 * tries; local files must stay unreadable; a memory bomb must not produce a PASS.
 */
const opts = { chromePath: process.env.CHROME_PATH, budgetMs: 15_000 };
const rules = (r: CheckRuleInput[]) => checkRulesSchema.parse(r);

let canary: Server;
let hits: string[] = [];
let base = '';
let secretFile = '';

beforeAll(async () => {
  canary = createServer((req, res) => {
    hits.push(`${req.method} ${req.url}`);
    res.setHeader('access-control-allow-origin', '*');
    res.end('canary');
  });
  canary.on('upgrade', (req, socket) => {
    hits.push(`UPGRADE ${req.url}`);
    socket.destroy();
  });
  await new Promise<void>((r) => canary.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${(canary.address() as AddressInfo).port}`;
  const dir = mkdtempSync(join(tmpdir(), 'wd-secret-'));
  secretFile = join(dir, 'secret.txt');
  writeFileSync(secretFile, 'TOP-SECRET-FILE-CONTENT');
});
afterAll(() => new Promise<void>((r) => canary.close(() => r())));

describe('CHECK browser sandbox', () => {
  it('lets no request reach any other server, by any channel', async () => {
    // Control: the canary does receive requests that are not sandboxed.
    hits = [];
    await fetch(`${base}/control`);
    expect(hits).toEqual(['GET /control']);
    hits = [];
    const html = `<style>body { background: url('${base}/css-bg'); }</style>
<link rel="prefetch" href="${base}/prefetch">
<link rel="stylesheet" href="${base}/style.css">
<img src="${base}/img">
<iframe src="${base}/iframe"></iframe>
<form id="f" action="${base}/form" method="post"><input name="x" value="1"></form>
<p id="r">start</p>
<script src="${base}/script.js"></script>
<script>
  const mark = (t) => (document.getElementById('r').textContent += ' ' + t);
  fetch('${base}/fetch').then(() => mark('fetch-ok'), () => mark('fetch-blocked'));
  const x = new XMLHttpRequest(); x.open('GET', '${base}/xhr'); x.onload = () => mark('xhr-ok'); x.onerror = () => mark('xhr-blocked'); x.send();
  try { navigator.sendBeacon('${base}/beacon', 'leak'); } catch {}
  try { new EventSource('${base}/sse'); } catch {}
  try { new WebSocket('${base.replace('http', 'ws')}/ws'); } catch {}
  try { new Worker('${base}/worker.js'); } catch {}
  setTimeout(() => { try { document.getElementById('f').submit(); } catch {} }, 300);
</script>`;
    const res = await runChecks(
      [{ path: 'index.html', content: html }],
      rules([
        {
          id: 'blocked',
          title: 'fetch blocked',
          actions: [{ type: 'wait', ms: 1_500 }],
          assert: { type: 'text', selector: '#r', value: 'fetch-blocked' },
        },
      ]),
      opts,
    );
    expect(res.status).not.toBe('ERROR');
    await new Promise((r) => setTimeout(r, 300));
    expect(hits).toEqual([]);
  });

  it('cannot read local files', async () => {
    const url = pathToFileURL(secretFile).href;
    const html = `<p id="r">start</p>
<iframe id="fr" src="${url}"></iframe>
<script>
  const mark = (t) => (document.getElementById('r').textContent += ' ' + t);
  fetch('${url}').then((r) => r.text()).then((t) => mark('read:' + t), () => mark('fetch-blocked'));
  setTimeout(() => {
    try { mark('frame:' + document.getElementById('fr').contentDocument.body.textContent); }
    catch { mark('frame-blocked'); }
  }, 500);
</script>`;
    const res = await runChecks(
      [{ path: 'index.html', content: html }],
      rules([
        {
          id: 'leak',
          title: 'secret visible',
          actions: [{ type: 'wait', ms: 1_200 }],
          assert: { type: 'text', selector: 'body', value: 'TOP-SECRET-FILE-CONTENT' },
        },
        {
          id: 'blocked',
          title: 'fetch blocked',
          actions: [{ type: 'wait', ms: 1_200 }],
          assert: { type: 'text', selector: '#r', value: 'fetch-blocked' },
        },
      ]),
      opts,
    );
    expect(res.results).toEqual([
      { id: 'leak', passed: false },
      { id: 'blocked', passed: true },
    ]);
  });

  it('a memory bomb never passes and the next run still works', async () => {
    const bomb = `<h1>x</h1><script>
      const keep = [];
      for (;;) keep.push(new Array(1e6).fill(Math.random()));
    </script>`;
    const started = Date.now();
    const res = await runChecks(
      [{ path: 'index.html', content: bomb }],
      rules([{ id: 'h1', title: 'h1', assert: { type: 'count', selector: 'h1' } }]),
      opts,
    );
    expect(res.status).not.toBe('PASSED');
    expect(['ERROR', 'TIMEOUT']).toContain(res.status);
    expect(Date.now() - started).toBeLessThan(opts.budgetMs + 10_000);

    const ok = await runChecks(
      [{ path: 'index.html', content: '<h1>ok</h1>' }],
      rules([{ id: 'h1', title: 'h1', assert: { type: 'count', selector: 'h1' } }]),
      opts,
    );
    expect(ok.status).toBe('PASSED');
  });
});
