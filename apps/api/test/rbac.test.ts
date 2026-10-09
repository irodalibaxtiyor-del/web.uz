import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createMember, createOrg, setup, type TestContext } from './helpers';

let ctx: TestContext;
let orgA: string;
let orgB: string;
let student: { userId: string; cookie: string };
let teacherA: { userId: string; cookie: string };
let teacherB: { userId: string; cookie: string };

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  student = await createMember(ctx, 'student@a.uz', orgA, 'STUDENT');
  teacherA = await createMember(ctx, 'teacher@a.uz', orgA, 'TEACHER');
  teacherB = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
});
afterAll(async () => {
  await ctx.app.close();
});

const members = (orgId: string) => ctx.http().get(`/orgs/${orgId}/members`);

describe('org RBAC', () => {
  it('allows a teacher to list members of their own org', async () => {
    const res = await members(orgA).set('Cookie', teacherA.cookie).expect(200);
    expect(res.body).toHaveLength(2);
    expect(JSON.stringify(res.body)).not.toMatch(/email|password|hash/i);
  });

  it('denies a student (insufficient role)', async () => {
    await members(orgA).set('Cookie', student.cookie).expect(403);
  });

  it('denies cross-org access and hides org existence', async () => {
    await members(orgA).set('Cookie', teacherB.cookie).expect(404);
  });

  it('ignores forged identity and role headers', async () => {
    await members(orgA)
      .set('Cookie', student.cookie)
      .set('x-user-id', teacherA.userId)
      .set('x-role', 'ORG_ADMIN')
      .set('x-org-id', orgA)
      .expect(403);
    await members(orgA).set('x-user-id', teacherA.userId).set('x-role', 'TEACHER').expect(401);
  });

  it('returns 404 for a malformed org id', async () => {
    await members('not-a-uuid').set('Cookie', teacherA.cookie).expect(404);
  });

  it('requires a session', async () => {
    await members(orgA).expect(401);
  });
});
