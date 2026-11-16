import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { assessmentAttempts, groups, groupStudents } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgA: string;
let orgB: string;
let owner: Member;
let otherTeacher: Member;
let foreignTeacher: Member;
let s1: Member;
let s2: Member;
let s3: Member;
let outsider: Member;
let courseId: string;

const QUESTIONS = [
  {
    id: 'q1',
    kind: 'SINGLE',
    prompt: 'Sarlavha tegi?',
    explanation: 'zxq-izoh',
    options: [
      { id: 'a', text: '<zxq-h1>' },
      { id: 'b', text: '<p>' },
    ],
    correct: ['a'],
  },
  { id: 'q2', kind: 'TRUE_FALSE', prompt: '<br> yopilmaydi', answer: true },
  {
    id: 'q3',
    kind: 'FILL_BLANK',
    prompt: 'To‘ldiring',
    template: 'Havola tegi {{1}}',
    blanks: [{ accepted: ['zxq-a'] }],
  },
  {
    id: 'q4',
    kind: 'ORDERING',
    prompt: 'Tartiblang',
    items: [
      { id: 'a', text: '<html>' },
      { id: 'b', text: '<head>' },
    ],
  },
];
const ALL_RIGHT = [
  { questionId: 'q1', optionIds: ['a'] },
  { questionId: 'q2', optionIds: ['true'] },
  { questionId: 'q3', texts: ['zxq-a'] },
  { questionId: 'q4', order: ['a', 'b'] },
];
const HALF = ALL_RIGHT.slice(0, 2);
const ONE = ALL_RIGHT.slice(0, 1);

const course = (org = orgA) => `/orgs/${org}/courses/${courseId}`;
const A = (slug: string, org = orgA) => `${course(org)}/assessments/${slug}`;
const req = (
  who: Member,
  method: 'get' | 'post' | 'put' | 'patch',
  path: string,
  body?: object,
) => {
  const r = ctx.http()[method](path).set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};
const save = (who: Member, slug: string, body: object = {}) =>
  req(who, 'put', A(slug), {
    title: slug === 'kirish' ? 'Kirish testi' : 'Yakuniy test',
    questions: QUESTIONS,
    isOpen: true,
    ...body,
  });
const take = async (who: Member, slug: string, answers: object[]) => {
  await req(who, 'post', `${A(slug)}/start`).expect(200);
  return req(who, 'post', `${A(slug)}/submit`, { answers });
};

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  otherTeacher = await createMember(ctx, 'other@a.uz', orgA, 'TEACHER');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  s1 = await createMember(ctx, 's1@a.uz', orgA, 'STUDENT');
  s2 = await createMember(ctx, 's2@a.uz', orgA, 'STUDENT');
  s3 = await createMember(ctx, 's3@a.uz', orgA, 'STUDENT');
  outsider = await createMember(ctx, 'outsider@a.uz', orgA, 'STUDENT');
  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'HTML', slug: 'html' });
  courseId = c.body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Teglar' });
  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of [s1, s2, s3]) await req(s, 'post', `${course()}/enroll`).expect(201);
  // s1 and s2 in group "E-1"; s3 in "N-1".
  const db = ctx.handle.db;
  const [e] = await db
    .insert(groups)
    .values({ organizationId: orgA, name: 'E-1', code: 'e-1' })
    .returning();
  const [n] = await db
    .insert(groups)
    .values({ organizationId: orgA, name: 'N-1', code: 'n-1' })
    .returning();
  await db.insert(groupStudents).values([
    { groupId: e!.id, organizationId: orgA, userId: s1.userId, rosterKey: 'S1' },
    { groupId: e!.id, organizationId: orgA, userId: s2.userId, rosterKey: 'S2' },
    { groupId: n!.id, organizationId: orgA, userId: s3.userId, rosterKey: 'S3' },
  ]);
});
afterAll(async () => {
  await ctx.app.close();
});

describe('authoring', () => {
  it('only course staff can author; other orgs get 404; unknown kind 404', async () => {
    await save(s1, 'kirish').expect(403);
    await save(otherTeacher, 'kirish').expect(403);
    await req(foreignTeacher, 'put', A('kirish', orgB), {
      title: 'Begona',
      questions: QUESTIONS,
    }).expect(404);
    await save(owner, 'oraliq').expect(404);
  });

  it('an open test needs questions; questions are validated', async () => {
    await save(owner, 'kirish', { questions: [] }).expect(400);
    await save(owner, 'kirish', { questions: [{ ...QUESTIONS[0], correct: ['z'] }] }).expect(400);
  });

  it('creates both tests; a closed test is invisible to students', async () => {
    const pre = await save(owner, 'kirish', { timeLimitMinutes: 20 }).expect(200);
    expect(pre.body).toMatchObject({ kind: 'PRETEST', isOpen: true, locked: false, started: 0 });
    await save(owner, 'yakuniy', { isOpen: false }).expect(200);
    const list = await req(owner, 'get', `${course()}/assessments`).expect(200);
    expect(list.body.map((x: { kind: string }) => x.kind)).toEqual(['PRETEST', 'POSTTEST']);
    await req(s1, 'get', A('yakuniy')).expect(404);
    const mine = await req(s1, 'get', `${course()}/assessments/mine`).expect(200);
    expect(mine.body).toEqual([
      { kind: 'PRETEST', title: 'Kirish testi', status: 'NOT_STARTED', score: null },
    ]);
  });
});

describe('taking a test', () => {
  it('refuses outsiders and other orgs', async () => {
    await req(outsider, 'get', A('kirish')).expect(403);
    await req(foreignTeacher, 'get', A('kirish', orgB)).expect(404);
  });

  it('shows questions only after starting, never answers or explanations', async () => {
    const before = await req(s1, 'get', A('kirish')).expect(200);
    expect(before.body).toMatchObject({ status: 'NOT_STARTED', questions: null, questionCount: 4 });
    const started = await req(s1, 'post', `${A('kirish')}/start`).expect(200);
    expect(started.body.status).toBe('IN_PROGRESS');
    expect(started.body.questions).toHaveLength(4);
    expect(started.body.deadline).not.toBeNull();
    const json = JSON.stringify(started.body);
    for (const secret of ['zxq-izoh', 'zxq-a', '"correct"', '"answer"', 'accepted']) {
      expect(json).not.toContain(secret);
    }
    // Starting again keeps the original clock.
    const again = await req(s1, 'post', `${A('kirish')}/start`).expect(200);
    expect(again.body.startedAt).toBe(started.body.startedAt);
  });

  it('freezes the questions once anyone started; availability can still change', async () => {
    const res = await save(owner, 'kirish', {
      timeLimitMinutes: 20,
      questions: QUESTIONS.slice(0, 2),
    }).expect(409);
    expect(res.body.code).toBe('ASSESSMENT_LOCKED');
    await save(owner, 'kirish', { timeLimitMinutes: 20, title: 'Diagnostik test' }).expect(200);
  });

  it('grades a single attempt without per-question feedback; a second submit is refused', async () => {
    const res = await req(s1, 'post', `${A('kirish')}/submit`, { answers: ONE }).expect(200);
    expect(res.body).toMatchObject({
      status: 'SUBMITTED',
      questions: null,
      result: { score: 25, correct: 1, total: 4, late: false },
    });
    expect(JSON.stringify(res.body)).not.toContain('review');
    const again = await req(s1, 'post', `${A('kirish')}/submit`, { answers: ALL_RIGHT }).expect(
      409,
    );
    expect(again.body.code).toBe('ASSESSMENT_SUBMITTED');
    await req(s2, 'post', `${A('kirish')}/submit`, { answers: ALL_RIGHT }).expect(409);
  });

  it('flags a submission after the time limit as late', async () => {
    await req(s2, 'post', `${A('kirish')}/start`).expect(200);
    await ctx.handle.db
      .update(assessmentAttempts)
      .set({ startedAt: new Date(Date.now() - 30 * 60_000) })
      .where(eq(assessmentAttempts.userId, s2.userId));
    const res = await req(s2, 'post', `${A('kirish')}/submit`, { answers: HALF }).expect(200);
    expect(res.body.result).toMatchObject({ score: 50, late: true });
  });
});

describe('results', () => {
  beforeAll(async () => {
    expect((await take(s3, 'kirish', HALF)).status).toBe(200);
    await save(owner, 'yakuniy', { isOpen: true }).expect(200);
    expect((await take(s1, 'yakuniy', ALL_RIGHT)).status).toBe(200); // 25 -> 100
    expect((await take(s2, 'yakuniy', ALL_RIGHT.slice(0, 3))).status).toBe(200); // 50 -> 75
    expect((await take(s3, 'yakuniy', ALL_RIGHT)).status).toBe(200); // 50 -> 100
  });

  it('pairs pre and post per student with gain, Hake g and a paired t test', async () => {
    const res = await req(owner, 'get', `${course()}/assessments/results`).expect(200);
    const byName = Object.fromEntries(
      res.body.rows.map((r: { name: string }) => [r.name.split(' ')[0], r]),
    );
    expect(res.body.rows).toHaveLength(3);
    const one = res.body.rows.find((r: { userId: string }) => r.userId === s1.userId);
    expect(one).toMatchObject({ pre: 25, post: 100, gain: 75, normalizedGain: 1, group: 'E-1' });
    const two = res.body.rows.find((r: { userId: string }) => r.userId === s2.userId);
    expect(two.normalizedGain).toBeCloseTo(0.5, 6);
    expect(res.body).toMatchObject({ paired: 3, preMean: 125 / 3, postMean: 275 / 3, df: 2 });
    expect(res.body.meanGain).toBeCloseTo(50, 6);
    expect(res.body.t).toBeGreaterThan(0);
    expect(res.body.p).toBeGreaterThan(0);
    expect(res.body.p).toBeLessThan(1);
    expect(byName).toBeTruthy();
    expect(JSON.stringify(res.body)).not.toContain('@a.uz');
  });

  it('filters by group', async () => {
    const list = await ctx.handle.db.select().from(groups).where(eq(groups.name, 'N-1'));
    const res = await req(
      owner,
      'get',
      `${course()}/assessments/results?groupId=${list[0]!.id}`,
    ).expect(200);
    expect(res.body.rows.map((r: { userId: string }) => r.userId)).toEqual([s3.userId]);
  });

  it('students see only their score; results are staff-only', async () => {
    const mine = await req(s1, 'get', `${course()}/assessments/mine`).expect(200);
    expect(mine.body).toEqual([
      { kind: 'PRETEST', title: 'Diagnostik test', status: 'SUBMITTED', score: 25 },
      { kind: 'POSTTEST', title: 'Yakuniy test', status: 'SUBMITTED', score: 100 },
    ]);
    await req(s1, 'get', `${course()}/assessments/results`).expect(403);
    await req(otherTeacher, 'get', `${course()}/assessments/results`).expect(403);
  });

  it('exports an .xlsx with results and statistics', async () => {
    const res = await req(owner, 'get', `${course()}/assessments/results.xlsx`)
      .buffer(true)
      .parse((r, cb) => {
        const chunks: Buffer[] = [];
        r.on('data', (c: Buffer) => chunks.push(c));
        r.on('end', () => cb(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect(res.headers['content-type']).toContain('spreadsheetml');
    expect((res.body as Buffer).subarray(0, 2).toString()).toBe('PK');
  });

  it('a closed test stays readable for those who submitted it', async () => {
    await save(owner, 'yakuniy', { isOpen: false }).expect(200);
    const res = await req(s1, 'get', A('yakuniy')).expect(200);
    expect(res.body).toMatchObject({ status: 'SUBMITTED', result: { score: 100 } });
    await req(outsider, 'get', A('yakuniy')).expect(403);
  });
});

describe('pedagogical experiment', () => {
  const E = () => `${course()}/experiment`;
  let eId: string;
  let nId: string;

  beforeAll(async () => {
    const all = await ctx.handle.db.select().from(groups);
    eId = all.find((g) => g.name === 'E-1')!.id;
    nId = all.find((g) => g.name === 'N-1')!.id;
  });

  it('lists the organization groups with enrolled students and no roles yet', async () => {
    const res = await req(owner, 'get', E()).expect(200);
    expect(res.body.groups).toEqual([
      { id: eId, name: 'E-1', students: 2, role: null },
      { id: nId, name: 'N-1', students: 1, role: null },
    ]);
    expect(res.body.conclusions[0]).toContain('belgilang');
  });

  it('marks groups and compares them on the pre-/post-tests', async () => {
    const res = await req(owner, 'put', `${E()}/groups`, {
      groups: [
        { groupId: eId, role: 'EXPERIMENT' },
        { groupId: nId, role: 'CONTROL' },
      ],
    }).expect(200);
    expect(res.body.groups.map((g: { role: string }) => g.role)).toEqual(['EXPERIMENT', 'CONTROL']);
    expect(res.body.stats.experiment.rows).toHaveLength(2);
    expect(res.body.stats.control.rows).toHaveLength(1);
    expect(res.body.stats.passRate.experiment).toEqual({ passed: 2, total: 2 });
    expect(res.body.conclusions.join(' ')).toContain('< 15');
    expect(JSON.stringify(res.body)).not.toContain('@a.uz');
  });

  it('refuses groups of another organization, students and unassigned teachers', async () => {
    const [foreign] = await ctx.handle.db
      .insert(groups)
      .values({ organizationId: orgB, name: 'B-1', code: 'b-1' })
      .returning();
    await req(owner, 'put', `${E()}/groups`, {
      groups: [{ groupId: foreign!.id, role: 'CONTROL' }],
    }).expect(404);
    await req(s1, 'get', E()).expect(403);
    await req(otherTeacher, 'get', E()).expect(403);
    await req(foreignTeacher, 'get', `${course(orgB)}/experiment`).expect(404);
  });

  it('exports the report and removes a group with a null role', async () => {
    const res = await req(owner, 'get', `${E()}/report.xlsx`)
      .buffer(true)
      .parse((r, cb) => {
        const chunks: Buffer[] = [];
        r.on('data', (c: Buffer) => chunks.push(c));
        r.on('end', () => cb(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect((res.body as Buffer).subarray(0, 2).toString()).toBe('PK');
    const off = await req(owner, 'put', `${E()}/groups`, {
      groups: [{ groupId: nId, role: null }],
    }).expect(200);
    expect(off.body.groups.find((g: { id: string }) => g.id === nId).role).toBeNull();
  });
});

describe('item analysis', () => {
  it('reports pre-/post-tests and lesson quizzes using first attempts only', async () => {
    const struct = await req(owner, 'get', `${course()}/structure`).expect(200);
    const lessonId = struct.body.modules[0].lessons[0].id;
    const q = await req(owner, 'post', `${course()}/lessons/${lessonId}/quizzes`, {
      title: 'Dars testi',
      questions: QUESTIONS.slice(0, 2),
      isActive: true,
    }).expect(201);
    const Q = `${course()}/quizzes/${q.body.id}/attempts`;
    // s1: first attempt wrong, second right — only the first must count.
    await req(s1, 'post', Q, { answers: [{ questionId: 'q1', optionIds: ['b'] }] }).expect(201);
    await req(s1, 'post', Q, { answers: ALL_RIGHT.slice(0, 2) }).expect(201);
    await req(s2, 'post', Q, { answers: ALL_RIGHT.slice(0, 2) }).expect(201);

    const res = await req(owner, 'get', `${course()}/item-analysis`).expect(200);
    const sources = res.body.instruments.map((x: { source: string }) => x.source);
    expect(sources).toEqual(['PRETEST', 'POSTTEST', 'QUIZ']);
    const quiz = res.body.instruments.find((x: { source: string }) => x.source === 'QUIZ');
    expect(quiz).toMatchObject({ respondents: 2, lessonTitle: 'Teglar', reliability: null });
    const q1 = quiz.questions.find((x: { id: string }) => x.id === 'q1');
    expect(q1).toMatchObject({ n: 2, difficulty: 0.5, discrimination: null, flag: null });
    expect(res.body.byKind).toEqual([]);
    expect(JSON.stringify(res.body)).not.toContain('"correct":[');
  });

  it('is staff-only and exports an .xlsx', async () => {
    await req(s1, 'get', `${course()}/item-analysis`).expect(403);
    await req(otherTeacher, 'get', `${course()}/item-analysis`).expect(403);
    const res = await req(owner, 'get', `${course()}/item-analysis/report.xlsx`)
      .buffer(true)
      .parse((r, cb) => {
        const chunks: Buffer[] = [];
        r.on('data', (c: Buffer) => chunks.push(c));
        r.on('end', () => cb(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect((res.body as Buffer).subarray(0, 2).toString()).toBe('PK');
  });
});
