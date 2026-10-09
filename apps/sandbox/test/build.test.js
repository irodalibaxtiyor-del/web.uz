import { describe, expect, it } from 'vitest';
import { buildDocument } from '../public/build.js';

const files = (index, extra = []) => [{ path: 'index.html', content: index }, ...extra];

describe('buildDocument', () => {
  it('injects the bridge as the first thing in <head>', () => {
    const html = buildDocument(
      files('<html><head><title>t</title><script>console.log(1)</script></head></html>'),
      'run-1',
    );
    const bridgeAt = html.indexOf('wd:console');
    expect(bridgeAt).toBeGreaterThan(0);
    expect(bridgeAt).toBeLessThan(html.indexOf('<title>'));
    expect(html).toContain('"run-1"');
  });

  it('adds a head when the document has none', () => {
    expect(buildDocument(files('<h1>Salom</h1>'), 'r')).toMatch(/^<script>[\s\S]*<h1>Salom<\/h1>$/);
    expect(buildDocument(files('<html><body>x</body></html>'), 'r')).toMatch(
      /^<html><head><script>/,
    );
  });

  it('inlines local stylesheets and scripts with relative, ./ and / paths', () => {
    const html = buildDocument(
      files(
        '<head><link rel="stylesheet" href="./css/style.css"><link href="/b.css" rel="stylesheet"></head><body><script src="js/app.js" defer></script></body>',
        [
          { path: 'css/style.css', content: 'h1{color:red}' },
          { path: 'b.css', content: 'p{margin:0}' },
          { path: 'js/app.js', content: 'console.log("hi")' },
        ],
      ),
      'r',
    );
    expect(html).toContain('<style>h1{color:red}</style>');
    expect(html).toContain('<style>p{margin:0}</style>');
    expect(html).toContain('<script defer>console.log("hi")</script>');
    expect(html).not.toContain('src="js/app.js"');
  });

  it('escapes closing tags inside inlined files so they cannot break out', () => {
    const html = buildDocument(
      files('<head><link rel="stylesheet" href="a.css"></head><script src="a.js"></script>', [
        { path: 'a.css', content: 'x{}</style><img src=x onerror=alert(1)>' },
        { path: 'a.js', content: 'var s = "</script><b>hi</b>";' },
      ]),
      'r',
    );
    expect(html).toContain('<\\/style><img');
    expect(html).toContain('"<\\/script><b>hi</b>"');
  });

  it('leaves remote and missing references untouched (CSP blocks them)', () => {
    const html = buildDocument(
      files(
        '<link rel="stylesheet" href="https://cdn.example/x.css"><script src="//evil.example/x.js"></script><script src="missing.js"></script>',
      ),
      'r',
    );
    expect(html).toContain('href="https://cdn.example/x.css"');
    expect(html).toContain('src="//evil.example/x.js"');
    expect(html).toContain('src="missing.js"');
  });

  it('falls back to another html file, then to a message', () => {
    expect(buildDocument([{ path: 'page.html', content: '<p>p</p>' }], 'r')).toContain('<p>p</p>');
    expect(buildDocument([{ path: 'a.css', content: '' }], 'r')).toContain(
      'index.html fayli topilmadi',
    );
  });
});
