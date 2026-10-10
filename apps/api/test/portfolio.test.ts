import { and, eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CheckQueue } from '../src/checks/check-queue';
import type { CheckExecutor } from '../src/checks/check-executor';
import { auditEvents, portfolioItems } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

/** Not exercised here: assignment CHECKs are irrelevant to the portfolio. */
class NoopExecutor implements CheckExecutor {
  run() {
    return Promise.resolve({
      status: 'PASSED' as const,
      errorCode: null,
      results: [],
      durationMs: 1,
    });
  }
}

let ctx: TestContext;
let org: string;
let teacher: Member;
let student: Member;
let student2: Member;
let courseId: string;
let exerciseId: string;
let otherExerciseId: string;
let assignmentId: string;
let exerciseItem: string;
let assignmentItem: string;

const course = () => `/orgs/${org}/courses/${courseId}`;
const req = (
  who: Member | null,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  body?: object,
) => {
  const r = ctx.http()[method](path);
  if (who) r.set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};
const files = (html: string) => [{ path: 'index.html', content: html }];

beforeAll(async () => {
  ctx = await setup({}, { checkExecutor: new NoopExecutor() });
  org = await createOrg(ctx, 'org-p');
  teacher = await createMember(ctx, 'teacher@p.uz', org, 'TEACHER');
  student = await createMember(ctx, 'aziza@p.uz', org, 'STUDENT');
  student2 = await createMember(ctx, 'bobur@p.uz', org, 'STUDENT');

  const c = await req(teacher, 'post', `/orgs/${org}/courses`, { title: 'HTML', slug: 'html' });
  courseId = c.body.course.id;
  const mod = await req(teacher, 'post', `${course()}/modules`, { title: '1-modul' });
  const lessonId = (
    await req(teacher, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Kirish' })
  ).body.id;
  const ex = async (title: string) =>
    (await req(teacher, 'post', `${course()}/lessons/${lessonId}/exercises`, { title }).expect(201))
      .body.id as string;
  exerciseId = await ex('Vizitka sahifasi');
  otherExerciseId = await ex('Jadval');
  const asg = await req(teacher, 'post', `${course()}/lessons/${lessonId}/assignments`, {
    title: 'Shaxsiy sayt',
    instructions: 'Sayt yarating',
  }).expect(201);
  assignmentId = asg.body.id;
  await req(teacher, 'post', `${course()}/assignments/${assignmentId}/publish`).expect(200);
  await req(teacher, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of [student, student2]) await req(s, 'post', `${course()}/enroll`).expect(201);
});

afterAll(async () => {
  await ctx.app.close();
});

const passExercise = async (who: Member, id: string, html: string) => {
  await req(who, 'put', `${course()}/exercises/${id}/workspace`, { files: files(html) }).expect(
    200,
  );
  await req(teacher, 'put', `${course()}/exercises/${id}/students/${who.userId}/status`, {
    status: 'PASSED',
    note: 'Maxfiy izoh: zo‘r',
  }).expect(200);
};

describe('owner portfolio', () => {
  it('requires a session and starts private', async () => {
    await req(null, 'get', '/portfolio/me').expect(401);
    const res = await req(student, 'get', '/portfolio/me').expect(200);
    expect(res.body.profile).toMatchObject({
      slug: null,
      displayName: 'aziza',
      isPublished: false,
      skills: [],
    });
    expect(res.body.items).toEqual([]);
    expect(res.body.candidates).toEqual([]);
    expect(res.body.achievements).toEqual([]);
  });

  it('offers only finished work of the caller as candidates', async () => {
    await req(student, 'put', `${course()}/exercises/${otherExerciseId}/workspace`, {
      files: files('<p>hali tugamagan</p>'),
    }).expect(200);
    await passExercise(student, exerciseId, '<h1>Aziza</h1>');
    await passExercise(student2, otherExerciseId, '<h1>Bobur</h1>');
    await req(student, 'put', `${course()}/assignments/${assignmentId}/draft`, {
      files: files('<h1>Mening saytim</h1>'),
    }).expect(200);
    await req(student, 'post', `${course()}/assignments/${assignmentId}/submit`).expect(201);
    await ctx.app.get(CheckQueue).idle();

    let res = await req(student, 'get', '/portfolio/me').expect(200);
    expect(res.body.candidates).toEqual([
      expect.objectContaining({ kind: 'EXERCISE', sourceId: exerciseId, courseTitle: 'HTML' }),
    ]);

    const S = `${course()}/assignments/${assignmentId}/submissions/${student.userId}`;
    await req(teacher, 'post', `${S}/start-review`, { version: 1 }).expect(200);
    await req(teacher, 'post', `${S}/grade`, {
      version: 1,
      score: 42,
      feedback: 'Maxfiy feedback',
    }).expect(200);
    res = await req(student, 'get', '/portfolio/me').expect(200);
    expect(res.body.candidates.map((c: { kind: string }) => c.kind)).toEqual([
      'ASSIGNMENT',
      'EXERCISE',
    ]);
  });

  it('rejects work that is not the caller’s finished work', async () => {
    // Bobur passed this exercise, Aziza did not.
    const r1 = await req(student, 'post', '/portfolio/me/items', {
      kind: 'EXERCISE',
      sourceId: otherExerciseId,
    }).expect(404);
    expect(r1.body.code).toBe('NOT_ELIGIBLE');
    // Bobur has no graded submission.
    await req(student2, 'post', '/portfolio/me/items', {
      kind: 'ASSIGNMENT',
      sourceId: assignmentId,
    }).expect(404);
    await req(student, 'post', '/portfolio/me/items', {
      kind: 'ASSIGNMENT',
      sourceId: exerciseId,
    }).expect(404);
    await req(student, 'post', '/portfolio/me/items', {
      kind: 'QUIZ',
      sourceId: exerciseId,
    }).expect(400);
  });

  it('adds snapshots that do not follow later edits', async () => {
    const a = await req(student, 'post', '/portfolio/me/items', {
      kind: 'EXERCISE',
      sourceId: exerciseId,
      description: 'Birinchi sahifam',
    }).expect(201);
    exerciseItem = a.body.id;
    expect(a.body).toMatchObject({ title: 'Vizitka sahifasi', position: 0, courseTitle: 'HTML' });
    const b = await req(student, 'post', '/portfolio/me/items', {
      kind: 'ASSIGNMENT',
      sourceId: assignmentId,
      title: 'Mening shaxsiy saytim',
    }).expect(201);
    assignmentItem = b.body.id;
    expect(b.body.position).toBe(1);

    await req(student, 'post', '/portfolio/me/items', {
      kind: 'EXERCISE',
      sourceId: exerciseId,
    })
      .expect(409)
      .expect((r) => expect(r.body.code).toBe('ALREADY_ADDED'));

    await req(student, 'put', `${course()}/exercises/${exerciseId}/workspace`, {
      files: files('<h1>keyin o‘zgartirildi</h1>'),
    }).expect(200);
    const item = await req(student, 'get', `/portfolio/me/items/${exerciseItem}`).expect(200);
    expect(item.body.files).toEqual(files('<h1>Aziza</h1>'));
    const asg = await req(student, 'get', `/portfolio/me/items/${assignmentItem}`).expect(200);
    expect(asg.body.files).toEqual(files('<h1>Mening saytim</h1>'));

    const me = await req(student, 'get', '/portfolio/me').expect(200);
    expect(me.body.candidates).toEqual([]);
  });

  it('keeps items private to their owner', async () => {
    await req(student2, 'get', `/portfolio/me/items/${exerciseItem}`).expect(404);
    await req(student2, 'patch', `/portfolio/me/items/${exerciseItem}`, { title: 'Meniki' }).expect(
      404,
    );
    await req(student2, 'delete', `/portfolio/me/items/${exerciseItem}`).expect(404);
    await req(student2, 'get', `/portfolio/me/items/${exerciseItem}`)
      .set('x-user-id', student.userId)
      .expect(404);
    await req(student, 'get', '/portfolio/me/items/not-a-uuid').expect(404);
  });

  it('edits and reorders items', async () => {
    const res = await req(student, 'patch', `/portfolio/me/items/${assignmentItem}`, {
      description: 'Rubrika bo‘yicha baholangan loyiha',
      position: 0,
    }).expect(200);
    expect(res.body.description).toBe('Rubrika bo‘yicha baholangan loyiha');
    await req(student, 'patch', `/portfolio/me/items/${exerciseItem}`, { position: 1 }).expect(200);
    const me = await req(student, 'get', '/portfolio/me').expect(200);
    expect(me.body.items.map((i: { id: string }) => i.id)).toEqual([assignmentItem, exerciseItem]);
    await req(student, 'patch', `/portfolio/me/items/${exerciseItem}`, {}).expect(400);
  });

  it('caps the number of items', async () => {
    const extra = Array.from({ length: 18 }, (_, i) => ({
      userId: student2.userId,
      kind: 'EXERCISE' as const,
      sourceId: crypto.randomUUID(),
      title: `Ish ${i}`,
      courseTitle: 'HTML',
      files: files('<p>x</p>'),
      position: i,
    }));
    await req(student2, 'get', '/portfolio/me').expect(200);
    await ctx.handle.db.insert(portfolioItems).values(extra);
    await req(student2, 'post', '/portfolio/me/items', {
      kind: 'EXERCISE',
      sourceId: otherExerciseId,
    }).expect(201);
    await ctx.handle.db
      .insert(portfolioItems)
      .values({ ...extra[0]!, sourceId: crypto.randomUUID() });
    // 20 items now; Bobur has nothing else eligible, so re-check the cap through a removal.
    const me = await req(student2, 'get', '/portfolio/me').expect(200);
    expect(me.body.items).toHaveLength(20);
    const own = me.body.items.find((i: { title: string }) => i.title === 'Jadval');
    await req(student2, 'delete', `/portfolio/me/items/${own.id}`).expect(204);
    await ctx.handle.db
      .insert(portfolioItems)
      .values({ ...extra[0]!, sourceId: crypto.randomUUID() });
    await req(student2, 'post', '/portfolio/me/items', {
      kind: 'EXERCISE',
      sourceId: otherExerciseId,
    })
      .expect(409)
      .expect((r) => expect(r.body.code).toBe('PORTFOLIO_FULL'));
  });
});

describe('publishing', () => {
  it('is hidden until explicitly published', async () => {
    await req(student, 'post', '/portfolio/me/publish')
      .expect(409)
      .expect((r) => expect(r.body.code).toBe('SLUG_REQUIRED'));
    await req(student, 'put', '/portfolio/me', { slug: 'Aziza-K' }).expect(200);
    const hidden = await req(null, 'get', '/portfolio/public/aziza-k').expect(404);
    const missing = await req(null, 'get', '/portfolio/public/no-such-person').expect(404);
    expect(hidden.body).toEqual(missing.body);
  });

  it('keeps slugs unique', async () => {
    await req(student2, 'put', '/portfolio/me', { slug: 'aziza-k' })
      .expect(409)
      .expect((r) => expect(r.body.code).toBe('SLUG_TAKEN'));
    await req(student2, 'put', '/portfolio/me', { slug: 'a' }).expect(400);
  });

  it('shows only what the owner chose, without private data', async () => {
    await req(student, 'put', '/portfolio/me', {
      displayName: 'Aziza Karimova',
      headline: 'Boshlovchi veb-dizayner',
      bio: 'HTML va CSS o‘rganyapman.',
      skills: ['HTML', 'CSS'],
    }).expect(200);
    await req(student, 'post', '/portfolio/me/publish').expect(200);

    const res = await req(null, 'get', '/portfolio/public/AZIZA-K').expect(200);
    expect(res.body).toMatchObject({
      slug: 'aziza-k',
      displayName: 'Aziza Karimova',
      skills: ['HTML', 'CSS'],
      achievements: ['FIRST_EXERCISE', 'FIRST_GRADED_ASSIGNMENT'],
    });
    expect(res.body.items).toHaveLength(2);
    const body = JSON.stringify(res.body);
    for (const secret of [
      'aziza@p.uz',
      student.userId,
      exerciseId,
      assignmentId,
      org,
      courseId,
      'Maxfiy',
      '"score"',
      'files',
    ]) {
      expect(body, secret).not.toContain(secret);
    }

    const item = await req(null, 'get', `/portfolio/public/aziza-k/items/${exerciseItem}`).expect(
      200,
    );
    expect(item.body.files).toEqual(files('<h1>Aziza</h1>'));
  });

  it('does not serve another owner’s items under a slug', async () => {
    const theirs = await ctx.handle.db
      .select({ id: portfolioItems.id })
      .from(portfolioItems)
      .where(eq(portfolioItems.userId, student2.userId))
      .limit(1);
    await req(null, 'get', `/portfolio/public/aziza-k/items/${theirs[0]!.id}`).expect(404);
  });

  it('cannot drop the slug while published', async () => {
    await req(student, 'put', '/portfolio/me', { slug: null })
      .expect(409)
      .expect((r) => expect(r.body.code).toBe('SLUG_REQUIRED'));
  });

  it('lists completed courses', async () => {
    // The only lesson completes once both exercises pass.
    await passExercise(student, otherExerciseId, '<table></table>');
    const res = await req(null, 'get', '/portfolio/public/aziza-k').expect(200);
    expect(res.body.completedCourses).toEqual([{ title: 'HTML', completedAt: expect.any(String) }]);
    expect(res.body.achievements).toContain('COURSE_COMPLETED');
  });

  it('hides everything again on unpublish and audits both actions', async () => {
    await req(student, 'post', '/portfolio/me/unpublish').expect(200);
    await req(null, 'get', '/portfolio/public/aziza-k').expect(404);
    await req(null, 'get', `/portfolio/public/aziza-k/items/${exerciseItem}`).expect(404);
    const events = await ctx.handle.db
      .select({ action: auditEvents.action })
      .from(auditEvents)
      .where(
        and(eq(auditEvents.actorUserId, student.userId), eq(auditEvents.targetType, 'portfolio')),
      );
    expect(events.map((e) => e.action).sort()).toEqual([
      'portfolio.publish',
      'portfolio.unpublish',
    ]);
  });
});
