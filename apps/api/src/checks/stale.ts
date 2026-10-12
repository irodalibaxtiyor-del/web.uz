import type { AppConfig } from '../config';

/** How often every instance sweeps for abandoned runs. */
export const STALE_SWEEP_MS = 60_000;

/**
 * A QUEUED/RUNNING row older than this can no longer finish: its process is gone (crash or
 * restart). Younger rows may belong to another API instance that is still working on them, so
 * they are never touched; that is what makes the sweep safe with several instances.
 */
export function staleCutoff(config: Pick<AppConfig, 'CHECK_BUDGET_MS'>, now = new Date()): Date {
  const maxRunMs = Math.max(10 * 60_000, config.CHECK_BUDGET_MS * 3);
  return new Date(now.getTime() - maxRunMs);
}

/** Starts a periodic sweep that does not keep the process alive; returns a stopper. */
export function startSweep(fn: () => Promise<unknown>): () => void {
  const timer = setInterval(() => {
    fn().catch(() => {
      // A failed sweep (e.g. database briefly unavailable) is retried on the next tick.
    });
  }, STALE_SWEEP_MS);
  timer.unref();
  return () => clearInterval(timer);
}
