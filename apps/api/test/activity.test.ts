import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { activityLastPing, activityTime } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgA: string;
let owner: Member;
let student: Member;
let outsider: Member;
let courseId: string;
let otherCourseId: string;
let lessonId: string;
let otherLessonId: string;

const course = (id = courseId) => `/orgs/${orgA}/courses/${id}`;
const req = (who: Member, method: 'get' | 'post' | 'patch', path: string, body?: object) => {
  const r = ctx.http()[method](path).set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};
const ping = (who: Member, body: object) => req(who, 'post', `${course()}/activity`, body);

async function makeCourse(slug: string) {
  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: slug, slug });
  const id = c.body.course.id as string;
  const mod = await req(owner, 'post', `${course(id)}/modules`, { title: '1-modul' });
  const l = await req(owner, 'post', `${course(id)}/modules/${mod.body.id}/lessons`, {
    title: 'Teglar',
  });
  await req(owner, 'patch', course(id), { status: 'PUBLISHED' }).expect(200);
  return { id, lesson: l.body.id as string };
}

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  student = await createMember(ctx, 's@a.uz', orgA, 'STUDENT');
  outsider = await createMember(ctx, 'o@a.uz', orgA, 'STUDENT');
  ({ id: courseId, lesson: lessonId } = await makeCourse('html'));
  ({ id: otherCourseId, lesson: otherLessonId } = await makeCourse('css'));
  await req(student, 'post', `${course()}/enroll`).expect(201);
});
afterAll(async () => {
  await ctx.app.close();
});

describe('time on task', () => {
  it('credits the first ping and caps the next by the real time since the previous one', async () => {
    const first = await ping(student, { kind: 'LESSON', targetId: lessonId, seconds: 30 }).expect(
      200,
    );
    expect(first.body.credited).toBe(30);
    const second = await ping(student, { kind: 'LESSON', targetId: lessonId, seconds: 30 }).expect(
      200,
    );
    expect(second.body.credited).toBeLessThanOrEqual(1);
    // Two minutes later the next ping counts in full (at most 30 s).
    await ctx.handle.db
      .update(activityLastPing)
      .set({ at: new Date(Date.now() - 120_000) })
      .where(eq(activityLastPing.userId, student.userId));
    const third = await ping(student, { kind: 'LESSON', targetId: lessonId, seconds: 30 }).expect(
      200,
    );
    expect(third.body.credited).toBe(30);
    const rows = await ctx.handle.db
      .select()
      .from(activityTime)
      .where(eq(activityTime.userId, student.userId));
    expect(rows).toHaveLength(1);
    expect(rows[0]!.seconds).toBeGreaterThanOrEqual(60);
  });

  it('refuses items of another course, outsiders and bad input', async () => {
    await ping(student, { kind: 'LESSON', targetId: otherLessonId, seconds: 30 }).expect(404);
    await ping(outsider, { kind: 'LESSON', targetId: lessonId, seconds: 30 }).expect(403);
    await ping(student, { kind: 'LESSON', targetId: lessonId, seconds: 3600 }).expect(400);
    await ping(student, { kind: 'VIDEO', targetId: lessonId, seconds: 10 }).expect(400);
    await req(student, 'post', `${course(otherCourseId)}/activity`, {
      kind: 'LESSON',
      targetId: otherLessonId,
      seconds: 30,
    }).expect(403);
  });

  it('appears as active minutes in the pre/post results', async () => {
    const res = await req(owner, 'get', `${course()}/assessments/results`).expect(200);
    expect(res.body.rows[0].activeMinutes).toBeGreaterThanOrEqual(1);
    expect(res.body.meanActiveMinutes).toBeGreaterThanOrEqual(1);
  });
});
