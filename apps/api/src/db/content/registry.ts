import { BS3_COURSE, BS3_MODULES, BS3_SOLUTIONS } from './bootstrap3/manifest';
import { BS4_COURSE, BS4_MODULES, BS4_SOLUTIONS } from './bootstrap4/manifest';
import { BS5_COURSE, BS5_MODULES, BS5_SOLUTIONS } from './bootstrap5/manifest';
import { CSS_COURSE, CSS_MODULES } from './css/manifest';
import { CSS_SOLUTIONS } from './css/solutions';
import type { CourseDef } from './helpers';
import { HTML_COURSE, HTML_MODULES } from './html/manifest';
import { HTML_SOLUTIONS } from './html/solutions';
import { JS_COURSE, JS_MODULES } from './js/manifest';
import { JS_SOLUTIONS } from './js/solutions';
import { PHP_COURSE, PHP_MODULES } from './php/manifest';

/** Bundled original courses, in the order they are meant to be taken. */
export const CONTENT_COURSES: CourseDef[] = [
  { ...HTML_COURSE, modules: HTML_MODULES, solutions: HTML_SOLUTIONS },
  { ...CSS_COURSE, modules: CSS_MODULES, solutions: CSS_SOLUTIONS },
  { ...JS_COURSE, modules: JS_MODULES, solutions: JS_SOLUTIONS },
  { ...PHP_COURSE, modules: PHP_MODULES, solutions: {} },
  { ...BS3_COURSE, modules: BS3_MODULES, solutions: BS3_SOLUTIONS },
  { ...BS4_COURSE, modules: BS4_MODULES, solutions: BS4_SOLUTIONS },
  { ...BS5_COURSE, modules: BS5_MODULES, solutions: BS5_SOLUTIONS },
];

export function findContentCourse(slug: string): CourseDef | undefined {
  return CONTENT_COURSES.find((c) => c.slug === slug);
}
