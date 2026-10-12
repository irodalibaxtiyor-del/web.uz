import type { ProjectFile } from '@webdizayn/shared';
import { BODY08, LAYOUT_CSS, SPRITE_CSS } from '../modules/08-components';
import { site } from '../shared';

export const s08: Record<string, ProjectFile[]> = {
  opacity: site(
    BODY08.opacity,
    `.galereya img {
  opacity: 0.8;
}

.galereya img:hover {
  opacity: 1;
}

.banner {
  padding: 24px;
  background-color: rgba(0, 113, 220, 0.6);
  color: white;
}`,
  ),

  'navbar-vertical': site(
    BODY08.navVertical,
    `.yon-menyu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 220px;
}

.yon-menyu a {
  display: block;
  padding: 10px 16px;
  color: #0e1133;
  text-decoration: none;
}

.yon-menyu a:hover {
  background-color: #f5faff;
}

.yon-menyu a[aria-current="page"] {
  background-color: #0071dc;
  color: white;
}`,
  ),

  'navbar-horizontal': site(
    BODY08.navHorizontal,
    `.logo {
  color: white;
}

.sarlavha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background-color: #0e1133;
}

.menyu ul {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menyu a {
  display: block;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
}`,
  ),

  dropdowns: site(
    BODY08.dropdowns,
    `.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menyu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  min-width: 180px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background-color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.dropdown:hover .dropdown-menyu,
.dropdown:focus-within .dropdown-menyu {
  display: block;
}`,
  ),

  'image-gallery': site(
    BODY08.gallery,
    `.galereya {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

figure {
  margin: 0;
}

.galereya img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

figcaption {
  padding: 8px;
}`,
  ),

  'image-sprites': site(
    BODY08.sprites,
    `${SPRITE_CSS}

.ikonka {
  display: inline-block;
  width: 32px;
  height: 32px;
}

.ikonka-qidiruv {
  background-position: -32px 0;
}

.ikonka-savat {
  background-position: -64px 0;
}`,
  ),

  forms: site(
    BODY08.forms,
    `body {
  font: 16px/1.5 Arial, sans-serif;
}

input[type="text"],
textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  font: inherit;
}

input[type="checkbox"] {
  accent-color: #0071dc;
}

textarea {
  resize: vertical;
}`,
  ),

  counters: site(
    BODY08.counters,
    `.maqola {
  counter-reset: bolim;
}

.maqola h2 {
  counter-increment: bolim;
}

.maqola h2::before {
  content: counter(bolim) ". ";
}

.qadamlar {
  counter-reset: qadam;
  list-style: none;
  padding: 0;
}

.qadamlar li {
  counter-increment: qadam;
}

.qadamlar li::before {
  content: counter(qadam);
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: #0071dc;
  color: white;
}`,
  ),

  'website-layout': site(
    BODY08.layout,
    `${LAYOUT_CSS}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.sahifa {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
}

@media (max-width: 768px) {
  .sahifa {
    grid-template-columns: 1fr;
  }
}`,
  ),
};
