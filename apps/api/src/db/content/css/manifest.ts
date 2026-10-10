import type { CourseMeta, ModuleDef } from '../helpers';
import { m01 } from './modules/01-intro';
import { m02 } from './modules/02-colors';
import { m03 } from './modules/03-box';

/**
 * Original Uzbek CSS course. Only the topic order follows the usual CSS curriculum; every
 * lesson, exercise and question is written for WEBDIZAYN.UZ. Lesson bodies live in
 * `apps/api/content/css-course/<slug>.md`; each module is in `./modules`.
 */

export const CSS_COURSE: CourseMeta = {
  slug: 'css',
  contentDir: 'css-course',
  title: 'CSS: to‘liq kurs',
  description:
    'Sahifalarni chiroyli va qulay qiling: selektorlar, ranglar, quti modeli, shriftlar, ' +
    'joylashuv, Flexbox, Grid, animatsiyalar va moslashuvchan dizayn. Har darsda amaliy mashq.',
};

export const CSS_MODULES: ModuleDef[] = [m01, m02, m03];
