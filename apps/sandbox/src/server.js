// @ts-check
// Static server for the isolated sandbox origin. Serves only an allow-list of files,
// each with a strict CSP that the nested srcdoc preview inherits.
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readLibraryPath } from '@webdizayn/libs';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const FILES = {
  '/runner.html': 'text/html; charset=utf-8',
  '/runner.js': 'text/javascript; charset=utf-8',
  '/build.js': 'text/javascript; charset=utf-8',
  '/protocol.js': 'text/javascript; charset=utf-8',
};

/** Hosted libraries (Bootstrap, jQuery…): `/lib/<id>/<file>`, only listed files. */
const LIB_PREFIX = '/lib/';

const ORIGIN_RE = /^https?:\/\/[A-Za-z0-9.-]+(?::\d{1,5})?$/;

/** @param {string | undefined} raw */
export function parseParents(raw) {
  const list = (raw ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const o of list) {
    if (!ORIGIN_RE.test(o)) throw new Error(`Invalid SANDBOX_PARENT_ORIGINS entry: ${o}`);
  }
  return list;
}

/** @param {string[]} parents */
export function securityHeaders(parents) {
  return {
    'Content-Security-Policy': [
      "default-src 'none'",
      // 'unsafe-inline' is required for the bridge and students' inline <script>/<style>.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      'img-src data: blob:',
      // 'self': hosted library fonts (Glyphicons, Bootstrap Icons) under /lib/.
      "font-src 'self' data:",
      'media-src data: blob:',
      // No network from student code: no fetch/XHR/WebSocket/EventSource/beacon.
      "connect-src 'none'",
      "frame-src 'self'",
      "child-src 'self'",
      "worker-src 'none'",
      "form-action 'none'",
      "base-uri 'none'",
      "manifest-src 'none'",
      `frame-ancestors ${parents.join(' ')}`,
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), usb=(), payment=(), serial=(), bluetooth=(), hid=(), clipboard-read=(), display-capture=()',
    'Cache-Control': 'no-store',
  };
}

/** @param {{ parents: string[] }} opts */
export function createSandboxServer({ parents }) {
  const headers = securityHeaders(parents);
  const runnerHtml = readFileSync(join(PUBLIC, 'runner.html'), 'utf8').replace(
    '__WD_PARENTS__',
    JSON.stringify(parents).replace(/"/g, '&quot;'),
  );

  return createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://sandbox.invalid');
    const path = url.pathname === '/' ? '/runner.html' : url.pathname;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { ...headers, Allow: 'GET, HEAD' }).end();
      return;
    }
    if (path.startsWith(LIB_PREFIX)) {
      const lib = readLibraryPath(decodeURIComponent(path.slice(LIB_PREFIX.length)));
      if (!lib) {
        res
          .writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' })
          .end('Not found');
        return;
      }
      res.writeHead(200, {
        ...headers,
        'Content-Type': lib.contentType,
        // Loaded by the opaque-origin preview; versioned public files, safe to cache.
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cache-Control': 'public, max-age=86400',
      });
      res.end(req.method === 'HEAD' ? undefined : lib.body);
      return;
    }
    const type = Object.hasOwn(FILES, path)
      ? FILES[/** @type {keyof typeof FILES} */ (path)]
      : null;
    if (!type) {
      res
        .writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' })
        .end('Not found');
      return;
    }
    const isHtml = path === '/runner.html';
    const body = isHtml ? runnerHtml : readFileSync(join(PUBLIC, path.slice(1)));
    res.writeHead(200, {
      ...headers,
      'Content-Type': type,
      // The runner document has an opaque origin (sandboxed iframe), so its module
      // scripts are CORS requests from origin "null". These files are public code.
      ...(isHtml
        ? {}
        : { 'Access-Control-Allow-Origin': '*', 'Cross-Origin-Resource-Policy': 'cross-origin' }),
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  });
}
