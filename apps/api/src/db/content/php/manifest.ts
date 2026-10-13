import type { CourseMeta, ModuleDef } from '../helpers';
import { m01 } from './modules/01-intro';
import { m02 } from './modules/02-variables';
import { m03 } from './modules/03-strings';
import { m04 } from './modules/04-numbers';
import { m05 } from './modules/05-control';
import { m06 } from './modules/06-functions';

/**
 * Original Uzbek PHP course. Only the topic order follows the usual PHP curriculum; every
 * lesson and question is written for WEBDIZAYN.UZ. PHP runs on a server, which the platform's
 * RUN/CHECK sandboxes do not provide, so practice is quiz-based (`practice: 'quiz'`): every
 * lesson ends with a quiz, and each lesson has a hands-on task the student runs locally.
 */

export const PHP_COURSE: CourseMeta = {
  slug: 'php',
  contentDir: 'php-course',
  position: 50,
  practice: 'quiz',
  title: 'PHP: to‘liq kurs',
  description:
    'Server tomonidagi dasturlash: o‘zgaruvchilar, massivlar, funksiyalar, formalar, sessiyalar, ' +
    'fayllar, OOP va PDO bilan ma’lumotlar bazasi. Har darsda test va kompyuteringizda ' +
    'bajariladigan mustaqil mashq.',
};

export const PHP_MODULES: ModuleDef[] = [m01, m02, m03, m04, m05, m06];
