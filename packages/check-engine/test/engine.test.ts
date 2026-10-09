import { checkRulesSchema, type CheckRuleInput, type ProjectFile } from '@webdizayn/shared';
import { describe, expect, it } from 'vitest';
import { runChecks } from '../src/engine';

// Real headless Chrome. CHROME_PATH overrides the installed Google Chrome.
const opts = { chromePath: process.env.CHROME_PATH, budgetMs: 15_000 };

const rules = (r: CheckRuleInput[]) => checkRulesSchema.parse(r);
const project = (html: string, extra: ProjectFile[] = []): ProjectFile[] => [
  { path: 'index.html', content: html },
  ...extra,
];
const passedIds = (res: { results: { id: string; passed: boolean }[] }) =>
  Object.fromEntries(res.results.map((r) => [r.id, r.passed]));

const PAGE = `<!doctype html><html><head><title>Mening sahifam</title>
<link rel="stylesheet" href="css/style.css"></head>
<body><h1 class="title">Salom   dunyo</h1>
<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="logo">
<ul><li>a</li><li>b</li><li>c</li></ul>
<button id="btn">Bos</button><p id="out"></p>
<input id="name"><p id="greet"></p>
<script src="js/app.js"></script></body></html>`;
const CSS = `h1 { color: red; font-size: 2rem; }
@media (max-width: 600px) { h1 { font-size: 20px; } .desktop { display: none; } }`;
const JS = `document.getElementById('btn').addEventListener('click', () => {
  document.getElementById('out').textContent = 'Bosildi';
});
document.getElementById('name').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('greet').textContent = 'Salom, ' + e.target.value;
});`;
const FULL = project(PAGE, [
  { path: 'css/style.css', content: CSS },
  { path: 'js/app.js', content: JS },
]);

describe('check engine (real Chrome)', () => {
  it('passes DOM, text, attribute, computed style, responsive and behavior checks', async () => {
    const res = await runChecks(
      FULL,
      rules([
        { id: 'h1', title: 'h1 bor', assert: { type: 'count', selector: 'h1' } },
        { id: 'li', title: '3 ta li', assert: { type: 'count', selector: 'li', min: 3, max: 3 } },
        {
          id: 'no-table',
          title: 'jadval yo‘q',
          assert: { type: 'count', selector: 'table', max: 0, min: 0 },
        },
        {
          id: 'text',
          title: 'matn',
          assert: { type: 'text', selector: 'h1', value: 'salom dunyo', match: 'equals' },
        },
        {
          id: 'title',
          title: 'title',
          assert: { type: 'text', selector: 'title', value: 'sahifam' },
        },
        {
          id: 'alt',
          title: 'alt',
          assert: { type: 'attribute', selector: 'img', name: 'alt', value: 'logo' },
        },
        {
          id: 'color',
          title: 'rang',
          assert: { type: 'style', selector: 'h1', property: 'color', value: 'red' },
        },
        {
          id: 'size',
          title: 'o‘lcham',
          assert: { type: 'style', selector: 'h1', property: 'font-size', value: '32px' },
        },
        {
          id: 'mobile',
          title: 'mobil',
          viewport: { width: 375, height: 667 },
          assert: { type: 'style', selector: 'h1', property: 'font-size', value: '20px' },
        },
        {
          id: 'click',
          title: 'tugma',
          actions: [{ type: 'click', selector: '#btn' }],
          assert: { type: 'text', selector: '#out', value: 'Bosildi' },
        },
        {
          id: 'enter',
          title: 'forma',
          actions: [
            { type: 'fill', selector: '#name', value: 'Aziza' },
            { type: 'press', selector: '#name', key: 'Enter' },
          ],
          assert: { type: 'text', selector: '#greet', value: 'Salom, Aziza', match: 'equals' },
        },
        { id: 'clean', title: 'xatosiz', assert: { type: 'noConsoleErrors' } },
      ]),
      opts,
    );
    expect(passedIds(res)).toEqual({
      h1: true,
      li: true,
      'no-table': true,
      text: true,
      title: true,
      alt: true,
      color: true,
      size: true,
      mobile: true,
      click: true,
      enter: true,
      clean: true,
    });
    expect(res).toMatchObject({ status: 'PASSED', errorCode: null });
  });

  it('reports FAILED with per-rule results when expectations are not met', async () => {
    const res = await runChecks(
      FULL,
      rules([
        { id: 'h2', title: 'h2', assert: { type: 'count', selector: 'h2' } },
        {
          id: 'color',
          title: 'rang',
          assert: { type: 'style', selector: 'h1', property: 'color', value: 'blue' },
        },
        {
          id: 'attr',
          title: 'attr',
          assert: { type: 'attribute', selector: 'img', name: 'title' },
        },
        {
          id: 'text',
          title: 'matn',
          assert: {
            type: 'text',
            selector: 'h1',
            value: 'Salom',
            caseSensitive: true,
            match: 'equals',
          },
        },
        // Clicking a missing element fails the rule, not the run.
        {
          id: 'missing',
          title: 'yo‘q',
          actions: [{ type: 'click', selector: '#nope' }],
          assert: { type: 'count', selector: 'h1' },
        },
        { id: 'ok', title: 'ok', assert: { type: 'count', selector: 'h1' } },
      ]),
      { ...opts, stepTimeoutMs: 500 },
    );
    expect(res).toMatchObject({ status: 'FAILED', errorCode: null });
    expect(passedIds(res)).toEqual({
      h2: false,
      color: false,
      attr: false,
      text: false,
      missing: false,
      ok: true,
    });
  });

  it('detects uncaught errors and console.error', async () => {
    const r = rules([{ id: 'clean', title: 'xatosiz', assert: { type: 'noConsoleErrors' } }]);
    const thrown = await runChecks(project('<script>undefinedFn()</script>'), r, opts);
    const logged = await runChecks(project('<script>console.error("x")</script>'), r, opts);
    expect(thrown.status).toBe('FAILED');
    expect(logged.status).toBe('FAILED');
  });

  it('fails without index.html', async () => {
    const res = await runChecks(
      [{ path: 'main.html', content: '<h1>x</h1>' }],
      rules([{ id: 'h1', title: 'h1', assert: { type: 'count', selector: 'h1' } }]),
      opts,
    );
    expect(res).toMatchObject({ status: 'FAILED', errorCode: 'NO_ENTRY' });
  });

  it('times out on an infinite loop during load', async () => {
    const res = await runChecks(
      project('<h1>x</h1><script>while(true){}</script>'),
      rules([{ id: 'h1', title: 'h1', assert: { type: 'count', selector: 'h1' } }]),
      { ...opts, loadTimeoutMs: 1_500 },
    );
    expect(res).toMatchObject({ status: 'TIMEOUT', errorCode: 'LOAD_TIMEOUT' });
    expect(res.durationMs).toBeLessThan(10_000);
  });

  it('times out on an infinite loop in an event handler', async () => {
    const res = await runChecks(
      project('<button id="b" onclick="while(true){}">x</button>'),
      rules([
        {
          id: 'click',
          title: 'click',
          actions: [{ type: 'click', selector: '#b' }],
          assert: { type: 'count', selector: 'button' },
        },
      ]),
      { ...opts, stepTimeoutMs: 1_000 },
    );
    expect(res.status).toBe('TIMEOUT');
  });

  it('blocks all network except the project, and alerts do not hang the run', async () => {
    // The page reports what got through into the DOM; the check asserts nothing leaked.
    const html = `<p id="r">start</p><script>
      alert('hi');
      const out = document.getElementById('r');
      const mark = (t) => (out.textContent += ' ' + t);
      fetch('https://example.com/').then(() => mark('fetch-ok'), () => mark('fetch-blocked'));
      fetch('/index.html').then(() => mark('self-fetch-ok'), () => mark('self-fetch-blocked'));
      try { const ws = new WebSocket('ws://127.0.0.1:1/'); ws.onopen = () => mark('ws-ok'); } catch { mark('ws-blocked'); }
      const img = new Image(); img.onload = () => mark('img-ok'); img.onerror = () => mark('img-blocked');
      img.src = 'https://example.com/x.png';
    </script>`;
    const res = await runChecks(
      project(html),
      rules([
        {
          id: 'net',
          title: 'net',
          actions: [{ type: 'wait', ms: 1_000 }],
          assert: { type: 'text', selector: '#r', value: 'ok' },
        },
        {
          id: 'blocked',
          title: 'blocked',
          actions: [{ type: 'wait', ms: 1_000 }],
          assert: { type: 'text', selector: '#r', value: 'fetch-blocked' },
        },
      ]),
      opts,
    );
    // No "*-ok" marker may appear; the fetch must be observed as blocked.
    expect(passedIds(res)).toEqual({ net: false, blocked: true });
  });

  it('serves linked files case-insensitively and nothing outside the project', async () => {
    const res = await runChecks(
      project('<link rel="stylesheet" href="/CSS/Style.css"><h1>x</h1>', [
        { path: 'css/style.css', content: 'h1 { color: rgb(0, 128, 0); }' },
      ]),
      rules([
        {
          id: 'c',
          title: 'rang',
          assert: { type: 'style', selector: 'h1', property: 'color', value: 'green' },
        },
      ]),
      opts,
    );
    expect(res.status).toBe('PASSED');
  });

  it('reports ERROR when the browser cannot start (never a fake PASS)', async () => {
    const res = await runChecks(
      project('<h1>x</h1>'),
      rules([{ id: 'h1', title: 'h1', assert: { type: 'count', selector: 'h1' } }]),
      { chromePath: 'C:/definitely/not/chrome.exe' },
    );
    expect(res).toMatchObject({ status: 'ERROR', errorCode: 'ENGINE' });
    expect(res.results).toEqual([{ id: 'h1', passed: false }]);
  });
});
