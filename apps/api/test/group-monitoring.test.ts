import type {
  CheckEngineResult,
  CheckRule,
  GroupOverview,
  ProjectFile,
  StudentDetail,
} from '@webdizayn/shared';
import { eq, sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { CheckExecutor } from '../src/checks/check-executor';
import { CheckQueue } from '../src/checks/check-queue';
import { unzip } from './unzip';
import { auditEvents, groupStudents, memberships, users } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

class FakeExecutor implements CheckExecutor {
  async run(files: ProjectFile[], rules: CheckRule[]): Promise<CheckEngineResult> {
    const html = files.find((f) => f.path === 'index.html')?.content ?? '';
    const results = rules.map((r) => ({ id: r.id, passed: html.includes(`pass:${r.id}`) }));
    return {
      status: results.every((r) => r.passed) ? 'PASSED' : 'FAILED',
      errorCode: null,
      results,
      durationMs: 1,
    };
  }
}

const RULES = [
  { id: 'h1', title: 'Sarlavha bor', assert: { type: 'count', selector: 'h1' } },
  {
    id: 'secret',
    title: 'Footer bor',
    hidden: true,
    assert: { type: 'count', selector: 'footer' },
  },
];

let ctx: TestContext;
let orgA: string;
let orgB: string;
let admin: Member;
let owner: Member;
let teacherA: Member;
let teacherB: Member;
let foreignTeacher: Member;
let s1: Member;
let s2: Member;
let s3: Member;
let groupA: string;
let groupB: string;
let courseId: string;
let ex1: string;
let quizId: string;
let assignmentId: string;

const req = (
  who: Member | null,
  method: 'get' | 'post' | 'put' | 'patch',
  path: string,
  body?: object,
) => {
  const r = ctx.http()[method](path);
  if (who) r.set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};
const G = (path = '', org = orgA) => `/orgs/${org}/groups${path}`;
const course = () => `/orgs/${orgA}/courses/${courseId}`;
const binary = (r: ReturnType<typeof req>) =>
  r.buffer(true).parse((res, cb) => {
    const chunks: Buffer[] = [];
    res.on('data', (c: Buffer) => chunks.push(c));
    res.on('end', () => cb(null, Buffer.concat(chunks)));
  });
const sheets = (buf: Buffer) => {
  const files = unzip(buf);
  return [1, 2, 3, 4].map((n) => files.get(`xl/worksheets/sheet${n}.xml`) ?? '');
};

beforeAll(async () => {
  ctx = await setup({}, { checkExecutor: new FakeExecutor() });
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  admin = await createMember(ctx, 'admin@a.uz', orgA, 'ORG_ADMIN');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  teacherA = await createMember(ctx, 'teacher-a@a.uz', orgA, 'TEACHER');
  teacherB = await createMember(ctx, 'teacher-b@a.uz', orgA, 'TEACHER');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  s1 = await createMember(ctx, 's1@a.uz', orgA, 'STUDENT');
  s2 = await createMember(ctx, 's2@a.uz', orgA, 'STUDENT');
  s3 = await createMember(ctx, 's3@a.uz', orgA, 'STUDENT');
  // A name an attacker might choose to try formula injection in the export.
  await ctx.handle.db
    .update(users)
    .set({ fullName: '=HYPERLINK("http://x","s2")' })
    .where(eq(users.id, s2.userId));

  await req(admin, 'post', `/orgs/${orgA}/admin/roster/import`, {
    groups: [
      { name: '8-24 ATT', students: ['BIR TALABA'] },
      { name: '9-24 ATT', students: ['IKKI TALABA'] },
    ],
  }).expect(200);
  const list = (await req(admin, 'get', `/orgs/${orgA}/admin/groups`).expect(200)).body as {
    id: string;
    name: string;
  }[];
  groupA = list.find((g) => g.name === '8-24 ATT')!.id;
  groupB = list.find((g) => g.name === '9-24 ATT')!.id;
  for (const [s, g] of [
    [s1, groupA],
    [s2, groupA],
    [s3, groupB],
  ] as const) {
    await req(admin, 'put', `/orgs/${orgA}/admin/students/${s.userId}/group`, {
      groupId: g,
    }).expect(200);
  }
  await req(admin, 'put', `/orgs/${orgA}/admin/teachers/${teacherA.userId}/groups`, {
    groupIds: [groupA],
  }).expect(200);
  await req(admin, 'put', `/orgs/${orgA}/admin/teachers/${teacherB.userId}/groups`, {
    groupIds: [groupB],
  }).expect(200);

  courseId = (await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'HTML', slug: 'html' }))
    .body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  const l1 = (
    await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Kirish' })
  ).body.id;
  const l2 = (
    await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Ro‘yxatlar' })
  ).body.id;
  ex1 = (
    await req(owner, 'post', `${course()}/lessons/${l1}/exercises`, {
      title: 'Sarlavha',
      checks: RULES,
    }).expect(201)
  ).body.id;
  await req(owner, 'post', `${course()}/lessons/${l2}/exercises`, {
    title: 'Ro‘yxat',
    checks: RULES,
  }).expect(201);
  quizId = (
    await req(owner, 'post', `${course()}/lessons/${l1}/quizzes`, {
      title: 'Kirish testi',
      passingPercent: 100,
      isActive: true,
      questions: [
        {
          id: 'q1',
          prompt: 'Sarlavha?',
          options: [
            { id: 'a', text: 'h1' },
            { id: 'b', text: 'p' },
          ],
          correct: ['a'],
        },
      ],
    }).expect(201)
  ).body.id;
  assignmentId = (
    await req(owner, 'post', `${course()}/lessons/${l1}/assignments`, {
      title: 'Vizitka',
      instructions: 'Sahifa yarating',
      gradingPolicy: { maxScore: 10, passingScore: 6 },
    }).expect(201)
  ).body.id;
  await req(owner, 'post', `${course()}/assignments/${assignmentId}/publish`).expect(200);
  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of [s1, s2, s3]) await req(s, 'post', `${course()}/enroll`).expect(201);

  // s1: three failed CHECKs, a failed quiz and a graded assignment.
  await req(s1, 'put', `${course()}/exercises/${ex1}/workspace`, {
    files: [{ path: 'index.html', content: '<p>salom</p>' }],
  }).expect(200);
  for (let i = 0; i < 3; i++) {
    await req(s1, 'post', `${course()}/exercises/${ex1}/checks`).expect(202);
    await ctx.app.get(CheckQueue).idle();
  }
  await req(s1, 'post', `${course()}/quizzes/${quizId}/attempts`, {
    answers: [{ questionId: 'q1', optionIds: ['b'] }],
  }).expect(201);
  const A = `${course()}/assignments/${assignmentId}`;
  await req(s1, 'put', `${A}/draft`, {
    files: [{ path: 'index.html', content: '<h1>Ali</h1>' }],
  }).expect(200);
  await req(s1, 'post', `${A}/submit`).expect(201);
  const S = `${A}/submissions/${s1.userId}`;
  await req(owner, 'post', `${S}/start-review`, { version: 1 }).expect(200);
  await req(owner, 'post', `${S}/grade`, { version: 1, score: 7, feedback: 'Yaxshi' }).expect(200);
  // Re-grading the same submission replaces the score, it never adds to it.
  await req(owner, 'post', `${S}/grade`, { version: 1, score: 8, feedback: 'Juda yaxshi' }).expect(
    200,
  );
});

afterAll(async () => {
  await ctx.app.close();
});

describe('group access', () => {
  it('a teacher sees only the groups an admin assigned', async () => {
    const mine = await req(teacherA, 'get', G()).expect(200);
    expect(mine.body.map((g: { name: string }) => g.name)).toEqual(['8-24 ATT']);
    await req(teacherA, 'get', G(`/${groupA}`)).expect(200);
    await req(teacherA, 'get', G(`/${groupB}`)).expect(404);
    await req(teacherA, 'get', G(`/${groupB}/students/${s3.userId}`)).expect(404);
    // A student of another group cannot be reached through an allowed group id.
    await req(teacherA, 'get', G(`/${groupA}/students/${s3.userId}`)).expect(404);
    await req(teacherB, 'get', G(`/${groupA}/students/${s1.userId}`)).expect(404);
  });

  it('teaching a course does not open the groups; others are kept out', async () => {
    expect((await req(owner, 'get', G()).expect(200)).body).toEqual([]);
    await req(owner, 'get', G(`/${groupA}`)).expect(404);
    await req(s1, 'get', G()).expect(403);
    await req(s1, 'get', G(`/${groupA}/students/${s1.userId}`)).expect(403);
    await req(foreignTeacher, 'get', G(`/${groupA}`)).expect(404);
    await req(foreignTeacher, 'get', G(`/${groupA}`, orgB)).expect(404);
    await req(null, 'get', G()).expect(401);
    await req(s1, 'get', G(`/${groupA}`))
      .set('x-role', 'ORG_ADMIN')
      .set('x-user-id', admin.userId)
      .expect(403);
    const all = await req(admin, 'get', G()).expect(200);
    expect(all.body).toHaveLength(2);
  });

  it('removing the assignment closes the group again', async () => {
    const t = await createMember(ctx, 'temp@a.uz', orgA, 'TEACHER');
    await req(admin, 'put', `/orgs/${orgA}/admin/teachers/${t.userId}/groups`, {
      groupIds: [groupA],
    }).expect(200);
    await req(t, 'get', G(`/${groupA}`)).expect(200);
    await req(admin, 'put', `/orgs/${orgA}/admin/teachers/${t.userId}/groups`, {
      groupIds: [],
    }).expect(200);
    await req(t, 'get', G(`/${groupA}`)).expect(404);
  });
});

describe('group overview', () => {
  it('reports progress, CHECK attempts, points and struggles per student', async () => {
    const o = (await req(teacherA, 'get', G(`/${groupA}`)).expect(200)).body as GroupOverview;
    expect(o.group.name).toBe('8-24 ATT');
    expect(o.courses).toEqual([
      {
        courseId,
        title: 'HTML',
        lessonsTotal: 2,
        modules: [
          {
            moduleId: expect.any(String),
            title: '1-modul',
            lessons: [
              { lessonId: expect.any(String), title: 'Kirish' },
              { lessonId: expect.any(String), title: 'Ro‘yxatlar' },
            ],
          },
        ],
      },
    ]);
    // The two moved-in students plus the one imported with the roster.
    expect(o.students).toHaveLength(3);
    expect(o.students.map((s) => s.userId)).toEqual(expect.arrayContaining([s1.userId, s2.userId]));
    const one = o.students.find((s) => s.userId === s1.userId)!;
    expect(one).toMatchObject({
      points: 8,
      maxPoints: 10,
      struggle: 'STRUGGLING',
      averagePercent: 0,
    });
    expect(one.courses[0]).toMatchObject({
      currentLesson: { title: 'Kirish', moduleTitle: '1-modul' },
      exercises: { total: 2, passed: 0 },
      checks: { runs: 3, passed: 0, failed: 3 },
      quizzes: { total: 1, passed: 0 },
      assignments: { available: 1, graded: 1, points: 8, maxPoints: 10 },
    });
    expect(one.lastActivityAt).not.toBeNull();
    const two = o.students.find((s) => s.userId === s2.userId)!;
    expect(two).toMatchObject({ struggle: 'INSUFFICIENT_DATA', points: 0, struggleCount: 0 });
    // No email, no password data in the panel.
    expect(JSON.stringify(o)).not.toMatch(/@a\.uz|password|argon/i);
  });

  it('shows each requirement, attempt and grade with its source', async () => {
    const d = (await req(teacherA, 'get', G(`/${groupA}/students/${s1.userId}`)).expect(200))
      .body as StudentDetail;
    expect(d.runResults).toBe('NOT_STORED');
    expect(d.points).toBe(8);
    const lesson = d.courses[0]!.lessons[0]!;
    expect(lesson.exercises[0]).toMatchObject({
      title: 'Sarlavha',
      status: 'NEEDS_IMPROVEMENT',
      checks: { runs: 3, failed: 3, lastStatus: 'FAILED' },
      unmet: [
        { title: 'Sarlavha bor', hidden: false },
        { title: 'Footer bor', hidden: true },
      ],
    });
    expect(lesson.quizzes[0]).toMatchObject({
      title: 'Kirish testi',
      attempts: 1,
      passed: false,
      bestPercent: 0,
    });
    expect(d.courses[0]!.assignments[0]).toMatchObject({
      title: 'Vizitka',
      status: 'GRADED',
      score: 8,
      maxScore: 10,
      versions: 1,
      gradedBy: 'owner',
      feedback: 'Juda yaxshi',
      final: false,
    });
    expect(d.struggles.map((s) => s.kind).sort()).toEqual([
      'QUIZ_NOT_PASSED',
      'REPEATED_CHECK_FAILURES',
    ]);
    const repeated = d.struggles.find((s) => s.kind === 'REPEATED_CHECK_FAILURES')!;
    expect(repeated).toMatchObject({
      itemTitle: 'Sarlavha',
      lessonTitle: 'Kirish',
      failedAttempts: 3,
    });
  });
});

describe('score export', () => {
  it('exports the chosen group as .xlsx with safe cells and an audit entry', async () => {
    const res = await binary(req(teacherA, 'get', G(`/export.xlsx?groupId=${groupA}`))).expect(200);
    expect(res.headers['content-type']).toContain('spreadsheetml');
    expect(res.headers['content-disposition']).toContain('ballar-8-24 ATT-');
    const [summary = '', scores = '', work = '', notes = ''] = sheets(res.body as Buffer);
    expect(summary).toContain('8-24 ATT');
    expect(summary).toContain('Eksport sanasi');
    expect(summary).toContain('s1');
    expect(summary).not.toContain('s3');
    expect(scores).toContain('Vizitka');
    expect(scores).toContain('Juda yaxshi');
    expect(work).toContain('Footer bor (yashirin)');
    expect(notes).toContain('RUN natijalari');
    // The formula-like name stays text: quotePrefix style, no formula element.
    expect(summary).toContain('t="inlineStr" s="2"><is><t xml:space="preserve">=HYPERLINK');
    expect(summary + scores + work).not.toMatch(/<f[ >]/);
    const [audit] = await ctx.handle.db
      .select({ metadata: auditEvents.metadata })
      .from(auditEvents)
      .where(eq(auditEvents.action, 'group.export'));
    expect(audit!.metadata).toMatchObject({ groupIds: [groupA], students: 3 });
  });

  it('exports all allowed groups, one student, and a date range', async () => {
    const all = sheets(
      (await binary(req(teacherA, 'get', G('/export.xlsx'))).expect(200)).body as Buffer,
    )[0]!;
    expect(all).toContain('8-24 ATT');
    expect(all).not.toContain('9-24 ATT');
    expect(all).not.toContain('s3');

    const one = sheets(
      (
        await binary(
          req(teacherA, 'get', G(`/export.xlsx?groupId=${groupA}&studentId=${s1.userId}`)),
        ).expect(200)
      ).body as Buffer,
    )[0]!;
    expect(one).toContain('s1');
    expect(one).not.toContain('HYPERLINK');

    // A range in the past: no CHECK runs and no grades fall inside it.
    const past = sheets(
      (
        await binary(
          req(teacherA, 'get', G(`/export.xlsx?groupId=${groupA}&from=2020-01-01&to=2020-01-31`)),
        ).expect(200)
      ).body as Buffer,
    );
    expect(past[1]).not.toContain('Juda yaxshi');
    // No data row has a "latest CHECK" cell (column K) inside that range.
    expect(past[2]).not.toMatch(/<c r="K(?:[7-9]|\d{2,})"/);
    expect(past[2]).toContain('Tuzatish kerak');
  });

  it('checks every filter against what the caller may see', async () => {
    await req(teacherA, 'get', G(`/export.xlsx?groupId=${groupB}`)).expect(404);
    await req(teacherA, 'get', G(`/export.xlsx?groupId=${groupA}&studentId=${s3.userId}`)).expect(
      404,
    );
    await req(teacherA, 'get', G(`/export.xlsx?studentId=${s1.userId}`)).expect(400);
    await req(teacherA, 'get', G(`/export.xlsx?moduleId=${groupA}`)).expect(400);
    await req(teacherA, 'get', G(`/export.xlsx?from=2026-02-01&to=2026-01-01`)).expect(400);
    await req(teacherA, 'get', G(`/export.xlsx?courseId=${groupA}`)).expect(404);
    await req(owner, 'get', G('/export.xlsx')).expect(404);
    await req(s1, 'get', G('/export.xlsx')).expect(403);
    await req(foreignTeacher, 'get', G('/export.xlsx', orgB)).expect(404);
  });
});

describe('roster integrity', () => {
  it('keeps one group per student and the counts in sync', async () => {
    const [n] = await ctx.handle.db
      .select({ n: sql<number>`count(*)::int` })
      .from(groupStudents)
      .where(eq(groupStudents.groupId, groupA));
    expect(n!.n).toBe(3);
    const members = await ctx.handle.db
      .select()
      .from(memberships)
      .where(eq(memberships.userId, s1.userId));
    expect(members).toHaveLength(1);
  });
});
