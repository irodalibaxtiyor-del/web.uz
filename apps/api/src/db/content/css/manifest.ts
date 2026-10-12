import type { CourseMeta, ModuleDef } from '../helpers';
import { m01 } from './modules/01-intro';
import { m02 } from './modules/02-colors';
import { m03 } from './modules/03-box';
import { m04 } from './modules/04-text';
import { m05 } from './modules/05-lists-tables';
import { m06 } from './modules/06-layout';
import { m07 } from './modules/07-selectors';
import { m08 } from './modules/08-components';
import { m09 } from './modules/09-units';
import { m10 } from './modules/10-effects';
import { m11 } from './modules/11-motion';
import { m12 } from './modules/12-ui';
import { m13 } from './modules/13-flexbox';
import { m14 } from './modules/14-grid';
import { m15 } from './modules/15-responsive';

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

export const CSS_MODULES: ModuleDef[] = [
  m01,
  m02,
  m03,
  m04,
  m05,
  m06,
  m07,
  m08,
  m09,
  m10,
  m11,
  m12,
  m13,
  m14,
  m15,
];
