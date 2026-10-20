import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { auditEvents, courseSlugRedirects, organizations } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let org: string;
let otherOrg: string;
let teacher: Member;
let otherTeacher: Member;
let foreignTeacher: Member;
let student: Member;

const base = (o = org) => `/orgs/${o}/courses`;
const send = (who: Member, method: 'post' | 'patch', path: string, body: object = {}) =>
  ctx.http()[method](path).set('Cookie', who.cookie).send(body);
const get = (who: Member, path: string) => ctx.http().get(path).set('Cookie', who.cookie);
const pub = (slug: string) => ctx.http().get(`/public/courses/${slug}`);

async function create(who: Member, body: object, o = org) {
  return (await send(who, 'post', base(o), body).expect(201)).body.course as {
    id: string;
    slug: string;
  };
}

async function publish(who: Member, id: string) {
  const mod = (await send(who, 'post', `${base()}/${id}/modules`, { title: 'Modul' }).expect(201))
    .body.id;
  await send(who, 'post', `${base()}/${id}/modules/${mod}/lessons`, { title: 'Dars' }).expect(201);
  await send(who, 'patch', `${base()}/${id}`, { status: 'PUBLISHED' }).expect(200);
}

beforeAll(async () => {
  ctx = await setup();
  const [platform] = await ctx.handle.db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, ctx.config.DEFAULT_ORG_SLUG));
  org = platform!.id;
  otherOrg = await createOrg(ctx, 'boshqa');
  teacher = await createMember(ctx, 'teacher@slug.uz', org, 'TEACHER');
  otherTeacher = await createMember(ctx, 'other@slug.uz', org, 'TEACHER');
  foreignTeacher = await createMember(ctx, 'teacher@boshqa.uz', otherOrg, 'TEACHER');
  student = await createMember(ctx, 'student@slug.uz', org, 'STUDENT');
});
afterAll(async () => {
  await ctx.app.close();
});

describe('course slugs', () => {
  it('generates the slug from an Uzbek title (Latin and Cyrillic)', async () => {
    expect((await create(teacher, { title: 'Oʻzbek tili: Grammatika asoslari' })).slug).toBe(
      'ozbek-tili-grammatika-asoslari',
    );
    expect((await create(teacher, { title: 'Шаҳар чироқлари' })).slug).toBe('shahar-chiroqlari');
    expect((await create(teacher, { title: '!!!' })).slug).toBe('kurs');
  });

  it('makes slugs unique with -2, -3 inside an organization only', async () => {
    expect((await create(teacher, { title: 'O‘zbek tili: grammatika asoslari' })).slug).toBe(
      'ozbek-tili-grammatika-asoslari-2',
    );
    expect((await create(teacher, { title: "O'zbek tili — Grammatika asoslari" })).slug).toBe(
      'ozbek-tili-grammatika-asoslari-3',
    );
    expect(
      (await create(foreignTeacher, { title: 'Oʻzbek tili: Grammatika asoslari' }, otherOrg)).slug,
    ).toBe('ozbek-tili-grammatika-asoslari');
  });

  it('keeps long slugs within 80 characters, suffix included', async () => {
    const title = 'Juda uzun kurs nomi '.repeat(8);
    const a = await create(teacher, { title });
    const b = await create(teacher, { title });
    expect(a.slug.length).toBeLessThanOrEqual(80);
    expect(b.slug.length).toBeLessThanOrEqual(80);
    expect(b.slug).toMatch(/-2$/);
    expect(b.slug).not.toContain('--');
  });

  it('gives parallel creations different slugs', async () => {
    const res = await Promise.all(
      Array.from({ length: 5 }, () => send(teacher, 'post', base(), { title: 'Parallel kurs' })),
    );
    expect(res.map((r) => r.status)).toEqual([201, 201, 201, 201, 201]);
    expect(res.map((r) => r.body.course.slug).sort()).toEqual([
      'parallel-kurs',
      'parallel-kurs-2',
      'parallel-kurs-3',
      'parallel-kurs-4',
      'parallel-kurs-5',
    ]);
  });

  it('validates slugs on the server', async () => {
    for (const slug of ['Bad slug', 'a--b', '-a', 'oʻzbek', 'a'.repeat(81), '']) {
      await send(teacher, 'post', base(), { title: 'Kurs', slug }).expect(400);
    }
    const c = await create(teacher, { title: 'Tekshiruv' });
    await send(teacher, 'patch', `${base()}/${c.id}`, { slug: 'Yomon Slug' }).expect(400);
  });

  it('previews the slug the server would give (staff only)', async () => {
    const q = (s: string) => `${base()}/slug-suggestion?${s}`;
    const title = encodeURIComponent('Oʻzbek tili: Grammatika asoslari');
    expect((await get(teacher, q(`title=${title}`)).expect(200)).body).toEqual({
      requested: 'ozbek-tili-grammatika-asoslari',
      slug: 'ozbek-tili-grammatika-asoslari-4',
      available: false,
    });
    expect((await get(teacher, q('slug=yangi-kurs')).expect(200)).body).toEqual({
      requested: 'yangi-kurs',
      slug: 'yangi-kurs',
      available: true,
    });
    await get(teacher, q('slug=Bad%20slug')).expect(400);
    await get(student, q('slug=x')).expect(403);
    await ctx.http().get(q('slug=x')).expect(401);
  });

  it('renames a published course: the old slug redirects and stays reserved', async () => {
    const c = await create(teacher, { title: 'Eski nom' });
    await publish(teacher, c.id);
    await pub('eski-nom').expect(200);

    const res = await send(teacher, 'patch', `${base()}/${c.id}`, { slug: 'yangi-nom' }).expect(
      200,
    );
    expect(res.body.course.slug).toBe('yangi-nom');
    expect((await pub('eski-nom').expect(200)).body).toEqual({ movedTo: 'yangi-nom' });
    expect((await pub('yangi-nom').expect(200)).body.id).toBe(c.id);

    // A second rename: both old slugs point to the current one (no chains).
    await send(teacher, 'patch', `${base()}/${c.id}`, { slug: 'uchinchi-nom' }).expect(200);
    for (const old of ['eski-nom', 'yangi-nom']) {
      expect((await pub(old).expect(200)).body).toEqual({ movedTo: 'uchinchi-nom' });
    }

    // Another course can take neither the old slug (explicit → 409, generated → "-2")…
    const other = await create(otherTeacher, { title: 'Boshqa kurs' });
    const taken = await send(otherTeacher, 'patch', `${base()}/${other.id}`, {
      slug: 'eski-nom',
    }).expect(409);
    expect(taken.body.code).toBe('SLUG_TAKEN');
    expect((await create(otherTeacher, { title: 'Eski nom' })).slug).toBe('eski-nom-2');

    // …but the course itself may take its old slug back; that redirect then disappears.
    await send(teacher, 'patch', `${base()}/${c.id}`, { slug: 'eski-nom' }).expect(200);
    expect((await pub('eski-nom').expect(200)).body.id).toBe(c.id);
    const rows = await ctx.handle.db
      .select()
      .from(courseSlugRedirects)
      .where(eq(courseSlugRedirects.courseId, c.id));
    expect(rows.map((r) => r.slug).sort()).toEqual(['uchinchi-nom', 'yangi-nom']);

    const audit = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.action, 'course.slug_change'));
    expect(audit.filter((a) => a.targetId === c.id)).toHaveLength(3);
  });

  it('does not redirect for drafts or hidden courses', async () => {
    const draft = await create(teacher, { title: 'Qoralama' });
    await send(teacher, 'patch', `${base()}/${draft.id}`, { slug: 'qoralama-yangi' }).expect(200);
    await pub('qoralama').expect(404);
    // A draft's old slug is not reserved.
    expect((await create(teacher, { title: 'Qoralama' })).slug).toBe('qoralama');

    const c = await create(teacher, { title: 'Yashiriladi' });
    await publish(teacher, c.id);
    await send(teacher, 'patch', `${base()}/${c.id}`, { slug: 'yashiriladi-2026' }).expect(200);
    await send(teacher, 'patch', `${base()}/${c.id}`, { status: 'ARCHIVED' }).expect(200);
    await pub('yashiriladi').expect(404);
  });

  it('only course staff may change a slug', async () => {
    const c = await create(teacher, { title: 'Ruxsat' });
    await send(otherTeacher, 'patch', `${base()}/${c.id}`, { slug: 'boshqa' }).expect(403);
    await send(student, 'patch', `${base()}/${c.id}`, { slug: 'boshqa' }).expect(403);
    await send(foreignTeacher, 'patch', `${base(otherOrg)}/${c.id}`, { slug: 'boshqa' }).expect(
      404,
    );
  });
});
