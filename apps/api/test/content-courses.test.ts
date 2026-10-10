import { readdirSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CONTENT_COURSES, findContentCourse } from '../src/db/content/registry';
import { CourseExistsError, contentDirOf, prepareCourse, seedCourse } from '../src/db/content/seed';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let org: string;
let teacher: Member;
let student: Member;
let courseId: string;

const HTML = findContentCourse('html')!;
const course = () => `/orgs/${org}/courses/${courseId}`;
const get = (who: Member, path: string) => ctx.http().get(path).set('Cookie', who.cookie);
const send = (who: Member, method: 'post' | 'put', path: string, body: object = {}) =>
  ctx.http()[method](path).set('Cookie', who.cookie).send(body);

beforeAll(async () => {
  ctx = await setup();
  org = await createOrg(ctx, 'content-org');
  teacher = await createMember(ctx, 'teacher@content.uz', org, 'TEACHER');
  student = await createMember(ctx, 'student@content.uz', org, 'STUDENT');
});

afterAll(async () => {
  await ctx.app.close();
});

describe.each(CONTENT_COURSES.map((c) => [c.slug, c] as const))('%s course manifest', (_, c) => {
  it('validates and every lesson has a real lesson file', () => {
    const lessons = prepareCourse(c).flatMap((m) => m.lessons);
    expect(new Set(lessons.map((l) => l.slug)).size).toBe(lessons.length);
    for (const l of lessons) expect(l.content.length, l.slug).toBeGreaterThan(500);
  });

  it('uses every lesson file exactly once', () => {
    const files = readdirSync(contentDirOf(c))
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.slice(0, -3))
      .sort();
    const slugs = c.modules.flatMap((m) => m.lessons.map((l) => l.slug)).sort();
    expect(files).toEqual(slugs);
  });

  it('gives every module a quiz and every exercise a reference solution', () => {
    for (const m of c.modules) {
      expect(
        m.lessons.filter((l) => l.quiz),
        m.title,
      ).toHaveLength(1);
    }
    const withExercise = c.modules.flatMap((m) => m.lessons.filter((l) => l.exercise));
    expect(withExercise.length).toBeGreaterThan(c.modules.length);
    expect(Object.keys(c.solutions).sort()).toEqual(withExercise.map((l) => l.slug).sort());
  });
});

describe('HTML course manifest', () => {
  it('has 12 modules and 60 lessons', () => {
    const prepared = prepareCourse(HTML);
    expect(prepared).toHaveLength(12);
    expect(prepared.flatMap((m) => m.lessons)).toHaveLength(60);
  });

  it('reports missing lesson files instead of seeding partial content', () => {
    expect(() => prepareCourse(HTML, `${contentDirOf(HTML)}-missing`)).toThrow(
      /missing introduction\.md/,
    );
  });
});

describe('HTML course seed', () => {
  it('creates the published course in one go', async () => {
    const r = await seedCourse(ctx.handle.db, HTML, {
      organizationId: org,
      teacherId: teacher.userId,
    });
    expect(r).toMatchObject({ modules: 12, lessons: 60, quizzes: 12, replaced: false });
    expect(r.exercises).toBe(Object.keys(HTML.solutions).length);
    courseId = r.courseId;

    const list = await get(teacher, `/orgs/${org}/courses`).expect(200);
    const row = list.body.find((c: { id: string }) => c.id === courseId);
    expect(row).toMatchObject({ slug: 'html', status: 'PUBLISHED', canManage: true });
  });

  it('refuses to overwrite an existing course without --replace', async () => {
    await expect(
      seedCourse(ctx.handle.db, HTML, { organizationId: org, teacherId: teacher.userId }),
    ).rejects.toBeInstanceOf(CourseExistsError);
  });

  it('requires a staff owner', async () => {
    await expect(
      seedCourse(ctx.handle.db, HTML, {
        organizationId: org,
        teacherId: student.userId,
        replace: true,
      }),
    ).rejects.toThrow(/TEACHER or ORG_ADMIN/);
  });

  it('recreates the course with --replace', async () => {
    const r = await seedCourse(ctx.handle.db, HTML, {
      organizationId: org,
      teacherId: teacher.userId,
      replace: true,
    });
    expect(r.replaced).toBe(true);
    expect(r.courseId).not.toBe(courseId);
    courseId = r.courseId;
  });
});

describe('HTML course for a student', () => {
  let lessonIds: string[];

  it('starts with only the first lesson open', async () => {
    await send(student, 'post', `${course()}/enroll`).expect(201);
    const map = await get(student, `${course()}/map`).expect(200);
    const lessons = map.body.modules.flatMap((m: { lessons: object[] }) => m.lessons);
    lessonIds = lessons.map((l: { id: string }) => l.id);
    expect(lessons).toHaveLength(60);
    expect(lessons[0].state).toBe('AVAILABLE');
    expect(lessons.slice(1).every((l: { state: string }) => l.state === 'LOCKED')).toBe(true);

    await get(student, `${course()}/lessons/${lessonIds[1]}`)
      .expect(403)
      .expect((res) => expect(res.body.code).toBe('LESSON_LOCKED'));
  });

  it('serves lesson text and exercises without hidden CHECK rules', async () => {
    const lesson = await get(student, `${course()}/lessons/${lessonIds[0]}`).expect(200);
    expect(lesson.body.content).toContain('## HTML nima?');
    const [ex] = lesson.body.exercises;
    const view = await get(student, `${course()}/exercises/${ex.id}`).expect(200);
    expect(view.body.checkAvailable).toBe(true);
    expect(view.body.checks).toBeUndefined();
    expect(JSON.stringify(view.body)).not.toContain('h1-text');
  });

  it('unlocks the next lessons as requirements are met', async () => {
    const lesson = await get(student, `${course()}/lessons/${lessonIds[0]}`).expect(200);
    const exerciseId = lesson.body.exercises[0].id;
    await send(
      teacher,
      'put',
      `${course()}/exercises/${exerciseId}/students/${student.userId}/status`,
      {
        status: 'PASSED',
      },
    ).expect(200);

    // Lesson 2 (editors) is theory only and is completed by hand.
    await get(student, `${course()}/lessons/${lessonIds[1]}`).expect(200);
    await send(student, 'post', `${course()}/lessons/${lessonIds[1]}/complete`).expect(201);
    const map = await get(student, `${course()}/map`).expect(200);
    const states = map.body.modules[0].lessons.map((l: { state: string }) => l.state);
    expect(states.slice(0, 3)).toEqual(['COMPLETED', 'COMPLETED', 'AVAILABLE']);
  });

  it('serves the module quiz without correct answers', async () => {
    // Lessons 3-5 have exercises; pass them so the module 1 quiz (lesson 5) opens.
    for (const id of lessonIds.slice(2, 5)) {
      const lesson = await get(student, `${course()}/lessons/${id}`).expect(200);
      const exerciseId = lesson.body.exercises[0].id;
      await send(
        teacher,
        'put',
        `${course()}/exercises/${exerciseId}/students/${student.userId}/status`,
        {
          status: 'PASSED',
        },
      ).expect(200);
    }
    const lesson = await get(student, `${course()}/lessons/${lessonIds[4]}`).expect(200);
    expect(lesson.body.quizzes).toHaveLength(1);
    const quiz = await get(student, `${course()}/quizzes/${lesson.body.quizzes[0].id}`).expect(200);
    expect(quiz.body.questions.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(quiz.body)).not.toContain('correct');
  });
});
