import type { ProjectFile } from '@webdizayn/shared';
import { BODY14, GRID_BASE_CSS, ITEMS_CSS, LAYOUT_CSS, SUPPORTS_CSS } from '../modules/14-grid';
import { site } from '../shared';

export const s14: Record<string, ProjectFile[]> = {
  'grid-intro': site(
    BODY14.intro,
    `${GRID_BASE_CSS}

.asosiy {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.uchlik {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}`,
  ),

  'grid-container': site(
    BODY14.container,
    `${GRID_BASE_CSS}

.karta {
  background-color: #f5faff;
}

.kartalar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-auto-rows: minmax(120px, auto);
  gap: 16px;
}

.markaz {
  display: grid;
  place-items: center;
  min-height: 200px;
}`,
  ),

  'grid-items': site(
    BODY14.items,
    `${ITEMS_CSS}

.tor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.sarlavha {
  grid-column: 1 / -1;
}

.katta {
  grid-row: span 2;
}

.karta {
  display: grid;
}

.rasm,
.yozuv {
  grid-area: 1 / 1;
}

.yozuv {
  align-self: end;
}`,
  ),

  'grid-layout': site(
    BODY14.layout,
    `${LAYOUT_CSS}

.sahifa {
  grid-template-columns: 1fr;
  grid-template-areas:
    "sarlavha"
    "asosiy"
    "yon"
    "pasti";
}

.sahifa > header {
  grid-area: sarlavha;
}

.sahifa > aside {
  grid-area: yon;
}

.sahifa > main {
  grid-area: asosiy;
}

.sahifa > footer {
  grid-area: pasti;
}

@media (min-width: 768px) {
  .sahifa {
    grid-template-columns: 240px 1fr;
    grid-template-areas:
      "sarlavha sarlavha"
      "yon      asosiy"
      "pasti    pasti";
  }
}`,
  ),

  supports: site(
    BODY14.supports,
    `${SUPPORTS_CSS}

@supports (backdrop-filter: blur(8px)) {
  .panel {
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
  }
}

@supports selector(:has(img)) {
  .karta:has(img) {
    padding-top: 0;
  }
}`,
  ),
};
