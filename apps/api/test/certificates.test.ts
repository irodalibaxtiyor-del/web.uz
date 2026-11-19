import { CERTIFICATE_CODE_RE } from '@webdizayn/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgA: string;
let orgB: string;
let owner: Member;
let otherTeacher: Member;
let foreignTeacher: Member;
let student: Member;
let lazy: Member;
let outsider: Member;
let courseId: string;
const lessons: string[] = [];
let code: string;
let certId: string;

const course = (org = orgA) => `/orgs/${org}/courses/${courseId}`;
const req = (who: Member | null, method: 'get' | 'post' | 'patch', path: string, body?: object) => {
  const r = ctx.http()[method](path);
  if (who) r.set('Cookie', who.cookie);
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
  lazy = await createMember(ctx, 's2@a.uz', orgA, 'STUDENT');
  outsider = await createMember(ctx, 'outsider@a.uz', orgA, 'STUDENT');
  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, {
    title: 'HTML asoslari',
    slug: 'html',
  });
  courseId = c.body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  for (const title of ['Teglar', 'Atributlar']) {
    const l = await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title });
    lessons.push(l.body.id);
  }
  await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
  for (const s of [student, lazy]) await req(s, 'post', `${course()}/enroll`).expect(201);
});
afterAll(async () => {
  await ctx.app.close();
});

describe('certificates', () => {
  it('is refused until every lesson is completed', async () => {
    let st = await req(student, 'get', `${course()}/certificate`).expect(200);
    expect(st.body).toMatchObject({ certificate: null, eligible: false, completed: 0, total: 2 });
    await req(student, 'post', `${course()}/lessons/${lessons[0]}/complete`).expect(201);
    await req(student, 'post', `${course()}/certificate`)
      .expect(409)
      .expect((r) => expect(r.body.code).toBe('CERTIFICATE_NOT_ELIGIBLE'));
    await req(student, 'post', `${course()}/lessons/${lessons[1]}/complete`).expect(201);
    st = await req(student, 'get', `${course()}/certificate`).expect(200);
    expect(st.body).toMatchObject({ eligible: true, completed: 2 });
  });

  it('issues once, with a well-formed code and frozen names', async () => {
    const r = await req(student, 'post', `${course()}/certificate`).expect(200);
    expect(r.body.code).toMatch(CERTIFICATE_CODE_RE);
    expect(r.body).toMatchObject({ courseTitle: 'HTML asoslari', lessons: 2, revoked: false });
    code = r.body.code;
    const again = await req(student, 'post', `${course()}/certificate`).expect(200);
    expect(again.body.code).toBe(code);
    // A later rename does not change the issued certificate.
    await req(owner, 'patch', course(), { title: 'Yangi nom' }).expect(200);
    const mine = await req(student, 'get', '/me/certificates').expect(200);
    expect(mine.body).toHaveLength(1);
    expect(mine.body[0].courseTitle).toBe('HTML asoslari');
  });

  it('anyone can verify by code (case and dashes forgiven); unknown codes are 404', async () => {
    const pub = await req(null, 'get', `/public/certificates/${code}`).expect(200);
    expect(pub.body).toMatchObject({ code, revoked: false, lessons: 2 });
    expect(JSON.stringify(pub.body)).not.toMatch(/userId|email|@a\.uz/);
    await req(null, 'get', `/public/certificates/${code.replace(/-/g, '').toLowerCase()}`).expect(
      200,
    );
    await req(null, 'get', '/public/certificates/AAAA-BBBB-CCCC').expect(404);
    await req(null, 'get', '/public/certificates/not-a-code').expect(404);
  });

  it('only enrolled students claim; only course staff list and revoke', async () => {
    await req(outsider, 'post', `${course()}/certificate`).expect(403);
    await req(lazy, 'post', `${course()}/certificate`).expect(409);
    await req(student, 'get', `${course()}/certificates`).expect(403);
    await req(otherTeacher, 'get', `${course()}/certificates`).expect(403);
    await req(foreignTeacher, 'get', `${course(orgB)}/certificates`).expect(404);
    const list = await req(owner, 'get', `${course()}/certificates`).expect(200);
    expect(list.body).toHaveLength(1);
    certId = list.body[0].id;
    await req(student, 'post', `${course()}/certificates/${certId}/revoke`, {
      reason: 'Sinov',
    }).expect(403);
  });

  it('revocation shows on the public page and cannot be repeated', async () => {
    await req(owner, 'post', `${course()}/certificates/${certId}/revoke`, { reason: '' }).expect(
      400,
    );
    const r = await req(owner, 'post', `${course()}/certificates/${certId}/revoke`, {
      reason: 'Topshiriqlar boshqa talabadan ko‘chirilgan',
    }).expect(200);
    expect(r.body.revokedAt).toBeTruthy();
    await req(owner, 'post', `${course()}/certificates/${certId}/revoke`, {
      reason: 'Yana bir bor',
    }).expect(409);
    const pub = await req(null, 'get', `/public/certificates/${code}`).expect(200);
    expect(pub.body).toMatchObject({
      revoked: true,
      revokedReason: expect.stringContaining('ko‘chirilgan'),
    });
    // A revoked certificate is not re-issued by claiming again.
    const again = await req(student, 'post', `${course()}/certificate`).expect(200);
    expect(again.body).toMatchObject({ code, revoked: true });
  });
});
