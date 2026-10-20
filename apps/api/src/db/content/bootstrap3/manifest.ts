import type { ProjectFile } from '@webdizayn/shared';
import type { CourseMeta, ModuleDef } from '../helpers';
import { m01, s01 } from './modules/01-intro';
import { m02, s02 } from './modules/02-content';
import { m03, s03 } from './modules/03-buttons';
import { m04, s04 } from './modules/04-navigation';
import { m05, s05 } from './modules/05-forms';
import { m06, s06 } from './modules/06-plugins';
import { m07, s07 } from './modules/07-grid';
import { m08, s08 } from './modules/08-themes';

/**
 * Original Uzbek Bootstrap 3 course. Only the topic order follows the usual Bootstrap 3
 * curriculum; every lesson, exercise and question is written for WEBDIZAYN.UZ. Lesson bodies
 * live in `apps/api/content/bootstrap3-course/<slug>.md`; each module (with its reference
 * solutions, used only by `content:verify`) is in `./modules`.
 */

export const BS3_COURSE: CourseMeta = {
  slug: 'bootstrap3',
  contentDir: 'bootstrap3-course',
  position: 60,
  directions: ['bootstrap'],
  title: 'Bootstrap 3',
  description:
    'Bootstrap 3.4.1 bilan tez va moslashuvchan sahifalar: setka, tipografiya, tugmalar, ' +
    'panellar, navbar, formalar, modal, karusel va boshqa jQuery plaginlari. Eski loyihalarni ' +
    'qo‘llab-quvvatlash uchun. Har darsda serverda tekshiriladigan amaliy mashq.',
};

export const BS3_MODULES: ModuleDef[] = [m01, m02, m03, m04, m05, m06, m07, m08];

export const BS3_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
  ...s02,
  ...s03,
  ...s04,
  ...s05,
  ...s06,
  ...s07,
  ...s08,
};
