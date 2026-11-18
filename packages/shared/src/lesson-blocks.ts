/**
 * Interactive blocks inside lesson Markdown, written as fenced code blocks so teachers can author
 * them in the ordinary lesson editor:
 *
 * ```tekshir            — instant self-check (no grade, not stored):
 * Savol matni?          question (one or more lines, `inline code` allowed)
 * - noto‘g‘ri variant   wrong option
 * + to‘g‘ri variant     right option (two or more `+` → several answers)
 * > Izoh                explanation shown after checking (required)
 * ```
 *
 * ```jonli              — editable live example, run in the sandbox (body = HTML)
 * ```yechim Sarlavha    — collapsible “show the answer” block (body = Markdown;
 *                         use a longer fence (````) when the body contains ``` itself)
 *
 * The answers of a self-check are part of the lesson text by design: it is formative
 * practice, never graded (graded tests are server-side quizzes).
 */

export const LESSON_BLOCK_KINDS = ['tekshir', 'jonli', 'yechim'] as const;
export type LessonBlockKind = (typeof LESSON_BLOCK_KINDS)[number];

export const LIVE_BLOCK_MAX = 20_000;

export interface CheckBlockOption {
  text: string;
  correct: boolean;
}

export interface CheckBlock {
  prompt: string;
  options: CheckBlockOption[];
  explanation: string;
  /** More than one right option: the learner ticks all of them. */
  multiple: boolean;
}

export interface FencedBlock {
  kind: LessonBlockKind;
  /** Text after the kind on the opening fence (e.g. the title of a `yechim`). */
  meta: string;
  body: string;
  /** 1-based line of the opening fence. */
  line: number;
}

export function isLessonBlockKind(s: string): s is LessonBlockKind {
  return (LESSON_BLOCK_KINDS as readonly string[]).includes(s);
}

const OPEN = /^(`{3,})\s*([a-z]+)?\s*(.*)$/;

/** Interactive blocks of a lesson, in order. Other fenced code blocks are skipped. */
export function findLessonBlocks(markdown: string): FencedBlock[] {
  const lines = markdown.split('\n');
  const out: FencedBlock[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = OPEN.exec(lines[i]!.trimEnd());
    if (!m) continue;
    const fence = m[1]!;
    const lang = m[2] ?? '';
    let end = i + 1;
    while (end < lines.length && lines[end]!.trim() !== fence) end++;
    if (isLessonBlockKind(lang)) {
      out.push({
        kind: lang,
        meta: (m[3] ?? '').trim(),
        body: lines.slice(i + 1, end).join('\n'),
        line: i + 1,
      });
    }
    i = end; // skip the whole fenced block (other fences inside it are content)
  }
  return out;
}

/** Parses a `tekshir` body; returns the block or a list of problems (Uzbek, for authors). */
export function parseCheckBlock(body: string): { block: CheckBlock } | { errors: string[] } {
  const prompt: string[] = [];
  const options: CheckBlockOption[] = [];
  const explanation: string[] = [];
  const errors: string[] = [];
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('+ ') || line.startsWith('- ')) {
      if (explanation.length) errors.push('variantlar izohdan oldin yozilishi kerak');
      options.push({ text: line.slice(2).trim(), correct: line.startsWith('+') });
    } else if (line.startsWith('>')) {
      explanation.push(line.replace(/^>\s?/, ''));
    } else if (options.length === 0) {
      prompt.push(line);
    } else {
      errors.push(
        `tushunarsiz qator: “${line.slice(0, 40)}” (variant “+ ” yoki “- ” bilan, izoh “> ” bilan boshlanadi)`,
      );
    }
  }
  if (prompt.length === 0) errors.push('savol matni yo‘q');
  if (options.length < 2) errors.push('kamida 2 ta variant kerak');
  if (!options.some((o) => o.correct)) errors.push('kamida bitta to‘g‘ri variant (“+ ”) kerak');
  if (options.some((o) => !o.text)) errors.push('bo‘sh variant bor');
  if (explanation.join(' ').trim().length === 0) errors.push('izoh (“> ”) kerak');
  if (errors.length) return { errors };
  return {
    block: {
      prompt: prompt.join('\n'),
      options,
      explanation: explanation.join('\n'),
      multiple: options.filter((o) => o.correct).length > 1,
    },
  };
}

/** Problems in the lesson's interactive blocks, each prefixed with its line number. */
export function validateLessonBlocks(markdown: string): string[] {
  const problems: string[] = [];
  for (const b of findLessonBlocks(markdown)) {
    const at = `${b.line}-qator (${b.kind})`;
    if (b.kind === 'tekshir') {
      const r = parseCheckBlock(b.body);
      if ('errors' in r) problems.push(...r.errors.map((e) => `${at}: ${e}`));
    } else if (b.kind === 'jonli') {
      if (!b.body.trim()) problems.push(`${at}: kod bo‘sh`);
      if (b.body.length > LIVE_BLOCK_MAX) problems.push(`${at}: kod juda uzun`);
    } else if (!b.body.trim()) {
      problems.push(`${at}: yechim matni bo‘sh`);
    }
  }
  return problems;
}

/**
 * The lesson text without its interactive blocks (whitespace normalized). Used to tell whether
 * a stored lesson still matches the bundled file apart from newly added blocks.
 */
export function stripLessonBlocks(markdown: string): string {
  const lines = markdown.split('\n');
  const kept: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = OPEN.exec(lines[i]!.trimEnd());
    if (m && isLessonBlockKind(m[2] ?? '')) {
      const fence = m[1]!;
      let end = i + 1;
      while (end < lines.length && lines[end]!.trim() !== fence) end++;
      i = end;
      continue;
    }
    if (m) {
      // Ordinary code block: keep it verbatim.
      const fence = m[1]!;
      let end = i + 1;
      while (end < lines.length && lines[end]!.trim() !== fence) end++;
      kept.push(...lines.slice(i, end + 1));
      i = end;
      continue;
    }
    kept.push(lines[i]!);
  }
  return kept
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
