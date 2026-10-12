import type { CheckEngineResult, CheckRule, ProjectFile } from '@webdizayn/shared';
import { and, eq, sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AssignmentsService, submitState } from '../src/assignments/assignments.service';
import type { CheckExecutor } from '../src/checks/check-executor';
import { CheckQueue } from '../src/checks/check-queue';
import { auditEvents, submissionChecks, submissions, submissionVersions } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

/** A rule passes when index.html contains `pass:<rule id>`. */
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
let otherTeacher: Member;
let foreignTeacher: Member;
let student: Member;
let student2: Member;
let outsider: Member;
let courseId: string;
let l1: string;
let l2: string;

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
const files = (html: string) => [{ path: 'index.html', content: html }];

/** Creates and publishes an assignment on lesson 1. */
async function published(body: object = {}, lessonId = l1): Promise<string> {
  const res = await req(owner, 'post', `${course()}/lessons/${lessonId}/assignments`, {
    title: 'Shaxsiy sahifa',
    instructions: 'O‘zingiz haqingizda sahifa yarating',
    ...body,
  }).expect(201);
  await req(owner, 'post', `${A(res.body.id)}/publish`).expect(200);
  return res.body.id;
}
const submit = (who: Member, id: string) => req(who, 'post', `${A(id)}/submit`);
const saveDraft = (who: Member, id: string, html: string) =>
  req(who, 'put', `${A(id)}/draft`, { files: files(html) });

beforeAll(async () => {
  ctx = await setup({}, { checkExecutor: new FakeExecutor() });
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
  l1 = (await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Kirish' }))
    .body.id;
  l2 = (await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Davomi' }))
    .body.id;
  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of [student, student2]) await req(s, 'post', `${course()}/enroll`).expect(201);
});
afterAll(async () => {
  await ctx.app.close();
});

describe('submitState', () => {
  const base = {
    status: 'PUBLISHED' as const,
    deadline: null,
    maxAttempts: 2,
    gradingPolicy: { maxScore: 100, passingScore: 60, allowLate: false },
  };
  const past = new Date(Date.now() - 60_000);

  it('applies closed, locked, attempts and deadline rules in order', () => {
    expect(submitState(base, { status: 'DRAFT' }, 0)).toEqual({ blockedBy: null, late: false });
    expect(submitState({ ...base, status: 'CLOSED' }, { status: 'DRAFT' }, 0).blockedBy).toBe(
      'ASSIGNMENT_CLOSED',
    );
    for (const s of ['IN_REVIEW', 'GRADED', 'FINALIZED'] as const) {
      expect(submitState(base, { status: s }, 0).blockedBy).toBe('SUBMISSION_LOCKED');
    }
    expect(submitState(base, { status: 'SUBMITTED' }, 2).blockedBy).toBe('ATTEMPTS_EXHAUSTED');
    expect(submitState({ ...base, deadline: past }, { status: 'DRAFT' }, 0).blockedBy).toBe(
      'DEADLINE_PASSED',
    );
    const lateOk = {
      ...base,
      deadline: past,
      gradingPolicy: { ...base.gradingPolicy, allowLate: true },
    };
    expect(submitState(lateOk, { status: 'DRAFT' }, 0)).toEqual({ blockedBy: null, late: true });
    expect(submitState({ ...base, deadline: past }, { status: 'REVISION_REQUESTED' }, 1)).toEqual({
      blockedBy: null,
      late: false,
    });
  });
});

describe('assignment authoring', () => {
  let draftId: string;

  it('creates a DRAFT with defaults; validates rubric against max score', async () => {
    const res = await req(owner, 'post', `${course()}/lessons/${l1}/assignments`, {
      title: 'Qoralama topshiriq',
    }).expect(201);
    expect(res.body).toMatchObject({
      status: 'DRAFT',
      maxAttempts: 3,
      deadline: null,
      submittedCount: 0,
      gradingPolicy: { maxScore: 100, passingScore: 60, allowLate: false },
    });
    draftId = res.body.id;
    await req(owner, 'post', `${course()}/lessons/${l1}/assignments`, {
      title: 'Yomon rubrika',
      rubric: [{ id: 'a', title: 'Joylashuv', maxPoints: 10 }],
    }).expect(400);
    await req(owner, 'patch', A(draftId), {
      rubric: [{ id: 'a', title: 'Joylashuv', maxPoints: 10 }],
    }).expect(400);
  });

  it('denies students, unassigned teachers and other orgs', async () => {
    const body = { title: 'Ruxsatsiz' };
    await req(student, 'post', `${course()}/lessons/${l1}/assignments`, body).expect(403);
    await req(otherTeacher, 'post', `${course()}/lessons/${l1}/assignments`, body).expect(403);
    await req(otherTeacher, 'patch', A(draftId), body).expect(403);
    await req(otherTeacher, 'post', `${A(draftId)}/publish`).expect(403);
    await req(student, 'get', `${A(draftId)}/submissions`).expect(403);
    await req(foreignTeacher, 'get', `${course(orgB)}/assignments/${draftId}/edit`).expect(404);
  });

  it('hides drafts from students', async () => {
    await req(student, 'get', A(draftId)).expect(404);
    const lesson = await req(student, 'get', `${course()}/lessons/${l1}`).expect(200);
    expect(lesson.body.assignments).toEqual([]);
  });

  it('publishes only with instructions and only forward', async () => {
    const res = await req(owner, 'post', `${A(draftId)}/publish`).expect(409);
    expect(res.body.code).toBe('INSTRUCTIONS_REQUIRED');
    await req(owner, 'patch', A(draftId), { instructions: 'Sahifa yarating' }).expect(200);
    await req(owner, 'post', `${A(draftId)}/close`).expect(409);
    const pub = await req(owner, 'post', `${A(draftId)}/publish`).expect(200);
    expect(pub.body.status).toBe('PUBLISHED');
    const again = await req(owner, 'post', `${A(draftId)}/publish`).expect(409);
    expect(again.body.code).toBe('INVALID_TRANSITION');
    const lesson = await req(student, 'get', `${course()}/lessons/${l1}`).expect(200);
    expect(lesson.body.assignments).toEqual([
      expect.objectContaining({ id: draftId, status: 'PUBLISHED', submissionStatus: null }),
    ]);
    const audit = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(and(eq(auditEvents.action, 'assignment.publish'), eq(auditEvents.targetId, draftId)));
    expect(audit).toHaveLength(1);
  });
});

describe('student submissions', () => {
  let id: string;

  beforeAll(async () => {
    id = await published({
      starterFiles: files('<!-- start -->'),
      maxAttempts: 3,
      requirements: ['Sarlavha', 'Rasm'],
      rubric: [
        { id: 'structure', title: 'Tuzilma', maxPoints: 60 },
        { id: 'design', title: 'Dizayn', maxPoints: 40 },
      ],
    });
  });

  it('refuses unenrolled students and locked lessons', async () => {
    await req(outsider, 'get', A(id)).expect(403);
    const locked = await published({}, l2);
    await req(student, 'get', A(locked)).expect(403);
    await submit(student, locked).expect(403);
  });

  it('starts from the starter files with rubric and requirements visible', async () => {
    const res = await req(student, 'get', A(id)).expect(200);
    expect(res.body).toMatchObject({
      status: 'PUBLISHED',
      requirements: ['Sarlavha', 'Rasm'],
      rubric: [{ id: 'structure' }, { id: 'design' }],
      checkAvailable: false,
      submission: {
        status: 'DRAFT',
        attemptsUsed: 0,
        blockedBy: null,
        files: files('<!-- start -->'),
      },
      versions: [],
    });
    expect(res.body).not.toHaveProperty('checks');
  });

  it('submits the saved draft as version 1', async () => {
    await saveDraft(student, id, '<h1>v1</h1>').expect(200);
    const res = await submit(student, id).expect(201);
    expect(res.body.submission).toMatchObject({ status: 'SUBMITTED', attemptsUsed: 1 });
    expect(res.body.versions).toEqual([
      expect.objectContaining({ version: 1, isLate: false, check: null }),
    ]);
    const v1 = await req(student, 'get', `${A(id)}/versions/1`).expect(200);
    expect(v1.body.files).toEqual(files('<h1>v1</h1>'));
  });

  it('refuses an unchanged resubmit without using an attempt', async () => {
    const res = await submit(student, id).expect(409);
    expect(res.body.code).toBe('NO_CHANGES');
    expect((await req(student, 'get', A(id))).body.submission.attemptsUsed).toBe(1);
  });

  it('a resubmit creates version 2 and leaves version 1 untouched', async () => {
    await saveDraft(student, id, '<h1>v2</h1>').expect(200);
    await submit(student, id).expect(201);
    const v1 = await req(student, 'get', `${A(id)}/versions/1`).expect(200);
    const v2 = await req(student, 'get', `${A(id)}/versions/2`).expect(200);
    expect(v1.body.files).toEqual(files('<h1>v1</h1>'));
    expect(v2.body.files).toEqual(files('<h1>v2</h1>'));
  });

  it('versions are immutable in the database itself', async () => {
    await expect(
      ctx.handle.db
        .update(submissionVersions)
        .set({ files: files('tampered') })
        .where(eq(submissionVersions.assignmentId, id)),
    ).rejects.toThrow();
    const v1 = await req(student, 'get', `${A(id)}/versions/1`).expect(200);
    expect(v1.body.files).toEqual(files('<h1>v1</h1>'));
  });

  it('enforces the attempt limit', async () => {
    await saveDraft(student, id, '<h1>v3</h1>').expect(200);
    await submit(student, id).expect(201);
    await saveDraft(student, id, '<h1>v4</h1>').expect(200);
    const res = await submit(student, id).expect(409);
    expect(res.body.code).toBe('ATTEMPTS_EXHAUSTED');
    const view = await req(student, 'get', A(id));
    expect(view.body.submission).toMatchObject({
      attemptsUsed: 3,
      blockedBy: 'ATTEMPTS_EXHAUSTED',
    });
  });

  it('keeps submissions private to their owner', async () => {
    await req(student2, 'get', `${A(id)}/versions/1`).expect(404);
    const own = await req(student2, 'get', A(id)).expect(200);
    expect(own.body.versions).toEqual([]);
    await req(student, 'get', `${A(id)}/versions/abc`).expect(404);
    await req(student, 'get', `${A(id)}/versions/0`).expect(404);
    await req(foreignTeacher, 'get', `${course(orgB)}/assignments/${id}`).expect(404);
  });

  it('serializes concurrent submits into one new version', async () => {
    const other = await published({ maxAttempts: 5 });
    await saveDraft(student2, other, '<p>bir</p>').expect(200);
    const results = await Promise.all([submit(student2, other), submit(student2, other)]);
    expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
    const rows = await ctx.handle.db
      .select()
      .from(submissionVersions)
      .where(eq(submissionVersions.assignmentId, other));
    expect(rows.map((r) => r.version)).toEqual([1]);
  });

  it('locks grading terms after the first submission, other fields stay editable', async () => {
    const res = await req(owner, 'patch', A(id), {
      rubric: [{ id: 'all', title: 'Hammasi', maxPoints: 100 }],
    }).expect(409);
    expect(res.body.code).toBe('GRADING_LOCKED');
    await req(owner, 'patch', A(id), { gradingPolicy: { maxScore: 100, allowLate: true } }).expect(
      409,
    );
    await req(owner, 'patch', A(id), { deadline: '2030-01-01T00:00:00Z', maxAttempts: 4 }).expect(
      200,
    );
    const edit = await req(owner, 'get', `${A(id)}/edit`).expect(200);
    expect(edit.body.submittedCount).toBe(1);
  });

  it('gives staff an overview without files or emails', async () => {
    const res = await req(owner, 'get', `${A(id)}/submissions`).expect(200);
    const rows = res.body as { fullName: string }[];
    expect(rows.find((r) => r.fullName === 'student')).toMatchObject({
      status: 'SUBMITTED',
      versions: 3,
      lastIsLate: false,
    });
    expect(rows.find((r) => r.fullName === 'student2')).toMatchObject({ versions: 0 });
    expect(JSON.stringify(res.body)).not.toMatch(/files|@a\.uz|<h1>/);
  });
});

describe('deadlines, review states and closing', () => {
  const past = new Date(Date.now() - 3600_000).toISOString();

  it('refuses late work unless the policy allows it, then marks it late', async () => {
    const strict = await published({ deadline: past });
    await saveDraft(student, strict, '<p>kech</p>').expect(200);
    expect((await submit(student, strict).expect(409)).body.code).toBe('DEADLINE_PASSED');

    const lenient = await published({
      deadline: past,
      gradingPolicy: { maxScore: 100, passingScore: 60, allowLate: true },
    });
    await saveDraft(student, lenient, '<p>kech</p>').expect(200);
    expect((await req(student, 'get', A(lenient))).body.submission.wouldBeLate).toBe(true);
    const res = await submit(student, lenient).expect(201);
    expect(res.body.versions[0].isLate).toBe(true);
  });

  it('a requested revision may be resubmitted after the deadline; review states lock', async () => {
    const id = await published({
      deadline: past,
      gradingPolicy: { maxScore: 100, allowLate: true },
    });
    await saveDraft(student2, id, '<p>1</p>').expect(200);
    await submit(student2, id).expect(201);
    const where = and(eq(submissions.assignmentId, id), eq(submissions.userId, student2.userId));

    // Review transitions belong to 12E; simulate them directly.
    await ctx.handle.db.update(submissions).set({ status: 'IN_REVIEW' }).where(where);
    expect((await saveDraft(student2, id, '<p>2</p>').expect(409)).body.code).toBe(
      'SUBMISSION_LOCKED',
    );
    expect((await submit(student2, id).expect(409)).body.code).toBe('SUBMISSION_LOCKED');

    await ctx.handle.db.update(submissions).set({ status: 'REVISION_REQUESTED' }).where(where);
    await saveDraft(student2, id, '<p>2</p>').expect(200);
    const res = await submit(student2, id).expect(201);
    expect(res.body.versions[0]).toMatchObject({ version: 2, isLate: false });
    expect(res.body.submission.status).toBe('SUBMITTED');
  });

  it('closing stops new work but keeps it readable', async () => {
    const id = await published();
    await saveDraft(student, id, '<p>x</p>').expect(200);
    await submit(student, id).expect(201);
    await req(owner, 'post', `${A(id)}/close`).expect(200);
    await req(owner, 'post', `${A(id)}/close`).expect(409);
    expect((await saveDraft(student, id, '<p>y</p>').expect(409)).body.code).toBe(
      'ASSIGNMENT_CLOSED',
    );
    expect((await submit(student, id).expect(409)).body.code).toBe('ASSIGNMENT_CLOSED');
    const view = await req(student, 'get', A(id)).expect(200);
    expect(view.body).toMatchObject({
      status: 'CLOSED',
      submission: { blockedBy: 'ASSIGNMENT_CLOSED' },
    });
    await req(student, 'get', `${A(id)}/versions/1`).expect(200);
  });
});

describe('CHECK on submitted versions', () => {
  const RULES = [
    { id: 'h1', title: 'Sarlavha bor', assert: { type: 'count', selector: 'h1' } },
    {
      id: 'zxq-hidden',
      title: 'MAXFIY shart',
      hidden: true,
      assert: { type: 'text', selector: '.zxq', value: 'maxfiy' },
    },
  ];

  it('runs CHECK on the submitted snapshot and reports it safely, without grading', async () => {
    const id = await published({ checks: RULES });
    const view = await req(student, 'get', A(id)).expect(200);
    expect(view.body.checkAvailable).toBe(true);
    await saveDraft(student, id, '<h1>pass:h1</h1>').expect(200);
    await submit(student, id).expect(201);
    await ctx.app.get(CheckQueue).idle();
    const res = await req(student, 'get', A(id)).expect(200);
    expect(res.body.versions[0].check).toMatchObject({
      status: 'FAILED',
      passedCount: 1,
      total: 2,
      checks: [{ title: 'Sarlavha bor', passed: true }],
      hidden: { passed: 0, total: 1 },
    });
    expect(res.body.submission.status).toBe('SUBMITTED');
    expect(JSON.stringify(res.body)).not.toMatch(/MAXFIY|zxq/);
  });

  it('staff can dry-run assignment rules; students cannot', async () => {
    const id = await published({ checks: RULES });
    const res = await req(owner, 'post', `${A(id)}/checks/preview`, {
      files: files('<h1>pass:h1 pass:zxq-hidden</h1>'),
    }).expect(200);
    expect(res.body.status).toBe('PASSED');
    await req(student, 'post', `${A(id)}/checks/preview`, { files: files('x') }).expect(403);
  });

  it('closes abandoned submission checks as ERROR, but not recent ones', async () => {
    const service = ctx.app.get(AssignmentsService);
    const [chk] = await ctx.handle.db
      .update(submissionChecks)
      .set({ status: 'RUNNING', startedAt: new Date() })
      .where(sql`true`)
      .returning();
    // Recently started: may still be running on another instance.
    expect(await service.closeStale()).toBe(0);
    await ctx.handle.db
      .update(submissionChecks)
      .set({ startedAt: new Date(Date.now() - 60 * 60_000) })
      .where(eq(submissionChecks.id, chk!.id));
    expect(await service.closeStale()).toBeGreaterThanOrEqual(1);
    const [after] = await ctx.handle.db
      .select()
      .from(submissionChecks)
      .where(eq(submissionChecks.id, chk!.id));
    expect(after).toMatchObject({ status: 'ERROR', errorCode: 'ENGINE' });
  });
});
