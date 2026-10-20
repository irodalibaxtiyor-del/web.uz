import { describe, expect, it } from 'vitest';
import { safeNext } from './safe-next';

describe('safeNext', () => {
  it('accepts same-origin paths', () => {
    expect(safeNext('/dashboard')).toBe('/dashboard');
    expect(safeNext('/orgs/a/courses/b?tab=1')).toBe('/orgs/a/courses/b?tab=1');
  });

  it('rejects open-redirect tricks', () => {
    for (const bad of [
      null,
      '',
      'https://evil.uz',
      '//evil.uz',
      '/\\evil.uz',
      '/\\/evil.uz',
      '/path\\..\\x',
      'javascript:alert(1)',
      '/a\nb',
      '/a\tb',
      `/${'a'.repeat(600)}`,
    ]) {
      expect(safeNext(bad), JSON.stringify(bad)).toBeNull();
    }
  });
});
