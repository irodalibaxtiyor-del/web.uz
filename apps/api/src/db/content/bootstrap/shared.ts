import type { CheckAction, ProjectFile } from '@webdizayn/shared';
import { page } from '../helpers';

export { after, at, attr, clean, has, q, quiz, style, text, type ModuleDef } from '../helpers';

export const md = (...lines: string[]) => lines.join('\n');

/**
 * Public CDN URLs as students will write them. The platform hosts exactly these files
 * (`LIBRARIES` in @webdizayn/shared), so they work in RUN and CHECK without network access.
 */
export const BS3_CDN = {
  css: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css',
  jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js',
  js: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js',
};

export const BS4_CDN = {
  css: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css',
  jquery: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js',
  js: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',
};

export const BS5_CDN = {
  css: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css',
  js: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js',
};

export const ICONS_CDN =
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css';

interface BsOpts {
  title?: string;
  /** Own `style.css`, linked after Bootstrap. */
  css?: string;
  /** Own `script.js`, loaded after Bootstrap's scripts. */
  js?: string;
  /** Extra `<head>` markup (e.g. the icons stylesheet). */
  head?: string;
  /** Leave out Bootstrap's JavaScript (CSS-only lessons still get it by default). */
  noScripts?: boolean;
  /** Leave out Bootstrap completely (the "get started" exercises add it themselves). */
  bare?: boolean;
}

function bsPage(cssLinks: string[], scripts: string[], body: string, opts: BsOpts): ProjectFile[] {
  const head = [
    ...(opts.bare ? [] : cssLinks.map((href) => `<link rel="stylesheet" href="${href}">`)),
    opts.head ?? '',
    opts.css === undefined ? '' : '<link rel="stylesheet" href="style.css">',
  ]
    .filter(Boolean)
    .join('\n');
  const tail = [
    ...(opts.bare || opts.noScripts ? [] : scripts.map((src) => `<script src="${src}"></script>`)),
    opts.js === undefined ? '' : '<script src="script.js"></script>',
  ]
    .filter(Boolean)
    .join('\n');
  const result: ProjectFile[] = [
    {
      path: 'index.html',
      content: page(tail ? `${body.trim()}\n\n${tail}` : body, {
        title: opts.title ?? 'Bootstrap mashqi',
        head: head || undefined,
      }),
    },
  ];
  if (opts.css !== undefined) result.push({ path: 'style.css', content: `${opts.css.trim()}\n` });
  if (opts.js !== undefined) result.push({ path: 'script.js', content: `${opts.js.trim()}\n` });
  return result;
}

/** Bootstrap 3 page: CSS in `<head>`, jQuery + bootstrap.min.js at the end of `<body>`. */
export const bs3 = (body: string, opts: BsOpts = {}) =>
  bsPage([BS3_CDN.css], [BS3_CDN.jquery, BS3_CDN.js], body, opts);

/** Bootstrap 4 page: CSS in `<head>`, jQuery (slim) + bootstrap.bundle (with Popper) at the end. */
export const bs4 = (body: string, opts: BsOpts = {}) =>
  bsPage([BS4_CDN.css], [BS4_CDN.jquery, BS4_CDN.js], body, opts);

/** Bootstrap 5 page: CSS in `<head>`, bootstrap.bundle (with Popper) at the end. No jQuery. */
export const bs5 = (body: string, opts: BsOpts = {}) =>
  bsPage([BS5_CDN.css], [BS5_CDN.js], body, opts);

/** CHECK actions used to drive a student's page before an assertion. */
export const click = (selector: string): CheckAction => ({ type: 'click', selector });
export const hover = (selector: string): CheckAction => ({ type: 'hover', selector });
export const fill = (selector: string, value: string): CheckAction => ({
  type: 'fill',
  selector,
  value,
});
export const wait = (ms: number): CheckAction => ({ type: 'wait', ms });

/** Bootstrap's palette as computed RGB, for `style` checks. */
export const RGB = {
  bs3: {
    primary: 'rgb(51, 122, 183)',
    success: 'rgb(92, 184, 92)',
    info: 'rgb(91, 192, 222)',
    warning: 'rgb(240, 173, 78)',
    danger: 'rgb(217, 83, 79)',
  },
  bs4: {
    primary: 'rgb(0, 123, 255)',
    secondary: 'rgb(108, 117, 125)',
    success: 'rgb(40, 167, 69)',
    info: 'rgb(23, 162, 184)',
    warning: 'rgb(255, 193, 7)',
    danger: 'rgb(220, 53, 69)',
    dark: 'rgb(52, 58, 64)',
    light: 'rgb(248, 249, 250)',
  },
  bs5: {
    primary: 'rgb(13, 110, 253)',
    secondary: 'rgb(108, 117, 125)',
    success: 'rgb(25, 135, 84)',
    info: 'rgb(13, 202, 240)',
    warning: 'rgb(255, 193, 7)',
    danger: 'rgb(220, 53, 69)',
    dark: 'rgb(33, 37, 41)',
    light: 'rgb(248, 249, 250)',
  },
};

/** A placeholder picture as a `data:` SVG (external images are blocked in RUN and CHECK). */
export function pic(label: string, width = 300, height = 200, color = '#0071dc'): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<rect width="100%" height="100%" fill="${color}"/>` +
    `<text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="20" ` +
    `text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Fills `{{name}}` slots of an exercise template. The starter leaves every slot empty and
 * the reference solution fills them, so both are built from one piece of markup.
 */
export function slots(template: string, values: Record<string, string> = {}): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k: string) => values[k] ?? '');
}

/** ` class="…"` for a slot value. */
export const cls = (names: string) => ` class="${names}"`;
