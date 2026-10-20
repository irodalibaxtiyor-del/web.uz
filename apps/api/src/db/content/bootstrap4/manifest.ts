import type { ProjectFile } from '@webdizayn/shared';
import type { CourseMeta, ModuleDef } from '../helpers';
import { m01, s01 } from './modules/01-intro';
import { m02, s02 } from './modules/02-content';
import { m03, s03 } from './modules/03-buttons';
import { m04, s04 } from './modules/04-navigation';
import { m05, s05 } from './modules/05-forms';
import { m06, s06 } from './modules/06-plugins';
import { m07, s07 } from './modules/07-utilities';
import { m08, s08 } from './modules/08-grid';

/**
 * Original Uzbek Bootstrap 4 course. Only the topic order follows the usual Bootstrap 4
 * curriculum; every lesson, exercise and question is written for WEBDIZAYN.UZ. Lesson bodies
 * live in `apps/api/content/bootstrap4-course/<slug>.md`; each module (with its reference
 * solutions, used only by `content:verify`) is in `./modules`.
 */

export const BS4_COURSE: CourseMeta = {
  slug: 'bootstrap4',
  contentDir: 'bootstrap4-course',
  position: 70,
  directions: ['bootstrap'],
  title: 'Bootstrap 4',
  description:
    'Bootstrap 4.6 bilan Flexbox asosidagi setka, kartalar, utilitalar, navbar, formalar, ' +
    'modal, toast va boshqa komponentlar. Bootstrap 3 dan keyingi bosqich va ko‘plab ' +
    'ishlab turgan loyihalar standarti. Har darsda serverda tekshiriladigan amaliy mashq.',
};

export const BS4_MODULES: ModuleDef[] = [m01, m02, m03, m04, m05, m06, m07, m08];

export const BS4_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
  ...s02,
  ...s03,
  ...s04,
  ...s05,
  ...s06,
  ...s07,
  ...s08,
};
