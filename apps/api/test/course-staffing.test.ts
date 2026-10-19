import { and, eq } from 'drizzle-orm';
import type { GroupEnrollResult, TeacherRow } from '@webdizayn/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { auditEvents, enrollments } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgId: string;
let otherOrgId: string;
let admin: Member;
let otherAdmin: Member;
let teacher: Member;
let author: Member;
let s1: Member;
let s2: Member;
let s3: Member;
let course: string;
let draft: string;
let foreignCourse: string;
let group: string;
let foreignGroup: string;

const A = (path: string, org = orgId) => `/orgs/${org}/admin${path}`;
const C = (id: string, org = orgId) => `/orgs/${org}/courses/${id}`;
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

async function newCourse(who: Member, slug: string, org = orgId, publish = true) {
  const id = (
    await req(who, 'post', `/orgs/${org}/courses`, { title: `Kurs ${slug}`, slug }).expect(201)
  ).body.course.id as string;
  const mod = (await req(who, 'post', `${C(id, org)}/modules`, { title: 'Modul' }).expect(201))
    .body;
  await req(who, 'post', `${C(id, org)}/modules/${mod.id}/lessons`, {
    title: 'Birinchi dars',
  }).expect(201);
  if (publish) await req(who, 'patch', C(id, org), { status: 'PUBLISHED' }).expect(200);
  return id;
}

beforeAll(async () => {
  ctx = await setup();
  orgId = await createOrg(ctx, 'college');
  otherOrgId = await createOrg(ctx, 'other');
  admin = await createMember(ctx, 'admin@c.uz', orgId, 'ORG_ADMIN');
  otherAdmin = await createMember(ctx, 'admin@o.uz', otherOrgId, 'ORG_ADMIN');
  teacher = await createMember(ctx, 'teacher@c.uz', orgId, 'TEACHER');
  author = await createMember(ctx, 'author@c.uz', orgId, 'TEACHER');
  s1 = await createMember(ctx, 's1@c.uz', orgId, 'STUDENT');
  s2 = await createMember(ctx, 's2@c.uz', orgId, 'STUDENT');
  s3 = await createMember(ctx, 's3@c.uz', orgId, 'STUDENT');

  course = await newCourse(author, 'html');
  draft = await newCourse(admin, 'draft', orgId, false);
  foreignCourse = await newCourse(otherAdmin, 'begona', otherOrgId);

  await req(admin, 'post', A('/roster/import'), {
    groups: [{ name: '8-24 ATT', students: ['BIRINCHI TALABA'] }],
  }).expect(200);
  await req(otherAdmin, 'post', A('/roster/import', otherOrgId), {
    groups: [{ name: '1-24 X', students: ['BEGONA TALABA'] }],
  }).expect(200);
  group = (await req(admin, 'get', A('/groups')).expect(200)).body[0].id;
  foreignGroup = (await req(otherAdmin, 'get', A('/groups', otherOrgId)).expect(200)).body[0].id;
  for (const s of [s1, s2, s3]) {
    await req(admin, 'put', A(`/students/${s.userId}/group`), { groupId: group }).expect(200);
  }
});

afterAll(async () => {
  await ctx.app.close();
});

describe('assigning teachers to courses', () => {
  it('requires ORG_ADMIN of this organization', async () => {
    const calls: ['put' | 'post', string, object][] = [
      ['put', A(`/teachers/${teacher.userId}/courses`), { courseIds: [course] }],
      ['post', A(`/groups/${group}/enroll`), { courseId: course }],
    ];
    for (const [m, p, b] of calls) {
      await req(null, m, p, b).expect(401);
      await req(teacher, m, p, b).expect(403);
      await req(s1, m, p, b).expect(403);
      await req(otherAdmin, m, p, b).expect(404);
      await req(teacher, m, p, b)
        .set('x-user-id', admin.userId)
        .set('x-role', 'ORG_ADMIN')
        .expect(403);
    }
  });

  it('lets an assigned teacher manage and review the course, and removal takes it away', async () => {
    await req(teacher, 'patch', C(course), { title: 'Yangi nom' }).expect(403);
    await req(teacher, 'get', `${C(course)}/analytics`).expect(403);

    const row = (
      await req(admin, 'put', A(`/teachers/${teacher.userId}/courses`), {
        courseIds: [course, draft],
      }).expect(200)
    ).body as TeacherRow;
    expect(row.courses.map((c) => c.id).sort()).toEqual([course, draft].sort());
    await req(teacher, 'patch', C(course), { title: 'Yangi nom' }).expect(200);
    await req(teacher, 'get', `${C(course)}/analytics`).expect(200);

    const list = (await req(admin, 'get', A('/teachers')).expect(200)).body as TeacherRow[];
    expect(list.find((t) => t.userId === teacher.userId)!.courses).toHaveLength(2);
    // The author keeps their own assignment.
    expect(list.find((t) => t.userId === author.userId)!.courses.map((c) => c.id)).toEqual([
      course,
    ]);

    await req(admin, 'put', A(`/teachers/${teacher.userId}/courses`), { courseIds: [] }).expect(
      200,
    );
    await req(teacher, 'patch', C(course), { title: 'Yana' }).expect(403);

    const [audit] = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(
        and(
          eq(auditEvents.action, 'teacher.courses_set'),
          eq(auditEvents.targetId, teacher.userId),
        ),
      );
    expect(audit).toBeDefined();
  });

  it('refuses courses of another organization, students and admins', async () => {
    await req(admin, 'put', A(`/teachers/${teacher.userId}/courses`), {
      courseIds: [foreignCourse],
    }).expect(404);
    await req(admin, 'put', A(`/teachers/${s1.userId}/courses`), { courseIds: [course] }).expect(
      404,
    );
    await req(admin, 'put', A(`/teachers/${admin.userId}/courses`), {
      courseIds: [course],
    }).expect(409);
    await req(admin, 'put', A(`/teachers/${teacher.userId}/courses`), {
      courseIds: [course, course],
    }).expect(400);
  });
});

describe('enrolling a group in a course', () => {
  it('only into a published course of this organization', async () => {
    const res = await req(admin, 'post', A(`/groups/${group}/enroll`), { courseId: draft }).expect(
      409,
    );
    expect(res.body.code).toBe('COURSE_NOT_PUBLISHED');
    await req(admin, 'post', A(`/groups/${group}/enroll`), { courseId: foreignCourse }).expect(404);
    await req(admin, 'post', A(`/groups/${foreignGroup}/enroll`), { courseId: course }).expect(404);
  });

  it('enrols active students once, skips disabled accounts, and is idempotent', async () => {
    await req(s1, 'post', `${C(course)}/enroll`).expect(201);
    await req(admin, 'post', A(`/accounts/${s3.userId}/disable`)).expect(200);

    const first = (
      await req(admin, 'post', A(`/groups/${group}/enroll`), { courseId: course }).expect(200)
    ).body as GroupEnrollResult;
    // s2 and the imported (password-less) student are new; s1 already enrolled; s3 disabled.
    expect(first).toEqual({
      courseId: course,
      enrolled: 2,
      alreadyEnrolled: 1,
      skippedDisabled: 1,
    });

    const again = (
      await req(admin, 'post', A(`/groups/${group}/enroll`), { courseId: course }).expect(200)
    ).body as GroupEnrollResult;
    expect(again.enrolled).toBe(0);
    expect(again.alreadyEnrolled).toBe(3);

    await req(s2, 'get', `${C(course)}/map`).expect(200);
    const s3rows = await ctx.handle.db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, s3.userId), eq(enrollments.courseId, course)));
    expect(s3rows).toHaveLength(0);

    const audits = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(and(eq(auditEvents.action, 'group.enroll'), eq(auditEvents.targetId, group)));
    expect(audits).toHaveLength(2);
    expect(JSON.stringify(audits)).not.toMatch(/TALABA/);
  });
});
