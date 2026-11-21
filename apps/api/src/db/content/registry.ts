import { BS3_LESSON_QUIZZES } from './bootstrap3/lesson-quizzes';
import { BS3_MINI_QUIZZES } from './bootstrap3/mini-quizzes';
import { BS3_COURSE, BS3_MODULES, BS3_SOLUTIONS } from './bootstrap3/manifest';
import { BS4_LESSON_QUIZZES } from './bootstrap4/lesson-quizzes';
import { BS4_MINI_QUIZZES } from './bootstrap4/mini-quizzes';
import { BS4_COURSE, BS4_MODULES, BS4_SOLUTIONS } from './bootstrap4/manifest';
import { BS5_LESSON_QUIZZES } from './bootstrap5/lesson-quizzes';
import { BS5_MINI_QUIZZES } from './bootstrap5/mini-quizzes';
import { BS5_COURSE, BS5_MODULES, BS5_SOLUTIONS } from './bootstrap5/manifest';
import { CSS_GLOSSARY } from './css/glossary';
import { CSS_COURSE, CSS_MODULES } from './css/manifest';
import { CSS_LESSON_QUIZZES } from './css/lesson-quizzes';
import { CSS_MINI_QUIZZES } from './css/mini-quizzes';
import { CSS_SOLUTIONS } from './css/solutions';
import { withQuizzes, type CourseDef } from './helpers';
import { HTML_GLOSSARY } from './html/glossary';
import { HTML_COURSE, HTML_MODULES } from './html/manifest';
import { HTML_LESSON_QUIZZES } from './html/lesson-quizzes';
import { HTML_MINI_QUIZZES } from './html/mini-quizzes';
import { HTML_SOLUTIONS } from './html/solutions';
import { JS_GLOSSARY } from './js/glossary';
import { JS_COURSE, JS_MODULES } from './js/manifest';
import { JS_LESSON_QUIZZES } from './js/lesson-quizzes';
import { JS_MINI_QUIZZES } from './js/mini-quizzes';
import { JS_SOLUTIONS } from './js/solutions';
import { PHP_COURSE, PHP_MODULES } from './php/manifest';
import { PORTFOLIO_LESSON_QUIZZES } from './portfolio/lesson-quizzes';
import { PORTFOLIO_MINI_QUIZZES } from './portfolio/mini-quizzes';
import { PORTFOLIO_COURSE, PORTFOLIO_MODULES, PORTFOLIO_SOLUTIONS } from './portfolio/manifest';
import { RWD_LESSON_QUIZZES } from './rwd/lesson-quizzes';
import { RWD_MINI_QUIZZES } from './rwd/mini-quizzes';
import { RWD_COURSE, RWD_MODULES, RWD_SOLUTIONS } from './rwd/manifest';
import { UI_LESSON_QUIZZES } from './ui/lesson-quizzes';
import { UI_MINI_QUIZZES } from './ui/mini-quizzes';
import { UI_COURSE, UI_MODULES, UI_SOLUTIONS } from './ui/manifest';
import { FIGMA_LESSON_QUIZZES } from './figma/lesson-quizzes';
import { FIGMA_MINI_QUIZZES } from './figma/mini-quizzes';
import { FIGMA_COURSE, FIGMA_MODULES, FIGMA_SOLUTIONS } from './figma/manifest';

/** Bundled original courses, in the order they are meant to be taken. */
export const CONTENT_COURSES: CourseDef[] = [
  {
    ...HTML_COURSE,
    modules: withQuizzes(HTML_MODULES, { lesson: HTML_LESSON_QUIZZES, mini: HTML_MINI_QUIZZES }),
    solutions: HTML_SOLUTIONS,
    glossary: HTML_GLOSSARY,
  },
  {
    ...CSS_COURSE,
    modules: withQuizzes(CSS_MODULES, { lesson: CSS_LESSON_QUIZZES, mini: CSS_MINI_QUIZZES }),
    solutions: CSS_SOLUTIONS,
    glossary: CSS_GLOSSARY,
  },
  {
    ...RWD_COURSE,
    modules: withQuizzes(RWD_MODULES, { lesson: RWD_LESSON_QUIZZES, mini: RWD_MINI_QUIZZES }),
    solutions: RWD_SOLUTIONS,
  },
  {
    ...UI_COURSE,
    modules: withQuizzes(UI_MODULES, { lesson: UI_LESSON_QUIZZES, mini: UI_MINI_QUIZZES }),
    solutions: UI_SOLUTIONS,
  },
  {
    ...FIGMA_COURSE,
    modules: withQuizzes(FIGMA_MODULES, { lesson: FIGMA_LESSON_QUIZZES, mini: FIGMA_MINI_QUIZZES }),
    solutions: FIGMA_SOLUTIONS,
  },
  {
    ...JS_COURSE,
    modules: withQuizzes(JS_MODULES, { lesson: JS_LESSON_QUIZZES, mini: JS_MINI_QUIZZES }),
    solutions: JS_SOLUTIONS,
    glossary: JS_GLOSSARY,
  },
  {
    ...PORTFOLIO_COURSE,
    modules: withQuizzes(PORTFOLIO_MODULES, {
      lesson: PORTFOLIO_LESSON_QUIZZES,
      mini: PORTFOLIO_MINI_QUIZZES,
    }),
    solutions: PORTFOLIO_SOLUTIONS,
  },
  { ...PHP_COURSE, modules: PHP_MODULES, solutions: {} },
  {
    ...BS3_COURSE,
    modules: withQuizzes(BS3_MODULES, { lesson: BS3_LESSON_QUIZZES, mini: BS3_MINI_QUIZZES }),
    solutions: BS3_SOLUTIONS,
  },
  {
    ...BS4_COURSE,
    modules: withQuizzes(BS4_MODULES, { lesson: BS4_LESSON_QUIZZES, mini: BS4_MINI_QUIZZES }),
    solutions: BS4_SOLUTIONS,
  },
  {
    ...BS5_COURSE,
    modules: withQuizzes(BS5_MODULES, { lesson: BS5_LESSON_QUIZZES, mini: BS5_MINI_QUIZZES }),
    solutions: BS5_SOLUTIONS,
  },
];

export function findContentCourse(slug: string): CourseDef | undefined {
  return CONTENT_COURSES.find((c) => c.slug === slug);
}
