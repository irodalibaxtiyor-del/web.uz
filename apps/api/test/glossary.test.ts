import { REVIEW_NEW_PER_DAY } from '@webdizayn/shared';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RateLimiter } from '../src/common/rate-limiter';
import { REVIEW_ANSWERS_PER_MINUTE, tashkentDayStart } from '../src/glossary/glossary.service';
import { termReviews } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgA: string;
let orgB: string;
let owner: Member;
let otherTeacher: Member;
let foreignTeacher: Member;
let student: Member;
let outsider: Member;
let courseId: string;
let lesson1: string;
let lesson2: string;
const ids: Record<string, string> = {};

const course = (org = orgA) => `/orgs/${org}/courses/${courseId}`;
const G = (org = orgA) => `${course(org)}/glossary`;
const req = (
  who: Member,
  method: 'get' | 'post' | 'patch' | 'delete',
  path: string,
  body?: object,
) => {
  const r = ctx.http()[method](path).set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  otherTeacher = await createMember(ctx, 'other@a.uz', orgA, 'TEACHER');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  student = await createMember(ctx, 's1@a.uz', orgA, 'STUDENT');
  outsider = await createMember(ctx, 'outsider@a.uz', orgA, 'STUDENT');
  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'HTML', slug: 'html' });
  courseId = c.body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  const l1 = await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, {
    title: 'Teglar',
  });
  const l2 = await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, {
    title: 'Atributlar',
  });
  lesson1 = l1.body.id;
  lesson2 = l2.body.id;
  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  await req(student, 'post', `${course()}/enroll`).expect(201);
});
afterAll(async () => {
  await ctx.app.close();
});

describe('glossary', () => {
  it('only course staff edit terms; duplicates are refused case-insensitively', async () => {
    const body = { term: 'Teg', definition: 'Elementni belgilovchi belgi', lessonId: lesson1 };
    await req(student, 'post', G(), body).expect(403);
    await req(otherTeacher, 'post', G(), body).expect(403);
    await req(foreignTeacher, 'post', G(orgB), body).expect(404);
    await req(owner, 'post', G(), { ...body, term: '' }).expect(400);
    const t = await req(owner, 'post', G(), body).expect(201);
    expect(t.body).toMatchObject({ term: 'Teg', lessonTitle: 'Teglar' });
    ids.teg = t.body.id;
    await req(owner, 'post', G(), { ...body, term: '  teg ' }).expect(409);

    const a = await req(owner, 'post', G(), {
      term: 'Atribut',
      definition: 'Tegga qo‘shimcha ma’lumot',
      example: '<a href="#">',
      lessonId: lesson2,
    }).expect(201);
    ids.atribut = a.body.id;
    const h = await req(owner, 'post', G(), { term: 'HTML', definition: 'Belgilash tili' });
    ids.html = h.body.id;
  });

  it('a lesson of another course is refused', async () => {
    const other = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'CSS', slug: 'css' });
    const mod = await req(owner, 'post', `/orgs/${orgA}/courses/${other.body.course.id}/modules`, {
      title: 'Selektorlar',
    });
    const l = await req(
      owner,
      'post',
      `/orgs/${orgA}/courses/${other.body.course.id}/modules/${mod.body.id}/lessons`,
      { title: 'Ranglar' },
    );
    expect(l.status, JSON.stringify([other.body, mod.body, l.body])).toBe(201);
    const res = await req(owner, 'post', G(), {
      term: 'X',
      definition: 'xxx',
      lessonId: l.body.id,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it('edits and renames; a rename onto another term is a conflict', async () => {
    await req(owner, 'patch', `${G()}/${ids.html}`, { term: 'teg', definition: 'abc' }).expect(409);
    const r = await req(owner, 'patch', `${G()}/${ids.html}`, {
      term: 'HTML',
      definition: 'Gipermatn belgilash tili',
    }).expect(200);
    expect(r.body.definition).toBe('Gipermatn belgilash tili');
  });

  it('staff get the lesson list; enrolled students get learned flags only', async () => {
    const staff = await req(owner, 'get', G()).expect(200);
    expect(staff.body.lessons).toHaveLength(2);
    const s = await req(student, 'get', G()).expect(200);
    expect(s.body.lessons).toBeUndefined();
    const learned = Object.fromEntries(
      s.body.terms.map((t: { term: string; learned: boolean }) => [t.term, t.learned]),
    );
    expect(learned).toEqual({ Atribut: false, HTML: true, Teg: false });
    await req(outsider, 'get', G()).expect(403);
    await req(student, 'get', G(orgB)).expect(404);
  });
});

describe('spaced repetition', () => {
  it('only terms of completed lessons (or without a lesson) are reviewable', async () => {
    let q = await req(student, 'get', `${G()}/review`).expect(200);
    expect(q.body.cards.map((c: { term: string }) => c.term)).toEqual(['HTML']);
    expect(q.body.counts).toMatchObject({ learned: 1, total: 3, due: 0 });
    await req(student, 'post', `${G()}/review/${ids.teg}`, { grade: 'GOOD' })
      .expect(403)
      .expect((r) => expect(r.body.code).toBe('TERM_LOCKED'));

    await req(student, 'post', `${course()}/lessons/${lesson1}/complete`).expect(201);
    q = await req(student, 'get', `${G()}/review`).expect(200);
    // Course order: lesson-free terms, then the first lesson.
    expect(q.body.cards.map((c: { term: string }) => c.term)).toEqual(['HTML', 'Teg']);
    expect(q.body.cards[0]).toMatchObject({ isNew: true, state: null });
  });

  it('an answer schedules the card; AGAIN brings it back soon, GOOD tomorrow', async () => {
    await req(student, 'post', `${G()}/review/${ids.html}`, { grade: 'MAYBE' }).expect(400);
    const good = await req(student, 'post', `${G()}/review/${ids.html}`, { grade: 'GOOD' }).expect(
      200,
    );
    expect(good.body.intervalDays).toBe(1);
    const again = await req(student, 'post', `${G()}/review/${ids.teg}`, {
      grade: 'AGAIN',
    }).expect(200);
    expect(new Date(again.body.dueAt).getTime() - Date.now()).toBeLessThan(11 * 60_000);

    const q = await req(student, 'get', `${G()}/review`).expect(200);
    expect(q.body.cards).toHaveLength(0);
    expect(q.body.counts).toMatchObject({ learned: 2, started: 2, newToday: 2 });
    expect(new Date(q.body.nextDueAt).getTime()).toBe(new Date(again.body.dueAt).getTime());
  });

  it('due cards come back with their state; repeated answers grow the interval', async () => {
    const db = ctx.handle.db;
    await db
      .update(termReviews)
      .set({ dueAt: new Date(Date.now() - 1000) })
      .where(eq(termReviews.termId, ids.html!));
    const q = await req(student, 'get', `${G()}/review`).expect(200);
    expect(q.body.cards).toHaveLength(1);
    expect(q.body.cards[0]).toMatchObject({ term: 'HTML', isNew: false, state: { reps: 1 } });
    expect(q.body.counts.due).toBe(1);
    const r = await req(student, 'post', `${G()}/review/${ids.html}`, { grade: 'GOOD' }).expect(
      200,
    );
    expect(r.body.intervalDays).toBe(3);
    const [row] = await db.select().from(termReviews).where(eq(termReviews.termId, ids.html!));
    expect(row).toMatchObject({ reviewCount: 2, reps: 2, lastGrade: 'GOOD' });
  });

  it('limits new cards per day', async () => {
    for (let i = 0; i < REVIEW_NEW_PER_DAY + 3; i++) {
      await req(owner, 'post', G(), { term: `Yangi ${i}`, definition: 'Sinov atamasi' }).expect(
        201,
      );
    }
    const q = await req(student, 'get', `${G()}/review`).expect(200);
    // Two new cards were already seen today.
    expect(q.body.cards).toHaveLength(REVIEW_NEW_PER_DAY - 2);
  });

  it('staff see review statistics; students do not', async () => {
    await req(student, 'get', `${G()}/stats`).expect(403);
    await req(otherTeacher, 'get', `${G()}/stats`).expect(403);
    const r = await req(owner, 'get', `${G()}/stats`).expect(200);
    expect(r.body).toMatchObject({ enrolled: 1, reviewers: 1, cardsStarted: 2, reviews: 3 });
    expect(r.body.retained).toBe(0.5); // "Teg" was last answered AGAIN
    expect(r.body.hardest[0]).toMatchObject({ term: 'Teg', forgotten: 1 });
  });

  it('review answers are rate limited per student', async () => {
    const limiter = ctx.app.get(RateLimiter);
    const key = `review-answer:${student.userId}`;
    for (let i = 0; i < REVIEW_ANSWERS_PER_MINUTE; i++) await limiter.record(key);
    await req(student, 'post', `${G()}/review/${ids.html}`, { grade: 'GOOD' })
      .expect(429)
      .expect((r) => expect(r.body.code).toBe('REVIEW_RATE_LIMITED'));
    await limiter.clear(key);
  });

  it('deleting a term removes its reviews; outsiders cannot review', async () => {
    await req(outsider, 'get', `${G()}/review`).expect(403);
    await req(student, 'delete', `${G()}/${ids.html}`).expect(403);
    await req(owner, 'delete', `${G()}/${ids.html}`).expect(204);
    const rows = await ctx.handle.db
      .select()
      .from(termReviews)
      .where(eq(termReviews.termId, ids.html!));
    expect(rows).toHaveLength(0);
    await req(student, 'post', `${G()}/review/${ids.html}`, { grade: 'GOOD' }).expect(404);
  });

  it('Tashkent day starts at 19:00 UTC', () => {
    expect(tashkentDayStart(new Date('2026-11-19T18:59:00Z')).toISOString()).toBe(
      '2026-11-18T19:00:00.000Z',
    );
    expect(tashkentDayStart(new Date('2026-11-19T19:00:00Z')).toISOString()).toBe(
      '2026-11-19T19:00:00.000Z',
    );
  });
});
