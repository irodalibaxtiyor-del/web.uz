import { describe, expect, it } from 'vitest';
import { parseRunnerMessage, SANDBOX_URL, withHostedLibraries } from './sandbox';

describe('parseRunnerMessage', () => {
  it('accepts the three runner message types', () => {
    expect(parseRunnerMessage({ type: 'wd:ready' })).toEqual({ type: 'wd:ready' });
    expect(parseRunnerMessage({ type: 'wd:loaded', runId: 'a' })).toEqual({
      type: 'wd:loaded',
      runId: 'a',
    });
    expect(
      parseRunnerMessage({ type: 'wd:console', runId: 'a', level: 'warn', text: 'x' }),
    ).toEqual({ type: 'wd:console', runId: 'a', level: 'warn', text: 'x' });
  });

  it('drops malformed or unexpected messages', () => {
    for (const bad of [
      null,
      'wd:ready',
      { type: 'wd:run' },
      { type: 'wd:loaded' },
      { type: 'wd:console', runId: 'a', level: 'evil', text: 'x' },
      { type: 'wd:console', runId: 'a', level: 'log', text: { html: '<b>' } },
      { type: 'wd:loaded', runId: 'x'.repeat(65) },
    ]) {
      expect(parseRunnerMessage(bad)).toBeNull();
    }
  });

  it('clamps console text', () => {
    const msg = parseRunnerMessage({
      type: 'wd:console',
      runId: 'a',
      level: 'log',
      text: 'x'.repeat(10_000),
    });
    expect(msg && 'text' in msg && msg.text.length).toBe(2001);
  });
});

describe('withHostedLibraries', () => {
  it('points known CDN URLs in HTML/CSS at the sandbox copy and leaves JS alone', () => {
    const cdn = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css';
    const out = withHostedLibraries([
      { path: 'index.html', content: `<link href="${cdn}" rel="stylesheet">` },
      { path: 'css/a.css', content: `@import url(${cdn});` },
      { path: 'script.js', content: `const u = "${cdn}";` },
    ]);
    expect(out[0]!.content).toBe(
      `<link href="${SANDBOX_URL}/lib/bootstrap@5.3.8/css/bootstrap.min.css" rel="stylesheet">`,
    );
    expect(out[1]!.content).toContain(`${SANDBOX_URL}/lib/bootstrap@5.3.8/`);
    expect(out[2]!.content).toContain(cdn);
  });
});
