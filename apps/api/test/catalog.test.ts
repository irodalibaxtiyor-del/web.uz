import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DIRECTIONS, syncDirections } from '../src/db/content/directions';
import { courseDirections, directions, organizations } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let platformOrg: string;
let otherOrg: string;
let teacher: Member;
let foreignTeacher: Member;
let published: { id: string; slug: string };

const SECRET_LESSON = 'zxq-dars-matni-sir';
const SECRET_INSTRUCTION = 'zxq-mashq-korsatmasi';
const SECRET_SELECTOR = '#zxq-yashirin-selektor';
const SECRET_OPTION = 'zxq-togri-javob';

const req = (who: Member, method: 'post' | 'patch', path: string, body: object = {}) =>
  ctx.http()[method](path).set('Cookie', who.cookie).send(body);

/** Creates a course with 2 modules / 3 lessons, an exercise, a quiz, and optionally publishes it. */
async function makeCourse(who: Member, org: string, slug: string, publish: boolean) {
  const base = `/orgs/${org}/courses`;
  const c = (
    await req(who, 'post', base, { title: `Kurs ${slug}`, slug, description: 'Tavsif' }).expect(201)
  ).body.course;
  const m1 = (await req(who, 'post', `${base}/${c.id}/modules`, { title: '1-modul' }).expect(201))
    .body.id;
  const m2 = (await req(who, 'post', `${base}/${c.id}/modules`, { title: '2-modul' }).expect(201))
    .body.id;
  const lesson = async (mod: string, title: string) =>
    (
      await req(who, 'post', `${base}/${c.id}/modules/${mod}/lessons`, {
        title,
        content: `# ${title}\n\n${SECRET_LESSON}`,
      }).expect(201)
    ).body.id as string;
  const l1 = await lesson(m1, 'Teglar');
  await lesson(m1, 'Atributlar');
  await lesson(m2, 'Formalar');
  await req(who, 'post', `${base}/${c.id}/lessons/${l1}/exercises`, {
    title: 'Mashq',
    instructions: SECRET_INSTRUCTION,
    expectedBehavior: 'Sarlavha ko‘rinadi',
    starterFiles: [{ path: 'index.html', content: '<h1></h1>' }],
    checks: [
      {
        id: 'h1',
        title: 'Sarlavha bor',
        hidden: true,
        assert: { type: 'count', selector: SECRET_SELECTOR, min: 1 },
      },
    ],
  }).expect(201);
  await req(who, 'post', `${base}/${c.id}/lessons/${l1}/quizzes`, {
    title: 'Test',
    passingPercent: 50,
    isActive: true,
    questions: [
      {
        id: 'q1',
        prompt: 'Sarlavha teg?',
        options: [
          { id: 'a', text: SECRET_OPTION },
          { id: 'b', text: 'p' },
        ],
        correct: ['a'],
      },
    ],
  }).expect(201);
  if (publish) await req(who, 'patch', `${base}/${c.id}`, { status: 'PUBLISHED' }).expect(200);
  return { id: c.id as string, slug };
}

async function link(courseId: string, directionSlug: string) {
  const [d] = await ctx.handle.db
    .select()
    .from(directions)
    .where(eq(directions.slug, directionSlug));
  await ctx.handle.db.insert(courseDirections).values({ courseId, directionId: d!.id });
}

beforeAll(async () => {
  ctx = await setup();
  const [org] = await ctx.handle.db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, ctx.config.DEFAULT_ORG_SLUG));
  platformOrg = org!.id;
  otherOrg = await createOrg(ctx, 'other-school');
  teacher = await createMember(ctx, 'teacher@catalog.uz', platformOrg, 'TEACHER');
  foreignTeacher = await createMember(ctx, 'teacher@other.uz', otherOrg, 'TEACHER');

  await ctx.handle.db.transaction((tx) => syncDirections(tx, platformOrg));
  published = await makeCourse(teacher, platformOrg, 'html-asoslari', true);
  const draft = await makeCourse(teacher, platformOrg, 'qoralama-kurs', false);
  const foreign = await makeCourse(foreignTeacher, otherOrg, 'begona-kurs', true);
  await link(published.id, 'html');
  await link(draft.id, 'html');
  await link(foreign.id, 'html');
});

afterAll(async () => {
  await ctx.app.close();
});

describe('public directions', () => {
  it('lists every direction in order without a session, counting only published platform courses', async () => {
    const res = await ctx.http().get('/public/directions').expect(200);
    expect(res.body.map((d: { slug: string }) => d.slug)).toEqual(
      [...DIRECTIONS].sort((a, b) => a.position - b.position).map((d) => d.slug),
    );
    const html = res.body.find((d: { slug: string }) => d.slug === 'html');
    expect(html).toMatchObject({ title: 'HTML', courseCount: 1 });
    expect(html.summary.length).toBeGreaterThan(10);
  });

  it('shows a direction with its published platform courses and their counts', async () => {
    const res = await ctx.http().get('/public/directions/html').expect(200);
    expect(res.body.description.length).toBeGreaterThan(50);
    expect(res.body.courses).toEqual([
      {
        slug: 'html-asoslari',
        title: 'Kurs html-asoslari',
        description: 'Tavsif',
        counts: { modules: 2, lessons: 3, exercises: 1, quizzes: 1 },
      },
    ]);
  });

  it('answers 404 for unknown or malformed slugs', async () => {
    await ctx.http().get('/public/directions/yoq-narsa').expect(404);
    await ctx.http().get('/public/directions/HTML').expect(404);
    await ctx.http().get('/public/directions/a_b').expect(404);
    await ctx
      .http()
      .get(`/public/directions/${'a'.repeat(81)}`)
      .expect(404);
  });
});

describe('public course page', () => {
  it('shows modules and lesson titles of a published platform course', async () => {
    const res = await ctx.http().get('/public/courses/html-asoslari').expect(200);
    expect(res.body).toMatchObject({
      id: published.id,
      organizationId: platformOrg,
      slug: 'html-asoslari',
      counts: { modules: 2, lessons: 3, exercises: 1, quizzes: 1 },
      directions: [{ slug: 'html', title: 'HTML' }],
      modules: [
        { title: '1-modul', lessons: ['Teglar', 'Atributlar'] },
        { title: '2-modul', lessons: ['Formalar'] },
      ],
    });
  });

  it('never exposes lesson bodies, exercises, CHECK rules or quiz content', async () => {
    const bodies = [
      (await ctx.http().get('/public/courses/html-asoslari').expect(200)).text,
      (await ctx.http().get('/public/directions/html').expect(200)).text,
      (await ctx.http().get('/public/directions').expect(200)).text,
    ].join('\n');
    for (const secret of [
      SECRET_LESSON,
      SECRET_INSTRUCTION,
      SECRET_SELECTOR,
      SECRET_OPTION,
      'correct',
      'checks',
    ]) {
      expect(bodies).not.toContain(secret);
    }
  });

  it('hides drafts and courses of other organizations', async () => {
    await ctx.http().get('/public/courses/qoralama-kurs').expect(404);
    await ctx.http().get('/public/courses/begona-kurs').expect(404);
    await ctx.http().get('/public/courses/Bad_Slug').expect(404);
  });
});

describe('directions seed', () => {
  it('is idempotent and links bundled courses as their manifests say', async () => {
    const css = await makeCourse(teacher, platformOrg, 'css', true);
    const first = await ctx.handle.db.transaction((tx) => syncDirections(tx, platformOrg));
    const second = await ctx.handle.db.transaction((tx) => syncDirections(tx, platformOrg));
    expect(second).toEqual(first);
    expect(await ctx.handle.db.select().from(directions)).toHaveLength(DIRECTIONS.length);
    const links = await ctx.handle.db
      .select({ slug: directions.slug })
      .from(courseDirections)
      .innerJoin(directions, eq(directions.id, courseDirections.directionId))
      .where(eq(courseDirections.courseId, css.id));
    expect(links.map((l) => l.slug).sort()).toEqual(['css', 'flexbox-va-grid']);
    // A course that is not bundled keeps the links an admin gave it.
    const res = await ctx.http().get('/public/directions/html').expect(200);
    expect(res.body.courses.map((c: { slug: string }) => c.slug)).toEqual(['html-asoslari']);
  });
});

describe('public rate limit', () => {
  it('limits anonymous catalogue requests per client IP', async () => {
    const limited = await setup({ PUBLIC_RATE_PER_MINUTE: '2' });
    try {
      await limited.http().get('/public/directions').expect(200);
      await limited.http().get('/public/directions/html').expect(404); // counted even when missing
      const res = await limited.http().get('/public/courses/x').expect(429);
      expect(res.body.code).toBe('PUBLIC_RATE_LIMITED');
    } finally {
      await limited.app.close();
    }
  });
});
