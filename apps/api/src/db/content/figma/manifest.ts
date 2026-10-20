import type { ProjectFile } from '@webdizayn/shared';
import type { CourseMeta, ModuleDef } from '../helpers';
import { m01, s01 } from './modules/01-oqish';
import { m02, s02 } from './modules/02-auto-layout';
import { m03, s03 } from './modules/03-moslashuv';
import { m04, s04 } from './modules/04-effektlar';
import { m05, s05 } from './modules/05-komponentlar';
import { m06, s06 } from './modules/06-loyiha';

/**
 * Original Uzbek "design to code" course (there is no W3Schools tutorial for Figma): reading a
 * design file and turning frames, Auto Layout, constraints, layout grids, text styles,
 * effects and components into HTML and CSS. Exercises give a design spec (as the Inspect panel
 * shows it) and the CHECK rules verify the exact values. Lesson bodies live in
 * `apps/api/content/figma-course/<slug>.md`.
 */
export const FIGMA_COURSE: CourseMeta = {
  slug: 'figmadan-kodga',
  contentDir: 'figma-course',
  position: 37,
  directions: ['figmadan-kodga'],
  title: 'Figma’dan kodga',
  description:
    'Dizayner maketini aniq o‘lchamlari bilan sahifaga aylantirish: freym va qatlamlar, Inspect ' +
    'paneli, rang o‘zgaruvchilari, Auto Layout → Flexbox, Constraints va Layout Grid → CSS Grid, ' +
    'matn stillari, soyalar, komponentlar va variantlar. Har mashqda maket spetsifikatsiyasi va ' +
    'aniq o‘lchamlar bo‘yicha tekshiruv.',
};

export const FIGMA_MODULES: ModuleDef[] = [m01, m02, m03, m04, m05, m06];

export const FIGMA_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
  ...s02,
  ...s03,
  ...s04,
  ...s05,
  ...s06,
};
