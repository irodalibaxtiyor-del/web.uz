import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgA: string;
let orgB: string;
let admin: Member;
let owner: Member;
let otherTeacher: Member;
let student: Member;
let student2: Member;
let foreignTeacher: Member;
let foreignStudent: Member;

let courseId: string;
let mod1: string;
let mod2: string;
let l1: string;
let l2: string;
let l3: string;

const base = (org = orgA) => `/orgs/${org}/courses`;
const get = (who: Member, path: string) => ctx.http().get(path).set('Cookie', who.cookie);
const post = (who: Member, path: string, body: object = {}) =>
  ctx.http().post(path).set('Cookie', who.cookie).send(body);
const patch = (who: Member, path: string, body: object) =>
  ctx.http().patch(path).set('Cookie', who.cookie).send(body);
const states = (map: { modules: { lessons: { state: string }[] }[] }) =>
  map.modules.flatMap((m) => m.lessons.map((l) => l.state));

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  admin = await createMember(ctx, 'admin@a.uz', orgA, 'ORG_ADMIN');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  otherTeacher = await createMember(ctx, 'other@a.uz', orgA, 'TEACHER');
  student = await createMember(ctx, 'student@a.uz', orgA, 'STUDENT');
  student2 = await createMember(ctx, 'student2@a.uz', orgA, 'STUDENT');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  foreignStudent = await createMember(ctx, 'student@b.uz', orgB, 'STUDENT');
});
afterAll(async () => {
  await ctx.app.close();
});

describe('course authoring', () => {
  it('lets a teacher create a draft course and assigns them to it', async () => {
    const res = await post(owner, base(), {
      title: 'HTML asoslari',
      slug: 'html-asoslari',
      description: 'Birinchi kurs',
    }).expect(201);
    expect(res.body.course.status).toBe('DRAFT');
    courseId = res.body.course.id;
  });

  it('rejects duplicate slugs in the same org and invalid slugs', async () => {
    await post(owner, base(), { title: 'Takror', slug: 'html-asoslari' }).expect(409);
    await post(owner, base(), { title: 'Yomon', slug: 'Bad Slug!' }).expect(400);
  });

  it('forbids students from creating courses', async () => {
    await post(student, base(), { title: 'Talaba kursi', slug: 'talaba' }).expect(403);
  });

  it('builds modules and lessons in order', async () => {
    mod1 = (await post(owner, `${base()}/${courseId}/modules`, { title: '1-modul' }).expect(201))
      .body.id;
    mod2 = (await post(owner, `${base()}/${courseId}/modules`, { title: '2-modul' }).expect(201))
      .body.id;
    const lesson = (mod: string, title: string) =>
      post(owner, `${base()}/${courseId}/modules/${mod}/lessons`, {
        title,
        content: `# ${title}\n\nMatn`,
      }).expect(201);
    l1 = (await lesson(mod1, 'Teglar')).body.id;
    l2 = (await lesson(mod1, 'Atributlar')).body.id;
    l3 = (await lesson(mod2, 'Formalar')).body.id;

    const s = await get(owner, `${base()}/${courseId}/structure`).expect(200);
    expect(s.body.modules.map((m: { title: string }) => m.title)).toEqual(['1-modul', '2-modul']);
    expect(s.body.modules[0].lessons.map((l: { id: string }) => l.id)).toEqual([l1, l2]);
  });

  it('denies an unassigned teacher in the same org (cross-teacher)', async () => {
    await get(otherTeacher, `${base()}/${courseId}/structure`).expect(403);
    await patch(otherTeacher, `${base()}/${courseId}`, { title: 'Buzilgan' }).expect(403);
    await post(otherTeacher, `${base()}/${courseId}/modules`, { title: 'Yangi modul' }).expect(403);
    const list = await get(otherTeacher, base()).expect(200);
    expect(list.body.find((c: { id: string }) => c.id === courseId).canManage).toBe(false);
  });

  it('allows the org admin to manage any org course', async () => {
    await get(admin, `${base()}/${courseId}/structure`).expect(200);
  });

  it('denies teachers from another org (cross-org) and rejects ID re-binding', async () => {
    await get(foreignTeacher, `${base()}/${courseId}/structure`).expect(404);
    // Foreign teacher uses their own org in the URL with our course id: must still 404.
    await get(foreignTeacher, `${base(orgB)}/${courseId}/structure`).expect(404);
    await patch(foreignTeacher, `${base(orgB)}/${courseId}`, { title: 'Hack' }).expect(404);
  });

  it('rejects a module id that belongs to a different course', async () => {
    const other = await post(owner, base(), { title: 'CSS', slug: 'css' }).expect(201);
    await post(owner, `${base()}/${other.body.course.id}/modules/${mod1}/lessons`, {
      title: 'Begona',
    }).expect(404);
  });

  it('returns 404 for malformed ids', async () => {
    await get(owner, `${base()}/not-a-uuid/structure`).expect(404);
  });
});

describe('student visibility of drafts', () => {
  it('hides draft courses from students', async () => {
    const list = await get(student, base()).expect(200);
    expect(list.body.find((c: { id: string }) => c.id === courseId)).toBeUndefined();
    await post(student, `${base()}/${courseId}/enroll`).expect(404);
    await get(student, `${base()}/${courseId}/lessons/${l1}`).expect(404);
  });

  it('forbids students from the authoring structure endpoint', async () => {
    await get(student, `${base()}/${courseId}/structure`).expect(403);
  });
});

describe('sequential learning', () => {
  it('publishes the course and records an audit-relevant status change', async () => {
    const res = await patch(owner, `${base()}/${courseId}`, { status: 'PUBLISHED' }).expect(200);
    expect(res.body.course.status).toBe('PUBLISHED');
  });

  it('lists the published course for students with progress', async () => {
    const list = await get(student, base()).expect(200);
    const c = list.body.find((x: { id: string }) => x.id === courseId);
    expect(c).toMatchObject({ enrolled: false, progressPercent: 0 });
    expect(c).not.toHaveProperty('canManage');
  });

  it('requires enrollment before the map or lessons', async () => {
    const res = await get(student, `${base()}/${courseId}/map`).expect(403);
    expect(res.body.code).toBe('NOT_ENROLLED');
    await get(student, `${base()}/${courseId}/lessons/${l1}`).expect(403);
  });

  it('opens only the first lesson after enrolling', async () => {
    const res = await post(student, `${base()}/${courseId}/enroll`).expect(201);
    expect(states(res.body)).toEqual(['AVAILABLE', 'LOCKED', 'LOCKED']);
    expect(res.body.progressPercent).toBe(0);
  });

  it('refuses a locked lesson without leaking its content', async () => {
    const res = await get(student, `${base()}/${courseId}/lessons/${l2}`).expect(403);
    expect(res.body.code).toBe('LESSON_LOCKED');
    expect(JSON.stringify(res.body)).not.toContain('Atributlar');
    await post(student, `${base()}/${courseId}/lessons/${l3}/complete`).expect(403);
  });

  it('marks an opened lesson IN_PROGRESS and hides the next id until completion', async () => {
    const res = await get(student, `${base()}/${courseId}/lessons/${l1}`).expect(200);
    expect(res.body).toMatchObject({ state: 'IN_PROGRESS', moduleTitle: '1-modul' });
    expect(res.body.content).toContain('Teglar');
    expect(res.body.nextLessonId).toBeNull();
  });

  it('completes a lesson, unlocks the next one and is idempotent', async () => {
    const res = await post(student, `${base()}/${courseId}/lessons/${l1}/complete`).expect(201);
    expect(states(res.body)).toEqual(['COMPLETED', 'AVAILABLE', 'LOCKED']);
    expect(res.body.progressPercent).toBe(33);
    await post(student, `${base()}/${courseId}/lessons/${l1}/complete`).expect(201);
    const again = await get(student, `${base()}/${courseId}/lessons/${l1}`).expect(200);
    expect(again.body.nextLessonId).toBe(l2);
  });

  it('crosses module boundaries in order', async () => {
    await post(student, `${base()}/${courseId}/lessons/${l2}/complete`).expect(201);
    const map = await get(student, `${base()}/${courseId}/map`).expect(200);
    expect(states(map.body)).toEqual(['COMPLETED', 'COMPLETED', 'AVAILABLE']);
  });

  it('keeps progress per student (cross-student isolation)', async () => {
    await post(student2, `${base()}/${courseId}/enroll`).expect(201);
    const map = await get(student2, `${base()}/${courseId}/map`).expect(200);
    expect(states(map.body)).toEqual(['AVAILABLE', 'LOCKED', 'LOCKED']);
    await get(student2, `${base()}/${courseId}/lessons/${l2}`).expect(403);
  });

  it('makes a newly inserted earlier lesson the next target without re-locking work', async () => {
    const res = await post(owner, `${base()}/${courseId}/modules/${mod1}/lessons`, {
      title: 'Kirish',
      position: 0,
    }).expect(201);
    const l0 = res.body.id;
    // Existing lessons are at positions 0 and 1; push them after the new one.
    await patch(owner, `${base()}/${courseId}/lessons/${l1}`, { position: 1 }).expect(200);
    await patch(owner, `${base()}/${courseId}/lessons/${l2}`, { position: 2 }).expect(200);
    await patch(owner, `${base()}/${courseId}/lessons/${l0}`, { position: 0 }).expect(200);

    const map = await get(student, `${base()}/${courseId}/map`).expect(200);
    expect(states(map.body)).toEqual(['AVAILABLE', 'COMPLETED', 'COMPLETED', 'LOCKED']);
    await get(student, `${base()}/${courseId}/lessons/${l3}`).expect(403);
  });

  it('rejects a lesson id from another course', async () => {
    const other = await post(owner, base(), { title: 'JS', slug: 'js' }).expect(201);
    const m = await post(owner, `${base()}/${other.body.course.id}/modules`, {
      title: 'JS modul',
    }).expect(201);
    const foreignLesson = await post(
      owner,
      `${base()}/${other.body.course.id}/modules/${m.body.id}/lessons`,
      { title: 'Begona dars' },
    ).expect(201);
    await get(student, `${base()}/${courseId}/lessons/${foreignLesson.body.id}`).expect(404);
  });

  it('denies students from another org', async () => {
    await get(foreignStudent, `${base()}/${courseId}/map`).expect(404);
    await post(foreignStudent, `${base(orgB)}/${courseId}/enroll`).expect(404);
  });

  it('ignores forged identity headers', async () => {
    await get(student2, `${base()}/${courseId}/lessons/${l2}`)
      .set('x-user-id', student.userId)
      .set('x-role', 'ORG_ADMIN')
      .expect(403);
  });

  it('hides archived courses from learners', async () => {
    await patch(admin, `${base()}/${courseId}`, { status: 'ARCHIVED' }).expect(200);
    await get(student, `${base()}/${courseId}/map`).expect(404);
  });
});

describe('catalogue order', () => {
  it('lists courses by position, then title; only an admin may reorder', async () => {
    const org = await createOrg(ctx, 'org-order');
    const a = await createMember(ctx, 'admin@order.uz', org, 'ORG_ADMIN');
    const t = await createMember(ctx, 'teacher@order.uz', org, 'TEACHER');
    const make = async (title: string, slug: string) =>
      (await post(t, base(org), { title, slug }).expect(201)).body.course.id as string;
    const css = await make('CSS', 'css');
    const html = await make('HTML', 'html');
    const js = await make('JavaScript', 'js');
    const titles = async () =>
      ((await get(a, base(org)).expect(200)).body as { title: string }[]).map((c) => c.title);

    // New courses share the default position, so the title decides.
    expect(await titles()).toEqual(['CSS', 'HTML', 'JavaScript']);

    // The order is organization-wide: the course's own teacher may not change it.
    await patch(t, `${base(org)}/${css}`, { position: 1 }).expect(403);
    await patch(t, `${base(org)}/${css}`, { title: 'CSS asoslari' }).expect(200);

    await patch(a, `${base(org)}/${html}`, { position: 10 }).expect(200);
    await patch(a, `${base(org)}/${js}`, { position: 20 }).expect(200);
    await patch(a, `${base(org)}/${css}`, { position: 30 }).expect(200);
    expect(await titles()).toEqual(['HTML', 'JavaScript', 'CSS asoslari']);

    await patch(a, `${base(org)}/${css}`, { position: -1 }).expect(400);
  });
});
