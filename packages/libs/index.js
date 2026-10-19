// @ts-check
'use strict';
// Reads the hosted library files (see LIBRARIES in @webdizayn/shared) from npm packages
// pinned in this package. Only listed files are ever read, so no path from a request
// reaches the file system.
const { readFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
const { isLibraryFile } = require('@webdizayn/shared');

/** Library id → [npm package (alias) in this package, root folder inside it]. */
const ROOTS = {
  'bootstrap@3.4.1': ['bootstrap3', 'dist'],
  'bootstrap@4.6.2': ['bootstrap4', 'dist'],
  'bootstrap@5.3.8': ['bootstrap5', 'dist'],
  'jquery@3.7.1': ['jquery', 'dist'],
  'popper.js@1.16.1': ['popper.js', 'dist/umd'],
  'bootstrap-icons@1.13.1': ['bootstrap-icons', 'font'],
};

const TYPES = {
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  woff2: 'font/woff2',
  woff: 'font/woff',
  ttf: 'font/ttf',
  eot: 'application/vnd.ms-fontobject',
  svg: 'image/svg+xml',
};

/** @type {Map<string, { body: Buffer, contentType: string }>} */
const cache = new Map();

/**
 * @param {string} id
 * @param {string} file
 * @returns {{ body: Buffer, contentType: string } | null}
 */
function readLibraryFile(id, file) {
  if (!isLibraryFile(id, file) || !Object.hasOwn(ROOTS, id)) return null;
  const key = `${id}/${file}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const [pkg, root] = ROOTS[/** @type {keyof typeof ROOTS} */ (id)];
  const dir = dirname(require.resolve(`${pkg}/package.json`));
  const ext = file.slice(file.lastIndexOf('.') + 1);
  const entry = {
    body: readFileSync(join(dir, root, file)),
    contentType: TYPES[/** @type {keyof typeof TYPES} */ (ext)] ?? 'application/octet-stream',
  };
  cache.set(key, entry);
  return entry;
}

/**
 * Serves `<id>/<file>` (the part after the library prefix of a request path).
 * @param {string} path
 */
function readLibraryPath(path) {
  const at = path.indexOf('/', path.indexOf('@'));
  if (at < 0) return null;
  return readLibraryFile(path.slice(0, at), path.slice(at + 1));
}

module.exports = { readLibraryFile, readLibraryPath };
