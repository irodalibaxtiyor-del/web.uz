import {
  seededOrder,
  type CheckAction,
  type CheckPseudoElement,
  type CheckRuleInput,
  type ChoiceQuestion,
  type Difficulty,
  type ProjectFile,
  type QuizQuestion,
} from '@webdizayn/shared';

/** Authoring helpers for the bundled course manifests (`content/<course>/manifest.ts`). */

export interface ExerciseDef {
  title: string;
  description: string;
  instructions: string;
  expectedBehavior: string;
  difficulty: Difficulty;
  starterFiles: ProjectFile[];
  checks: CheckRuleInput[];
}

export interface QuizDef {
  title: string;
  description: string;
  passingPercent: number;
  questions: QuizQuestion[];
}

export interface LessonDef {
  /** File name in `content/html-course/<slug>.md`. Unique across the course. */
  slug: string;
  title: string;
  exercise?: ExerciseDef;
  /** Optional self-check of the exercise (needs `exercise`); never gates the lesson. */
  miniQuiz?: QuizDef;
  quiz?: QuizDef;
}

export interface ModuleDef {
  title: string;
  lessons: LessonDef[];
}

export interface CourseMeta {
  slug: string;
  title: string;
  description: string;
  /** Folder under `apps/api/content/` with one `<lesson slug>.md` per lesson. */
  contentDir: string;
  /** Catalogue order in the organization; lower comes first. */
  position: number;
  /**
   * How lessons are practised. `check` (default): exercises verified by the CHECK engine.
   * `quiz`: no runnable exercises (e.g. server-side PHP); every lesson ends with a quiz.
   */
  practice?: 'check' | 'quiz';
  /** Public catalogue directions (slugs from `content/directions.ts`) the course is listed under. */
  directions?: string[];
}

/** Glossary entry; `lesson` is the slug of the lesson that introduces the term. */
export interface GlossaryDef {
  term: string;
  definition: string;
  example?: string;
  lesson?: string;
}

export interface CourseDef extends CourseMeta {
  modules: ModuleDef[];
  glossary?: GlossaryDef[];
  /** Reference solutions by lesson slug; used only by `content:verify`, never seeded. */
  solutions: Record<string, ProjectFile[]>;
}

interface RuleOpts {
  hint?: string;
  hidden?: boolean;
}

/** A complete HTML document with the given body (and optional extra head markup). */
export function page(body: string, opts: { title?: string; head?: string } = {}): string {
  const head = opts.head ? `\n${indent(opts.head.trim(), 4)}` : '';
  return `<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${opts.title ?? 'Mashq'}</title>${head}
  </head>
  <body>
${indent(body.trim(), 4)}
  </body>
</html>
`;
}

function indent(text: string, n: number): string {
  const pad = ' '.repeat(n);
  return text
    .split('\n')
    .map((l) => (l ? pad + l : l))
    .join('\n');
}

export function html(content: string): ProjectFile[] {
  return [{ path: 'index.html', content }];
}

/** `index.html` linked to `style.css`: the usual shape of a CSS exercise. */
export function site(
  body: string,
  css: string,
  opts: { title?: string; head?: string } = {},
): ProjectFile[] {
  const head = [opts.head ?? '', '<link rel="stylesheet" href="style.css">']
    .filter(Boolean)
    .join('\n');
  return [
    { path: 'index.html', content: page(body, { title: opts.title, head }) },
    { path: 'style.css', content: `${css.trim()}\n` },
  ];
}

/**
 * `index.html` that loads `script.js` at the end of the body (plus an optional `style.css`):
 * the usual shape of a JavaScript exercise. `script.js` comes first so the IDE opens it.
 */
export function app(
  body: string,
  js: string,
  opts: { css?: string; title?: string } = {},
): ProjectFile[] {
  const head = opts.css === undefined ? undefined : '<link rel="stylesheet" href="style.css">';
  const result: ProjectFile[] = [
    { path: 'script.js', content: `${js.trim()}\n` },
    {
      path: 'index.html',
      content: page(`${body.trim()}\n\n<script src="script.js"></script>`, {
        title: opts.title,
        head,
      }),
    },
  ];
  if (opts.css !== undefined) result.push({ path: 'style.css', content: `${opts.css.trim()}\n` });
  return result;
}

export function files(map: Record<string, string>): ProjectFile[] {
  return Object.entries(map).map(([path, content]) => ({ path, content }));
}

export function has(
  id: string,
  title: string,
  selector: string,
  opts: RuleOpts & { min?: number; max?: number } = {},
): CheckRuleInput {
  return {
    id,
    title,
    hint: opts.hint,
    hidden: opts.hidden,
    assert: { type: 'count', selector, min: opts.min ?? 1, max: opts.max },
  };
}

export function text(
  id: string,
  title: string,
  selector: string,
  value: string,
  opts: RuleOpts & { equals?: boolean; caseSensitive?: boolean } = {},
): CheckRuleInput {
  return {
    id,
    title,
    hint: opts.hint,
    hidden: opts.hidden,
    assert: {
      type: 'text',
      selector,
      value,
      match: opts.equals ? 'equals' : 'contains',
      ...(opts.caseSensitive ? { caseSensitive: true } : {}),
    },
  };
}

export function attr(
  id: string,
  title: string,
  selector: string,
  name: string,
  value?: string,
  opts: RuleOpts = {},
): CheckRuleInput {
  return {
    id,
    title,
    hint: opts.hint,
    hidden: opts.hidden,
    assert: { type: 'attribute', selector, name, value },
  };
}

export function style(
  id: string,
  title: string,
  selector: string,
  property: string,
  value: string,
  opts: RuleOpts & { pseudo?: CheckPseudoElement } = {},
): CheckRuleInput {
  return {
    id,
    title,
    hint: opts.hint,
    hidden: opts.hidden,
    assert: { type: 'style', selector, property, value, pseudo: opts.pseudo },
  };
}

export function clean(opts: RuleOpts = {}): CheckRuleInput {
  return {
    id: 'clean',
    title: 'Konsolda xato yo‘q',
    hint: opts.hint ?? 'Konsolni oching va JavaScript xatosini tuzating.',
    hidden: opts.hidden,
    assert: { type: 'noConsoleErrors' },
  };
}

/** Runs the actions before the rule's assertion. */
export function after(actions: CheckAction[], rule: CheckRuleInput): CheckRuleInput {
  return { ...rule, actions };
}

/** Evaluates the rule at the given viewport size. */
export function at(width: number, height: number, rule: CheckRuleInput): CheckRuleInput {
  return { ...rule, viewport: { width, height } };
}

/**
 * Quiz question. `correct` holds 0-based indexes into `options`; more than one makes it
 * a MULTIPLE question.
 *
 * Authors tend to write the right answer first, so the options are shuffled — deterministically
 * (seeded by id and prompt), so a re-seed produces the same order and nothing is random at
 * runtime.
 */
export function q(
  id: string,
  prompt: string,
  options: string[],
  correct: number[],
): ChoiceQuestion {
  const order = seededOrder(options.length, `${id}\u0000${prompt}`);
  const ids = options.map((_, i) => String.fromCharCode(97 + i));
  return {
    id,
    prompt,
    kind: correct.length > 1 ? 'MULTIPLE' : 'SINGLE',
    options: order.map((from, i) => ({ id: ids[i]!, text: options[from]! })),
    correct: correct.map((c) => ids[order.indexOf(c)]!).sort(),
  };
}

const letters = (n: number) => Array.from({ length: n }, (_, i) => String.fromCharCode(97 + i));

/** True/false statement. */
export function tf(id: string, prompt: string, answer: boolean): QuizQuestion {
  return { id, prompt, kind: 'TRUE_FALSE', answer };
}

/**
 * Fill the gaps: `template` uses `{{1}}`, `{{2}}`…; `answers[i]` lists accepted spellings for
 * gap i+1 (a string is one spelling). Case-insensitive unless `caseSensitive`.
 */
export function fill(
  id: string,
  prompt: string,
  template: string,
  answers: (string | string[])[],
  opts: { code?: boolean; caseSensitive?: boolean } = {},
): QuizQuestion {
  return {
    id,
    prompt,
    kind: opts.code ? 'CODE_FILL' : 'FILL_BLANK',
    template,
    blanks: answers.map((a) => ({
      accepted: Array.isArray(a) ? a : [a],
      caseSensitive: opts.caseSensitive ?? false,
    })),
  };
}

/** Gaps in a code snippet (whitespace inside answers is ignored when grading). */
export function codeFill(
  id: string,
  prompt: string,
  template: string,
  answers: (string | string[])[],
  caseSensitive = true,
): QuizQuestion {
  return fill(id, prompt, template, answers, { code: true, caseSensitive });
}

/**
 * Matching: `pairs` are `[left, right]` texts in the right correspondence; `extra` adds
 * distractors on the right. Students see the right column shuffled.
 */
export function match(
  id: string,
  prompt: string,
  pairs: [string, string][],
  extra: string[] = [],
): QuizQuestion {
  const l = letters(pairs.length);
  const right = [...pairs.map((p) => p[1]), ...extra];
  const r = right.map((_, i) => `r${i + 1}`);
  return {
    id,
    prompt,
    kind: 'MATCHING',
    left: pairs.map((p, i) => ({ id: l[i]!, text: p[0] })),
    right: right.map((text, i) => ({ id: r[i]!, text })),
    pairs: pairs.map((_, i) => [l[i]!, r[i]!]),
  };
}

/** Ordering: `items` in the correct order (students get them shuffled). */
export function order(id: string, prompt: string, items: string[]): QuizQuestion {
  const ids = letters(items.length);
  return {
    id,
    prompt,
    kind: 'ORDERING',
    items: items.map((text, i) => ({ id: ids[i]!, text })),
  };
}

/** Sort into groups: `groups` maps a group title to the item texts that belong to it. */
export function sortInto(
  id: string,
  prompt: string,
  groups: Record<string, string[]>,
): QuizQuestion {
  const titles = Object.keys(groups);
  const items = titles.flatMap((t, gi) =>
    groups[t]!.map((text) => ({ text, group: `g${gi + 1}` })),
  );
  return {
    id,
    prompt,
    kind: 'CATEGORIZE',
    groups: titles.map((text, i) => ({ id: `g${i + 1}`, text })),
    items: items.map((x, i) => ({ id: `i${i + 1}`, ...x })),
  };
}

export function quiz(title: string, questions: QuizDef['questions']): QuizDef {
  return {
    title,
    description: 'Modul bo‘yicha qisqa test. O‘tish uchun kamida 70% to‘g‘ri javob kerak.',
    passingPercent: 70,
    questions,
  };
}

/** Exercise self-check: unlimited attempts, explanations after each, does not gate the lesson. */
export function miniQuiz(questions: QuizDef['questions']): QuizDef {
  return {
    title: 'Mashq mini-testi',
    description: 'O‘zingizni tekshiring: mashqdagi asosiy tushunchalar bo‘yicha qisqa savollar.',
    passingPercent: 60,
    questions,
  };
}

/** Attaches the explanation students see after an attempt (never before). */
export function why<T extends QuizQuestion>(question: T, explanation: string): T {
  return { ...question, explanation };
}

export const LESSON_QUIZ_TITLE = 'Dars testi';

/** Per-lesson test (the module `quiz` checks a whole module). */
export function lessonQuiz(questions: QuizDef['questions']): QuizDef {
  return {
    title: LESSON_QUIZ_TITLE,
    description:
      'Dars bo‘yicha qisqa test. Javob berganingizdan keyin har savol bo‘yicha izoh ko‘rasiz. O‘tish uchun kamida 70% kerak.',
    passingPercent: 70,
    questions,
  };
}

/**
 * Merges lesson tests and exercise mini-tests kept in separate files into the manifest.
 * A lesson that already has its own (module) quiz keeps it. Unknown slugs are an error.
 */
export function withQuizzes(
  modules: ModuleDef[],
  extra: { lesson?: Record<string, QuizDef>; mini?: Record<string, QuizDef> },
): ModuleDef[] {
  const slugs = new Set(modules.flatMap((m) => m.lessons.map((l) => l.slug)));
  for (const s of [...Object.keys(extra.lesson ?? {}), ...Object.keys(extra.mini ?? {})]) {
    if (!slugs.has(s)) throw new Error(`withQuizzes: unknown lesson slug "${s}"`);
  }
  return modules.map((m) => ({
    ...m,
    lessons: m.lessons.map((l) => ({
      ...l,
      quiz: l.quiz ?? extra.lesson?.[l.slug],
      miniQuiz: l.miniQuiz ?? extra.mini?.[l.slug],
    })),
  }));
}
