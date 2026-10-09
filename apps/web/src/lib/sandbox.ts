import type { ProjectFile } from '@webdizayn/shared';

/**
 * Sandbox runner URL. Must be a different *site* from the web app (in production a separate
 * registrable domain) so browsers put student code in its own process.
 */
export const SANDBOX_URL = (process.env.NEXT_PUBLIC_SANDBOX_URL ?? 'http://127.0.0.1:3100').replace(
  /\/$/,
  '',
);

export const RUN_TIMEOUT_MS = 3000;
export const MAX_CONSOLE_LINES = 200;

export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error';
export interface ConsoleLine {
  level: ConsoleLevel;
  text: string;
}

export type RunMessage = { type: 'wd:run'; runId: string; files: ProjectFile[] };

/** Messages accepted from the runner frame. Anything else is ignored. */
export type RunnerMessage =
  | { type: 'wd:ready' }
  | { type: 'wd:loaded'; runId: string }
  | { type: 'wd:console'; runId: string; level: ConsoleLevel; text: string };

const LEVELS = new Set(['log', 'info', 'warn', 'error']);

export function parseRunnerMessage(data: unknown): RunnerMessage | null {
  if (typeof data !== 'object' || data === null) return null;
  const d = data as Record<string, unknown>;
  if (d.type === 'wd:ready') return { type: 'wd:ready' };
  if (typeof d.runId !== 'string' || d.runId.length > 64) return null;
  if (d.type === 'wd:loaded') return { type: 'wd:loaded', runId: d.runId };
  if (d.type === 'wd:console' && typeof d.text === 'string' && LEVELS.has(String(d.level))) {
    return {
      type: 'wd:console',
      runId: d.runId,
      level: d.level as ConsoleLevel,
      text: d.text.slice(0, 2001),
    };
  }
  return null;
}
