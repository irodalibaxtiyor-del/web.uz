import { execFileSync } from 'node:child_process';
import { checkRulesSchema } from '@webdizayn/shared';
import { describe, expect, it } from 'vitest';
import { runChecksIsolated, workerEnv } from '../src/isolated';

// Spawns dist/worker.js, so `pnpm test` builds first.
const chromePath = process.env.CHROME_PATH;
const rules = checkRulesSchema.parse([
  { id: 'h1', title: 'h1 bor', assert: { type: 'count', selector: 'h1' } },
]);

/** Chrome processes launched by Playwright (its temp profile dir is on the command line). */
function playwrightChromeCount(): number {
  const out =
    process.platform === 'win32'
      ? execFileSync('powershell', [
          '-NoProfile',
          '-Command',
          "(Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*playwright_chromiumdev_profile*' }).Count",
        ])
      : execFileSync('sh', [
          '-c',
          'ps -eo args | grep -c "[p]laywright_chromiumdev_profile" || true',
        ]);
  return Number(out.toString().trim() || 0);
}

describe('isolated check runner', () => {
  it('runs in a child process and returns the verdict', async () => {
    const res = await runChecksIsolated(
      [{ path: 'index.html', content: '<h1>Salom</h1>' }],
      rules,
      {
        chromePath,
      },
    );
    expect(res).toMatchObject({ status: 'PASSED', results: [{ id: 'h1', passed: true }] });
  });

  it('hard-kills a stuck run as TIMEOUT and leaves no Chrome behind', async () => {
    const files = [{ path: 'index.html', content: '<h1>x</h1><script>while(true){}</script>' }];
    let seenRunning = 0;
    const poll = setInterval(() => {
      seenRunning = Math.max(seenRunning, playwrightChromeCount());
    }, 700);
    const started = Date.now();
    const res = await runChecksIsolated(files, rules, {
      chromePath,
      loadTimeoutMs: 20_000,
      budgetMs: 20_000,
      killAfterMs: 4_000,
    });
    clearInterval(poll);
    expect(res).toMatchObject({ status: 'TIMEOUT', errorCode: 'BUDGET' });
    expect(Date.now() - started).toBeLessThan(8_000);
    expect(seenRunning).toBeGreaterThan(0);
    await new Promise((r) => setTimeout(r, 2_000));
    expect(playwrightChromeCount()).toBe(0);
  });

  it('passes only an allowlisted environment to the worker (no app secrets)', () => {
    const env = workerEnv({
      PATH: '/bin',
      TEMP: '/tmp',
      DATABASE_URL: 'postgres://user:pw@db/x',
      SESSION_SECRET: 's',
      AI_API_KEY: 'k',
      SEED_PASSWORD: 'p',
    });
    expect(env).toEqual({ PATH: '/bin', TEMP: '/tmp' });
  });
});
