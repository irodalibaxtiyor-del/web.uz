import { describe, expect, it } from 'vitest';
import { createQuizSchema, gradeQuiz, quizQuestionSchema } from './quizzes';

const q = (over: Record<string, unknown> = {}) => ({
  id: 'q1',
  prompt: 'Qaysi teg sarlavha?',
  options: [
    { id: 'a', text: '<h1>' },
    { id: 'b', text: '<p>' },
  ],
  correct: ['a'],
  ...over,
});

describe('quiz schemas', () => {
  it('validates options and correct answers', () => {
    expect(quizQuestionSchema.safeParse(q()).success).toBe(true);
    expect(quizQuestionSchema.safeParse(q({ correct: ['z'] })).success).toBe(false);
    expect(quizQuestionSchema.safeParse(q({ correct: ['a', 'b'] })).success).toBe(false);
    expect(quizQuestionSchema.safeParse(q({ kind: 'MULTIPLE', correct: ['a', 'b'] })).success).toBe(
      true,
    );
    expect(quizQuestionSchema.safeParse(q({ options: [{ id: 'a', text: 'x' }] })).success).toBe(
      false,
    );
  });

  it('starts inactive and refuses an active quiz without questions', () => {
    expect(createQuizSchema.parse({ title: 'Test' }).isActive).toBe(false);
    expect(createQuizSchema.safeParse({ title: 'Test', isActive: true }).success).toBe(false);
  });
});

describe('gradeQuiz', () => {
  const questions = [
    { id: 'q1', correct: ['a'] },
    { id: 'q2', correct: ['a', 'c'] },
  ];

  it('needs the exact set of correct options', () => {
    expect(
      gradeQuiz(
        questions,
        [
          { questionId: 'q1', optionIds: ['a'] },
          { questionId: 'q2', optionIds: ['a'] },
        ],
        50,
      ),
    ).toEqual({ correct: 1, total: 2, score: 50, passed: true });
    expect(
      gradeQuiz(questions, [{ questionId: 'q2', optionIds: ['c', 'a', 'b'] }], 50),
    ).toMatchObject({ correct: 0, passed: false });
  });

  it('treats an empty quiz as not passed', () => {
    expect(gradeQuiz([], [], 1).passed).toBe(false);
  });
});
