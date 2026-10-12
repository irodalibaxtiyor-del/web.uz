import type { ProjectFile } from '@webdizayn/shared';
import {
  BODY12,
  BOX_SIZING_CSS,
  BUTTONS_CSS,
  MASK_CSS,
  TOOLTIP_CSS,
  UI_CSS,
} from '../modules/12-ui';
import { site } from '../shared';

export const s12: Record<string, ProjectFile[]> = {
  tooltips: site(
    BODY12.tooltips,
    `p {
  margin-top: 60px;
}

${TOOLTIP_CSS}

.maslahat {
  position: relative;
}

.maslahat-matn {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}

.maslahat:hover .maslahat-matn,
.maslahat:focus-visible .maslahat-matn {
  opacity: 1;
}`,
  ),

  'image-styling': site(
    BODY12.imageStyling,
    `img {
  display: block;
  max-width: 100%;
  height: auto;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.hamkorlar img {
  filter: grayscale(1);
  transition: filter 0.3s;
}

.hamkorlar img:hover {
  filter: none;
}`,
  ),

  'object-fit': site(
    BODY12.objectFit,
    `.karta {
  max-width: 400px;
}

.karta img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.logo {
  width: 160px;
  height: 80px;
  object-fit: contain;
}

.portret {
  width: 200px;
  height: 200px;
  object-fit: cover;
  object-position: top;
}`,
  ),

  masking: site(
    BODY12.masking,
    `${MASK_CSS}

.doira {
  clip-path: circle(50%);
}

.qahramon {
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}

.sonuvchi {
  mask-image: linear-gradient(to bottom, black 40%, transparent);
}`,
  ),

  buttons: site(
    BODY12.buttons,
    `${BUTTONS_CSS}

.tugma {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 20px;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: #0071dc;
  color: white;
  font: inherit;
  cursor: pointer;
}

.tugma:hover {
  background-color: #005bb0;
}

.tugma:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tugma-ikkinchi {
  background-color: transparent;
  border-color: #0071dc;
  color: #0071dc;
}`,
  ),

  pagination: site(
    BODY12.pagination,
    `.sahifalash ul {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.sahifalash a {
  display: grid;
  place-items: center;
  min-width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #0e1133;
  text-decoration: none;
}

.sahifalash a[aria-current="page"] {
  background-color: #0071dc;
  color: white;
}`,
  ),

  'multi-columns': site(
    BODY12.columns,
    `.maqola {
  column-width: 220px;
  column-gap: 32px;
  column-rule: 1px solid #e5e7eb;
}

.maqola h2 {
  column-span: all;
}

.maqola figure {
  break-inside: avoid;
}`,
  ),

  'user-interface': site(
    BODY12.ui,
    `${UI_CSS}

html {
  scroll-behavior: smooth;
}

h2 {
  scroll-margin-top: 80px;
}

textarea {
  resize: vertical;
}

.yopiq {
  cursor: not-allowed;
}

.tugma {
  user-select: none;
}

.qoplama {
  pointer-events: none;
}`,
  ),

  'box-sizing': site(
    BODY12.boxSizing,
    `*,
*::before,
*::after {
  box-sizing: border-box;
}

${BOX_SIZING_CSS}`,
  ),
};
