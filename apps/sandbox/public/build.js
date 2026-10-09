// @ts-check
// Turns a student's virtual project into one HTML document for the preview iframe.
// Runs inside the sandbox origin only; the web app never renders student HTML itself.

import { MAX_CONSOLE_PER_RUN, MAX_CONSOLE_TEXT } from './protocol.js';

/**
 * Bridge injected before any student code. It reports console output, errors and the
 * load event to the runner, and neutralises dialogs and link navigation.
 * @param {string} runId validated against RUN_ID_RE by the caller
 */
export function bridgeScript(runId) {
  return `(function () {
  var RUN = ${JSON.stringify(runId)}, sent = 0, MAX = ${MAX_CONSOLE_PER_RUN}, LIM = ${MAX_CONSOLE_TEXT};
  function ser(v) {
    try {
      if (typeof v === 'string') return v;
      if (v === undefined) return 'undefined';
      if (v instanceof Error) return v.name + ': ' + v.message;
      if (typeof v === 'function') return 'ƒ ' + (v.name || 'anonymous') + '()';
      if (typeof Node !== 'undefined' && v instanceof Node) return '<' + String(v.nodeName).toLowerCase() + '>';
      var s = JSON.stringify(v);
      return s === undefined ? String(v) : s;
    } catch (e) { return String(v); }
  }
  function post(level, args) {
    if (sent >= MAX) return;
    sent++;
    var text = Array.prototype.map.call(args, ser).join(' ');
    if (text.length > LIM) text = text.slice(0, LIM) + '…';
    parent.postMessage({ type: 'wd:console', runId: RUN, level: level, text: text }, '*');
  }
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (l) {
    var orig = console[l];
    console[l] = function () {
      post(l === 'debug' ? 'log' : l, arguments);
      try { orig.apply(console, arguments); } catch (e) {}
    };
  });
  window.addEventListener('error', function (e) {
    post('error', [(e.message || 'Error') + (e.lineno ? ' (qator ' + e.lineno + ')' : '')]);
  });
  window.addEventListener('unhandledrejection', function (e) {
    post('error', ['Uncaught (in promise) ' + ser(e.reason)]);
  });
  window.alert = function (m) { post('info', ['alert: ' + ser(m)]); };
  window.confirm = function (m) { post('info', ['confirm: ' + ser(m)]); return false; };
  window.prompt = function (m) { post('info', ['prompt: ' + ser(m)]); return null; };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') return;
    e.preventDefault();
    post('warn', ['Havola preview ichida ochilmaydi: ' + href]);
  }, true);
  window.addEventListener('load', function () {
    parent.postMessage({ type: 'wd:loaded', runId: RUN }, '*');
  });
})();`;
}

/** Resolves a reference from index.html to a project path (`./a.css`, `/a.css` → `a.css`). */
function resolveRef(/** @type {string} */ ref) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.startsWith('//')) return null; // absolute URL
  return ref.replace(/^\.\//, '').replace(/^\/+/, '').split(/[?#]/)[0] ?? '';
}

function getAttr(/** @type {string} */ tag, /** @type {string} */ name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? (m[1] ?? m[2] ?? m[3] ?? '') : null;
}

const escapeScript = (/** @type {string} */ s) => s.replace(/<\/(script)/gi, '<\\/$1');
const escapeStyle = (/** @type {string} */ s) => s.replace(/<\/(style)/gi, '<\\/$1');

/**
 * @param {{ path: string, content: string }[]} files
 * @param {string} runId
 * @returns {string}
 */
export function buildDocument(files, runId) {
  const byPath = new Map(files.map((f) => [f.path.toLowerCase(), f.content]));
  const entry =
    byPath.get('index.html') ?? files.find((f) => f.path.toLowerCase().endsWith('.html'))?.content;
  const bridge = `<script>${bridgeScript(runId)}</script>`;
  if (entry === undefined) {
    return `<!doctype html><html><head><meta charset="utf-8">${bridge}</head><body><p style="font-family:sans-serif;color:#64748b">index.html fayli topilmadi.</p></body></html>`;
  }

  let html = entry.replace(/<link\b[^>]*>/gi, (tag) => {
    const rel = (getAttr(tag, 'rel') ?? '').toLowerCase();
    const href = getAttr(tag, 'href');
    if (!rel.split(/\s+/).includes('stylesheet') || !href) return tag;
    const path = resolveRef(href);
    const css = path ? byPath.get(path.toLowerCase()) : undefined;
    return css === undefined ? tag : `<style>${escapeStyle(css)}</style>`;
  });

  html = html.replace(/<script\b([^>]*)>\s*<\/script>/gi, (tag, attrs) => {
    const src = getAttr(tag, 'src');
    if (!src) return tag;
    const path = resolveRef(src);
    const js = path ? byPath.get(path.toLowerCase()) : undefined;
    if (js === undefined) return tag;
    const rest = String(attrs)
      .replace(/\bsrc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    return `<script${rest ? ` ${rest}` : ''}>${escapeScript(js)}</script>`;
  });

  // The bridge must run before any student script.
  if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (h) => `${h}${bridge}`);
  if (/<html\b[^>]*>/i.test(html))
    return html.replace(/<html\b[^>]*>/i, (h) => `${h}<head>${bridge}</head>`);
  return `${bridge}${html}`;
}
