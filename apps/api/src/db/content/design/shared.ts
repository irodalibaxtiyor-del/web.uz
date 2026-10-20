/**
 * Shared authoring helpers for the design-track courses (Moslashuvchan dizayn, UI asoslari,
 * Figma’dan kodga, Portfolio). Same shapes as the other bundled courses.
 */
export {
  after,
  app,
  at,
  attr,
  clean,
  files,
  has,
  html,
  page,
  q,
  quiz,
  site,
  style,
  text,
  type ModuleDef,
} from '../helpers';
export { cls, slots } from '../bootstrap/shared';

export const md = (...lines: string[]) => lines.join('\n');

/** Solid-colour placeholder picture as a data URL (external images are blocked in CHECK/RUN). */
export function svgData(color: string, w: number, h: number): string {
  // Spaces are encoded too: `srcset` ends a URL at the first space.
  return `data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='${w}'%20height='${h}'%3E%3Crect%20width='${w}'%20height='${h}'%20fill='%23${color}'/%3E%3C/svg%3E`;
}

/** `<img>` with a data-URL picture of the given intrinsic size. */
export function pic(color: string, alt: string, w = 160, h = 120, attrs = ''): string {
  return `<img src="${svgData(color, w, h)}" width="${w}" height="${h}" alt="${alt}"${attrs}>`;
}

/** A tiny inline SVG icon (outline square-ish glyph) that inherits `currentColor`. */
export const ICON_SVG =
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h16M12 4v16"/></svg>';

/** Common minimal reset most exercises start from. */
export const RESET = `*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}`;
