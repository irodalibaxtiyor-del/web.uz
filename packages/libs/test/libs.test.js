// @ts-check
import { LIBRARIES } from '@webdizayn/shared';
import { describe, expect, it } from 'vitest';
import { readLibraryFile, readLibraryPath } from '../index.js';

describe('hosted library files', () => {
  it('every listed file exists in the pinned npm package', () => {
    for (const lib of LIBRARIES) {
      for (const file of lib.files) {
        const f = readLibraryFile(lib.id, file);
        expect(f, `${lib.id}/${file}`).not.toBeNull();
        expect(f?.body.length).toBeGreaterThan(100);
      }
    }
  });

  it('serves the version the id names', () => {
    const css = readLibraryPath('bootstrap@5.3.8/css/bootstrap.min.css');
    expect(css?.contentType).toMatch(/^text\/css/);
    expect(css?.body.toString('utf8', 0, 200)).toContain('v5.3.8');
    expect(
      readLibraryPath('bootstrap@3.4.1/css/bootstrap.min.css')?.body.toString('utf8', 0, 200),
    ).toContain('v3.4.1');
    expect(
      readLibraryPath('bootstrap@4.6.2/js/bootstrap.bundle.min.js')?.body.toString('utf8', 0, 200),
    ).toContain('v4.6.2');
    expect(
      readLibraryPath('jquery@3.7.1/jquery.slim.min.js')?.body.toString('utf8', 0, 100),
    ).toContain('v3.7.1');
    expect(readLibraryPath('bootstrap-icons@1.13.1/fonts/bootstrap-icons.woff2')?.contentType).toBe(
      'font/woff2',
    );
  });

  it('rejects anything not listed', () => {
    expect(readLibraryPath('bootstrap@5.3.8/../package.json')).toBeNull();
    expect(readLibraryPath('bootstrap@5.3.8/css/bootstrap.min.css.map')).toBeNull();
    expect(readLibraryPath('bootstrap@5.3.7/css/bootstrap.min.css')).toBeNull();
    expect(readLibraryPath('nope')).toBeNull();
    expect(readLibraryFile('constructor', 'x')).toBeNull();
  });
});
