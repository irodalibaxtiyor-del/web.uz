import { describe, expect, it } from 'vitest';
import { parseRunnerMessage } from './sandbox';

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
