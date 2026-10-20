import type { ProjectFile } from '@webdizayn/shared';
import type { CourseMeta, ModuleDef } from '../helpers';
import { m01, s01 } from './modules/01-asoslar';
import { m02, s02 } from './modules/02-media';
import { m03, s03 } from './modules/03-maketlar';
import { m04, s04 } from './modules/04-kontent';
import { m05, s05 } from './modules/05-komponentlar';
import { m06, s06 } from './modules/06-loyiha';

/**
 * Original Uzbek responsive web design course. Only the topic order follows the usual RWD
 * curriculum (viewport, grid view, media queries, images, videos, frameworks and the common
 * responsive "how to" components); every lesson, exercise and question is written for
 * WEBDIZAYN.UZ. Lesson bodies live in `apps/api/content/rwd-course/<slug>.md`.
 */
export const RWD_COURSE: CourseMeta = {
  slug: 'moslashuvchan-dizayn',
  contentDir: 'rwd-course',
  position: 33,
  directions: ['moslashuvchan-dizayn', 'flexbox-va-grid'],
  title: 'Moslashuvchan dizayn',
  description:
    'Telefon, planshet va kompyuterda birdek qulay sahifalar: viewport, avval mobil yondashuvi, ' +
    'suyuq o‘lchamlar, media va konteyner so‘rovlari, Flexbox va Grid maketlari, moslashuvchan ' +
    'rasm, video, jadval, forma va navigatsiya. Har darsda haqiqiy brauzerda tekshiriladigan mashq.',
};

export const RWD_MODULES: ModuleDef[] = [m01, m02, m03, m04, m05, m06];

export const RWD_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
  ...s02,
  ...s03,
  ...s04,
  ...s05,
  ...s06,
};
