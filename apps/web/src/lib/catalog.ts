import type {
  CourseMoved,
  DirectionDetail,
  DirectionSummary,
  PublicCourseDetail,
} from '@webdizayn/shared';
import { headers } from 'next/headers';

/** Server-side only: the API is reached directly, not through the browser `/api` rewrite. */
const API_URL = process.env.API_URL ?? 'http://localhost:4000';

/** Public origin for canonical URLs and Open Graph (e.g. https://webdizayn.uz). */
export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = 'WEBDIZAYN.UZ';

/**
 * GET a public catalogue endpoint while rendering on the server. `null` means 404; anything
 * else unexpected throws (the error boundary shows a friendly page).
 *
 * The client's `X-Forwarded-For` is passed on so the API's per-IP limit counts each visitor,
 * not this server (which would otherwise put every visitor into one shared bucket). The API
 * only trusts it from the configured proxy hops (`TRUST_PROXY`).
 */
async function publicGet<T>(path: string): Promise<T | null> {
  const forwarded = (await headers()).get('x-forwarded-for');
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    headers: forwarded ? { 'x-forwarded-for': forwarded } : {},
    signal: AbortSignal.timeout(8000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Catalogue request failed: ${res.status}`);
  return (await res.json()) as T;
}

export const getDirections = () => publicGet<DirectionSummary[]>('/public/directions');

export const getDirection = (slug: string) =>
  publicGet<DirectionDetail>(`/public/directions/${encodeURIComponent(slug)}`);

/** A renamed course answers its old slug with `{ movedTo }`. */
export const getPublicCourse = (slug: string) =>
  publicGet<PublicCourseDetail | CourseMoved>(`/public/courses/${encodeURIComponent(slug)}`);

export const isMoved = (c: PublicCourseDetail | CourseMoved): c is CourseMoved => 'movedTo' in c;

/** "12 modul · 60 dars · 49 mashq · 12 test" (zero counts are left out). */
export function countsLine(c: {
  modules: number;
  lessons: number;
  exercises: number;
  quizzes: number;
}) {
  return [
    [c.modules, 'modul'],
    [c.lessons, 'dars'],
    [c.exercises, 'mashq'],
    [c.quizzes, 'test'],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, w]) => `${n} ${w}`)
    .join(' · ');
}
