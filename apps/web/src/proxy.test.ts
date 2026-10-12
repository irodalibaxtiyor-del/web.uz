import { describe, expect, it } from 'vitest';
import { buildCsp } from './proxy';

describe('Content-Security-Policy', () => {
  it('allows scripts only by nonce in production', () => {
    const csp = buildCsp('abc123', false);
    expect(csp).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    expect(csp).not.toContain('unsafe-eval');
    for (const d of [
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ]) {
      expect(csp).toContain(d);
    }
    expect(csp).toMatch(/frame-src https?:\/\/[^;\s]+$|frame-src https?:\/\/[^;\s]+;/);
  });

  it('adds eval and websockets only in development', () => {
    const csp = buildCsp('n', true);
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("connect-src 'self' ws: wss:");
  });
});
