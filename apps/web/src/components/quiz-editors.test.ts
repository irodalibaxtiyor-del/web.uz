import { QUIZ_QUESTION_KINDS, quizQuestionSchema, type QuizQuestion } from '@webdizayn/shared';
import { describe, expect, it } from 'vitest';
import { blankQuestion } from './quiz-editors';
import { templateParts } from './quiz-questions';

/** Fills every empty text field so the template can be validated as a finished question. */
function filled(q: QuizQuestion): unknown {
  return JSON.parse(
    JSON.stringify({ ...q, prompt: 'Savol' }, (key, value) => {
      if ((key === 'text' || key === 'prompt') && value === '') return 'matn';
      if (key === 'accepted') return ['javob'];
      return value;
    }),
  );
}

describe('quiz editor templates', () => {
  it.each(QUIZ_QUESTION_KINDS)('a new %s question becomes valid once filled in', (kind) => {
    const q = blankQuestion(kind);
    expect(q.kind).toBe(kind);
    expect(quizQuestionSchema.safeParse(filled(q)).success).toBe(true);
  });

  it('keeps the prompt and id when the kind changes', () => {
    const q = { ...blankQuestion('SINGLE'), prompt: 'Qaysi teg?' };
    const next = blankQuestion('ORDERING', q);
    expect(next).toMatchObject({ id: q.id, prompt: 'Qaysi teg?', kind: 'ORDERING' });
  });

  it('keeps choice options between SINGLE and MULTIPLE', () => {
    const multi = blankQuestion('MULTIPLE');
    if (multi.kind !== 'MULTIPLE') throw new Error('kind');
    const withTwo = { ...multi, correct: multi.options.map((o) => o.id) };
    const single = blankQuestion('SINGLE', withTwo);
    expect(single.kind === 'SINGLE' && single.correct).toHaveLength(1);
  });
});

describe('templateParts', () => {
  it('splits text and gap numbers', () => {
    expect(templateParts('a {{1}} b {{2}}')).toEqual(['a ', 1, ' b ', 2, '']);
    expect(templateParts('bo‘sh joysiz')).toEqual(['bo‘sh joysiz']);
  });
});
