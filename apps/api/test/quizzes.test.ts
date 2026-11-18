import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { quizAttempts } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgA: string;
let orgB: string;
let owner: Member;
let otherTeacher: Member;
let foreignTeacher: Member;
let student: Member;
let student2: Member;
let outsider: Member;
let courseId: string;
let l1: string;
let l2: string;
let l3: string;
let quiz1: string;
let quiz2: string;
let quiz3: string;
let exercise2: string;

const QUESTIONS = [
  {
    id: 'q1',
    prompt: 'Sarlavha uchun qaysi teg?',
    options: [
      { id: 'a', text: '<zxq-right>' },
      { id: 'b', text: '<p>' },
    ],
    correct: ['a'],
  },
  {
    id: 'q2',
    prompt: 'Qaysilari blok element?',
    kind: 'MULTIPLE',
    options: [
      { id: 'a', text: '<div>' },
      { id: 'b', text: '<span>' },
      { id: 'c', text: '<section>' },
    ],
    correct: ['a', 'c'],
  },
];
const RIGHT = [
  { questionId: 'q1', optionIds: ['a'] },
  { questionId: 'q2', optionIds: ['c', 'a'] },
];
const WRONG = [
  { questionId: 'q1', optionIds: ['b'] },
  { questionId: 'q2', optionIds: ['a'] },
];

const course = (org = orgA) => `/orgs/${org}/courses/${courseId}`;
const req = (
  who: Member,
  method: 'get' | 'post' | 'put' | 'patch',
  path: string,
  body?: object,
) => {
  const r = ctx.http()[method](path).set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};
const Q = (id: string) => `${course()}/quizzes/${id}`;
const attempt = (who: Member, id: string, answers: object[]) =>
  req(who, 'post', `${Q(id)}/attempts`, { answers });
const states = async (who: Member) => {
  const res = await req(who, 'get', `${course()}/map`).expect(200);
  return res.body.modules[0].lessons.map((l: { state: string }) => l.state);
};

async function quiz(lessonId: string, body: object = {}) {
  const res = await req(owner, 'post', `${course()}/lessons/${lessonId}/quizzes`, {
    title: 'HTML testi',
    questions: QUESTIONS,
    passingPercent: 100,
    isActive: true,
    ...body,
  }).expect(201);
  return res.body.id as string;
}

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  otherTeacher = await createMember(ctx, 'other@a.uz', orgA, 'TEACHER');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  student = await createMember(ctx, 'student@a.uz', orgA, 'STUDENT');
  student2 = await createMember(ctx, 'student2@a.uz', orgA, 'STUDENT');
  outsider = await createMember(ctx, 'outsider@a.uz', orgA, 'STUDENT');

  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'HTML', slug: 'html' });
  courseId = c.body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  const lesson = async (title: string) =>
    (await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title })).body.id;
  l1 = await lesson('Teglar');
  l2 = await lesson('Bloklar');
  l3 = await lesson('Formalar');
  quiz1 = await quiz(l1);
  quiz2 = await quiz(l2, { passingPercent: 50 });
  quiz3 = await quiz(l3);
  exercise2 = (
    await req(owner, 'post', `${course()}/lessons/${l2}/exercises`, { title: 'Mashq' }).expect(201)
  ).body.id;
  // Not visible to learners: inactive quiz and draft assignment.
  await req(owner, 'post', `${course()}/lessons/${l1}/quizzes`, { title: 'Qoralama test' }).expect(
    201,
  );
  await req(owner, 'post', `${course()}/lessons/${l1}/assignments`, { title: 'Qoralama ish' });
  const asg = await req(owner, 'post', `${course()}/lessons/${l1}/assignments`, {
    title: 'Vizitka',
    instructions: 'Sahifa yarating',
  });
  await req(owner, 'post', `${course()}/assignments/${asg.body.id}/publish`).expect(200);

  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of [student, student2]) await req(s, 'post', `${course()}/enroll`).expect(201);
});
afterAll(async () => {
  await ctx.app.close();
});

describe('quiz authoring', () => {
  it('starts inactive and cannot be activated without questions', async () => {
    const res = await req(owner, 'post', `${course()}/lessons/${l1}/quizzes`, {
      title: 'Bo‘sh',
    }).expect(201);
    expect(res.body).toMatchObject({ isActive: false, passingPercent: 70, questions: [] });
    await req(owner, 'patch', Q(res.body.id), { isActive: true }).expect(400);
    await req(owner, 'post', `${course()}/lessons/${l1}/quizzes`, {
      title: 'Bo‘sh',
      isActive: true,
    }).expect(400);
  });

  it('validates questions', async () => {
    await req(owner, 'post', `${course()}/lessons/${l1}/quizzes`, {
      title: 'Yomon',
      questions: [{ ...QUESTIONS[0], correct: ['z'] }],
    }).expect(400);
  });

  it('denies students, unassigned teachers and other orgs', async () => {
    const body = { title: 'Ruxsatsiz' };
    await req(student, 'post', `${course()}/lessons/${l1}/quizzes`, body).expect(403);
    await req(otherTeacher, 'patch', Q(quiz1), body).expect(403);
    await req(student, 'get', `${Q(quiz1)}/edit`).expect(403);
    await req(foreignTeacher, 'get', `${course(orgB)}/quizzes/${quiz1}/edit`).expect(404);
  });
});

describe('taking quizzes', () => {
  it('never sends correct answers to the student', async () => {
    const res = await req(student, 'get', Q(quiz1)).expect(200);
    expect(res.body).toMatchObject({ status: 'NOT_STARTED', attempts: 0, bestScore: null });
    expect(res.body.questions[1]).toEqual({
      id: 'q2',
      prompt: 'Qaysilari blok element?',
      kind: 'MULTIPLE',
      options: [
        { id: 'a', text: '<div>' },
        { id: 'b', text: '<span>' },
        { id: 'c', text: '<section>' },
      ],
    });
    expect(JSON.stringify(res.body)).not.toContain('correct');
    const lesson = await req(student, 'get', `${course()}/lessons/${l1}`).expect(200);
    expect(lesson.body.quizzes).toEqual([
      { id: quiz1, title: 'HTML testi', status: 'NOT_STARTED', bestScore: null },
    ]);
  });

  it('refuses locked lessons, inactive quizzes, outsiders and other orgs', async () => {
    await req(student, 'get', Q(quiz3)).expect(403);
    await attempt(student, quiz3, RIGHT).expect(403);
    await req(outsider, 'get', Q(quiz1)).expect(403);
    await req(foreignTeacher, 'get', `${course(orgB)}/quizzes/${quiz1}`).expect(404);
    const list = await req(owner, 'get', `${course()}/lessons/${l1}/quizzes`).expect(200);
    const inactive = list.body.find((q: { isActive: boolean }) => !q.isActive).id;
    await req(student, 'get', Q(inactive)).expect(404);
  });

  it('a failed attempt reports totals only and marks the lesson NEEDS_IMPROVEMENT', async () => {
    const res = await attempt(student, quiz1, WRONG).expect(201);
    expect(res.body).toMatchObject({
      status: 'FAILED',
      attempts: 1,
      bestScore: 0,
      lastAttempt: { correct: 0, total: 2, score: 0, passed: false },
    });
    expect(JSON.stringify(res.body)).not.toContain('correct":[');
    expect(await states(student)).toEqual(['NEEDS_IMPROVEMENT', 'LOCKED', 'LOCKED']);
    const lesson = await req(student, 'get', `${course()}/lessons/${l1}`).expect(200);
    expect(lesson.body.state).toBe('NEEDS_IMPROVEMENT');
    const done = await req(student, 'post', `${course()}/lessons/${l1}/complete`).expect(409);
    expect(done.body.code).toBe('EXERCISES_REQUIRED');
  });

  it('passing the only requirement completes the lesson and unlocks the next', async () => {
    const res = await attempt(student, quiz1, RIGHT).expect(201);
    expect(res.body).toMatchObject({ status: 'PASSED', bestScore: 100, attempts: 2 });
    expect(await states(student)).toEqual(['COMPLETED', 'AVAILABLE', 'LOCKED']);
    // A later failed practice attempt keeps the pass.
    await attempt(student, quiz1, WRONG).expect(201);
    expect((await req(student, 'get', Q(quiz1))).body).toMatchObject({
      status: 'PASSED',
      bestScore: 100,
    });
    expect(await states(student2)).toEqual(['AVAILABLE', 'LOCKED', 'LOCKED']);
  });

  it('with an exercise and a quiz, both are required', async () => {
    await attempt(student, quiz2, [{ questionId: 'q1', optionIds: ['a'] }]).expect(201);
    expect((await req(student, 'get', Q(quiz2))).body.status).toBe('PASSED');
    // The lesson page was never opened, so it is still AVAILABLE (not IN_PROGRESS).
    expect(await states(student)).toEqual(['COMPLETED', 'AVAILABLE', 'LOCKED']);
    await req(
      owner,
      'put',
      `${course()}/exercises/${exercise2}/students/${student.userId}/status`,
      {
        status: 'PASSED',
      },
    ).expect(200);
    expect(await states(student)).toEqual(['COMPLETED', 'COMPLETED', 'AVAILABLE']);
  });

  it('rate-limits attempts', async () => {
    for (let i = 0; i < 10; i++) await attempt(student2, quiz1, WRONG).expect(201);
    const res = await attempt(student2, quiz1, RIGHT).expect(429);
    expect(res.body.code).toBe('QUIZ_RATE_LIMITED');
  });

  it('gives staff per-quiz counts', async () => {
    const res = await req(owner, 'get', `${Q(quiz1)}/edit`).expect(200);
    expect(res.body).toMatchObject({ attemptedBy: 2, passedBy: 1 });
    expect(res.body.questions[0].correct).toEqual(['a']);
  });
});

describe('question kinds', () => {
  const KINDS = [
    { id: 'tf', kind: 'TRUE_FALSE', prompt: '<br> yopuvchi tegsiz yoziladi', answer: true },
    {
      id: 'fb',
      kind: 'FILL_BLANK',
      prompt: 'To‘ldiring',
      template: 'Havola tegi {{1}}.',
      blanks: [{ accepted: ['a', '<a>'] }],
    },
    {
      id: 'cf',
      kind: 'CODE_FILL',
      prompt: 'Kodni to‘ldiring',
      template: '<img {{1}}="rasm.png">',
      blanks: [{ accepted: ['zxq-src'], caseSensitive: true }],
    },
    {
      id: 'mt',
      kind: 'MATCHING',
      prompt: 'Moslang',
      left: [
        { id: 'a', text: '<ul>' },
        { id: 'b', text: '<ol>' },
      ],
      right: [
        { id: 'r1', text: 'belgili' },
        { id: 'r2', text: 'raqamli' },
        { id: 'r3', text: 'jadval' },
      ],
      pairs: [
        ['a', 'r1'],
        ['b', 'r2'],
      ],
    },
    {
      id: 'or',
      kind: 'ORDERING',
      prompt: 'Tartiblang',
      items: [
        { id: 'a', text: '<html>' },
        { id: 'b', text: '<head>' },
        { id: 'c', text: '<body>' },
      ],
    },
    {
      id: 'ct',
      kind: 'CATEGORIZE',
      prompt: 'Ajrating',
      groups: [
        { id: 'blok', text: 'Blok' },
        { id: 'qator', text: 'Qator' },
      ],
      items: [
        { id: 'div', text: '<div>', group: 'blok' },
        { id: 'span', text: '<span>', group: 'qator' },
      ],
    },
  ];
  const RIGHT_KINDS = [
    { questionId: 'tf', optionIds: ['true'] },
    { questionId: 'fb', texts: [' <A> '] },
    { questionId: 'cf', texts: ['zxq-src'] },
    {
      questionId: 'mt',
      pairs: [
        ['b', 'r2'],
        ['a', 'r1'],
      ],
    },
    { questionId: 'or', order: ['a', 'b', 'c'] },
    {
      questionId: 'ct',
      placements: [
        ['span', 'qator'],
        ['div', 'blok'],
      ],
    },
  ];
  let mixed: string;

  beforeAll(async () => {
    mixed = await quiz(l1, { title: 'Aralash test', questions: KINDS });
  });
  // Keep the course-map expectations below independent of this extra quiz.
  afterAll(async () => {
    await req(owner, 'patch', Q(mixed), { isActive: false }).expect(200);
  });

  it('rejects malformed questions of the new kinds', async () => {
    await req(owner, 'post', `${course()}/lessons/${l1}/quizzes`, {
      title: 'Yomon',
      questions: [{ ...KINDS[1], template: 'bo‘sh joysiz' }],
    }).expect(400);
  });

  it('shows students the questions without any answers, ordering shuffled', async () => {
    const res = await req(student, 'get', Q(mixed)).expect(200);
    const json = JSON.stringify(res.body);
    for (const secret of ['zxq-src', '"answer"', 'blanks', 'accepted', 'pairs', 'group"']) {
      expect(json).not.toContain(secret);
    }
    const byId = Object.fromEntries(
      res.body.questions.map((x: { id: string }) => [x.id, x]),
    ) as Record<string, Record<string, unknown>>;
    expect(byId.fb).toMatchObject({ kind: 'FILL_BLANK', blankCount: 1 });
    expect(byId.mt!.right).toHaveLength(3);
    const order = (byId.or!.items as { id: string }[]).map((x) => x.id).join('');
    expect(order).not.toBe('abc');
    // The same student sees the same shuffle on reload.
    expect((await req(student, 'get', Q(mixed))).body.questions).toEqual(res.body.questions);
  });

  it('grades every kind on the server and stores per-question results', async () => {
    const wrong = await attempt(student, mixed, [
      { questionId: 'tf', optionIds: ['false'] },
      { questionId: 'fb', texts: ['a'] },
    ]).expect(201);
    expect(wrong.body.lastAttempt).toMatchObject({ correct: 1, total: 6, passed: false });

    const right = await attempt(student, mixed, RIGHT_KINDS).expect(201);
    expect(right.body).toMatchObject({ status: 'PASSED', bestScore: 100 });

    const rows = await ctx.handle.db
      .select({ results: quizAttempts.results, score: quizAttempts.score })
      .from(quizAttempts)
      .where(eq(quizAttempts.quizId, mixed));
    const best = rows.find((r) => r.score === 100)!;
    expect(best.results.map((r) => `${r.kind}:${r.correct}`)).toEqual([
      'TRUE_FALSE:true',
      'FILL_BLANK:true',
      'CODE_FILL:true',
      'MATCHING:true',
      'ORDERING:true',
      'CATEGORIZE:true',
    ]);
  });

  it('refuses answers of the wrong shape', async () => {
    await attempt(student, mixed, [{ questionId: 'or', order: 'abc' }]).expect(400);
    await attempt(student, mixed, [{ questionId: 'mt', pairs: [['a']] }]).expect(400);
  });
});

describe('formative feedback', () => {
  const EXPLAINED = [
    { ...QUESTIONS[0], explanation: 'zxq-izoh: h1 eng katta sarlavha' },
    { ...QUESTIONS[1], explanation: 'zxq-izoh: div va section blok' },
  ];
  let perQuestion: string;
  let totalOnly: string;

  beforeAll(async () => {
    perQuestion = await quiz(l1, { title: 'Izohli test', questions: EXPLAINED });
    totalOnly = await quiz(l1, {
      title: 'Faqat natija',
      questions: EXPLAINED,
      feedback: 'TOTAL_ONLY',
    });
  });
  afterAll(async () => {
    for (const id of [perQuestion, totalOnly]) {
      await req(owner, 'patch', Q(id), { isActive: false }).expect(200);
    }
  });

  it('keeps explanations hidden before an attempt', async () => {
    const res = await req(student, 'get', Q(perQuestion)).expect(200);
    expect(res.body.feedback).toBe('PER_QUESTION');
    expect(JSON.stringify(res.body)).not.toContain('zxq-izoh');
  });

  it('after an attempt shows right/wrong and the explanation per question, not the answers', async () => {
    const res = await attempt(student, perQuestion, [
      { questionId: 'q1', optionIds: ['a'] },
      { questionId: 'q2', optionIds: ['a'] },
    ]).expect(201);
    expect(res.body.lastAttempt.review).toEqual([
      { questionId: 'q1', correct: true, explanation: 'zxq-izoh: h1 eng katta sarlavha' },
      { questionId: 'q2', correct: false, explanation: 'zxq-izoh: div va section blok' },
    ]);
    expect(JSON.stringify(res.body)).not.toContain('correct":[');
    // The review survives a reload.
    const again = await req(student, 'get', Q(perQuestion)).expect(200);
    expect(again.body.lastAttempt.review).toHaveLength(2);
  });

  it('TOTAL_ONLY quizzes give the score only', async () => {
    const res = await attempt(student, totalOnly, WRONG).expect(201);
    expect(res.body.feedback).toBe('TOTAL_ONLY');
    expect(res.body.lastAttempt.review).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toContain('zxq-izoh');
  });

  it('rejects an unknown feedback mode', async () => {
    await req(owner, 'patch', Q(perQuestion), { feedback: 'ALL_ANSWERS' }).expect(400);
  });
});

describe('course map', () => {
  it('lists learner-visible items per lesson with progress stats', async () => {
    const res = await req(student, 'get', `${course()}/map`).expect(200);
    const [first, second, third] = res.body.modules[0].lessons;
    expect(first.quizzes).toEqual([
      { id: quiz1, title: 'HTML testi', status: 'PASSED', bestScore: 100 },
    ]);
    expect(first.assignments).toEqual([
      expect.objectContaining({ title: 'Vizitka', status: 'PUBLISHED', submissionStatus: null }),
    ]);
    expect(second.exercises).toEqual([
      expect.objectContaining({ id: exercise2, title: 'Mashq', status: 'PASSED' }),
    ]);
    expect(third).toMatchObject({
      state: 'AVAILABLE',
      quizzes: [{ id: quiz3, status: 'NOT_STARTED' }],
    });
    expect(res.body.stats).toEqual({
      lessons: { done: 2, total: 3 },
      exercises: { done: 1, total: 1 },
      quizzes: { done: 2, total: 3 },
      assignments: { done: 0, total: 1 },
    });
    expect(res.body.progressPercent).toBe(67);
    expect(JSON.stringify(res.body)).not.toMatch(/Qoralama|correct/);
  });
});

describe('exercise mini-tests', () => {
  let mc: string;
  let lessonA: string;
  let lessonB: string;
  let ex: string;
  let mini: string;
  const base = () => `/orgs/${orgA}/courses/${mc}`;

  beforeAll(async () => {
    const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'Mini', slug: 'mini' });
    mc = c.body.course.id;
    const mod = await req(owner, 'post', `${base()}/modules`, { title: '1-modul' });
    const lesson = async (title: string) =>
      (await req(owner, 'post', `${base()}/modules/${mod.body.id}/lessons`, { title })).body.id;
    lessonA = await lesson('Ranglar');
    lessonB = await lesson('Shriftlar');
    ex = (
      await req(owner, 'post', `${base()}/lessons/${lessonA}/exercises`, {
        title: 'Rang mashqi',
      }).expect(201)
    ).body.id;
  });

  it('belongs to an exercise of the same lesson', async () => {
    const wrong = await req(owner, 'post', `${base()}/lessons/${lessonB}/quizzes`, {
      title: 'Mini',
      questions: QUESTIONS,
      isActive: true,
      exerciseId: ex,
    });
    expect(wrong.status).toBe(400);
    const res = await req(owner, 'post', `${base()}/lessons/${lessonA}/quizzes`, {
      title: 'Mashq mini-testi',
      questions: QUESTIONS,
      passingPercent: 100,
      isActive: true,
      exerciseId: ex,
    }).expect(201);
    expect(res.body.exerciseId).toBe(ex);
    mini = res.body.id;
    await req(owner, 'patch', base(), { status: 'PUBLISHED' }).expect(200);
    await req(student, 'post', `${base()}/enroll`).expect(201);
  });

  it('is shown with its exercise, not as a lesson quiz', async () => {
    const map = await req(student, 'get', `${base()}/map`).expect(200);
    const first = map.body.modules[0].lessons[0];
    expect(first.quizzes).toEqual([]);
    expect(first.exercises[0].miniQuizzes).toEqual([
      { id: mini, title: 'Mashq mini-testi', status: 'NOT_STARTED', bestScore: null },
    ]);
    expect(map.body.stats.quizzes).toEqual({ done: 0, total: 0 });
    const view = await req(student, 'get', `${base()}/exercises/${ex}`).expect(200);
    expect(view.body.miniQuizzes).toEqual([expect.objectContaining({ id: mini })]);
    const quiz = await req(student, 'get', `${base()}/quizzes/${mini}`).expect(200);
    expect(quiz.body.exerciseId).toBe(ex);
    expect(JSON.stringify(quiz.body)).not.toMatch(/correct"/);
  });

  it('never gates or completes the lesson', async () => {
    const passed = await req(student, 'post', `${base()}/quizzes/${mini}/attempts`, {
      answers: RIGHT,
    }).expect(201);
    expect(passed.body.status).toBe('PASSED');
    const statesOf = async () =>
      (await req(student, 'get', `${base()}/map`)).body.modules[0].lessons.map(
        (l: { state: string }) => l.state,
      );
    // Passing the mini-test alone does not complete the lesson (the exercise does).
    expect((await statesOf())[0]).not.toBe('COMPLETED');
    await req(student, 'post', `${base()}/quizzes/${mini}/attempts`, { answers: WRONG }).expect(
      201,
    );
    await req(owner, 'put', `${base()}/exercises/${ex}/students/${student.userId}/status`, {
      status: 'PASSED',
    }).expect(200);
    expect(await statesOf()).toEqual(['COMPLETED', 'AVAILABLE']);
  });

  it('disappears with its exercise', async () => {
    await req(owner, 'patch', `${base()}/exercises/${ex}`, { isActive: false }).expect(200);
    await req(student, 'get', `${base()}/quizzes/${mini}`).expect(404);
  });
});
