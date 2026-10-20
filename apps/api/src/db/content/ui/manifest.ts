import type { ProjectFile } from '@webdizayn/shared';
import type { CourseMeta, ModuleDef } from '../helpers';
import { m01, s01 } from './modules/01-rang';
import { m02, s02 } from './modules/02-tipografiya';
import { m03, s03 } from './modules/03-kompozitsiya';
import { m04, s04 } from './modules/04-ikonkalar';
import { m05, s05 } from './modules/05-komponentlar';
import { m06, s06 } from './modules/06-tizim';

/**
 * Original Uzbek UI fundamentals course. The topic order loosely follows the usual colour,
 * icon, font and "how to" component tutorials; every lesson, exercise and question is written
 * for WEBDIZAYN.UZ. Lesson bodies live in `apps/api/content/ui-course/<slug>.md`.
 */
export const UI_COURSE: CourseMeta = {
  slug: 'ui-asoslari',
  contentDir: 'ui-course',
  position: 35,
  directions: ['ui-asoslari'],
  title: 'UI asoslari',
  description:
    'Chiroyli va tushunarli interfeys qoidalari: rang modellari va palitra, kontrast, ' +
    'tipografiya shkalasi, oraliqlar tizimi, ikonkalar, tugma va forma holatlari, kartalar, ' +
    'bildirishnomalar, qorong‘i mavzu va mini dizayn tizimi. Har darsda CSS bilan amaliy mashq.',
};

export const UI_MODULES: ModuleDef[] = [m01, m02, m03, m04, m05, m06];

export const UI_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
  ...s02,
  ...s03,
  ...s04,
  ...s05,
  ...s06,
};
