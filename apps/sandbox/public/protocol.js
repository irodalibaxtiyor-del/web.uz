// @ts-check
// Message protocol shared by the web app (parent), the runner and the preview bridge.
// Every message crossing a frame boundary is validated here; anything else is dropped.

export const MAX_FILES = 20;
export const MAX_FILE_CHARS = 100_000;
export const MAX_TOTAL_CHARS = 500_000;
export const MAX_CONSOLE_PER_RUN = 200;
export const MAX_CONSOLE_TEXT = 2000;
export const CONSOLE_LEVELS = ['log', 'info', 'warn', 'error'];

const RUN_ID_RE = /^[A-Za-z0-9-]{1,64}$/;
// Mirrors PROJECT_PATH_RE in @webdizayn/shared.
const PATH_RE = /^(?:[A-Za-z0-9_-]+\/){0,4}[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*\.(?:html|css|js)$/;

/**
 * @param {unknown} v
 * @returns {v is Record<string, unknown>}
 */
const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Validates a RUN request from the parent page.
 * @param {unknown} data
 * @returns {{ runId: string, files: { path: string, content: string }[] } | null}
 */
export function parseRunMessage(data) {
  if (!isObj(data) || data.type !== 'wd:run') return null;
  const { runId, files } = /** @type {Record<string, unknown>} */ (data);
  if (typeof runId !== 'string' || !RUN_ID_RE.test(runId)) return null;
  if (!Array.isArray(files) || files.length === 0 || files.length > MAX_FILES) return null;
  let total = 0;
  const seen = new Set();
  const out = [];
  for (const f of files) {
    if (!isObj(f)) return null;
    const { path, content } = /** @type {Record<string, unknown>} */ (f);
    if (typeof path !== 'string' || !PATH_RE.test(path)) return null;
    if (typeof content !== 'string' || content.length > MAX_FILE_CHARS) return null;
    const key = path.toLowerCase();
    if (seen.has(key)) return null;
    seen.add(key);
    total += content.length;
    out.push({ path, content });
  }
  if (total > MAX_TOTAL_CHARS) return null;
  return { runId, files: out };
}

/**
 * Validates a message coming out of the preview (console line or load signal).
 * The preview runs student code, so this is untrusted input.
 * @param {unknown} data
 * @returns {{ type: 'wd:loaded', runId: string } | { type: 'wd:console', runId: string, level: string, text: string } | null}
 */
export function parsePreviewMessage(data) {
  if (!isObj(data) || typeof data.runId !== 'string' || !RUN_ID_RE.test(data.runId)) return null;
  if (data.type === 'wd:loaded') return { type: 'wd:loaded', runId: data.runId };
  if (data.type === 'wd:console') {
    const level = CONSOLE_LEVELS.includes(/** @type {string} */ (data.level)) ? data.level : 'log';
    const text = typeof data.text === 'string' ? clampText(data.text) : '';
    return { type: 'wd:console', runId: data.runId, level: /** @type {string} */ (level), text };
  }
  return null;
}

/** @param {string} text */
export function clampText(text) {
  return text.length > MAX_CONSOLE_TEXT ? `${text.slice(0, MAX_CONSOLE_TEXT)}…` : text;
}
