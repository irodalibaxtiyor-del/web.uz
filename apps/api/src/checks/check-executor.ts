import type { CheckEngineResult, CheckRule, ProjectFile } from '@webdizayn/shared';
import { parseResult, runChecksIsolated } from '@webdizayn/check-engine';
import type { AppConfig } from '../config';

/** Runs CHECK rules against project files. Swappable (tests, remote worker in production). */
export interface CheckExecutor {
  run(files: ProjectFile[], rules: CheckRule[]): Promise<CheckEngineResult>;
}

export const CHECK_EXECUTOR = Symbol('CHECK_EXECUTOR');

/** Playwright in a killable child process with a minimal environment. */
export class ProcessCheckExecutor implements CheckExecutor {
  constructor(private readonly config: AppConfig) {}

  run(files: ProjectFile[], rules: CheckRule[]) {
    return runChecksIsolated(files, rules, {
      chromePath: this.config.CHECK_CHROME_PATH || undefined,
      chromiumSandbox: this.config.CHECK_CHROMIUM_SANDBOX,
      budgetMs: this.config.CHECK_BUDGET_MS,
    });
  }
}

type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

/**
 * Production: the CHECK worker service runs in its own container without database or app
 * secrets. Its answer is re-validated here exactly like the local child process's output:
 * PASSED only when every rule passed; anything malformed or failed becomes ERROR (via runSafely).
 */
export class RemoteCheckExecutor implements CheckExecutor {
  constructor(
    private readonly config: Pick<
      AppConfig,
      'CHECK_WORKER_URL' | 'CHECK_WORKER_TOKEN' | 'CHECK_BUDGET_MS'
    >,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  async run(files: ProjectFile[], rules: CheckRule[]): Promise<CheckEngineResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.CHECK_BUDGET_MS + 15_000);
    try {
      const res = await this.fetchImpl(new URL('/run', this.config.CHECK_WORKER_URL).href, {
        method: 'POST',
        signal: controller.signal,
        redirect: 'error',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${this.config.CHECK_WORKER_TOKEN}`,
        },
        body: JSON.stringify({ files, rules }),
      });
      if (res.status !== 200) throw new Error(`CHECK worker status ${res.status}`);
      const result = parseResult((await res.text()).slice(0, 256 * 1024), rules);
      if (!result) throw new Error('CHECK worker returned an invalid result');
      return result;
    } finally {
      clearTimeout(timer);
    }
  }
}

/** Used when no browser infrastructure exists. Reports ERROR; never fakes a PASS. */
export class DisabledCheckExecutor implements CheckExecutor {
  async run(_files: ProjectFile[], rules: CheckRule[]): Promise<CheckEngineResult> {
    return {
      status: 'ERROR',
      errorCode: 'ENGINE',
      results: rules.map((r) => ({ id: r.id, passed: false })),
      durationMs: 0,
    };
  }
}

export function createCheckExecutor(config: AppConfig): CheckExecutor {
  if (config.CHECK_ENGINE === 'process') return new ProcessCheckExecutor(config);
  if (config.CHECK_ENGINE === 'remote') return new RemoteCheckExecutor(config);
  return new DisabledCheckExecutor();
}

/** Engine failures become ERROR results; they must never surface as a pass. */
export async function runSafely(
  executor: CheckExecutor,
  files: ProjectFile[],
  rules: CheckRule[],
): Promise<CheckEngineResult> {
  try {
    return await executor.run(files, rules);
  } catch {
    return {
      status: 'ERROR',
      errorCode: 'ENGINE',
      results: rules.map((r) => ({ id: r.id, passed: false })),
      durationMs: 0,
    };
  }
}
