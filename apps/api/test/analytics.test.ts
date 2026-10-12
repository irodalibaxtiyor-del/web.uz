import { checkRulesSchema } from '@webdizayn/shared';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { checkRuns, enrollments } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgA: string;
let orgB: string;
let owner: Member;
let otherTeacher: Member;
let admin: Member;
let adminB: Member;
let foreignTeacher: Member;
let s1: Member;
let s2: Member;
let s3: Member;
let studentB: Member;
let courseId: string;
let l1: string;
let l2: string;
let l3: string;
let e1: string;
let assignmentId: string;

const HIDDEN_TITLE = 'Maxfiy tekshiruv nomi';
const RULES = checkRulesSchema.parse([
  { id: 'r1', title: 'Sarlavha bor', assert: { type: 'count', selector: 'h1', min: 1 } },
  {
    id: 'r2',
    title: HIDDEN_TITLE,
    hidden: true,
    assert: { type: 'count', selector: '.maxfiy-selektor', min: 1 },
  },
]);

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
const files = (html: string) => [{ path: 'index.html', content: html }];
const A = (id: string) => `${course()}/assignments/${id}`;
const S = (who: Member) => `${A(assignmentId)}/submissions/${who.userId}`;

async function run(who: Member, status: 'PASSED' | 'FAILED' | 'TIMEOUT', failed: string[] = []) {
  await ctx.handle.db.insert(checkRuns).values({
    userId: who.userId,
    exerciseId: e1,
    courseId,
    status,
    errorCode: status === 'TIMEOUT' ? 'LOAD_TIMEOUT' : null,
    files: files('<h1>Salom</h1>'),
    rules: RULES,
    results:
      status === 'TIMEOUT' ? [] : RULES.map((r) => ({ id: r.id, passed: !failed.includes(r.id) })),
    finishedAt: new Date(),
  });
}

async function submit(who: Member, html: string) {
  await req(who, 'put', `${A(assignmentId)}/draft`, { files: files(html) }).expect(200);
  await req(who, 'post', `${A(assignmentId)}/submit`).expect(201);
}

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  otherTeacher = await createMember(ctx, 'other@a.uz', orgA, 'TEACHER');
  admin = await createMember(ctx, 'admin@a.uz', orgA, 'ORG_ADMIN');
  adminB = await createMember(ctx, 'admin@b.uz', orgB, 'ORG_ADMIN');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  s1 = await createMember(ctx, 'aziza@a.uz', orgA, 'STUDENT');
  s2 = await createMember(ctx, 'bobur@a.uz', orgA, 'STUDENT');
  s3 = await createMember(ctx, 'dilnoza@a.uz', orgA, 'STUDENT');
  studentB = await createMember(ctx, 'student@b.uz', orgB, 'STUDENT');

  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'HTML', slug: 'html' });
  courseId = c.body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  const lesson = async (title: string) =>
    (await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title })).body.id;
  l1 = await lesson('Teglar');
  l2 = await lesson('Bloklar');
  l3 = await lesson('Formalar');
  e1 = (await req(owner, 'post', `${course()}/lessons/${l1}/exercises`, { title: 'Sarlavha' })).body
    .id;
  const quiz = await req(owner, 'post', `${course()}/lessons/${l2}/quizzes`, {
    title: 'Bloklar testi',
    passingPercent: 100,
    isActive: true,
    questions: [
      {
        id: 'q1',
        prompt: 'Blok element?',
        options: [
          { id: 'a', text: '<div>' },
          { id: 'b', text: '<span>' },
        ],
        correct: ['a'],
      },
    ],
  });
  const asg = await req(owner, 'post', `${course()}/lessons/${l1}/assignments`, {
    title: 'Vizitka',
    instructions: 'Sahifa yarating',
    gradingPolicy: { maxScore: 100, passingScore: 60, allowLate: false },
  }).expect(201);
  assignmentId = asg.body.id;
  await req(owner, 'post', `${A(assignmentId)}/publish`).expect(200);
  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of [s1, s2, s3]) await req(s, 'post', `${course()}/enroll`).expect(201);

  // s1: failed, then passed the exercise; passed the quiz; graded 80/100. Progress 2/3.
  await run(s1, 'FAILED', ['r1']);
  await run(s1, 'PASSED');
  const status = (who: Member, value: string) =>
    req(owner, 'put', `${course()}/exercises/${e1}/students/${who.userId}/status`, {
      status: value,
    }).expect(200);
  await status(s1, 'PASSED');
  await req(s1, 'post', `${course()}/quizzes/${quiz.body.id}/attempts`, {
    answers: [{ questionId: 'q1', optionIds: ['a'] }],
  }).expect(201);
  await submit(s1, '<h1>Aziza</h1>');
  await req(owner, 'post', `${S(s1)}/start-review`, { version: 1 }).expect(200);
  await req(owner, 'post', `${S(s1)}/grade`, { version: 1, score: 80 }).expect(200);

  // s2: stuck on the exercise (3 failures + a timeout), needs improvement, revision requested.
  await run(s2, 'FAILED', ['r1', 'r2']);
  await run(s2, 'FAILED', ['r1']);
  await run(s2, 'FAILED', ['r1']);
  await run(s2, 'TIMEOUT');
  await status(s2, 'NEEDS_IMPROVEMENT');
  await submit(s2, '<p>Bobur</p>');
  await req(owner, 'post', `${S(s2)}/start-review`, { version: 1 }).expect(200);
  await req(owner, 'post', `${S(s2)}/request-revision`, {
    version: 1,
    feedback: 'Sarlavha qo‘shing',
  }).expect(200);

  // s3: enrolled a month ago and never did anything.
  await ctx.handle.db
    .update(enrollments)
    .set({ createdAt: new Date(Date.now() - 30 * 86_400_000) })
    .where(eq(enrollments.userId, s3.userId));
});
afterAll(async () => {
  await ctx.app.close();
});

describe('student analytics', () => {
  it('requires a session', async () => {
    await ctx.http().get('/analytics/me').expect(401);
  });

  it('reports the session user’s own progress, CHECK, quiz and assignment numbers', async () => {
    const res = await req(s1, 'get', '/analytics/me').expect(200);
    expect(res.body.aiUsage).toEqual({ available: false });
    expect(res.body.courses).toHaveLength(1);
    const c = res.body.courses[0];
    expect(c).toMatchObject({
      courseId,
      organizationId: orgA,
      progress: { lessonsCompleted: 2, lessonsTotal: 3, percent: 67, completed: false },
      exercises: { total: 1, passed: 1, needsImprovement: 0 },
      checks: { runs: 2, passed: 1, failed: 1, errored: 0, successRate: 0.5, firstTryRate: 0 },
      assignments: { available: 1, submitted: 1, graded: 1, averageScore: 0.8 },
      quizzes: { total: 1, passed: 1, averageBest: 1 },
      weakTopics: [],
    });
    expect(c.lastActivityAt).toEqual(expect.any(String));
    expect(res.body.trend).toHaveLength(8);
    const thisWeek = res.body.trend.at(-1);
    expect(thisWeek).toMatchObject({ checkRuns: 2, checksPassed: 1, lessonsCompleted: 2 });
  });

  it('finds weak topics without exposing CHECK rule details', async () => {
    const res = await req(s2, 'get', '/analytics/me').expect(200);
    const c = res.body.courses[0];
    expect(c.checks).toMatchObject({ runs: 4, passed: 0, failed: 3, errored: 1, successRate: 0 });
    expect(c.weakTopics).toEqual([
      {
        lessonId: l1,
        lessonTitle: 'Teglar',
        moduleTitle: '1-modul',
        failedChecks: 3,
        needsImprovement: 1,
        failedQuizAttempts: 0,
      },
    ]);
    expect(c.assignments).toMatchObject({ submitted: 1, graded: 0, revisionsRequested: 1 });
    const json = JSON.stringify(res.body);
    for (const secret of [HIDDEN_TITLE, 'Sarlavha bor', '.maxfiy-selektor', 'r2']) {
      expect(json).not.toContain(secret);
    }
  });

  it('never mixes in other students or other organizations', async () => {
    const res = await req(studentB, 'get', '/analytics/me').expect(200);
    expect(res.body.courses).toEqual([]);
    expect(res.body.trend.every((p: { checkRuns: number }) => p.checkRuns === 0)).toBe(true);
    // Spoofed identity headers are ignored.
    const spoof = await ctx
      .http()
      .get('/analytics/me')
      .set('Cookie', s3.cookie)
      .set('x-user-id', s1.userId)
      .expect(200);
    expect(spoof.body.courses[0].checks.runs).toBe(0);
  });
});

describe('course analytics (teacher)', () => {
  it('is limited to the course’s teachers and org admins', async () => {
    await req(s1, 'get', `${course()}/analytics`).expect(403);
    await req(otherTeacher, 'get', `${course()}/analytics`).expect(403);
    await req(foreignTeacher, 'get', `${course()}/analytics`).expect(404);
    await req(foreignTeacher, 'get', `${course(orgB)}/analytics`).expect(404);
    await req(admin, 'get', `${course()}/analytics`).expect(200);
  });

  it('shows class progress, bottlenecks and common errors', async () => {
    const res = await req(owner, 'get', `${course()}/analytics`).expect(200);
    const b = res.body;
    expect(b.students).toBe(3);
    expect(b.progress.averagePercent).toBe(22);
    expect(b.progress.completedCount).toBe(0);
    const dist = Object.fromEntries(
      b.progress.distribution.map((d: { bucket: string; count: number }) => [d.bucket, d.count]),
    );
    expect(dist).toMatchObject({ '0': 2, '50-74': 1, '100': 0 });
    expect(b.bottlenecks).toEqual([
      expect.objectContaining({ lessonId: l1, stuckStudents: 2, checkFailRate: 0.8 }),
      expect.objectContaining({ lessonId: l3, stuckStudents: 1, checkFailRate: null }),
    ]);
    expect(b.commonErrors[0]).toMatchObject({
      exerciseId: e1,
      ruleId: 'r1',
      ruleTitle: 'Sarlavha bor',
      failedRuns: 4,
      students: 2,
    });
    // Staff may see hidden rule titles, flagged as hidden.
    expect(b.commonErrors[1]).toMatchObject({ ruleId: 'r2', hidden: true, students: 1 });
    expect(b.checkIssues).toEqual({ timeouts: 1, errors: 0 });
  });

  it('shows assignment status, revision rate and struggling students', async () => {
    const res = await req(owner, 'get', `${course()}/analytics`).expect(200);
    const b = res.body;
    expect(b.assignments).toHaveLength(1);
    expect(b.assignments[0]).toMatchObject({
      assignmentId,
      notSubmitted: 1,
      averageScore: 0.8,
      revisionRate: 0.5,
    });
    expect(b.assignments[0].statuses).toMatchObject({ GRADED: 1, REVISION_REQUESTED: 1 });
    expect(b.revisions).toEqual({ reviewed: 2, revisionRequested: 1, rate: 0.5 });

    const struggling = b.strugglingStudents as { userId: string; reasons: string[] }[];
    expect(struggling.map((s) => s.userId)).toEqual([s2.userId, s3.userId]);
    expect(struggling[0]!.reasons).toEqual([
      'STUCK_ON_CHECK',
      'NEEDS_IMPROVEMENT',
      'REVISION_REQUESTED',
    ]);
    expect(struggling[1]!.reasons).toEqual(['INACTIVE']);
    // Names only: no emails leave the server.
    expect(JSON.stringify(b)).not.toContain('@');
  });
});

describe('organization analytics', () => {
  it('is for org admins only', async () => {
    await req(owner, 'get', `/orgs/${orgA}/analytics`).expect(403);
    await req(s1, 'get', `/orgs/${orgA}/analytics`).expect(403);
    await req(adminB, 'get', `/orgs/${orgA}/analytics`).expect(404);
  });

  it('summarizes course activity, engagement and teacher activity', async () => {
    const res = await req(admin, 'get', `/orgs/${orgA}/analytics`).expect(200);
    const b = res.body;
    expect(b.members).toEqual({ students: 3, teachers: 2, admins: 1 });
    expect(b.engagement).toEqual({ enrolledStudents: 3, activeLast7: 2, activeLast30: 2 });
    expect(b.completion).toEqual({ enrollments: 3, completed: 0, rate: 0 });
    expect(b.courses).toEqual([
      expect.objectContaining({
        courseId,
        students: 3,
        activeLast30: 2,
        averagePercent: 22,
        checkRunsLast30: 6,
        submissionsLast30: 2,
      }),
    ]);
    const ownerRow = b.teachers.find((t: { userId: string }) => t.userId === owner.userId);
    expect(ownerRow).toMatchObject({
      courses: 1,
      reviewsTotal: 2,
      reviewsLast30: 2,
      pendingReviews: 0,
    });
    expect(ownerRow.lastReviewAt).toEqual(expect.any(String));
    const other = b.teachers.find((t: { userId: string }) => t.userId === otherTeacher.userId);
    expect(other).toMatchObject({ courses: 0, reviewsTotal: 0, lastReviewAt: null });
    expect(b.trend.at(-1).activeStudents).toBe(2);
    expect(JSON.stringify(b)).not.toContain('@');
  });

  it('keeps organizations apart', async () => {
    const res = await req(adminB, 'get', `/orgs/${orgB}/analytics`).expect(200);
    expect(res.body.courses).toEqual([]);
    expect(res.body.engagement).toEqual({ enrolledStudents: 0, activeLast7: 0, activeLast30: 0 });
    expect(res.body.completion.rate).toBeNull();
    expect(res.body.teachers.map((t: { userId: string }) => t.userId).sort()).toEqual(
      [adminB.userId, foreignTeacher.userId].sort(),
    );
  });
});
