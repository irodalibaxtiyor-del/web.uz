import { surveyTemplate } from '@webdizayn/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { courseExperimentGroups, groups, groupStudents } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgA: string;
let orgB: string;
let owner: Member;
let otherTeacher: Member;
let foreignTeacher: Member;
let students: Member[];
let outsider: Member;
let courseId: string;
let surveyId: string;

const course = (org = orgA) => `/orgs/${org}/courses/${courseId}`;
const S = (id = surveyId, org = orgA) => `${course(org)}/surveys/${id}`;
const req = (
  who: Member,
  method: 'get' | 'post' | 'put' | 'patch',
  path: string,
  body?: object,
) => {
  const r = ctx.http()[method](path).set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};

const ITEMS = [
  { id: 'a', text: 'Darslar qiziqarli', kind: 'LIKERT', scale: 'Motivatsiya' },
  { id: 'b', text: 'Mashq qilishni xohlayman', kind: 'LIKERT', scale: 'Motivatsiya' },
  { id: 'c', text: 'Darslar zerikarli', kind: 'LIKERT', scale: 'Motivatsiya', reverse: true },
  { id: 't', text: 'Taklifingiz', kind: 'TEXT', required: false },
];

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  otherTeacher = await createMember(ctx, 'other@a.uz', orgA, 'TEACHER');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  students = [];
  for (let i = 1; i <= 4; i++) {
    students.push(await createMember(ctx, `s${i}@a.uz`, orgA, 'STUDENT'));
  }
  outsider = await createMember(ctx, 'outsider@a.uz', orgA, 'STUDENT');
  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'HTML', slug: 'html' });
  courseId = c.body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Teglar' });
  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of students) await req(s, 'post', `${course()}/enroll`).expect(201);
  // s1, s2 experimental; s3, s4 control.
  const db = ctx.handle.db;
  const [e] = await db
    .insert(groups)
    .values({ organizationId: orgA, name: 'E', code: 'e' })
    .returning();
  const [k] = await db
    .insert(groups)
    .values({ organizationId: orgA, name: 'K', code: 'k' })
    .returning();
  await db.insert(groupStudents).values(
    students.map((s, i) => ({
      groupId: i < 2 ? e!.id : k!.id,
      organizationId: orgA,
      userId: s.userId,
      rosterKey: `S${i}`,
    })),
  );
  await db.insert(courseExperimentGroups).values([
    { courseId, groupId: e!.id, role: 'EXPERIMENT' },
    { courseId, groupId: k!.id, role: 'CONTROL' },
  ]);
});
afterAll(async () => {
  await ctx.app.close();
});

describe('surveys', () => {
  it('the built-in template can be created as is', async () => {
    const res = await req(owner, 'post', `${course()}/surveys`, surveyTemplate()).expect(201);
    expect(res.body.items).toHaveLength(12);
  });

  it('only course staff can author; an open survey needs items', async () => {
    const body = { title: 'Motivatsiya', items: ITEMS };
    await req(students[0]!, 'post', `${course()}/surveys`, body).expect(403);
    await req(otherTeacher, 'post', `${course()}/surveys`, body).expect(403);
    await req(foreignTeacher, 'post', `${course(orgB)}/surveys`, body).expect(404);
    await req(owner, 'post', `${course()}/surveys`, { title: 'Bo‘sh', isOpen: true }).expect(400);
    const res = await req(owner, 'post', `${course()}/surveys`, { ...body, phase: 'PRE' }).expect(
      201,
    );
    surveyId = res.body.id;
    expect(res.body).toMatchObject({ anonymous: true, isOpen: false, locked: false });
  });

  it('a closed survey is hidden; an open one is listed for enrolled students only', async () => {
    await req(students[0]!, 'get', S()).expect(404);
    await req(owner, 'patch', S(), { isOpen: true }).expect(200);
    const mine = await req(students[0]!, 'get', `${course()}/surveys/mine`).expect(200);
    expect(mine.body).toEqual([
      { id: surveyId, title: 'Motivatsiya', phase: 'PRE', answered: false },
    ]);
    await req(outsider, 'get', S()).expect(403);
  });

  it('students do not see reverse flags or subscales', async () => {
    const res = await req(students[0]!, 'get', S()).expect(200);
    const json = JSON.stringify(res.body);
    expect(json).not.toContain('reverse');
    expect(json).not.toContain('"scale"');
  });

  it('validates and stores one response per student', async () => {
    await req(students[0]!, 'post', `${S()}/responses`, { answers: { a: 5, b: 5 } }).expect(400);
    await req(students[0]!, 'post', `${S()}/responses`, { answers: { a: 9, b: 5, c: 1 } }).expect(
      400,
    );
    const ok = await req(students[0]!, 'post', `${S()}/responses`, {
      answers: { a: 5, b: 5, c: 1, t: '  Zo‘r  ' },
    }).expect(201);
    expect(ok.body.answered).toBe(true);
    const again = await req(students[0]!, 'post', `${S()}/responses`, {
      answers: { a: 1, b: 1, c: 5 },
    }).expect(409);
    expect(again.body.code).toBe('SURVEY_ANSWERED');
    const answers = [
      { a: 4, b: 5, c: 2 },
      { a: 2, b: 2, c: 4 },
      { a: 3, b: 2, c: 4 },
    ];
    for (let i = 1; i < 4; i++) {
      await req(students[i]!, 'post', `${S()}/responses`, { answers: answers[i - 1] }).expect(201);
    }
  });

  it('freezes the items after the first response', async () => {
    const res = await req(owner, 'patch', S(), { items: ITEMS.slice(0, 2) }).expect(409);
    expect(res.body.code).toBe('SURVEY_LOCKED');
    await req(owner, 'patch', S(), { title: 'O‘quv motivatsiyasi', items: ITEMS }).expect(200);
  });

  it('reports items, reliability and the experimental/control comparison without names', async () => {
    const res = await req(owner, 'get', `${S()}/results`).expect(200);
    expect(res.body).toMatchObject({ respondents: 4, enrolled: 4 });
    const scale = res.body.scales[0];
    expect(scale).toMatchObject({ scale: 'Motivatsiya', items: 3, n: 4 });
    expect(scale.alpha).toBeGreaterThan(0.8);
    expect(scale.experiment.n).toBe(2);
    expect(scale.control.n).toBe(2);
    expect(scale.experiment.mean).toBeGreaterThan(scale.control.mean);
    expect(res.body.items.find((i: { id: string }) => i.id === 't').texts).toEqual(['Zo‘r']);
    expect(JSON.stringify(res.body)).not.toMatch(/@a\.uz|userId/);
    await req(students[0]!, 'get', `${S()}/results`).expect(403);
  });

  it('exports an .xlsx', async () => {
    const res = await req(owner, 'get', `${S()}/results.xlsx`)
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
