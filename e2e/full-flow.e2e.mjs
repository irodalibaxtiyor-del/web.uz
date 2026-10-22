// Phase 15A — full end-to-end run on a fresh database with the real stack:
// compiled API (real CHECK engine in Chrome, mock AI), Next.js web, sandbox origin, headless Chrome.
//
//   pnpm -r build && pnpm e2e
//
// Needs ports 3000, 3100 and 4000 free (the web build bakes them in) and Google Chrome
// (CHROME_PATH overrides). Course authoring uses the teacher's own browser session against the
// API (its UI was click-tested in earlier phases); every learning, review and portfolio step
// below is driven through the UI.
import { execFileSync, spawn } from 'node:child_process';
import { createWriteStream, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

const ROOT = join(import.meta.dirname, '..');
const { chromium } = createRequire(join(ROOT, 'packages', 'check-engine', 'package.json'))(
  'playwright-core',
);
const WEB = 'http://localhost:3000';
const API = 'http://localhost:4000';
const SANDBOX = 'http://127.0.0.1:3100';
const PASSWORD = `E2e-${randomBytes(9).toString('base64url')}`;
const WORK = mkdtempSync(join(tmpdir(), 'wd-e2e-'));
const OUT = process.env.E2E_OUT ?? join(WORK, 'artifacts');
mkdirSync(OUT, { recursive: true });

const HIDDEN_TITLE = 'Tavsif paragrafi (yashirin)';
const HIDDEN_SELECTOR = 'p.tavsif-maxfiy';

// ---------------------------------------------------------------- reporting

const results = [];
let failed = 0;
function record(ok, name, detail = '') {
  results.push(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  console.log(results.at(-1));
  if (!ok) failed++;
}
function expect(cond, name, detail) {
  record(Boolean(cond), name, cond ? '' : detail);
  if (!cond) throw new Error(`assertion failed: ${name}`);
}

// ---------------------------------------------------------------- processes

const children = [];
function start(name, args, cwd, env) {
  const log = createWriteStream(join(OUT, `${name}.log`));
  const child = spawn(process.execPath, args, { cwd, env: { ...process.env, ...env } });
  child.stdout.pipe(log);
  child.stderr.pipe(log);
  children.push(child);
  return child;
}
function stopAll() {
  for (const c of children) {
    try {
      if (process.platform === 'win32') {
        execFileSync('taskkill', ['/PID', String(c.pid), '/T', '/F'], { stdio: 'ignore' });
      } else {
        c.kill('SIGKILL');
      }
    } catch {
      // already gone
    }
  }
}
/** Confirms the app's modal confirm dialog (<dialog> rendered by DialogHost). */
async function acceptModal(page) {
  const dialog = page.locator('dialog[open]');
  await dialog.waitFor({ timeout: 10_000 });
  await dialog.locator('footer button').last().click();
  await dialog.waitFor({ state: 'hidden', timeout: 10_000 });
}

async function up(url, ms = 60_000) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try {
      if ((await fetch(url)).status < 500) return;
    } catch {
      // not yet listening
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`${url} did not start (logs in ${OUT})`);
}
async function free(url) {
  try {
    await fetch(url);
    return false;
  } catch {
    return true;
  }
}

// ---------------------------------------------------------------- browser helpers

async function api(ctx, method, path, body) {
  const res = await ctx.request.fetch(`${WEB}/api${path}`, {
    method,
    data: body,
    headers: { origin: WEB },
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    // empty body
  }
  return { status: res.status(), body: json };
}

async function login(page, identifier, password = PASSWORD, landing = '**/dashboard') {
  await page.goto(`${WEB}/login`);
  await page.locator('input[name="login"]').fill(identifier);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Kirish', exact: true }).click();
  await page.waitForURL(landing);
}

/** First sign-in with an admin-issued temporary password: the app forces a new one. */
async function firstLogin(page, identifier, temporary) {
  await login(page, identifier, temporary, '**/change-password');
  await changePassword(page, temporary);
}
async function changePassword(page, temporary) {
  await page.getByLabel(/Joriy \(vaqtinchalik\) parol/).fill(temporary);
  await page.getByLabel('Yangi parol', { exact: true }).fill(PASSWORD);
  await page.getByLabel('Yangi parolni takrorlang').fill(PASSWORD);
  await page.getByRole('button', { name: 'Parolni saqlash' }).click();
  await page.waitForURL('**/dashboard');
}

/** Reads the one-time password shown by the admin UI (CredentialNotice). */
async function shownPassword(page, fullName) {
  const notice = page.getByRole('alert').filter({ hasText: `${fullName}: vaqtinchalik parol` });
  await notice.waitFor({ timeout: 20_000 });
  return (await notice.locator('dd').nth(1).innerText()).trim();
}

/** Replaces the content of the active Monaco model (like a student selecting all and typing). */
async function typeCode(page, code) {
  const editor = page.locator('.monaco-editor').first();
  await editor.waitFor({ timeout: 20_000 });
  await editor.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  await page.keyboard.insertText(code);
}

async function waitText(page, text, timeout = 30_000) {
  await page.getByText(text).first().waitFor({ timeout });
}

// ---------------------------------------------------------------- main

let browser;
/** Kept outside run() so a crashed run can still write them to the artifacts. */
const diagnostics = { console: [], failed: [] };
async function run() {
  for (const url of [WEB, API, SANDBOX]) {
    if (!(await free(url))) throw new Error(`${url} is already in use; stop other servers first`);
  }

  // 1. Fresh database
  const dbUrl = `pglite://${join(WORK, 'db').replaceAll('\\', '/')}`;
  const setup = execFileSync(process.execPath, [join(ROOT, 'e2e', 'setup.cjs')], {
    env: { ...process.env, DATABASE_URL: dbUrl, E2E_PASSWORD: PASSWORD, NODE_ENV: 'development' },
  }).toString();
  const { mainOrg, otherOrg } = JSON.parse(setup.trim().split('\n').at(-1));
  record(true, 'fresh database with teachers in two organizations');

  // 2. Stack
  start('api', ['dist/main.js'], join(ROOT, 'apps', 'api'), {
    NODE_ENV: 'development',
    DATABASE_URL: dbUrl,
    WEB_ORIGINS: WEB,
    CHECK_ENGINE: 'process',
    AI_RATE_PER_MINUTE: '100',
    REGISTER_MAX_PER_HOUR: '100',
    LOG_LEVEL: 'warn',
  });
  start('sandbox', ['src/main.js'], join(ROOT, 'apps', 'sandbox'), {});
  start(
    'web',
    ['node_modules/next/dist/bin/next', 'start', '-p', '3000'],
    join(ROOT, 'apps', 'web'),
    {
      API_URL: API,
    },
  );
  await Promise.all([up(`${API}/health/ready`), up(`${SANDBOX}/runner.html`), up(`${WEB}/login`)]);
  record(true, 'api, sandbox and web are up');

  browser = await chromium.launch({ channel: 'chrome', executablePath: process.env.CHROME_PATH });
  const consoleErrors = diagnostics.console;
  const newPage = async (label) => {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const page = await ctx.newPage();
    page.on('dialog', (d) => d.accept());
    page.on('pageerror', (e) => consoleErrors.push(`${label}: ${e.message}`));
    page.on('console', (m) => {
      // Expected 4xx (locked lesson, not enrolled, ...) are asserted explicitly below.
      if (m.type() === 'error' && !/status of 4\d\d/.test(m.text())) {
        consoleErrors.push(`${label}: ${m.text()}`);
      }
    });
    page.on('requestfailed', (r) =>
      diagnostics.failed.push(`${label}: ${r.method()} ${r.url()} — ${r.failure()?.errorText}`),
    );
    return { ctx, page };
  };

  // 3. Teacher prepares a course
  const teacher = await newPage('teacher');
  await login(teacher.page, 'teacher@e2e.uz');
  const T = (m, p, b) => api(teacher.ctx, m, p, b);
  const course = (
    await T('POST', `/orgs/${mainOrg}/courses`, { title: 'E2E HTML', slug: 'e2e-html' })
  ).body.course;
  const base = `/orgs/${mainOrg}/courses/${course.id}`;
  const mod = (await T('POST', `${base}/modules`, { title: 'Asoslar' })).body;
  const l1 = (await T('POST', `${base}/modules/${mod.id}/lessons`, { title: 'Sarlavhalar' })).body;
  const l2 = (await T('POST', `${base}/modules/${mod.id}/lessons`, { title: 'Vizitka' })).body;
  await T('PATCH', `${base}/lessons/${l1.id}`, {
    content: '## Sarlavhalar\n\n`<h1>` — eng katta sarlavha.',
  });
  const ex = (
    await T('POST', `${base}/lessons/${l1.id}/exercises`, {
      title: 'Birinchi sarlavha',
      instructions: 'Sahifaga `<h1>` sarlavha va tavsif paragrafi qo‘shing.',
      checks: [
        {
          id: 'h1',
          title: 'Sahifada h1 bor',
          hint: '<h1> tegidan foydalaning',
          assert: { type: 'count', selector: 'h1' },
        },
        {
          id: 'p',
          title: HIDDEN_TITLE,
          hidden: true,
          assert: { type: 'count', selector: HIDDEN_SELECTOR },
        },
      ],
    })
  ).body;
  const asg = (
    await T('POST', `${base}/lessons/${l2.id}/assignments`, {
      title: 'Shaxsiy vizitka',
      instructions: 'O‘zingiz haqingizda sahifa yarating.',
      requirements: ['Sarlavha bo‘lsin', 'Tavsif bo‘lsin'],
      rubric: [
        { id: 'tuzilma', title: 'Sahifa tuzilishi', maxPoints: 60 },
        { id: 'uslub', title: 'Mazmun', maxPoints: 40 },
      ],
      gradingPolicy: { maxScore: 100, passingScore: 60, allowLate: false },
    })
  ).body;
  expect(
    (await T('POST', `${base}/assignments/${asg.id}/publish`)).status === 200,
    'teacher publishes the assignment',
  );
  expect(
    (await T('PATCH', base, { status: 'PUBLISHED' })).status === 200,
    'teacher publishes the course',
  );

  // 4. Student: register → login → course → enroll → lesson → exercise
  const student = await newPage('student');
  const sp = student.page;
  await sp.goto(`${WEB}/register`);
  await sp.locator('input[name="fullName"]').fill('Talaba Ergasheva');
  await sp.locator('input[name="email"]').fill('talaba@e2e.uz');
  await sp.locator('input[name="password"]').fill(PASSWORD);
  await sp.getByRole('button', { name: "Ro'yxatdan o'tish" }).click();
  await sp.waitForURL('**/dashboard');
  record(true, 'student registers through the form');
  // Logout lives in the account menu ("Shaxsiy kabinet" submenu) and is confirmed in a modal.
  await sp.locator('.app-shell header button[aria-haspopup="menu"]').click();
  await sp.getByRole('menuitem', { name: 'Chiqish' }).click();
  await acceptModal(sp);
  await sp.waitForURL(`${WEB}/`);
  expect(
    (await sp.request.get(`${WEB}/api/auth/me`)).status() === 401,
    'session ended after logout',
  );
  await login(sp, 'talaba@e2e.uz');
  record(true, 'student logs out from the account menu (confirmed) and back in');

  await sp.getByText('E2E HTML').first().click();
  await sp.getByRole('button', { name: 'Kursga yozilish' }).click();
  await waitText(sp, 'Sarlavhalar');
  const map1 = (await api(student.ctx, 'GET', `${base}/map`)).body;
  const states1 = map1.modules[0].lessons.map((l) => l.state);
  expect(
    states1[0] !== 'LOCKED' && states1[1] === 'LOCKED',
    'enrolled: lesson 1 open, lesson 2 locked',
    states1.join(),
  );
  const locked = await api(student.ctx, 'GET', `${base}/lessons/${l2.id}`);
  expect(locked.status === 403, 'locked lesson is refused by the server', String(locked.status));

  await sp
    .getByRole('link', { name: /Sarlavhalar/ })
    .first()
    .click();
  await waitText(sp, 'eng katta sarlavha');
  await sp
    .getByRole('link', { name: /Birinchi sarlavha/ })
    .first()
    .click();
  await sp.waitForURL(`**/exercises/${ex.id}`);
  record(true, 'student opens lesson and exercise');

  // 5. Playground: RUN (browser preview) and CHECK (server)
  await typeCode(sp, '<p>salom</p>\n<script>console.log("RUN-OK")</script>');
  await sp.getByRole('button', { name: /Ishga tushirish/ }).click();
  await waitText(sp, 'RUN-OK', 20_000);
  record(true, 'RUN shows the program output from the sandbox');
  await sp.getByRole('button', { name: /Tekshirish/ }).click();
  await waitText(sp, /Tekshiruvdan o.tmadi/, 60_000);
  record(true, 'CHECK on the saved code: FAILED with visible feedback');

  // 6. AI tutor helps after the failure
  const tutor = sp.getByRole('region', { name: /AI yordamchi/ });
  await tutor.getByRole('button', { name: /^Maslahat/ }).click();
  await tutor.getByText('Savol:').first().waitFor({ timeout: 20_000 });
  await tutor.getByRole('button', { name: 'Xatoni tushuntir' }).click();
  await tutor.getByText('Sahifada h1 bor').first().waitFor({ timeout: 20_000 });
  const tutorText = await tutor.innerText();
  expect(
    !tutorText.includes(HIDDEN_TITLE) && !tutorText.includes(HIDDEN_SELECTOR),
    'AI tutor explains the failure without hidden CHECK details',
  );

  // 7. Fix → PASS → unlock
  await typeCode(sp, '<h1>Salom</h1>\n<p class="tavsif-maxfiy">Men talabaman</p>');
  await sp.getByRole('button', { name: /Tekshirish/ }).click();
  await waitText(sp, /Tekshiruvdan o.tdi/, 60_000);
  record(true, 'CHECK passes after the fix');
  const map2 = (await api(student.ctx, 'GET', `${base}/map`)).body;
  const states2 = map2.modules[0].lessons.map((l) => l.state);
  expect(
    states2[0] === 'COMPLETED' && states2[1] !== 'LOCKED',
    'passing the exercise completes lesson 1 and unlocks lesson 2',
    states2.join(),
  );

  // 8. Assignment: submit v1
  await sp.goto(`${WEB}${base}/lessons/${l2.id}`);
  await sp
    .getByRole('link', { name: /Shaxsiy vizitka/ })
    .first()
    .click();
  await sp.waitForURL(`**/assignments/${asg.id}`);
  await typeCode(sp, '<h1>Talaba Ergasheva</h1>');
  await sp.getByRole('button', { name: /^Topshirish/ }).click();
  await acceptModal(sp);
  await waitText(sp, '1-versiya', 20_000);
  record(true, 'student submits version 1 of the assignment');

  // 9. Teacher: assignment → submission → review → revision
  const tp = teacher.page;
  await tp.goto(`${WEB}${base}/manage/assignments/${asg.id}`);
  await tp.getByRole('link', { name: /Talaba Ergasheva: javobni ko.rib chiqish/ }).click();
  await tp.waitForURL('**/submissions/**');
  await tp.getByRole('button', { name: /ko.rib chiqishni boshlash/ }).click();
  await tp.getByLabel(/Talabaga izoh/).waitFor();
  await tp.getByLabel(/Talabaga izoh/).fill('Tavsif paragrafini ham qo‘shing.');
  await tp.getByRole('button', { name: /Qayta ishlashni so.rash/ }).click();
  await acceptModal(tp);
  await waitText(tp, 'Qayta ishlash so‘raldi', 20_000);
  record(true, 'teacher starts the review and requests a revision with feedback');

  // 10. Student sees feedback and resubmits
  await sp.reload();
  await waitText(sp, 'Tavsif paragrafini ham qo‘shing.');
  await typeCode(sp, '<h1>Talaba Ergasheva</h1>\n<p>Veb dizaynni o‘rganyapman.</p>');
  await sp.getByRole('button', { name: /^Topshirish/ }).click();
  await acceptModal(sp);
  await waitText(sp, '2-versiya', 20_000);
  record(true, 'student reads the feedback and resubmits version 2');

  // 11. Teacher grades with the rubric and finalizes
  await tp.reload();
  await tp.getByRole('button', { name: /2-versiyani ko.rib chiqishni boshlash/ }).click();
  await tp.getByLabel('Sahifa tuzilishi').fill('55');
  await tp.getByLabel('Mazmun').fill('35');
  await tp.getByLabel(/Talabaga izoh/).fill('Yaxshi ish!');
  await tp.getByRole('button', { name: 'Baholash', exact: true }).click();
  await waitText(tp, '90', 20_000);
  await tp.getByRole('button', { name: 'Yakunlash' }).click();
  await acceptModal(tp);
  await waitText(tp, 'Yakunlandi', 20_000);
  record(true, 'teacher grades 55 + 35 = 90 by rubric and finalizes');

  await sp.reload();
  await waitText(sp, 'Yaxshi ish!');
  await waitText(sp, '90');
  record(true, 'student sees the final grade and feedback');

  // 12. Portfolio: add the graded assignment, publish, view anonymously
  await sp.goto(`${WEB}/portfolio`);
  await sp.getByPlaceholder('ism-familiya').fill('talaba-ergasheva');
  await sp.getByRole('button', { name: 'Saqlash', exact: true }).first().click();
  await sp.getByRole('button', { name: /Shaxsiy vizitka: portfolioga qo.shish/ }).click();
  await sp.getByRole('button', { name: /E.lon qilish/ }).click();
  await acceptModal(sp);
  await waitText(sp, '/p/talaba-ergasheva', 20_000);
  const anon = await newPage('anonymous');
  await anon.page.goto(`${WEB}/p/talaba-ergasheva`);
  await waitText(anon.page, 'Shaxsiy vizitka');
  const pub = (await api(anon.ctx, 'GET', '/portfolio/public/talaba-ergasheva')).body;
  expect(
    JSON.stringify(pub).indexOf('talaba@e2e.uz') === -1 && !('score' in (pub.items?.[0] ?? {})),
    'public portfolio shows the work without email or grade',
  );

  // ---------------------------------------------------------------- security
  const other = await newPage('student2');
  await other.page.goto(`${WEB}/register`);
  await other.page.locator('input[name="fullName"]').fill('Boshqa Talaba');
  await other.page.locator('input[name="email"]').fill('boshqa@e2e.uz');
  await other.page.locator('input[name="password"]').fill(PASSWORD);
  await other.page.getByRole('button', { name: "Ro'yxatdan o'tish" }).click();
  await other.page.waitForURL('**/dashboard');
  const S2 = (m, p, b) => api(other.ctx, m, p, b);
  const studentId = (await api(student.ctx, 'GET', '/auth/me')).body.id;
  const run1 = (await api(student.ctx, 'GET', `${base}/exercises/${ex.id}/checks/latest`)).body.run;

  // cross-student
  expect(
    (await S2('GET', `${base}/exercises/${ex.id}/checks/${run1.id}`)).status >= 403,
    'cross-student: another student cannot read a CHECK run',
  );
  expect(
    (await S2('GET', `${base}/assignments/${asg.id}/submissions/${studentId}`)).status === 403,
    'cross-student: another student cannot open a submission review',
  );
  expect(
    (await S2('GET', `${base}/exercises/${ex.id}`)).status === 403,
    'cross-student: not enrolled, no access to the exercise',
  );

  // cross-teacher and cross-org
  const teacher2 = await newPage('teacher2');
  await login(teacher2.page, 'teacher2@e2e.uz');
  expect(
    (await api(teacher2.ctx, 'GET', `${base}/assignments/${asg.id}/submissions/${studentId}`))
      .status === 403,
    'cross-teacher: an unassigned teacher cannot review',
  );
  expect(
    (await api(teacher2.ctx, 'PATCH', base, { title: 'Buzilgan' })).status === 403,
    'cross-teacher: an unassigned teacher cannot edit the course',
  );
  const foreign = await newPage('foreign-teacher');
  await login(foreign.page, 'teacher@other.uz');
  expect(
    (await api(foreign.ctx, 'GET', `${base}/structure`)).status === 404,
    'cross-org: a teacher of another organization gets 404',
  );
  expect(
    (await api(foreign.ctx, 'GET', `/orgs/${otherOrg}/courses/${course.id}/structure`)).status ===
      404,
    'cross-org: re-binding the course to another org gets 404',
  );

  // forged role / permission
  const forged = await api(anon.ctx, 'POST', '/auth/register', {
    email: 'hacker@e2e.uz',
    password: PASSWORD,
    fullName: 'Hacker',
    role: 'ORG_ADMIN',
  });
  expect(
    forged.status === 201 && forged.body.memberships[0].role === 'STUDENT',
    'forged role on register is ignored (STUDENT)',
  );
  const spoof = await other.ctx.request.fetch(`${WEB}/api${base}/analytics`, {
    headers: {
      'x-user-id': (await T('GET', '/auth/me')).body.id,
      'x-role': 'ORG_ADMIN',
      origin: WEB,
    },
  });
  expect(spoof.status() === 403, 'forged x-user-id / x-role headers grant nothing');
  expect(
    (await S2('GET', `/orgs/${mainOrg}/analytics`)).status === 403,
    'forged permission: a student cannot open organization analytics',
  );

  // unauthorized AI context
  expect(
    (
      await S2('POST', `${base}/tutor/ask`, {
        targetKind: 'EXERCISE',
        targetId: ex.id,
        mode: 'HINT',
      })
    ).status === 403,
    'AI context: not enrolled student is refused',
  );
  expect(
    (await S2('GET', `${base}/tutor?targetKind=ASSIGNMENT&targetId=${asg.id}`)).status === 403,
    'AI context: no tutor state for a foreign course',
  );

  // hidden CHECK inaccessible
  const view = await api(student.ctx, 'GET', `${base}/exercises/${ex.id}`);
  const latest = await api(student.ctx, 'GET', `${base}/exercises/${ex.id}/checks/latest`);
  await sp.goto(`${WEB}${base}/exercises/${ex.id}`);
  await sp.locator('.monaco-editor').first().waitFor();
  const html = await sp.content();
  const leaks = [JSON.stringify(view.body), JSON.stringify(latest.body), html].some(
    (s) => s.includes(HIDDEN_TITLE) || s.includes(HIDDEN_SELECTOR),
  );
  expect(!leaks, 'hidden CHECK rules never reach the student (API, run view, page)');

  // ---------------------------------------------------------------- groups and accounts
  // Fictional names only: the repository is public.
  const admin = await newPage('admin');
  const ap = admin.page;
  await login(ap, 'admin@e2e.uz');
  const A = (m, p, b) => api(admin.ctx, m, p, b);
  await ap.goto(`${WEB}/orgs/${mainOrg}/admin/groups`);
  await ap
    .getByLabel('Ro‘yxat matni')
    .fill(
      [
        '### 1-26 E2E — 2 nafar talaba',
        '1. QODIROVA NODIRA',
        '2. TOSHMATOV BOBUR',
        '### 2-26 E2E — 1 nafar talaba',
        '1. YUSUPOV SARDOR',
      ].join('\n'),
    );
  await ap.getByRole('button', { name: 'Ko‘rib chiqish' }).click();
  await waitText(ap, 'Jami 3 ta qator: 3 yangi');
  await ap.getByRole('button', { name: 'Import qilish' }).click();
  await acceptModal(ap);
  await waitText(ap, 'Import tugadi: 3 ta yangi hisob');
  const groupList = (await A('GET', `/orgs/${mainOrg}/admin/groups`)).body;
  const g1 = groupList.find((g) => g.name === '1-26 E2E');
  const g2 = groupList.find((g) => g.name === '2-26 E2E');
  const g1Students = (await A('GET', `/orgs/${mainOrg}/admin/groups/${g1.id}/students`)).body
    .students;
  const g2Students = (await A('GET', `/orgs/${mainOrg}/admin/groups/${g2.id}/students`)).body
    .students;
  const nodira = g1Students.find((s) => s.fullName === 'QODIROVA NODIRA');
  const sardor = g2Students[0];
  expect(
    g1Students.length === 2 &&
      g2Students.length === 1 &&
      nodira?.login === 'qodirova.nodira' &&
      !nodira.hasPassword &&
      !JSON.stringify(g1Students).includes('passwordHash'),
    'admin imports a roster through the UI: 2 groups, familiya.ism logins, no passwords yet',
  );

  // admin: teacher account bound to one group
  await ap.goto(`${WEB}/orgs/${mainOrg}/admin/teachers`);
  await ap.getByLabel('F.I.Sh.').first().fill('Guruh Ustozi');
  await ap.getByLabel('Login').first().fill('ustoz.guruh');
  await ap.getByRole('button', { name: 'O‘qituvchi yaratish' }).click();
  const teacherTemp = await shownPassword(ap, 'Guruh Ustozi');
  const row = ap.locator('li').filter({ hasText: 'ustoz.guruh' });
  await row.getByLabel('1-26 E2E').check();
  await row.getByRole('button', { name: 'Guruhlarni saqlash' }).click();
  await waitText(ap, 'Guruhlar saqlandi.');
  await row.getByLabel('E2E HTML').check();
  await row.getByRole('button', { name: 'Kurslarni saqlash' }).click();
  await waitText(ap, 'Kurslar saqlandi.');
  record(true, 'admin creates a teacher (one-time password), assigns one group and one course');

  // admin: temporary password for a student
  await ap.goto(`${WEB}/orgs/${mainOrg}/admin/groups/${g1.id}`);
  await ap.getByRole('button', { name: 'QODIROVA NODIRA: parolni tiklash' }).click();
  await acceptModal(ap);
  const nodiraTemp = await shownPassword(ap, 'QODIROVA NODIRA');
  await ap.getByLabel('Kurs', { exact: true }).selectOption({ label: 'E2E HTML' });
  await ap.getByRole('button', { name: 'Guruhni kursga yozish' }).click();
  await acceptModal(ap);
  await waitText(ap, '2 ta talaba yozildi');
  record(true, 'admin enrols the whole group in the course');
  expect(
    nodiraTemp.startsWith('1-26e2e-'),
    'admin issues a temporary student password with the group prefix',
    nodiraTemp.slice(0, 8),
  );

  // student: forced password change, then learning activity
  const gs = await newPage('group-student');
  await login(gs.page, 'qodirova.nodira', nodiraTemp, '**/change-password');
  const blocked = await api(gs.ctx, 'GET', `/orgs/${mainOrg}/courses`);
  expect(
    blocked.status === 403 && blocked.body?.code === 'PASSWORD_CHANGE_REQUIRED',
    'temporary password: everything but the password change is refused',
    String(blocked.status),
  );
  await changePassword(gs.page, nodiraTemp);
  record(true, 'student signs in with the login and sets an own password');
  const GS = (m, p, b) => api(gs.ctx, m, p, b);
  expect(
    (await GS('GET', `${base}/map`)).status === 200,
    'group enrolment: the student is in the course without enrolling',
  );
  await GS('PUT', `${base}/exercises/${ex.id}/workspace`, {
    files: [{ path: 'index.html', content: '<p>hali tayyor emas</p>' }],
  });
  await GS('POST', `${base}/exercises/${ex.id}/checks`);
  let groupRun = null;
  for (
    let i = 0;
    i < 120 && !['PASSED', 'FAILED', 'ERROR', 'TIMEOUT'].includes(groupRun?.status);
    i++
  ) {
    await new Promise((r) => setTimeout(r, 500));
    groupRun = (await GS('GET', `${base}/exercises/${ex.id}/checks/latest`)).body.run;
  }
  expect(groupRun?.status === 'FAILED', 'group student runs a CHECK (FAILED)', groupRun?.status);
  expect(
    (await GS('GET', `/orgs/${mainOrg}/groups/${g1.id}`)).status === 403 &&
      (await GS('GET', `/orgs/${mainOrg}/admin/groups`)).status === 403,
    'a student cannot open group panels or admin pages',
  );

  // group teacher: forced password change, sees only the assigned group
  const gt = await newPage('group-teacher');
  const tg = gt.page;
  await firstLogin(tg, 'ustoz.guruh', teacherTemp);
  await tg.goto(`${WEB}/orgs/${mainOrg}/groups`);
  await waitText(tg, '1-26 E2E');
  expect(!(await tg.getByText('2-26 E2E').count()), 'group teacher sees only the assigned group');
  await tg
    .getByRole('link', { name: /1-26 E2E/ })
    .first()
    .click();
  await tg.waitForURL(`**/groups/${g1.id}`);
  await waitText(tg, 'TOSHMATOV BOBUR');
  await waitText(tg, 'Ma’lumot yetarli emas');
  await tg.getByRole('link', { name: 'QODIROVA NODIRA' }).click();
  await tg.waitForURL(`**/students/${nodira.userId}`);
  await waitText(tg, 'O‘tmadi');
  record(true, 'group panel: results table, no-data state and the student CHECK history');
  const GT = (m, p) => api(gt.ctx, m, p);
  expect(
    (await GT('GET', `/orgs/${mainOrg}/groups/${g2.id}`)).status === 404 &&
      (await GT('GET', `/orgs/${mainOrg}/groups/${g1.id}/students/${sardor.userId}`)).status ===
        404 &&
      (await GT('GET', `/orgs/${mainOrg}/groups/export.xlsx?groupId=${g2.id}`)).status === 404 &&
      (await GT('GET', `/orgs/${mainOrg}/admin/teachers`)).status === 403 &&
      (await GT('GET', `/orgs/${otherOrg}/groups`)).status === 404,
    'cross-group: other groups, their students and admin pages are closed to the teacher',
  );
  expect(
    (await GT('GET', `${base}/analytics`)).status === 200 &&
      (await GT('GET', `${base}/assignments/${asg.id}/submissions/${studentId}`)).status === 200,
    'course assigned by the admin: the teacher can open its analytics and reviews',
  );
  const xlsx = await gt.ctx.request.fetch(
    `${WEB}/api/orgs/${mainOrg}/groups/export.xlsx?groupId=${g1.id}`,
  );
  const xlsxBody = await xlsx.body();
  expect(
    xlsx.status() === 200 &&
      /spreadsheetml/.test(xlsx.headers()['content-type'] ?? '') &&
      xlsxBody.subarray(0, 2).toString() === 'PK',
    'group teacher exports the results as .xlsx',
    String(xlsx.status()),
  );

  // admin disables the student: the live session ends at once
  await ap.goto(`${WEB}/orgs/${mainOrg}/admin/groups/${g1.id}`);
  await ap.getByRole('button', { name: 'QODIROVA NODIRA: faolsizlantirish' }).click();
  await acceptModal(ap);
  await waitText(ap, 'Faollashtirish');
  expect(
    (await GS('GET', '/auth/me')).status === 401,
    'disabled account: the existing session is revoked',
  );
  await gs.page.goto(`${WEB}/login`);
  await gs.page.locator('input[name="login"]').fill('qodirova.nodira');
  await gs.page.locator('input[name="password"]').fill(PASSWORD);
  await gs.page.getByRole('button', { name: 'Kirish', exact: true }).click();
  await gs.page.getByRole('alert').first().waitFor();
  expect(gs.page.url().includes('/login'), 'disabled account cannot sign in');

  expect(
    consoleErrors.length === 0,
    'no unexpected browser errors',
    consoleErrors.slice(0, 3).join(' | '),
  );
}

let crashed = null;
try {
  await run();
} catch (e) {
  crashed = e;
  if (!String(e?.message).startsWith('assertion failed'))
    record(false, 'run aborted', e?.message ?? String(e));
  writeFileSync(
    join(OUT, 'browser-diagnostics.txt'),
    [
      '# console errors',
      ...diagnostics.console,
      '',
      '# failed requests',
      ...diagnostics.failed,
    ].join('\n'),
  );
  try {
    const pages = browser ? browser.contexts().flatMap((c) => c.pages()) : [];
    for (const [i, p] of pages.entries()) {
      await p.screenshot({ path: join(OUT, `failure-${i}.png`), fullPage: true });
      // Inside the app shell only <main> scrolls, so the screenshot can miss an error shown
      // higher up: keep the URL and every alert/status text as well.
      const alerts = await p
        .locator('[role="alert"], [role="status"]')
        .allInnerTexts()
        .catch(() => []);
      writeFileSync(
        join(OUT, `failure-${i}.txt`),
        [p.url(), ...alerts.map((t) => `- ${t.trim()}`)].join('\n'),
      );
    }
  } catch {
    // best effort
  }
} finally {
  await browser?.close().catch(() => {});
  stopAll();
}
console.log(`\n${results.length - failed}/${results.length} steps passed. Artifacts: ${OUT}`);
process.exit(failed || crashed ? 1 : 0);
