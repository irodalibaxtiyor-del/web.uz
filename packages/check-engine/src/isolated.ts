import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  CHECK_ERROR_CODES,
  CHECK_RESULT_STATUSES,
  type CheckEngineResult,
  type CheckRule,
  type ProjectFile,
} from '@webdizayn/shared';
import type { EngineOptions } from './engine';

/**
 * Only what Node and Chrome need to start. Notably excludes DATABASE_URL, session secrets
 * and any API keys of the parent process.
 */
const ENV_ALLOWLIST = [
  'PATH',
  'SystemRoot',
  'SYSTEMROOT',
  'windir',
  'TEMP',
  'TMP',
  'TMPDIR',
  'HOME',
  'USERPROFILE',
  'LOCALAPPDATA',
  'PROGRAMFILES',
  'ProgramFiles',
  'ProgramFiles(x86)',
  'PROGRAMFILES(X86)',
  'XDG_RUNTIME_DIR',
  'LANG',
];

export function workerEnv(source: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  for (const key of ENV_ALLOWLIST) {
    if (source[key] !== undefined) env[key] = source[key];
  }
  return env;
}

const MAX_OUTPUT = 256 * 1024;

/** Compiled worker next to this file; from TS sources (tests) fall back to the build output. */
function workerPath(): string {
  const local = path.join(__dirname, 'worker.js');
  return existsSync(local) ? local : path.join(__dirname, '..', 'dist', 'worker.js');
}

export interface IsolatedOptions extends EngineOptions {
  /** Hard kill after this long. Defaults to budget + 8s. */
  killAfterMs?: number;
}

/** Runs CHECK in a separate Node process that can be killed if Chrome or the page hangs. */
export function runChecksIsolated(
  files: ProjectFile[],
  rules: CheckRule[],
  options: IsolatedOptions = {},
): Promise<CheckEngineResult> {
  const { killAfterMs, ...engine } = options;
  const budget = engine.budgetMs ?? 20_000;
  const started = Date.now();
  const failure = (status: 'ERROR' | 'TIMEOUT'): CheckEngineResult => ({
    status,
    errorCode: status === 'TIMEOUT' ? 'BUDGET' : 'ENGINE',
    results: rules.map((r) => ({ id: r.id, passed: false })),
    durationMs: Date.now() - started,
  });

  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['--max-old-space-size=256', workerPath()], {
      env: workerEnv(),
      stdio: ['pipe', 'pipe', 'ignore'],
      windowsHide: true,
    });
    let out = '';
    let killed = false;
    const timer = setTimeout(
      () => {
        killed = true;
        child.kill('SIGKILL');
      },
      killAfterMs ?? budget + 8_000,
    );

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (d: string) => {
      out += d;
      if (out.length > MAX_OUTPUT) child.kill('SIGKILL');
    });
    child.on('error', () => {
      clearTimeout(timer);
      resolve(failure('ERROR'));
    });
    child.on('close', () => {
      clearTimeout(timer);
      if (killed) return resolve(failure('TIMEOUT'));
      resolve(parseResult(out, rules) ?? failure('ERROR'));
    });
    child.stdin.on('error', () => {});
    child.stdin.end(JSON.stringify({ files, rules, options: engine }));
  });
}

/** Accepts only a well-formed result for exactly the given rules. */
function parseResult(raw: string, rules: CheckRule[]): CheckEngineResult | null {
  try {
    const r = JSON.parse(raw) as CheckEngineResult;
    if (!CHECK_RESULT_STATUSES.includes(r.status)) return null;
    if (r.errorCode !== null && !CHECK_ERROR_CODES.includes(r.errorCode)) return null;
    const passed = new Map(
      (Array.isArray(r.results) ? r.results : []).map((x) => [x.id, x.passed === true]),
    );
    const results = rules.map((rule) => ({ id: rule.id, passed: passed.get(rule.id) ?? false }));
    // PASSED must be backed by every rule passing; never trust the status alone.
    const status = r.status === 'PASSED' && !results.every((x) => x.passed) ? 'FAILED' : r.status;
    return {
      status,
      errorCode: r.errorCode,
      results,
      durationMs: Number.isFinite(r.durationMs) ? r.durationMs : 0,
    };
  } catch {
    return null;
  }
}
