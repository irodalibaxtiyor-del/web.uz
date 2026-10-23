import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Monaco's prebuilt `min` bundle (served from /monaco) embeds its own DOMPurify, so a
 * `dompurify` override in pnpm does not reach it. The bundled copy (3.4.15) has advisories that
 * only affect options Monaco never sets: IN_PLACE (GHSA-6688-9rhm-gjv2 and its follow-up),
 * SAFE_FOR_TEMPLATES with DOM output and an XHTML PARSER_MEDIA_TYPE (GHSA-c6gr-qvv4-5v3f).
 * Fail loudly if a Monaco upgrade starts using any of them, so the risk is re-evaluated
 * instead of silently inherited.
 */
describe('bundled Monaco', () => {
  it('never enables the DOMPurify options with known advisories', () => {
    // Same source as scripts/copy-monaco.mjs (vitest runs from apps/web).
    const dir = join(process.cwd(), 'node_modules', 'monaco-editor', 'min', 'vs');
    const bundles = readdirSync(dir)
      .filter((f) => f.endsWith('.js'))
      .map((f) => readFileSync(join(dir, f), 'utf8'))
      .filter((src) => src.includes('DOMPurify'));
    expect(bundles.length).toBeGreaterThan(0);
    for (const src of bundles) {
      expect(src).not.toMatch(/IN_PLACE\s*:\s*(!0|true)/);
      // DOMPurify itself only reads these as `cfg.X`; a `X:` key would mean Monaco passes it.
      expect(src).not.toMatch(/SAFE_FOR_TEMPLATES\s*:/);
      expect(src).not.toMatch(/PARSER_MEDIA_TYPE\s*:/);
      expect(src).toMatch(/RETURN_DOM_FRAGMENT\s*:\s*!0/);
    }
    // Reads and scans several MB of minified code; slow when other packages test in parallel.
  }, 30_000);
});
