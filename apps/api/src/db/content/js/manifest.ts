import type { CourseMeta, ModuleDef } from '../helpers';
import { m01 } from './modules/01-intro';
import { m02 } from './modules/02-variables';
import { m03 } from './modules/03-functions';

/**
 * Original Uzbek JavaScript course. Only the topic order follows the usual JavaScript
 * curriculum; every lesson, exercise and question is written for WEBDIZAYN.UZ. Lesson bodies
 * live in `apps/api/content/js-course/<slug>.md`; each module is in `./modules`.
 */

export const JS_COURSE: CourseMeta = {
  slug: 'js',
  contentDir: 'js-course',
  title: 'JavaScript: to‘liq kurs',
  description:
    'Sahifalarga jon bering: o‘zgaruvchilar, funksiyalar, massivlar, obyektlar, DOM, hodisalar, ' +
    'asinxron kod va brauzer API’lari. Har darsda serverda tekshiriladigan amaliy mashq, ' +
    'kurs oxirida to‘rtta mini-loyiha.',
};

export const JS_MODULES: ModuleDef[] = [m01, m02, m03];
