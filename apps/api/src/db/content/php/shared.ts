import type { QuizDef } from '../helpers';
import { q } from '../helpers';

export { q, type ModuleDef } from '../helpers';

/** Distractor option meaning “the code fails”; shown as text, never as output. */
export const XATO = '<xato>';

/**
 * Output-prediction questions, collected so their answers can be checked against a real
 * PHP interpreter (see `PHP_KURS_HOLATI.md`). Never seeded or sent anywhere.
 */
export const PHP_OUTPUTS: { id: string; code: string; expected: string }[] = [];

/** Prompt with a PHP snippet shown as a code block. */
export function kod(php: string, savol = 'Bu kod nimani chiqaradi?'): string {
  return `${savol}\n\n\`\`\`php\n${php.trim()}\n\`\`\``;
}

/**
 * “What does this print?” question. The correct option is the exact output; it is verified
 * against PHP 8.3, so options are written as the program prints them.
 */
export function natija(
  id: string,
  php: string,
  options: string[],
  correct: number,
  savol?: string,
): QuizDef['questions'][number] {
  PHP_OUTPUTS.push({ id, code: php.trim(), expected: options[correct]! });
  return q(id, kod(php, savol), options.map(option), [correct]);
}

/**
 * How an output is shown as an answer option: each printed line as `inline code`, lines
 * separated by a space (options cannot hold line breaks); empty output reads as words.
 */
function option(text: string): string {
  if (text === XATO) return 'Kod xato beradi';
  if (text === '') return '(hech narsa chiqmaydi)';
  if (!text.includes('`')) {
    return text
      .replace(/\n$/, '')
      .split('\n')
      .map((line) => `\`${line}\``)
      .join(' ');
  }
  return text;
}

/** Lesson quiz: closes every lesson of a quiz-practice course. */
export function dars(title: string, questions: QuizDef['questions']): QuizDef {
  return {
    title,
    description:
      'Dars bo‘yicha savollar. Keyingi dars ochilishi uchun kamida 70% to‘g‘ri javob kerak. ' +
      'Kodni avval o‘zingiz hisoblang, keyin javobni tanlang.',
    passingPercent: 70,
    questions,
  };
}

export const md = (...lines: string[]) => lines.join('\n');
