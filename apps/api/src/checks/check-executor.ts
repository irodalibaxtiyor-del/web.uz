import type { CheckEngineResult, CheckRule, ProjectFile } from '@webdizayn/shared';
import { runChecksIsolated } from '@webdizayn/check-engine';
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
  return config.CHECK_ENGINE === 'process'
    ? new ProcessCheckExecutor(config)
    : new DisabledCheckExecutor();
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
