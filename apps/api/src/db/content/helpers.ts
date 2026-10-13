import type {
  CheckAction,
  CheckPseudoElement,
  CheckRuleInput,
  Difficulty,
  ProjectFile,
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
  questions: {
    id: string;
    prompt: string;
    kind: 'SINGLE' | 'MULTIPLE';
    options: { id: string; text: string }[];
    correct: string[];
  }[];
}

export interface LessonDef {
  /** File name in `content/html-course/<slug>.md`. Unique across the course. */
  slug: string;
  title: string;
  exercise?: ExerciseDef;
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
}

export interface CourseDef extends CourseMeta {
  modules: ModuleDef[];
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
 */
export function q(
  id: string,
  prompt: string,
  options: string[],
  correct: number[],
): QuizDef['questions'][number] {
  const ids = options.map((_, i) => String.fromCharCode(97 + i));
  return {
    id,
    prompt,
    kind: correct.length > 1 ? 'MULTIPLE' : 'SINGLE',
    options: options.map((t, i) => ({ id: ids[i]!, text: t })),
    correct: correct.map((i) => ids[i]!),
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
