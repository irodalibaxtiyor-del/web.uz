import { describe, expect, it } from 'vitest';
import { isLibraryFile, LIBRARIES, resolveLibraryUrl, rewriteLibraryUrls } from './libraries';

describe('hosted libraries', () => {
  it('recognises exact CDN URLs only', () => {
    expect(
      resolveLibraryUrl('https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css'),
    ).toEqual({ id: 'bootstrap@5.3.8', file: 'css/bootstrap.min.css' });
    expect(
      resolveLibraryUrl('//maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js?v=1'),
    ).toEqual({ id: 'bootstrap@3.4.1', file: 'js/bootstrap.min.js' });
    expect(resolveLibraryUrl('https://code.jquery.com/jquery-3.7.1.min.js')?.file).toBe(
      'jquery.min.js',
    );
    // Other versions, files, hosts and path tricks are not hosted.
    expect(
      resolveLibraryUrl('https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css'),
    ).toBeNull();
    expect(
      resolveLibraryUrl('https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/../package.json'),
    ).toBeNull();
    expect(
      resolveLibraryUrl('https://evil.example/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css'),
    ).toBeNull();
  });

  it('rewrites known URLs in HTML and CSS and leaves the rest', () => {
    const html = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js'></script>
<img src="https://example.com/a.png">`;
    const out = rewriteLibraryUrls(html, '/__lib/');
    expect(out).toContain('href="/__lib/bootstrap@5.3.8/css/bootstrap.min.css"');
    expect(out).toContain("src='/__lib/bootstrap@5.3.8/js/bootstrap.bundle.min.js'");
    expect(out).toContain('https://example.com/a.png');
    expect(
      rewriteLibraryUrls(
        '@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css");',
        'http://s/lib/',
      ),
    ).toBe('@import url("http://s/lib/bootstrap-icons@1.13.1/bootstrap-icons.min.css");');
  });

  it('has unique ids and safe file names', () => {
    expect(new Set(LIBRARIES.map((l) => l.id)).size).toBe(LIBRARIES.length);
    for (const lib of LIBRARIES) {
      for (const f of lib.files) {
        expect(f).toMatch(/^[a-z0-9.-]+(\/[a-z0-9.-]+)*$/);
        expect(f.split('/')).not.toContain('..');
      }
    }
    expect(isLibraryFile('bootstrap@4.6.2', 'js/bootstrap.bundle.min.js')).toBe(true);
    expect(isLibraryFile('bootstrap@4.6.2', '../package.json')).toBe(false);
  });
});
