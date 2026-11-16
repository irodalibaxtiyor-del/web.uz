import { z } from 'zod';

/**
 * Time on task. While a learning page is visible and the student has interacted in the last
 * minute, the browser sends a ping every ACTIVITY_PING_SECONDS with the active seconds since
 * the previous ping. The server never credits more than the wall-clock time since the
 * student's previous ping (any page, any tab), so parallel tabs cannot double-count.
 */

export const ACTIVITY_KINDS = ['LESSON', 'EXERCISE', 'QUIZ', 'ASSIGNMENT'] as const;
export type ActivityKind = (typeof ACTIVITY_KINDS)[number];

export const ACTIVITY_PING_SECONDS = 30;
/** No input for this long = idle; idle time is not counted. */
export const ACTIVITY_IDLE_SECONDS = 60;

export const activityPingSchema = z.object({
  kind: z.enum(ACTIVITY_KINDS),
  targetId: z.string().uuid(),
  seconds: z.number().int().min(1).max(ACTIVITY_PING_SECONDS),
});
export type ActivityPingInput = z.infer<typeof activityPingSchema>;

/** Seconds to credit for a ping, given when the student's previous ping arrived. */
export function creditedSeconds(claimed: number, now: number, lastPingAt: number | null): number {
  const capped = Math.min(Math.max(0, Math.floor(claimed)), ACTIVITY_PING_SECONDS);
  if (lastPingAt === null) return capped;
  const elapsed = Math.floor((now - lastPingAt) / 1000);
  return Math.max(0, Math.min(capped, elapsed));
}

export function formatMinutes(seconds: number | null): string {
  if (seconds === null) return '—';
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} daq.`;
  return `${Math.floor(m / 60)} soat ${m % 60} daq.`;
}
