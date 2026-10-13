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
];

export function findContentCourse(slug: string): CourseDef | undefined {
  return CONTENT_COURSES.find((c) => c.slug === slug);
}
