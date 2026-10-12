import type { ProjectFile } from '@webdizayn/shared';
import {
  BASE_CSS,
  BODY15,
  VIEWPORT_BODY,
  VIEWPORT_CSS,
  viewportPage,
} from '../modules/15-responsive';
import { files, site } from '../shared';

const CARD_CSS = `.karta {
  padding: 16px;
  background-color: #f5faff;
}`;

export const s15: Record<string, ProjectFile[]> = {
  'rwd-intro': site(
    BODY15.intro,
    `${BASE_CSS}

${CARD_CSS}

.konteyner {
  width: min(100% - 32px, 1100px);
  margin-inline: auto;
}

h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
}

.kartalar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}`,
  ),

  'rwd-viewport': files({
    ...viewportPage('width=device-width, initial-scale=1', VIEWPORT_BODY),
    'style.css': `${VIEWPORT_CSS.replace('width: 800px', 'max-width: 800px')}

img {
  max-width: 100%;
  height: auto;
}

.jadval-quti {
  overflow-x: auto;
}
`,
  }),

  'rwd-grid-view': site(
    BODY15.gridView,
    `${BASE_CSS}

.tor {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.tor > * {
  grid-column: span 12;
  padding: 16px;
  background-color: #f5faff;
}

@media (min-width: 768px) {
  .tor > .md-8 {
    grid-column: span 8;
  }

  .tor > .md-4 {
    grid-column: span 4;
  }
}`,
  ),

  'media-queries': site(
    BODY15.mq,
    `${BASE_CSS}

.maket {
  display: grid;
  gap: 16px;
}

.faqat-katta {
  display: none;
}

@media (min-width: 768px) {
  .maket {
    grid-template-columns: 2fr 1fr;
  }
}

@media (min-width: 1024px) {
  .faqat-katta {
    display: block;
  }
}`,
  ),

  'mq-examples': site(
    BODY15.mqExamples,
    `${BASE_CSS}

${CARD_CSS}

.kartalar {
  display: grid;
  gap: 16px;
}

@media (min-width: 600px) {
  .kartalar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .kartalar {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  html {
    font-size: 112.5%;
  }
}`,
  ),

  'rwd-images': site(
    BODY15.images.replace('alt="Galereyadagi rasm"', 'alt="Galereyadagi rasm" loading="lazy"'),
    `${BASE_CSS}

img {
  max-width: 100%;
  height: auto;
}

.karta img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}`,
  ),

  'rwd-videos': site(
    BODY15.videos.replace('<iframe', '<iframe title="CSS Grid bo‘yicha videodars"'),
    `${BASE_CSS}

.video {
  max-width: 960px;
  margin-inline: auto;
}

.video iframe {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border: 0;
}`,
  ),

  'rwd-frameworks': site(
    BODY15.frameworks,
    `.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.gap-4 {
  gap: 1rem;
}

.p-4 {
  padding: 1rem;
}

@media (min-width: 768px) {
  .md\\:flex-row {
    flex-direction: row;
  }
}`,
  ),
};
