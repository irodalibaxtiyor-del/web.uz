import type { CheckEngineResult, CheckRule, ProjectFile } from '@webdizayn/shared';
import { and, eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CheckQueue } from '../src/checks/check-queue';
import { DisabledCheckExecutor, type CheckExecutor } from '../src/checks/check-executor';
import { ChecksService } from '../src/checks/checks.service';
import { auditEvents, checkRuns } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

/**
 * Deterministic stand-in for Playwright (the real engine is tested in packages/check-engine).
 * A rule passes when index.html contains `pass:<rule id>`; markers force other outcomes.
 */
class FakeExecutor implements CheckExecutor {
  hold: Promise<void> | null = null;
  calls: ProjectFile[][] = [];
  async run(files: ProjectFile[], rules: CheckRule[]): Promise<CheckEngineResult> {
    this.calls.push(files);
    if (this.hold) await this.hold;
    const html = files.find((f) => f.path === 'index.html')?.content ?? '';
    if (html.includes('FAKE_THROW')) throw new Error('browser exploded');
    const results = rules.map((r) => ({ id: r.id, passed: html.includes(`pass:${r.id}`) }));
    const forced = html.includes('FAKE_TIMEOUT')
      ? 'TIMEOUT'
      : html.includes('FAKE_ERROR')
        ? 'ERROR'
        : null;
    if (forced) {
      return {
        status: forced,
        errorCode: forced === 'TIMEOUT' ? 'LOAD_TIMEOUT' : 'ENGINE',
        results: results.map((r) => ({ ...r, passed: false })),
        durationMs: 5,
      };
    }
    return {
      status: results.every((r) => r.passed) ? 'PASSED' : 'FAILED',
      errorCode: null,
      results,
      durationMs: 5,
    };
  }
}

const RULES = [
  {
    id: 'has-h1',
    title: 'Sahifada asosiy sarlavha bor',
    hint: 'h1 tegidan foydalaning',
    assert: { type: 'count', selector: 'h1' },
  },
  {
    id: 'secret-color',
    title: 'MAXFIY: sarlavha rangi tomato',
    hint: 'MAXFIY maslahat',
    hidden: true,
    assert: { type: 'style', selector: 'h1.zxq-secret', property: 'color', value: 'tomato' },
  },
];
const PASSING = 'pass:has-h1 pass:secret-color';
const HIDDEN_LEAKS = ['MAXFIY', 'zxq-secret', 'tomato', 'secret-color', 'has-h1', 'selector'];

let ctx: TestContext;
let fake: FakeExecutor;
let orgA: string;
let orgB: string;
let owner: Member;
let otherTeacher: Member;
let student: Member;
let student2: Member;
let outsider: Member;
let rateStudent: Member;
let foreignStudent: Member;
let foreignTeacher: Member;
let courseId: string;
let l1: string;
let l2: string;
let ex: string;
let noChecks: string;
let lockedEx: string;

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
const save = (who: Member, exerciseId: string, html: string) =>
  req(who, 'put', `${course()}/exercises/${exerciseId}/workspace`, {
    files: [{ path: 'index.html', content: html }],
  }).expect(200);
const idle = () => ctx.app.get(CheckQueue).idle();
/** Starts a CHECK, waits for the queue and returns the finished run. */
const check = async (who: Member, exerciseId: string) => {
  const started = await req(who, 'post', `${course()}/exercises/${exerciseId}/checks`).expect(202);
  await idle();
  return (
    await req(who, 'get', `${course()}/exercises/${exerciseId}/checks/${started.body.id}`).expect(
      200,
    )
  ).body;
};
const exerciseStatus = async (who: Member, exerciseId: string) =>
  (await req(who, 'get', `${course()}/exercises/${exerciseId}`).expect(200)).body.status;

beforeAll(async () => {
  fake = new FakeExecutor();
  ctx = await setup({ CHECK_RATE_LIMIT: '8' }, { checkExecutor: fake });
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  otherTeacher = await createMember(ctx, 'other@a.uz', orgA, 'TEACHER');
  student = await createMember(ctx, 'student@a.uz', orgA, 'STUDENT');
  student2 = await createMember(ctx, 'student2@a.uz', orgA, 'STUDENT');
  outsider = await createMember(ctx, 'outsider@a.uz', orgA, 'STUDENT');
  rateStudent = await createMember(ctx, 'rate@a.uz', orgA, 'STUDENT');
  foreignStudent = await createMember(ctx, 'student@b.uz', orgB, 'STUDENT');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');

  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'HTML', slug: 'html' });
  courseId = c.body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  l1 = (await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Teglar' }))
    .body.id;
  l2 = (await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'CSS' }))
    .body.id;
  ex = (
    await req(owner, 'post', `${course()}/lessons/${l1}/exercises`, { title: 'Sarlavha' }).expect(
      201,
    )
  ).body.id;
  noChecks = (
    await req(owner, 'post', `${course()}/lessons/${l1}/exercises`, {
      title: 'Qo‘lda baholanadi',
      isActive: false,
    }).expect(201)
  ).body.id;
  lockedEx = (
    await req(owner, 'post', `${course()}/lessons/${l2}/exercises`, {
      title: 'Yopiq',
      checks: RULES,
    }).expect(201)
  ).body.id;
  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of [student, student2, rateStudent]) {
    await req(s, 'post', `${course()}/enroll`).expect(201);
  }
});
afterAll(async () => {
  await ctx.app.close();
});

describe('CHECK rule authoring', () => {
  it('reports no CHECK before rules exist', async () => {
    const view = await req(student, 'get', `${course()}/exercises/${ex}`).expect(200);
    expect(view.body.checkAvailable).toBe(false);
    const res = await req(student, 'post', `${course()}/exercises/${ex}/checks`).expect(409);
    expect(res.body.code).toBe('CHECK_NOT_CONFIGURED');
  });

  it('validates rules and lets only the course staff set them', async () => {
    await req(owner, 'patch', `${course()}/exercises/${ex}`, {
      checks: [{ id: 'Bad Id', title: 'x', assert: { type: 'count', selector: 'h1' } }],
    }).expect(400);
    await req(owner, 'patch', `${course()}/exercises/${ex}`, {
      checks: [{ id: 'a', title: 'aa', assert: { type: 'eval', code: 'fetch("x")' } }],
    }).expect(400);
    await req(student, 'patch', `${course()}/exercises/${ex}`, { checks: RULES }).expect(403);
    await req(otherTeacher, 'patch', `${course()}/exercises/${ex}`, { checks: RULES }).expect(403);
    const res = await req(owner, 'patch', `${course()}/exercises/${ex}`, { checks: RULES }).expect(
      200,
    );
    expect(res.body.checks).toHaveLength(2);
  });

  it('never sends rules to students', async () => {
    const view = await req(student, 'get', `${course()}/exercises/${ex}`).expect(200);
    expect(view.body.checkAvailable).toBe(true);
    expect(view.body).not.toHaveProperty('checks');
    const lesson = await req(student, 'get', `${course()}/lessons/${l1}`).expect(200);
    for (const body of [view.body, lesson.body]) {
      for (const leak of HIDDEN_LEAKS) expect(JSON.stringify(body)).not.toContain(leak);
    }
    await req(student, 'get', `${course()}/exercises/${ex}/edit`).expect(403);
  });
});

describe('student CHECK runs', () => {
  it('starts with no runs', async () => {
    const res = await req(student, 'get', `${course()}/exercises/${ex}/checks/latest`).expect(200);
    expect(res.body).toEqual({ run: null });
  });

  it('FAILED: safe summary with visible titles and hints, hidden only as counts', async () => {
    await save(student, ex, '<h1>pass:has-h1</h1>');
    const run = await check(student, ex);
    expect(run).toMatchObject({
      status: 'FAILED',
      errorCode: null,
      passedCount: 1,
      total: 2,
      checks: [{ title: 'Sahifada asosiy sarlavha bor', passed: true, hint: null }],
      hidden: { passed: 0, total: 1 },
    });
    for (const leak of HIDDEN_LEAKS) expect(JSON.stringify(run)).not.toContain(leak);
    expect(await exerciseStatus(student, ex)).toBe('NEEDS_IMPROVEMENT');
  });

  it('shows the hint of a failing visible check', async () => {
    await save(student, ex, '<p>bo‘sh</p>');
    const run = await check(student, ex);
    expect(run.checks).toEqual([
      { title: 'Sahifada asosiy sarlavha bor', passed: false, hint: 'h1 tegidan foydalaning' },
    ]);
  });

  it('checks the saved workspace, never files sent with the request', async () => {
    await save(student, ex, '<p>saqlangan</p>');
    fake.calls = [];
    const started = await req(student, 'post', `${course()}/exercises/${ex}/checks`)
      .send({ files: [{ path: 'index.html', content: PASSING }] })
      .expect(202);
    await idle();
    expect(fake.calls[0]).toEqual([{ path: 'index.html', content: '<p>saqlangan</p>' }]);
    const run = await req(student, 'get', `${course()}/exercises/${ex}/checks/${started.body.id}`);
    expect(run.body.status).toBe('FAILED');
  });

  it('ERROR and TIMEOUT are reported but change nothing', async () => {
    for (const [marker, status, code] of [
      ['FAKE_ERROR', 'ERROR', 'ENGINE'],
      ['FAKE_TIMEOUT', 'TIMEOUT', 'LOAD_TIMEOUT'],
      ['FAKE_THROW', 'ERROR', 'ENGINE'],
    ] as const) {
      await save(student2, ex, `${PASSING} ${marker}`);
      const run = await check(student2, ex);
      expect(run).toMatchObject({ status, errorCode: code, passedCount: 0 });
      expect(run.checks[0].hint).toBeNull();
      expect(await exerciseStatus(student2, ex)).toBe('IN_PROGRESS');
    }
  });

  it('PASSED marks the exercise passed, completes the lesson and is audited', async () => {
    await save(student, ex, PASSING);
    const run = await check(student, ex);
    expect(run).toMatchObject({
      status: 'PASSED',
      passedCount: 2,
      hidden: { passed: 1, total: 1 },
    });
    expect(await exerciseStatus(student, ex)).toBe('PASSED');
    const map = await req(student, 'get', `${course()}/map`).expect(200);
    const states = map.body.modules[0].lessons.map((l: { state: string }) => l.state);
    expect(states).toEqual(['COMPLETED', 'AVAILABLE']);
    const audit = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(and(eq(auditEvents.action, 'exercise.status_set'), eq(auditEvents.targetId, ex)));
    expect(audit[0]).toMatchObject({
      actorUserId: null,
      organizationId: orgA,
      metadata: { source: 'check', studentId: student.userId, status: 'PASSED' },
    });
  });

  it('a later FAILED run does not undo a pass', async () => {
    await save(student, ex, '<p>buzildi</p>');
    const run = await check(student, ex);
    expect(run.status).toBe('FAILED');
    expect(await exerciseStatus(student, ex)).toBe('PASSED');
    const latest = await req(student, 'get', `${course()}/exercises/${ex}/checks/latest`);
    expect(latest.body.run.id).toBe(run.id);
  });

  it('keeps the teacher note when CHECK sets the status', async () => {
    await req(owner, 'put', `${course()}/exercises/${ex}/students/${student2.userId}/status`, {
      status: 'NEEDS_IMPROVEMENT',
      note: 'Rangni tekshiring',
    }).expect(200);
    await save(student2, ex, '<p>yo‘q</p>');
    await check(student2, ex);
    const view = await req(student2, 'get', `${course()}/exercises/${ex}`).expect(200);
    expect(view.body).toMatchObject({
      status: 'NEEDS_IMPROVEMENT',
      teacherNote: 'Rangni tekshiring',
    });
  });
});

describe('CHECK isolation and limits', () => {
  it('allows one active run per exercise, also under concurrent requests', async () => {
    let release!: () => void;
    fake.hold = new Promise((r) => (release = r));
    try {
      const results = await Promise.all([
        req(student2, 'post', `${course()}/exercises/${ex}/checks`),
        req(student2, 'post', `${course()}/exercises/${ex}/checks`),
      ]);
      expect(results.map((r) => r.status).sort()).toEqual([202, 409]);
      const res = await req(student2, 'post', `${course()}/exercises/${ex}/checks`).expect(409);
      expect(res.body.code).toBe('CHECK_IN_PROGRESS');
      const running = results.find((r) => r.status === 202)!.body;
      expect(['QUEUED', 'RUNNING']).toContain(running.status);
    } finally {
      fake.hold = null;
      release();
      await idle();
    }
  });

  it('runs are private to their owner', async () => {
    const latest = await req(student, 'get', `${course()}/exercises/${ex}/checks/latest`);
    const id = latest.body.run.id;
    await req(student2, 'get', `${course()}/exercises/${ex}/checks/${id}`).expect(404);
    await req(owner, 'get', `${course()}/exercises/${ex}/checks/${id}`).expect(403);
    await req(foreignStudent, 'get', `${course(orgB)}/exercises/${ex}/checks/${id}`).expect(404);
    // student2 has not passed lesson 1, so lesson 2 is still locked for them.
    await req(student2, 'get', `${course()}/exercises/${lockedEx}/checks/${id}`).expect(403);
    await req(student, 'get', `${course()}/exercises/${ex}/checks/not-a-uuid`).expect(404);
  });

  it('refuses unenrolled students, locked lessons, inactive exercises and other orgs', async () => {
    await req(outsider, 'post', `${course()}/exercises/${ex}/checks`).expect(403);
    await req(student2, 'post', `${course()}/exercises/${lockedEx}/checks`).expect(403);
    await req(student, 'post', `${course()}/exercises/${noChecks}/checks`).expect(404);
    await req(foreignStudent, 'post', `${course(orgB)}/exercises/${ex}/checks`).expect(404);
  });

  it('rate-limits runs per user', async () => {
    await save(rateStudent, ex, '<p>x</p>');
    for (let i = 0; i < 8; i++) await check(rateStudent, ex);
    const res = await req(rateStudent, 'post', `${course()}/exercises/${ex}/checks`).expect(429);
    expect(res.body.code).toBe('CHECK_RATE_LIMITED');
  });

  it('closes runs interrupted by a restart as ERROR, never as PASSED', async () => {
    const [row] = await ctx.handle.db
      .insert(checkRuns)
      .values({
        userId: student.userId,
        exerciseId: ex,
        courseId,
        status: 'RUNNING',
        files: [{ path: 'index.html', content: PASSING }],
        rules: [],
      })
      .returning();
    await ctx.app.get(ChecksService).onModuleInit();
    const [after] = await ctx.handle.db.select().from(checkRuns).where(eq(checkRuns.id, row!.id));
    expect(after).toMatchObject({ status: 'ERROR', errorCode: 'ENGINE' });
  });

  it('the disabled engine reports ERROR', async () => {
    const res = await new DisabledCheckExecutor().run([], [{ id: 'a' } as CheckRule]);
    expect(res).toMatchObject({ status: 'ERROR', errorCode: 'ENGINE' });
  });
});

describe('staff CHECK preview', () => {
  const files = [{ path: 'index.html', content: 'pass:has-h1' }];

  it('returns full detail including hidden checks to the course staff', async () => {
    const res = await req(owner, 'post', `${course()}/exercises/${ex}/checks/preview`, {
      files,
    }).expect(200);
    expect(res.body).toMatchObject({
      status: 'FAILED',
      checks: [
        { id: 'has-h1', passed: true, hidden: false },
        { id: 'secret-color', title: 'MAXFIY: sarlavha rangi tomato', passed: false, hidden: true },
      ],
    });
  });

  it('tests unsaved rules and validates them', async () => {
    const res = await req(owner, 'post', `${course()}/exercises/${ex}/checks/preview`, {
      files,
      checks: [RULES[0]],
    }).expect(200);
    expect(res.body.status).toBe('PASSED');
    await req(owner, 'post', `${course()}/exercises/${ex}/checks/preview`, {
      files,
      checks: [{ id: 'x', title: 'xx', assert: { type: 'nope' } }],
    }).expect(400);
    await req(owner, 'post', `${course()}/exercises/${noChecks}/checks/preview`, { files }).expect(
      409,
    );
  });

  it('is denied to students, unassigned teachers and other orgs', async () => {
    const body = { files };
    await req(student, 'post', `${course()}/exercises/${ex}/checks/preview`, body).expect(403);
    await req(otherTeacher, 'post', `${course()}/exercises/${ex}/checks/preview`, body).expect(403);
    await req(
      foreignTeacher,
      'post',
      `${course(orgB)}/exercises/${ex}/checks/preview`,
      body,
    ).expect(404);
  });
});
