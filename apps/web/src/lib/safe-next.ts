/**
 * Validates a `?next=` return path. Only same-origin absolute paths are allowed: no scheme,
 * no protocol-relative `//host`, no backslash tricks (`/\host`), no control characters.
 */
export function safeNext(raw: string | null | undefined): string | null {
  if (!raw || raw.length > 512) return null;
  if (!raw.startsWith('/') || raw.startsWith('//')) return null;
  // Browsers treat `\` like `/`, so `/\evil.uz` would be protocol-relative.
  if (/[\u0000-\u001f\u007f\\]/.test(raw)) return null;
  return raw;
}

/** The current `?next=` of the page, if it is safe. */
export function currentNext(): string | null {
  if (typeof window === 'undefined') return null;
  return safeNext(new URLSearchParams(window.location.search).get('next'));
}

/** `/login?next=<here>` for the page the user is on now. */
export function loginUrlForHere(): string {
  const here = `${window.location.pathname}${window.location.search}`;
  return here === '/' ? '/login' : `/login?next=${encodeURIComponent(here)}`;
}
