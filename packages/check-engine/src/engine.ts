import { chromium, type Browser, type Page } from 'playwright-core';
import type {
  CheckAction,
  CheckAssertion,
  CheckEngineResult,
  CheckErrorCode,
  CheckRule,
  ProjectFile,
} from '@webdizayn/shared';

/** Fake origin the project is served from. Every other request is aborted. */
export const CHECK_ORIGIN = 'http://check.invalid';

export interface EngineOptions {
  /** Chrome/Chromium executable. Defaults to the installed Google Chrome (`channel: 'chrome'`). */
  chromePath?: string;
  /** Keep Chrome's renderer sandbox on. Only disable where the OS cannot provide it. */
  chromiumSandbox?: boolean;
  /** Whole-run budget. */
  budgetMs?: number;
  /** Page load (`load` event) timeout per check. */
  loadTimeoutMs?: number;
  /** Timeout per action or assertion. */
  stepTimeoutMs?: number;
}

const DEFAULTS = { budgetMs: 20_000, loadTimeoutMs: 5_000, stepTimeoutMs: 2_000 };

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'none'",
  "frame-src 'none'",
  "worker-src 'none'",
  "object-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
].join('; ');

const CONTENT_TYPES: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
};

type Outcome = { passed: boolean } | { abort: CheckErrorCode };

class Aborted extends Error {
  constructor(readonly code: CheckErrorCode) {
    super(code);
  }
}

export async function runChecks(
  files: ProjectFile[],
  rules: CheckRule[],
  options: EngineOptions = {},
): Promise<CheckEngineResult> {
  const opts = { ...DEFAULTS, ...options };
  const started = Date.now();
  const deadline = started + opts.budgetMs;
  const results = rules.map((r) => ({ id: r.id, passed: false }));
  const done = (status: CheckEngineResult['status'], errorCode: CheckErrorCode | null) => ({
    status,
    errorCode,
    results,
    durationMs: Date.now() - started,
  });

  if (rules.length === 0) return done('ERROR', 'ENGINE');
  const byPath = new Map(files.map((f) => [f.path.toLowerCase(), f]));
  if (!byPath.has('index.html')) return done('FAILED', 'NO_ENTRY');

  let browser: Browser;
  try {
    browser = await chromium.launch({
      ...(opts.chromePath ? { executablePath: opts.chromePath } : { channel: 'chrome' }),
      headless: true,
      chromiumSandbox: opts.chromiumSandbox ?? true,
      timeout: 15_000,
      // Defense in depth on top of request interception: no DNS, dead proxy.
      proxy: { server: 'http://127.0.0.1:9' },
      args: [
        '--host-resolver-rules=MAP * ~NOTFOUND',
        '--disable-background-networking',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-sync',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--js-flags=--max-old-space-size=128',
      ],
    });
  } catch {
    return done('ERROR', 'ENGINE');
  }

  try {
    for (const [i, rule] of rules.entries()) {
      if (Date.now() >= deadline) return done('TIMEOUT', 'BUDGET');
      const outcome = await runRule(browser, byPath, rule, opts, deadline);
      if ('abort' in outcome) {
        const status = outcome.abort === 'LOAD_TIMEOUT' || outcome.abort === 'BUDGET';
        return done(status ? 'TIMEOUT' : 'ERROR', outcome.abort);
      }
      results[i]!.passed = outcome.passed;
    }
    return done(results.every((r) => r.passed) ? 'PASSED' : 'FAILED', null);
  } finally {
    // A hung renderer must not keep the run alive; the worker exits (and Playwright kills Chrome).
    await Promise.race([browser.close().catch(() => {}), sleep(3_000)]);
  }
}

async function runRule(
  browser: Browser,
  files: Map<string, ProjectFile>,
  rule: CheckRule,
  opts: typeof DEFAULTS,
  deadline: number,
): Promise<Outcome> {
  const context = await browser.newContext({
    viewport: rule.viewport ?? { width: 1280, height: 800 },
    serviceWorkers: 'block',
    acceptDownloads: false,
    javaScriptEnabled: true,
  });
  try {
    await context.route('**/*', async (route) => {
      const url = new URL(route.request().url());
      const file =
        url.origin === CHECK_ORIGIN
          ? files.get(decodeURIComponent(url.pathname).replace(/^\/+/, '').toLowerCase())
          : undefined;
      if (!file) return route.abort('blockedbyclient');
      const ext = file.path.slice(file.path.lastIndexOf('.') + 1);
      return route.fulfill({
        status: 200,
        headers: {
          'content-type': CONTENT_TYPES[ext] ?? 'text/plain; charset=utf-8',
          'content-security-policy': CSP,
          'cache-control': 'no-store',
        },
        body: file.content,
      });
    });
    await context.routeWebSocket(/.*/, (ws) => ws.close());

    const page = await context.newPage();
    const errors: string[] = [];
    let crashed = false;
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('crash', () => (crashed = true));
    page.on('dialog', (d) => void d.dismiss().catch(() => {}));
    page.on('popup', (p) => void p.close().catch(() => {}));

    const remaining = () => deadline - Date.now();
    const step = () => Math.max(1, Math.min(opts.stepTimeoutMs, remaining()));

    try {
      await page.goto(`${CHECK_ORIGIN}/index.html`, {
        waitUntil: 'load',
        timeout: Math.max(1, Math.min(opts.loadTimeoutMs, remaining())),
      });
    } catch {
      if (crashed) return { abort: 'PAGE_CRASHED' };
      return { abort: remaining() <= 0 ? 'BUDGET' : 'LOAD_TIMEOUT' };
    }

    try {
      for (const action of rule.actions) {
        if (remaining() <= 0) throw new Aborted('BUDGET');
        const ok = await runAction(page, action, step());
        if (!ok) {
          await ensureResponsive(page, () => crashed);
          return { passed: false };
        }
      }
      if (remaining() <= 0) throw new Aborted('BUDGET');
      const passed = await assert(page, rule.assert, errors, step());
      if (!passed) await ensureResponsive(page, () => crashed);
      return { passed };
    } catch (err) {
      if (err instanceof Aborted) return { abort: err.code };
      if (crashed) return { abort: 'PAGE_CRASHED' };
      await ensureResponsive(page, () => crashed);
      return { passed: false };
    }
  } catch (err) {
    if (err instanceof Aborted) return { abort: err.code };
    return { abort: 'ENGINE' };
  } finally {
    await Promise.race([context.close().catch(() => {}), sleep(1_000)]);
  }
}

/** A failing step may be a missing element or a page stuck in a loop; only the latter aborts. */
async function ensureResponsive(page: Page, crashed: () => boolean): Promise<void> {
  if (crashed()) throw new Aborted('PAGE_CRASHED');
  const alive = await Promise.race([
    page.evaluate(() => true).catch(() => false),
    sleep(1_000).then(() => false),
  ]);
  if (crashed()) throw new Aborted('PAGE_CRASHED');
  if (!alive) throw new Aborted('LOAD_TIMEOUT');
}

async function runAction(page: Page, action: CheckAction, timeout: number): Promise<boolean> {
  try {
    switch (action.type) {
      case 'click':
        await page.locator(action.selector).first().click({ timeout });
        break;
      case 'hover':
        await page.locator(action.selector).first().hover({ timeout });
        break;
      case 'fill':
        await page.locator(action.selector).first().fill(action.value, { timeout });
        break;
      case 'press':
        await page.locator(action.selector).first().press(action.key, { timeout });
        break;
      case 'wait':
        await page.waitForTimeout(Math.min(action.ms, timeout));
        break;
    }
    return true;
  } catch {
    return false;
  }
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

async function assert(
  page: Page,
  a: CheckAssertion,
  errors: string[],
  timeout: number,
): Promise<boolean> {
  if (a.type === 'noConsoleErrors') return errors.length === 0;

  const all = page.locator(a.selector);
  const count = await all.count();
  if (a.type === 'count') return count >= a.min && (a.max === undefined || count <= a.max);
  if (count === 0) return false;
  const el = all.first();

  switch (a.type) {
    case 'text': {
      let actual = norm((await el.textContent({ timeout })) ?? '');
      let expected = norm(a.value);
      if (!a.caseSensitive) {
        actual = actual.toLocaleLowerCase();
        expected = expected.toLocaleLowerCase();
      }
      return a.match === 'equals' ? actual === expected : actual.includes(expected);
    }
    case 'attribute': {
      const value = await el.getAttribute(a.name, { timeout });
      if (value === null) return false;
      return a.value === undefined || value === a.value;
    }
    case 'style':
      return el.evaluate(
        (node, [prop, expected]) => {
          const actual = getComputedStyle(node).getPropertyValue(prop).trim();
          // Let the browser normalize the expected value (e.g. `red` -> `rgb(255, 0, 0)`)
          // by applying it to a sibling probe in the same context.
          const probe = document.createElement(node.tagName);
          probe.style.setProperty(prop, expected, 'important');
          if (!probe.style.getPropertyValue(prop)) return actual === expected;
          const parent =
            node.parentElement && node.parentElement !== document.documentElement
              ? node.parentElement
              : document.body;
          parent.appendChild(probe);
          const normalized = getComputedStyle(probe).getPropertyValue(prop).trim();
          probe.remove();
          return actual === normalized;
        },
        [a.property, a.value] as const,
        { timeout },
      );
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
