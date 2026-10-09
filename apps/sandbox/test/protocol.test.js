import { describe, expect, it } from 'vitest';
import {
  MAX_CONSOLE_TEXT,
  MAX_FILES,
  parsePreviewMessage,
  parseRunMessage,
} from '../public/protocol.js';

const run = (over = {}) => ({
  type: 'wd:run',
  runId: 'r-1',
  files: [{ path: 'index.html', content: '<h1>x</h1>' }],
  ...over,
});

describe('parseRunMessage', () => {
  it('accepts a valid run', () => {
    expect(parseRunMessage(run())).toEqual({ runId: 'r-1', files: run().files });
  });

  it('rejects wrong types, bad run ids and bad files', () => {
    for (const bad of [
      null,
      'string',
      { ...run(), type: 'other' },
      run({ runId: '<script>' }),
      run({ runId: 'x'.repeat(65) }),
      run({ files: [] }),
      run({ files: 'nope' }),
      run({ files: [{ path: '../x.html', content: '' }] }),
      run({ files: [{ path: 'x.php', content: '' }] }),
      run({ files: [{ path: 'a.js', content: 1 }] }),
      run({ files: [{ path: 'a.js', content: 'x'.repeat(100_001) }] }),
      run({
        files: [
          { path: 'a.js', content: '' },
          { path: 'A.js', content: '' },
        ],
      }),
      run({
        files: Array.from({ length: MAX_FILES + 1 }, (_, i) => ({ path: `f${i}.js`, content: '' })),
      }),
    ]) {
      expect(parseRunMessage(bad)).toBeNull();
    }
  });
});

describe('parsePreviewMessage', () => {
  it('accepts loaded and console messages and clamps text', () => {
    expect(parsePreviewMessage({ type: 'wd:loaded', runId: 'r' })).toEqual({
      type: 'wd:loaded',
      runId: 'r',
    });
    const msg = parsePreviewMessage({
      type: 'wd:console',
      runId: 'r',
      level: 'error',
      text: 'x'.repeat(5000),
    });
    expect(msg.level).toBe('error');
    expect(msg.text.length).toBe(MAX_CONSOLE_TEXT + 1);
  });

  it('normalises unknown levels and drops unknown types', () => {
    expect(parsePreviewMessage({ type: 'wd:console', runId: 'r', level: 'evil', text: 1 })).toEqual(
      { type: 'wd:console', runId: 'r', level: 'log', text: '' },
    );
    expect(parsePreviewMessage({ type: 'wd:run', runId: 'r' })).toBeNull();
    expect(parsePreviewMessage({ type: 'wd:loaded', runId: 'bad id!' })).toBeNull();
  });
});
