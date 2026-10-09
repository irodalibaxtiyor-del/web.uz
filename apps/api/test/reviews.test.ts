import type { CheckEngineResult, CheckRule, ProjectFile } from '@webdizayn/shared';
import { and, eq, like } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { CheckExecutor } from '../src/checks/check-executor';
import { CheckQueue } from '../src/checks/check-queue';
import { auditEvents, submissionReviews, users } from '../src/db/schema';
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

let ctx: TestContext;
let orgA: string;
let orgB: string;
let owner: Member;
let admin: Member;
let otherTeacher: Member;
let foreignTeacher: Member;
let student: Member;
let student2: Member;
let courseId: string;
let lessonId: string;
let rubricAssignment: string;
let plainAssignment: string;

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
const A = (id: string) => `${course()}/assignments/${id}`;
const S = (id: string, who: Member) => `${A(id)}/submissions/${who.userId}`;
const files = (html: string) => [{ path: 'index.html', content: html }];
const submitWork = async (who: Member, id: string, html: string) => {
  await req(who, 'put', `${A(id)}/draft`, { files: files(html) }).expect(200);
  return req(who, 'post', `${A(id)}/submit`).expect(201);
};
const scores = (a: number, b: number) => [
  { criterionId: 'layout', points: a },
  { criterionId: 'style', points: b },
];

beforeAll(async () => {
  ctx = await setup({}, { checkExecutor: new FakeExecutor() });
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  admin = await createMember(ctx, 'admin@a.uz', orgA, 'ORG_ADMIN');
  otherTeacher = await createMember(ctx, 'other@a.uz', orgA, 'TEACHER');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  student = await createMember(ctx, 'student@a.uz', orgA, 'STUDENT');
  student2 = await createMember(ctx, 'student2@a.uz', orgA, 'STUDENT');

  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'HTML', slug: 'html' });
  courseId = c.body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  lessonId = (
    await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Kirish' })
  ).body.id;
  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of [student, student2]) await req(s, 'post', `${course()}/enroll`).expect(201);

  const make = async (body: object) => {
    const res = await req(owner, 'post', `${course()}/lessons/${lessonId}/assignments`, {
      title: 'Sahifa',
      instructions: 'Sahifa yarating',
      ...body,
    }).expect(201);
    await req(owner, 'post', `${A(res.body.id)}/publish`).expect(200);
    return res.body.id as string;
  };
  rubricAssignment = await make({
    maxAttempts: 1,
    rubric: [
      { id: 'layout', title: 'Joylashuv', maxPoints: 60 },
      { id: 'style', title: 'Dizayn', maxPoints: 40 },
    ],
    checks: [
      { id: 'h1', title: 'Sarlavha bor', assert: { type: 'count', selector: 'h1' } },
      {
        id: 'secret',
        title: 'Yashirin shart',
        hidden: true,
        assert: { type: 'count', selector: 'footer' },
      },
    ],
  });
  plainAssignment = await make({ gradingPolicy: { maxScore: 10, passingScore: 6 } });
  await submitWork(student, rubricAssignment, '<h1>pass:h1</h1>');
  await ctx.app.get(CheckQueue).idle();
});
afterAll(async () => {
  await ctx.app.close();
});

describe('review access', () => {
  it('is limited to staff who manage the course', async () => {
    await req(student, 'get', S(rubricAssignment, student)).expect(403);
    await req(student, 'post', `${S(rubricAssignment, student)}/grade`, {
      version: 1,
      score: 100,
    }).expect(403);
    await req(otherTeacher, 'get', S(rubricAssignment, student)).expect(403);
    await req(
      foreignTeacher,
      'get',
      `${course(orgB)}/assignments/${rubricAssignment}/submissions/${student.userId}`,
    ).expect(404);
    await req(owner, 'get', S(rubricAssignment, student2)).expect(404);
    await req(owner, 'get', `${A(rubricAssignment)}/submissions/not-a-uuid`).expect(404);
    await req(admin, 'get', S(rubricAssignment, student)).expect(200);
  });

  it('shows versions, code and full CHECK detail including hidden checks', async () => {
    const res = await req(owner, 'get', S(rubricAssignment, student)).expect(200);
    expect(res.body).toMatchObject({
      status: 'SUBMITTED',
      score: null,
      student: { id: student.userId, fullName: 'student' },
      versions: [
        {
          version: 1,
          isLate: false,
          check: {
            status: 'FAILED',
            checks: [
              { id: 'h1', passed: true, hidden: false },
              { id: 'secret', title: 'Yashirin shart', passed: false, hidden: true },
            ],
          },
        },
      ],
      reviews: [],
    });
    const v1 = await req(owner, 'get', `${S(rubricAssignment, student)}/versions/1`).expect(200);
    expect(v1.body.files).toEqual(files('<h1>pass:h1</h1>'));
    await req(owner, 'get', `${S(rubricAssignment, student)}/versions/2`).expect(404);
  });
});

describe('review workflow', () => {
  const url = () => S(rubricAssignment, student);

  it('only allows starting a review from SUBMITTED, on the latest version', async () => {
    for (const action of ['grade', 'finalize', 'request-revision']) {
      const res = await req(owner, 'post', `${url()}/${action}`, {
        version: 1,
        feedback: 'x',
        scores: scores(1, 1),
      }).expect(409);
      expect(res.body.code).toBe('INVALID_TRANSITION');
    }
    const stale = await req(owner, 'post', `${url()}/start-review`, { version: 2 }).expect(409);
    expect(stale.body.code).toBe('STALE_VERSION');
    const res = await req(owner, 'post', `${url()}/start-review`, { version: 1 }).expect(200);
    expect(res.body.status).toBe('IN_REVIEW');
  });

  it('locks the student out while in review', async () => {
    const save = await req(student, 'put', `${A(rubricAssignment)}/draft`, {
      files: files('<h1>yangi</h1>'),
    }).expect(409);
    expect(save.body.code).toBe('SUBMISSION_LOCKED');
  });

  it('validates rubric scores', async () => {
    const bad = [
      { version: 1, scores: [{ criterionId: 'layout', points: 50 }] },
      { version: 1, scores: scores(61, 10) },
      { version: 1, scores: [...scores(1, 1), { criterionId: 'x', points: 1 }] },
      { version: 1, score: 80 },
      { version: 1 },
    ];
    for (const body of bad) {
      await req(owner, 'post', `${url()}/grade`, body).expect(400);
    }
  });

  it('requests a revision with mandatory feedback; the student sees it without the reviewer', async () => {
    await req(owner, 'post', `${url()}/request-revision`, { version: 1, feedback: '  ' }).expect(
      400,
    );
    const res = await req(owner, 'post', `${url()}/request-revision`, {
      version: 1,
      feedback: 'Rasmga alt qo‘shing',
    }).expect(200);
    expect(res.body.status).toBe('REVISION_REQUESTED');
    const view = await req(student, 'get', A(rubricAssignment)).expect(200);
    expect(view.body.review).toEqual({
      action: 'REVISION_REQUESTED',
      version: 1,
      feedback: 'Rasmga alt qo‘shing',
      createdAt: expect.any(String),
      grade: null,
    });
    expect(JSON.stringify(view.body)).not.toContain('owner');
  });

  it('a requested revision earns a resubmit beyond the attempt limit', async () => {
    const view = await req(student, 'get', A(rubricAssignment)).expect(200);
    expect(view.body.submission).toMatchObject({ attemptsUsed: 1, blockedBy: null });
    const res = await submitWork(student, rubricAssignment, '<h1>pass:h1</h1><footer>v2</footer>');
    expect(res.body.submission).toMatchObject({ status: 'SUBMITTED', attemptsUsed: 2 });
    // Back to SUBMITTED: the normal limit (1) applies again.
    expect(res.body.submission.blockedBy).toBe('ATTEMPTS_EXHAUSTED');
  });

  it('rejects actions based on an outdated version', async () => {
    const res = await req(owner, 'post', `${url()}/start-review`, { version: 1 }).expect(409);
    expect(res.body.code).toBe('STALE_VERSION');
    await req(owner, 'post', `${url()}/start-review`, { version: 2 }).expect(200);
  });

  it('grades by rubric; regrading is allowed until finalized', async () => {
    let res = await req(owner, 'post', `${url()}/grade`, {
      version: 2,
      scores: scores(50, 30),
      feedback: 'Yaxshi',
    }).expect(200);
    expect(res.body).toMatchObject({ status: 'GRADED', score: 80 });
    let view = await req(student, 'get', A(rubricAssignment)).expect(200);
    expect(view.body.review).toMatchObject({
      action: 'GRADED',
      version: 2,
      feedback: 'Yaxshi',
      grade: { score: 80, maxScore: 100, passed: true, final: false, scores: scores(50, 30) },
    });

    res = await req(owner, 'post', `${url()}/grade`, {
      version: 2,
      scores: scores(40, 10),
      feedback: 'Qayta ko‘rib chiqildi',
    }).expect(200);
    expect(res.body.score).toBe(50);
    view = await req(student, 'get', A(rubricAssignment)).expect(200);
    expect(view.body.review.grade).toMatchObject({ score: 50, passed: false });
    const overview = await req(owner, 'get', `${A(rubricAssignment)}/submissions`).expect(200);
    expect(
      overview.body.find((r: { userId: string }) => r.userId === student.userId),
    ).toMatchObject({ status: 'GRADED', score: 50 });
  });

  it('finalizes once; afterwards nothing changes', async () => {
    const results = await Promise.all([
      req(owner, 'post', `${url()}/finalize`, { version: 2 }),
      req(admin, 'post', `${url()}/finalize`, { version: 2 }),
    ]);
    expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
    const view = await req(student, 'get', A(rubricAssignment)).expect(200);
    expect(view.body.submission.status).toBe('FINALIZED');
    expect(view.body.review).toMatchObject({
      action: 'FINALIZED',
      feedback: 'Qayta ko‘rib chiqildi',
      grade: { score: 50, final: true, scores: scores(40, 10) },
    });
    for (const [action, body] of [
      ['grade', { version: 2, scores: scores(60, 40) }],
      ['request-revision', { version: 2, feedback: 'yana' }],
      ['finalize', { version: 2 }],
    ] as const) {
      await req(owner, 'post', `${url()}/${action}`, body).expect(409);
    }
    const submit = await req(student, 'post', `${A(rubricAssignment)}/submit`).expect(409);
    expect(submit.body.code).toBe('SUBMISSION_LOCKED');
  });

  it('keeps a complete, immutable history and audit trail', async () => {
    const res = await req(owner, 'get', url()).expect(200);
    expect(
      res.body.reviews.map((r: { action: string; version: number; score: number | null }) => [
        r.action,
        r.version,
        r.score,
      ]),
    ).toEqual([
      ['REVISION_REQUESTED', 1, null],
      ['GRADED', 2, 80],
      ['GRADED', 2, 50],
      ['FINALIZED', 2, 50],
    ]);
    expect(res.body.reviews[1].reviewerName).toBe('owner');
    await expect(ctx.handle.db.update(submissionReviews).set({ score: 100 })).rejects.toThrow();

    const audit = await ctx.handle.db
      .select({ action: auditEvents.action, metadata: auditEvents.metadata })
      .from(auditEvents)
      .where(
        and(eq(auditEvents.targetId, rubricAssignment), like(auditEvents.action, 'submission.%')),
      );
    const actions = audit.map((a) => a.action);
    for (const a of [
      'submission.review_start',
      'submission.revision_request',
      'submission.grade',
      'submission.finalize',
    ]) {
      expect(actions).toContain(a);
    }
    expect(audit.find((a) => a.action === 'submission.finalize')!.metadata).toMatchObject({
      studentId: student.userId,
      version: 2,
      score: 50,
    });
  });
});

describe('grading without a rubric', () => {
  it('takes a single score up to maxScore', async () => {
    await submitWork(student2, plainAssignment, '<p>ish</p>');
    const url = S(plainAssignment, student2);
    await req(owner, 'post', `${url}/start-review`, { version: 1 }).expect(200);
    await req(owner, 'post', `${url}/grade`, { version: 1, score: 11 }).expect(400);
    await req(owner, 'post', `${url}/grade`, { version: 1, scores: scores(1, 1) }).expect(400);
    const res = await req(admin, 'post', `${url}/grade`, { version: 1, score: 7 }).expect(200);
    expect(res.body).toMatchObject({ status: 'GRADED', score: 7 });
    const view = await req(student2, 'get', A(plainAssignment)).expect(200);
    expect(view.body.review.grade).toEqual({
      score: 7,
      maxScore: 10,
      passed: true,
      final: false,
      scores: null,
    });
  });

  it('deleting a reviewer account keeps the review (reviewer becomes null)', async () => {
    await ctx.handle.db.delete(users).where(eq(users.id, admin.userId));
    const res = await req(owner, 'get', S(plainAssignment, student2)).expect(200);
    expect(res.body.reviews).toEqual([
      expect.objectContaining({ action: 'GRADED', score: 7, reviewerName: null }),
    ]);
  });
});
