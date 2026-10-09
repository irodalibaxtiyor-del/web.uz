import { describe, expect, it } from 'vitest';
import { PROJECT_MAX_FILES, projectFilesSchema } from './exercises';

const ok = (path: string) => projectFilesSchema.safeParse([{ path, content: '' }]).success;

describe('project file paths', () => {
  it('accepts normal web source paths', () => {
    expect(ok('index.html')).toBe(true);
    expect(ok('css/style.css')).toBe(true);
    expect(ok('js/app.min.js')).toBe(true);
  });

  it('rejects traversal, absolute, backslash and other extensions', () => {
    for (const p of [
      '../secret.html',
      'a/../../b.js',
      '/etc/passwd.html',
      'C:\\x.html',
      'a\\b.css',
      'server.php',
      'img.png',
      '.html',
      'a//b.css',
      '',
      'a b.html',
    ]) {
      expect(ok(p), p).toBe(false);
    }
  });

  it('rejects duplicate paths case-insensitively', () => {
    expect(
      projectFilesSchema.safeParse([
        { path: 'index.html', content: '' },
        { path: 'INDEX.html', content: '' },
      ]).success,
    ).toBe(false);
  });

  it('enforces file count and total size limits', () => {
    const many = Array.from({ length: PROJECT_MAX_FILES + 1 }, (_, i) => ({
      path: `f${i}.js`,
      content: '',
    }));
    expect(projectFilesSchema.safeParse(many).success).toBe(false);
    const big = Array.from({ length: 6 }, (_, i) => ({
      path: `f${i}.js`,
      content: 'x'.repeat(99_000),
    }));
    expect(projectFilesSchema.safeParse(big).success).toBe(false);
    expect(projectFilesSchema.safeParse([]).success).toBe(false);
  });
});
