import { eq, sql } from 'drizzle-orm';
import type { CreatedTeacher, TeacherRow, TemporaryCredential } from '@webdizayn/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bootstrapAdmin } from '../src/accounts/bootstrap-admin';
import { PasswordService } from '../src/auth/password.service';
import { unzip } from './unzip';
import { auditEvents, memberships, users } from '../src/db/schema';
import {
  createMember,
  createOrg,
  PASSWORD,
  sessionCookie,
  setup,
  type TestContext,
} from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgId: string;
let otherOrgId: string;
let admin: Member;
let admin2: Member;
let otherAdmin: Member;
let teacher: Member;
let student: Member;
let groupA: string;
let groupB: string;
let foreignGroup: string;

const A = (path: string, org = orgId) => `/orgs/${org}/admin${path}`;
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
const login = (identifier: string, password: string) =>
  ctx.http().post('/auth/login').send({ login: identifier, password });

/** Parses a binary response body (supertest buffers it with this parser). */
const binary = (r: ReturnType<typeof req>) =>
  r.buffer(true).parse((res, cb) => {
    const chunks: Buffer[] = [];
    res.on('data', (c: Buffer) => chunks.push(c));
    res.on('end', () => cb(null, Buffer.concat(chunks)));
  });

function sheetText(buf: Buffer, n = 1) {
  return unzip(buf).get(`xl/worksheets/sheet${n}.xml`) ?? '';
}

beforeAll(async () => {
  ctx = await setup();
  orgId = await createOrg(ctx, 'college');
  otherOrgId = await createOrg(ctx, 'other');
  admin = await createMember(ctx, 'admin@c.uz', orgId, 'ORG_ADMIN');
  admin2 = await createMember(ctx, 'admin2@c.uz', orgId, 'ORG_ADMIN');
  otherAdmin = await createMember(ctx, 'admin@o.uz', otherOrgId, 'ORG_ADMIN');
  teacher = await createMember(ctx, 'teacher@c.uz', orgId, 'TEACHER');
  student = await createMember(ctx, 'student@c.uz', orgId, 'STUDENT');

  await req(admin, 'post', A('/roster/import'), {
    groups: [
      { name: '8-24 ATT', students: ['ALIYEV ALI VALI O‘G‘LI', 'KARIMOVA ZARINA QIZI'] },
      { name: '10-24 KI', students: ['TOSHEV BEK'] },
    ],
  }).expect(200);
  await req(otherAdmin, 'post', A('/roster/import', otherOrgId), {
    groups: [{ name: '1-24 X', students: ['BEGONA TALABA'] }],
  }).expect(200);
  const list = (await req(admin, 'get', A('/groups')).expect(200)).body as {
    id: string;
    name: string;
  }[];
  groupA = list.find((g) => g.name === '8-24 ATT')!.id;
  groupB = list.find((g) => g.name === '10-24 KI')!.id;
  foreignGroup = (await req(otherAdmin, 'get', A('/groups', otherOrgId)).expect(200)).body[0].id;
});

afterAll(async () => {
  await ctx.app.close();
});

describe('admin account endpoints: access', () => {
  it('require a session and ORG_ADMIN of this organization', async () => {
    const paths: ['get' | 'post' | 'put' | 'patch', string, object?][] = [
      ['get', A('/teachers')],
      ['post', A('/teachers'), { fullName: 'X Y Z', login: 'x.y' }],
      ['get', A('/students')],
      ['post', A(`/accounts/${student.userId}/reset-password`)],
      ['post', A(`/accounts/${student.userId}/disable`)],
      ['post', A('/credentials/reset.xlsx'), { groupId: groupA }],
      ['get', A('/logins.xlsx')],
    ];
    for (const [m, p, b] of paths) {
      await req(null, m, p, b).expect(401);
      await req(teacher, m, p, b).expect(403);
      await req(student, m, p, b).expect(403);
      await req(otherAdmin, m, p, b).expect(404);
    }
  });

  it('ignores forged identity headers', async () => {
    await req(teacher, 'get', A('/teachers'))
      .set('x-user-id', admin.userId)
      .set('x-role', 'ORG_ADMIN')
      .expect(403);
  });
});

describe('teachers', () => {
  let created: CreatedTeacher;

  it('creates a teacher with a one-time temporary password', async () => {
    const res = await req(admin, 'post', A('/teachers'), {
      fullName: 'Nodira Qodirova',
      login: 'N.Qodirova',
      email: 'Nodira@C.uz',
    }).expect(201);
    created = res.body;
    expect(created.teacher).toMatchObject({
      login: 'n.qodirova',
      email: 'nodira@c.uz',
      mustChangePassword: true,
      hasPassword: true,
      disabled: false,
      groups: [],
    });
    expect(created.credential.temporaryPassword).toMatch(/^wd-[a-z2-9]{4}-[a-z2-9]{4}$/);

    const [row] = await ctx.handle.db
      .select()
      .from(users)
      .where(eq(users.id, created.teacher.userId));
    expect(row!.passwordHash).toMatch(/^\$argon2id\$/);
    expect(row!.passwordHash).not.toContain(created.credential.temporaryPassword);
    const audit = await ctx.handle.db
      .select({ metadata: auditEvents.metadata })
      .from(auditEvents)
      .where(eq(auditEvents.action, 'teacher.create'));
    expect(JSON.stringify(audit)).not.toContain(created.credential.temporaryPassword);

    const list = (await req(admin, 'get', A('/teachers')).expect(200)).body as TeacherRow[];
    expect(JSON.stringify(list)).not.toMatch(/argon|temporaryPassword|passwordHash/);
  });

  it('keeps logins and emails unique (case-insensitive, students included)', async () => {
    const r1 = await req(admin, 'post', A('/teachers'), {
      fullName: 'Boshqa Odam',
      login: 'N.QODIROVA',
    });
    expect(r1.status).toBe(409);
    expect(r1.body.code).toBe('LOGIN_TAKEN');
    // A roster login created by the import.
    const r2 = await req(admin, 'post', A('/teachers'), {
      fullName: 'Boshqa Odam',
      login: 'aliyev.ali',
    });
    expect(r2.body.code).toBe('LOGIN_TAKEN');
    const r3 = await req(admin, 'post', A('/teachers'), {
      fullName: 'Boshqa Odam',
      login: 'boshqa.odam',
      email: 'STUDENT@c.uz',
    });
    expect(r3.body.code).toBe('EMAIL_TAKEN');
    await req(admin, 'post', A('/teachers'), { fullName: 'X', login: 'bad login' }).expect(400);
  });

  it('forces a password change before anything else works', async () => {
    const res = await login('n.qodirova', created.credential.temporaryPassword).expect(200);
    expect(res.body.mustChangePassword).toBe(true);
    const cookie = sessionCookie(res);
    const blocked = await ctx
      .http()
      .get(`/orgs/${orgId}/courses`)
      .set('Cookie', cookie)
      .expect(403);
    expect(blocked.body.code).toBe('PASSWORD_CHANGE_REQUIRED');
    await ctx.http().get(`/orgs/${orgId}/groups`).set('Cookie', cookie).expect(403);
    await ctx.http().get('/auth/me').set('Cookie', cookie).expect(200);

    const wrong = await ctx
      .http()
      .post('/auth/password')
      .set('Cookie', cookie)
      .send({ currentPassword: 'not-it-at-all', newPassword: 'yangi-parol-2026' })
      .expect(401);
    expect(wrong.body.code).toBe('WRONG_PASSWORD');
    await ctx
      .http()
      .post('/auth/password')
      .set('Cookie', cookie)
      .send({ currentPassword: created.credential.temporaryPassword, newPassword: 'short' })
      .expect(400);
    await ctx
      .http()
      .post('/auth/password')
      .set('Cookie', cookie)
      .send({
        currentPassword: created.credential.temporaryPassword,
        newPassword: 'yangi-parol-2026',
      })
      .expect(204);

    await ctx.http().get(`/orgs/${orgId}/groups`).set('Cookie', cookie).expect(200);
    const me = await ctx.http().get('/auth/me').set('Cookie', cookie).expect(200);
    expect(me.body.mustChangePassword).toBe(false);
    await login('n.qodirova', created.credential.temporaryPassword).expect(401);
    await login('nodira@c.uz', 'yangi-parol-2026').expect(200);
  });

  it('assigns groups of this organization only', async () => {
    const id = created.teacher.userId;
    await req(admin, 'put', A(`/teachers/${id}/groups`), { groupIds: [foreignGroup] }).expect(404);
    await req(admin, 'put', A(`/teachers/${id}/groups`), { groupIds: [groupA, groupA] }).expect(
      400,
    );
    let res = await req(admin, 'put', A(`/teachers/${id}/groups`), {
      groupIds: [groupA, groupB],
    }).expect(200);
    expect((res.body as TeacherRow).groups.map((g) => g.name).sort()).toEqual([
      '10-24 KI',
      '8-24 ATT',
    ]);
    res = await req(admin, 'put', A(`/teachers/${id}/groups`), { groupIds: [groupB] }).expect(200);
    expect((res.body as TeacherRow).groups.map((g) => g.name)).toEqual(['10-24 KI']);
    const audit = await ctx.handle.db
      .select({ n: sql<number>`count(*)::int` })
      .from(auditEvents)
      .where(eq(auditEvents.action, 'teacher.groups_set'));
    expect(audit[0]!.n).toBe(2);
  });

  it('edits a teacher; refuses to remove the last identifier', async () => {
    const id = created.teacher.userId;
    const res = await req(admin, 'patch', A(`/teachers/${id}`), {
      fullName: 'Nodira Qodirova-Ali',
    }).expect(200);
    expect(res.body.fullName).toBe('Nodira Qodirova-Ali');
    await req(admin, 'patch', A(`/teachers/${id}`), { email: null }).expect(200);
    await req(admin, 'patch', A(`/teachers/${id}`), {}).expect(400);
    await req(admin, 'patch', A(`/teachers/${student.userId}`), { fullName: 'Talaba Emas' }).expect(
      404,
    );
  });
});

describe('who an admin may manage', () => {
  it('not themselves, other admins, other organizations or shared accounts', async () => {
    const self = await req(admin, 'post', A(`/accounts/${admin.userId}/disable`)).expect(409);
    expect(self.body.code).toBe('SELF_ACCOUNT');
    await req(admin, 'post', A(`/accounts/${admin2.userId}/reset-password`)).expect(404);
    await req(admin, 'post', A(`/accounts/${otherAdmin.userId}/disable`)).expect(404);

    const shared = await createMember(ctx, 'shared@c.uz', orgId, 'STUDENT');
    await ctx.handle.db
      .insert(memberships)
      .values({ userId: shared.userId, organizationId: otherOrgId, role: 'STUDENT' });
    const res = await req(admin, 'post', A(`/accounts/${shared.userId}/reset-password`)).expect(
      409,
    );
    expect(res.body.code).toBe('ACCOUNT_SHARED');
    await req(admin, 'post', A(`/accounts/not-a-uuid/disable`)).expect(404);
  });
});

describe('disabling', () => {
  it('signs the account out and makes login fail like a wrong password', async () => {
    const t = await createMember(ctx, 'disable-me@c.uz', orgId, 'TEACHER');
    await ctx.http().get('/auth/me').set('Cookie', t.cookie).expect(200);
    const res = await req(admin, 'post', A(`/accounts/${t.userId}/disable`)).expect(200);
    expect(res.body).toMatchObject({ disabled: true });
    await ctx.http().get('/auth/me').set('Cookie', t.cookie).expect(401);

    const disabled = await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'disable-me@c.uz', password: PASSWORD });
    const wrong = await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'teacher@c.uz', password: 'wrong-pass' });
    expect(disabled.status).toBe(401);
    expect(disabled.body.message).toBe(wrong.body.message);

    await req(admin, 'post', A(`/accounts/${t.userId}/enable`)).expect(200);
    await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'disable-me@c.uz', password: PASSWORD })
      .expect(200);
    const actions = (
      await ctx.handle.db
        .select({ a: auditEvents.action })
        .from(auditEvents)
        .where(eq(auditEvents.targetId, t.userId))
    ).map((r) => r.a);
    expect(actions).toEqual(expect.arrayContaining(['account.disable', 'account.enable']));
  });
});

describe('student passwords and exports', () => {
  it('issues a group’s temporary passwords as a one-time .xlsx', async () => {
    const res = await binary(
      req(admin, 'post', A('/credentials/reset.xlsx'), { groupId: groupA }),
    ).expect(200);
    expect(res.headers['content-type']).toContain('spreadsheetml');
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.headers['x-credentials-count']).toBe('2');
    const sheet = sheetText(res.body as Buffer);
    expect(sheet).toContain('ALIYEV ALI VALI O‘G‘LI');
    expect(sheet).toContain('aliyev.ali');
    expect(sheet).not.toContain('TOSHEV BEK');
    const passwords = [...sheet.matchAll(/8-24att-[a-z2-9]{4}-[a-z2-9]{4}/g)].map((m) => m[0]);
    expect(passwords).toHaveLength(2);

    // Each password works once, then must be changed.
    const ok = await login('aliyev.ali', passwords[0]!).expect(200);
    expect(ok.body.mustChangePassword).toBe(true);

    // Plain passwords are nowhere in the database.
    const dump = JSON.stringify(
      await ctx.handle.db.execute(sql`select row_to_json(t) from (select * from users) t`),
    ).concat(JSON.stringify(await ctx.handle.db.select().from(auditEvents)));
    for (const p of passwords) expect(dump).not.toContain(p);
    const [audit] = await ctx.handle.db
      .select({ metadata: auditEvents.metadata })
      .from(auditEvents)
      .where(eq(auditEvents.action, 'credentials.export'));
    expect(audit!.metadata).toMatchObject({ groupId: groupA, count: 2 });
  });

  it('can hand out only to accounts that never had a password', async () => {
    const res = await binary(
      req(admin, 'post', A('/credentials/reset.xlsx'), {
        groupId: groupA,
        onlyWithoutPassword: true,
      }),
    ).expect(200);
    expect(res.headers['x-credentials-count']).toBe('0');
    await req(admin, 'post', A('/credentials/reset.xlsx'), { groupId: foreignGroup }).expect(404);
    await req(admin, 'post', A('/credentials/reset.xlsx'), {}).expect(400);
  });

  it('resets one password and signs the account out', async () => {
    const students = (await req(admin, 'get', A('/students')).expect(200)).body as {
      userId: string;
      login: string;
    }[];
    const bek = students.find((s) => s.login === 'toshev.bek')!;
    const res = await req(admin, 'post', A(`/accounts/${bek.userId}/reset-password`)).expect(200);
    const cred = res.body.credential as TemporaryCredential;
    expect(cred).toMatchObject({ login: 'toshev.bek', group: '10-24 KI' });
    expect(res.headers['cache-control']).toBe('no-store');
    const first = sessionCookie(await login('toshev.bek', cred.temporaryPassword).expect(200));
    await req(admin, 'post', A(`/accounts/${bek.userId}/reset-password`)).expect(200);
    await ctx.http().get('/auth/me').set('Cookie', first).expect(401);
  });

  it('exports logins without any password data', async () => {
    const res = await binary(req(admin, 'get', A('/logins.xlsx'))).expect(200);
    const students = sheetText(res.body as Buffer, 1);
    const teachers = sheetText(res.body as Buffer, 2);
    expect(students).toContain('aliyev.ali');
    expect(students).toContain('Guruhsiz');
    expect(teachers).toContain('n.qodirova');
    expect(students + teachers).not.toMatch(/argon|\$argon2|8-24att-[a-z2-9]{4}-/);
    const [audit] = await ctx.handle.db
      .select({ n: sql<number>`count(*)::int` })
      .from(auditEvents)
      .where(eq(auditEvents.action, 'logins.export'));
    expect(audit!.n).toBe(1);
  });

  it('moves a student between groups of this organization', async () => {
    const res = await req(admin, 'put', A(`/students/${student.userId}/group`), {
      groupId: groupB,
    }).expect(200);
    expect(res.body.group).toMatchObject({ id: groupB });
    await req(admin, 'put', A(`/students/${student.userId}/group`), {
      groupId: foreignGroup,
    }).expect(404);
    const out = await req(admin, 'put', A(`/students/${student.userId}/group`), {
      groupId: null,
    }).expect(200);
    expect(out.body.group).toBeNull();
  });
});

describe('login by name', () => {
  it('accepts the admin-issued login and keeps email login working', async () => {
    await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'student@c.uz', password: PASSWORD })
      .expect(200);
    await ctx
      .http()
      .post('/auth/login')
      .send({ login: 'STUDENT@c.uz', password: PASSWORD })
      .expect(200);
    // An imported account without a password cannot sign in at all.
    await login('karimova.zarina', '').expect(400);
    await login('karimova.zarina', 'anything-here').expect(401);
  });
});

describe('first administrator bootstrap', () => {
  it('creates one admin who must change the password, and is idempotent', async () => {
    const passwords = new PasswordService();
    const fresh = await createOrg(ctx, 'fresh-college');
    const input = {
      identifier: 'Bosh.Admin',
      fullName: 'Bosh Admin',
      password: 'bootstrap-secret-1',
    };
    await expect(
      bootstrapAdmin(ctx.handle.db, passwords, fresh, { ...input, password: 'short' }),
    ).rejects.toThrow(/12\+/);
    expect(await bootstrapAdmin(ctx.handle.db, passwords, fresh, input)).toBe('CREATED');
    expect(
      await bootstrapAdmin(ctx.handle.db, passwords, fresh, {
        ...input,
        identifier: 'boshqa.admin',
      }),
    ).toBe('ADMIN_EXISTS');
    expect(await bootstrapAdmin(ctx.handle.db, passwords, otherOrgId, input)).toBe('ADMIN_EXISTS');
    const res = await login('bosh.admin', 'bootstrap-secret-1').expect(200);
    expect(res.body.mustChangePassword).toBe(true);
    expect(res.body.memberships[0]).toMatchObject({ organizationId: fresh, role: 'ORG_ADMIN' });
    const audit = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.action, 'admin.bootstrap'));
    expect(JSON.stringify(audit)).not.toContain('bootstrap-secret-1');
  });
});
