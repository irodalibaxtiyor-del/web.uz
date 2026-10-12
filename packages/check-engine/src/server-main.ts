import { createCheckWorkerServer } from './server';

/**
 * Entry point of the CHECK worker container: `node dist/server-main.js`.
 * Env: CHECK_WORKER_TOKEN (required, >= 32 chars), PORT (4100), HOST (0.0.0.0),
 * CHECK_CONCURRENCY (2), CHECK_BUDGET_MS (20000), CHECK_CHROME_PATH, CHECK_CHROMIUM_SANDBOX.
 * Configuration errors print only variable names, never values.
 */
function int(name: string, fallback: number): number {
  const v = process.env[name];
  if (v === undefined || v === '') return fallback;
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`Invalid environment configuration: ${name}`);
  return n;
}

const token = process.env.CHECK_WORKER_TOKEN ?? '';
if (token.length < 32) throw new Error('Invalid environment configuration: CHECK_WORKER_TOKEN');
const port = int('PORT', 4100);
const host = process.env.HOST ?? '0.0.0.0';

const server = createCheckWorkerServer({
  token,
  concurrency: int('CHECK_CONCURRENCY', 2),
  engine: {
    budgetMs: int('CHECK_BUDGET_MS', 20_000),
    chromePath: process.env.CHECK_CHROME_PATH || undefined,
    chromiumSandbox: process.env.CHECK_CHROMIUM_SANDBOX !== 'false',
  },
});
// The token must not reach the per-run child processes (workerEnv() allowlist already
// excludes it); drop it from this process's environment as well.
delete process.env.CHECK_WORKER_TOKEN;

server.listen(port, host, () => console.warn(`CHECK worker listening on ${host}:${port}`));
const stop = () => server.close(() => process.exit(0));
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
