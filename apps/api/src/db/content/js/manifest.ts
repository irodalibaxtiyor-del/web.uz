import type { CourseMeta, ModuleDef } from '../helpers';
import { m01 } from './modules/01-intro';
import { m02 } from './modules/02-variables';
import { m03 } from './modules/03-functions';
import { m04 } from './modules/04-strings';
import { m05 } from './modules/05-numbers';
import { m06 } from './modules/06-arrays';
import { m07 } from './modules/07-dates';
import { m08 } from './modules/08-conditions';
import { m09 } from './modules/09-loops';
import { m10 } from './modules/10-types';
import { m11 } from './modules/11-quality';
import { m12 } from './modules/12-classes';
import { m13 } from './modules/13-advanced-objects';
import { m14 } from './modules/14-async';
import { m15 } from './modules/15-dom';
import { m16 } from './modules/16-dom-events';
import { m17 } from './modules/17-browser';
import { m18 } from './modules/18-projects';

/**
 * Original Uzbek JavaScript course. Only the topic order follows the usual JavaScript
 * curriculum; every lesson, exercise and question is written for WEBDIZAYN.UZ. Lesson bodies
 * live in `apps/api/content/js-course/<slug>.md`; each module is in `./modules`.
 */

export const JS_COURSE: CourseMeta = {
  slug: 'js',
  contentDir: 'js-course',
  position: 40,
  title: 'JavaScript: to‘liq kurs',
  description:
    'Sahifalarga jon bering: o‘zgaruvchilar, funksiyalar, massivlar, obyektlar, DOM, hodisalar, ' +
    'asinxron kod va brauzer API’lari. Har darsda serverda tekshiriladigan amaliy mashq, ' +
    'kurs oxirida to‘rtta mini-loyiha.',
};

export const JS_MODULES: ModuleDef[] = [
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
  m16,
  m17,
  m18,
];
