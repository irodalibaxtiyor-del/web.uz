import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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
