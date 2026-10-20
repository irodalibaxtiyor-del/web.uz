import type { ProjectFile } from '@webdizayn/shared';
import type { CourseMeta, ModuleDef } from '../helpers';
import { m01, s01 } from './modules/01-reja';

/**
 * Original Uzbek portfolio course. The topics follow the usual "how to" portfolio components
 * (gallery, filters, lightbox, contact form, skill bars, timeline, dark mode, scroll to top);
 * every lesson, exercise and question is written for WEBDIZAYN.UZ. Lesson bodies live in
 * `apps/api/content/portfolio-course/<slug>.md`.
 */
export const PORTFOLIO_COURSE: CourseMeta = {
  slug: 'portfolio',
  contentDir: 'portfolio-course',
  position: 45,
  directions: ['portfolio'],
  title: 'Portfolio sayti',
  description:
    'O‘z ishlaringizni ko‘rsatadigan shaxsiy saytni bosqichma-bosqich yasash: tuzilma va ' +
    'uslub, bosh ekran, yopishqoq va mobil menyu, ko‘nikmalar va vaqt chizig‘i, loyihalar ' +
    'galereyasi, filtr va lightbox, aloqa formasi, qorong‘i rejim, SEO va nashr qilish.',
};

export const PORTFOLIO_MODULES: ModuleDef[] = [m01];

export const PORTFOLIO_SOLUTIONS: Record<string, ProjectFile[]> = {
  ...s01,
};
