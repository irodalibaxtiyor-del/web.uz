import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Monaco's prebuilt `min` bundle (served from /monaco) embeds its own DOMPurify, so a
 * `dompurify` override in pnpm does not reach it. DOMPurify <=3.4.15 has advisories that only
 * affect the IN_PLACE mode (GHSA-6688-9rhm-gjv2). Fail loudly if a Monaco upgrade starts
 * using that mode, so the risk is re-evaluated instead of silently inherited.
 */
describe('bundled Monaco', () => {
  it('never calls DOMPurify in IN_PLACE mode', () => {
    // Same source as scripts/copy-monaco.mjs (vitest runs from apps/web).
    const dir = join(process.cwd(), 'node_modules', 'monaco-editor', 'min', 'vs');
    const bundles = readdirSync(dir)
      .filter((f) => f.endsWith('.js'))
      .map((f) => readFileSync(join(dir, f), 'utf8'))
      .filter((src) => src.includes('DOMPurify'));
    expect(bundles.length).toBeGreaterThan(0);
    for (const src of bundles) {
      expect(src).not.toMatch(/IN_PLACE\s*:\s*(!0|true)/);
      expect(src).toMatch(/RETURN_DOM_FRAGMENT\s*:\s*!0/);
    }
    // Reads and scans several MB of minified code; slow when other packages test in parallel.
  }, 30_000);
});
