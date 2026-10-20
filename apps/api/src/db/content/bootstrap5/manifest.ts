import type { ProjectFile } from '@webdizayn/shared';
import type { CourseMeta, ModuleDef } from '../helpers';
import { m01, s01 } from './modules/01-intro';
import { m02, s02 } from './modules/02-content';
import { m03, s03 } from './modules/03-buttons';
import { m04, s04 } from './modules/04-navigation';
import { m05, s05 } from './modules/05-plugins';
import { m06, s06 } from './modules/06-utilities';
import { m07, s07 } from './modules/07-forms';
import { m08, s08 } from './modules/08-grid';

/**
 * Original Uzbek Bootstrap 5 course. Only the topic order follows the usual Bootstrap 5
 * curriculum; every lesson, exercise and question is written for WEBDIZAYN.UZ. Lesson bodies
 * live in `apps/api/content/bootstrap5-course/<slug>.md`; each module (with its reference
 * solutions, used only by `content:verify`) is in `./modules`.
 */

export const BS5_COURSE: CourseMeta = {
  slug: 'bootstrap5',
  contentDir: 'bootstrap5-course',
  position: 80,
  directions: ['bootstrap'],
  title: 'Bootstrap 5',
  description:
    'Bootstrap 5.3 — eng yangi versiya: jQuery’siz komponentlar, oltita ekran sinfi, gutter, ' +
    'offcanvas, qorong‘i rejim, floating labels va boy utilitalar. Yangi loyihalar uchun ' +
    'tavsiya etiladi. Har darsda serverda tekshiriladigan amaliy mashq.',
};

export const BS5_MODULES: ModuleDef[] = [m01, m02, m03, m04, m05, m06, m07, m08];

export const BS5_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
  ...s02,
  ...s03,
  ...s04,
  ...s05,
  ...s06,
  ...s07,
  ...s08,
};
