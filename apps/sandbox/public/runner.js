// @ts-check
// Runner page: lives on the isolated sandbox origin inside an opaque-origin iframe.
// Receives RUN requests from the parent, renders the project in a nested srcdoc iframe,
// and forwards validated, rate-limited preview messages back to the parent.

import { buildDocument } from './build.js';
import { MAX_CONSOLE_PER_RUN, parsePreviewMessage, parseRunMessage } from './protocol.js';

const meta = document.querySelector('meta[name="wd-parents"]');
/** @type {string[]} */
const PARENTS = meta ? JSON.parse(meta.getAttribute('content') || '[]') : [];

const host = /** @type {HTMLElement} */ (document.getElementById('host'));
/** @type {HTMLIFrameElement | null} */
let preview = null;
let currentRun = '';
let forwarded = 0;

/** postMessage to the parent; only the allowed origin that matches will receive it. */
function toParent(/** @type {unknown} */ msg) {
  for (const origin of PARENTS) window.parent.postMessage(msg, origin);
}

window.addEventListener('message', (event) => {
  // From the parent page: a new run.
  if (event.source === window.parent) {
    if (!PARENTS.includes(event.origin)) return;
    const run = parseRunMessage(event.data);
    if (!run) return;
    currentRun = run.runId;
    forwarded = 0;
    preview?.remove();
    preview = document.createElement('iframe');
    preview.setAttribute('sandbox', 'allow-scripts');
    preview.setAttribute('title', 'Natija');
    preview.srcdoc = buildDocument(run.files, run.runId);
    host.appendChild(preview);
    return;
  }

  // From the preview (student code): untrusted.
  if (!preview || event.source !== preview.contentWindow) return;
  const msg = parsePreviewMessage(event.data);
  if (!msg || msg.runId !== currentRun) return;
  if (msg.type === 'wd:console') {
    if (forwarded >= MAX_CONSOLE_PER_RUN) return;
    forwarded++;
  }
  toParent(msg);
});

toParent({ type: 'wd:ready' });
