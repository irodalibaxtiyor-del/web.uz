import { and, eq, sql } from 'drizzle-orm';
import type { RosterImportInput, RosterPreview } from '@webdizayn/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { UNUSABLE_PASSWORD_HASH } from '../src/auth/password.service';
import { auditEvents, groupStudents, memberships, users } from '../src/db/schema';
import { createMember, createOrg, sessionCookie, setup, type TestContext } from './helpers';

let ctx: TestContext;
let orgId: string;
let otherOrgId: string;
let admin: { userId: string; cookie: string };
let otherAdmin: { userId: string; cookie: string };
let teacher: { cookie: string };
let student: { cookie: string };

const ATT: RosterImportInput = {
  groups: [
    {
      name: '1-24 ATT',
      expectedCount: 3,
      students: ['ALIYEV ALI VALI O‘G‘LI', 'ALIYEV ALI SAMI O‘G‘LI', 'G‘OFUROVA NODIRA QIZI'],
    },
    { name: '2-24 KI', students: ['O`RINOV JASUR'] },
  ],
};

const preview = (cookie: string, body: object, org = orgId) =>
  ctx.http().post(`/orgs/${org}/admin/roster/preview`).set('Cookie', cookie).send(body);
const runImport = (cookie: string, body: object, org = orgId) =>
  ctx.http().post(`/orgs/${org}/admin/roster/import`).set('Cookie', cookie).send(body);

async function count(table: typeof users | typeof groupStudents) {
  const [r] = await ctx.handle.db.select({ n: sql<number>`count(*)::int` }).from(table);
  return r!.n;
}

beforeAll(async () => {
  ctx = await setup();
  orgId = await createOrg(ctx, 'college');
  otherOrgId = await createOrg(ctx, 'other');
  admin = await createMember(ctx, 'admin@g.uz', orgId, 'ORG_ADMIN');
  otherAdmin = await createMember(ctx, 'admin@other.uz', otherOrgId, 'ORG_ADMIN');
  teacher = await createMember(ctx, 'teacher@g.uz', orgId, 'TEACHER');
  student = await createMember(ctx, 'student@g.uz', orgId, 'STUDENT');
});

afterAll(async () => {
  await ctx.app.close();
});

describe('roster access', () => {
  it('requires a session and the ORG_ADMIN role of this organization', async () => {
    await ctx.http().post(`/orgs/${orgId}/admin/roster/preview`).send(ATT).expect(401);
    await preview(teacher.cookie, ATT).expect(403);
    await preview(student.cookie, ATT).expect(403);
    await runImport(student.cookie, ATT).expect(403);
    await preview(otherAdmin.cookie, ATT).expect(404);
    await ctx.http().get(`/orgs/${orgId}/admin/groups`).set('Cookie', teacher.cookie).expect(403);
  });

  it('ignores forged identity headers', async () => {
    await preview(student.cookie, ATT)
      .set('x-user-id', admin.userId)
      .set('x-role', 'ORG_ADMIN')
      .expect(403);
  });
});

describe('roster import', () => {
  it('previews without writing and proposes familiya.ism logins', async () => {
    const before = await count(users);
    const res = await preview(admin.cookie, ATT).expect(200);
    const p = res.body as RosterPreview;
    expect(p.canImport).toBe(true);
    expect(p.totals).toMatchObject({ rows: 4, NEW: 4 });
    expect(p.groups[0]!.rows.map((r) => r.login)).toEqual([
      'aliyev.ali',
      'aliyev.ali2',
      'gofurova.nodira',
    ]);
    expect(p.groups[1]!.rows[0]!.login).toBe('orinov.jasur');
    expect(await count(users)).toBe(before);
  });

  it('creates groups and student accounts without email or usable password', async () => {
    const res = await runImport(admin.cookie, ATT).expect(200);
    expect(res.body).toMatchObject({ created: 4, linked: 0, skipped: 0, groupsCreated: 2 });
    expect(res.body.groups).toEqual([
      { name: '1-24 ATT', students: 3 },
      { name: '2-24 KI', students: 1 },
    ]);

    const [u] = await ctx.handle.db.select().from(users).where(eq(users.login, 'gofurova.nodira'));
    // The name is stored exactly as given, apostrophes included.
    expect(u).toMatchObject({
      fullName: 'G‘OFUROVA NODIRA QIZI',
      email: null,
      passwordHash: UNUSABLE_PASSWORD_HASH,
      mustChangePassword: true,
    });
    const [m] = await ctx.handle.db
      .select({ role: memberships.role })
      .from(memberships)
      .where(and(eq(memberships.userId, u!.id), eq(memberships.organizationId, orgId)));
    expect(m!.role).toBe('STUDENT');

    const [audit] = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.action, 'roster.import'));
    expect(audit!.actorUserId).toBe(admin.userId);
    expect(JSON.stringify(audit!.metadata)).not.toContain('NODIRA');
  });

  it('imported accounts cannot sign in before a password is issued', async () => {
    await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'gofurova.nodira@x.uz', password: UNUSABLE_PASSWORD_HASH })
      .expect(401);
  });

  it('re-importing the same list creates nothing', async () => {
    const before = await count(users);
    const res = await runImport(admin.cookie, ATT).expect(200);
    expect(res.body).toMatchObject({ created: 0, skipped: 4, groupsCreated: 0 });
    expect(await count(users)).toBe(before);
    const p = (await preview(admin.cookie, ATT).expect(200)).body as RosterPreview;
    expect(p.groups[0]!.rows[2]).toMatchObject({
      status: 'ALREADY_IMPORTED',
      login: 'gofurova.nodira',
    });
  });

  it('lists groups and students without password hashes', async () => {
    const list = await ctx
      .http()
      .get(`/orgs/${orgId}/admin/groups`)
      .set('Cookie', admin.cookie)
      .expect(200);
    const att = list.body.find((g: { name: string }) => g.name === '1-24 ATT');
    expect(att).toMatchObject({ code: '1-24att', students: 3, teachers: 0 });

    const res = await ctx
      .http()
      .get(`/orgs/${orgId}/admin/groups/${att.id}/students`)
      .set('Cookie', admin.cookie)
      .expect(200);
    expect(res.body.students).toHaveLength(3);
    expect(res.body.students[0]).toMatchObject({ hasPassword: false, mustChangePassword: true });
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|!unset|argon2/);

    // Another organization's admin cannot reach this group by id.
    await ctx
      .http()
      .get(`/orgs/${otherOrgId}/admin/groups/${att.id}/students`)
      .set('Cookie', otherAdmin.cookie)
      .expect(404);
  });
});

describe('roster problems are reported, never silently fixed', () => {
  it('blocks duplicates inside the list (apostrophe variants count as the same name)', async () => {
    const before = await count(users);
    const body = {
      groups: [{ name: '3-24 ATT', students: ['TO‘RAYEV BEK', "TO'RAYEV  BEK", 'NAZAROV OLIM'] }],
    };
    const p = (await preview(admin.cookie, body).expect(200)).body as RosterPreview;
    expect(p.canImport).toBe(false);
    expect(p.totals.DUPLICATE_IN_INPUT).toBe(2);
    const res = await runImport(admin.cookie, body).expect(409);
    expect(res.body.code).toBe('ROSTER_INVALID');
    expect(await count(users)).toBe(before);
  });

  it('blocks a name that already sits in another group', async () => {
    const body = { groups: [{ name: '3-24 ATT', students: ['ALIYEV ALI VALI O‘G‘LI'] }] };
    const p = (await preview(admin.cookie, body).expect(200)).body as RosterPreview;
    expect(p.groups[0]!.rows[0]).toMatchObject({
      status: 'IN_OTHER_GROUP',
      otherGroup: '1-24 ATT',
    });
    await runImport(admin.cookie, body).expect(409);
  });

  it('blocks a stated count that does not match the names', async () => {
    const body = { groups: [{ name: '4-24 ATT', expectedCount: 2, students: ['NAZAROV OLIM'] }] };
    const p = (await preview(admin.cookie, body).expect(200)).body as RosterPreview;
    expect(p.problems.join(' ')).toContain('2 nafar');
    await runImport(admin.cookie, body).expect(409);
  });

  it('blocks the same group twice', async () => {
    const body = {
      groups: [
        { name: '5-24 ATT', students: ['NAZAROV OLIM'] },
        { name: '5-24 att', students: ['RASULOV TIMUR'] },
      ],
    };
    expect(((await preview(admin.cookie, body)).body as RosterPreview).canImport).toBe(false);
  });

  it('rejects malformed input', async () => {
    await preview(admin.cookie, { groups: [{ name: 'X1', students: ['ALI'] }] }).expect(400);
    await preview(admin.cookie, { groups: [] }).expect(400);
  });
});

describe('matching self-registered students', () => {
  let selfId: string;
  const body = (resolutions?: RosterImportInput['resolutions']) => ({
    groups: [{ name: '6-24 KI', students: ['KARIMOV BOBUR'] }],
    ...(resolutions ? { resolutions } : {}),
  });

  beforeAll(async () => {
    const res = await ctx
      .http()
      .post('/auth/register')
      .send({ email: 'bobur@mail.uz', password: 'bobur-password-1', fullName: 'Karimov Bobur' })
      .expect(201);
    sessionCookie(res);
    const [u] = await ctx.handle.db.select().from(users).where(eq(users.email, 'bobur@mail.uz'));
    selfId = u!.id;
    // Self-registration lands in the default organization; put the student into this one too.
    await ctx.handle.db
      .insert(memberships)
      .values({ userId: selfId, organizationId: orgId, role: 'STUDENT' });
  });

  it('asks the admin to decide and does not accept a foreign user id', async () => {
    const p = (await preview(admin.cookie, body()).expect(200)).body as RosterPreview;
    expect(p.groups[0]!.rows[0]).toMatchObject({ status: 'NAME_MATCH' });
    expect(p.groups[0]!.rows[0]!.candidates).toEqual([
      { userId: selfId, login: null, email: 'bobur@mail.uz' },
    ]);
    await runImport(admin.cookie, body()).expect(409);
    await runImport(
      admin.cookie,
      body({ 'KARIMOV BOBUR': { action: 'LINK', userId: admin.userId } }),
    ).expect(409);
  });

  it('links the existing account instead of creating a duplicate', async () => {
    const before = await count(users);
    const res = await runImport(
      admin.cookie,
      body({ 'KARIMOV BOBUR': { action: 'LINK', userId: selfId } }),
    ).expect(200);
    expect(res.body).toMatchObject({ created: 0, linked: 1 });
    expect(await count(users)).toBe(before);
    // The linked student keeps signing in with their own email and password.
    await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'bobur@mail.uz', password: 'bobur-password-1' })
      .expect(200);
  });
});

describe('concurrency', () => {
  it('two simultaneous imports of the same list create each account once', async () => {
    const body = { groups: [{ name: '7-24 ATT', students: ['SOLIYEV ANVAR', 'TOSHEVA MALIKA'] }] };
    const before = await count(users);
    const results = await Promise.all([
      runImport(admin.cookie, body),
      runImport(admin.cookie, body),
    ]);
    expect(results.map((r) => r.status)).toEqual([200, 200]);
    expect(results.map((r) => r.body.created).sort()).toEqual([0, 2]);
    expect(await count(users)).toBe(before + 2);
  });
});
