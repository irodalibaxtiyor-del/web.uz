import { cpSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  gradeQuiz,
  type ChoiceQuestion,
  type QuizAnswer,
  type QuizQuestion,
} from '@webdizayn/shared';
import { CONTENT_COURSES, findContentCourse } from '../src/db/content/registry';
import { LESSON_QUIZ_TITLE, q } from '../src/db/content/helpers';
import {
  CourseExistsError,
  contentDirOf,
  prepareCourse,
  seedCourse,
  syncCourseGlossary,
  syncCourseLessons,
  syncCourseQuizzes,
} from '../src/db/content/seed';
import { createMember, createOrg, setup, type TestContext } from './helpers';

/** The right answer to a manifest question (test-only; students never get these). */
function rightAnswer(x: QuizQuestion): QuizAnswer {
  switch (x.kind) {
    case 'TRUE_FALSE':
      return { questionId: x.id, optionIds: [String(x.answer)] };
    case 'FILL_BLANK':
    case 'CODE_FILL':
      return { questionId: x.id, optionIds: [], texts: x.blanks.map((b) => b.accepted[0]!) };
    case 'MATCHING':
      return { questionId: x.id, optionIds: [], pairs: x.pairs };
    case 'ORDERING':
      return { questionId: x.id, optionIds: [], order: x.items.map((i) => i.id) };
    case 'CATEGORIZE':
      return { questionId: x.id, optionIds: [], placements: x.items.map((i) => [i.id, i.group]) };
    default:
      return { questionId: x.id, optionIds: x.correct };
  }
}

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

  it('does not put the right answer first most of the time', () => {
    const questions = c.modules
      .flatMap((m) => m.lessons.flatMap((l) => l.quiz?.questions ?? []))
      .filter((q): q is ChoiceQuestion => q.kind === 'SINGLE' || q.kind === 'MULTIPLE');
    const first = questions.filter((q) => q.correct.includes(q.options[0]!.id)).length;
    expect(first / questions.length).toBeLessThan(0.5);
  });

  it('gives every module a quiz and every exercise a reference solution', () => {
    if (c.practice === 'quiz') {
      // Quiz-practice courses: no runnable exercises, a quiz closes every lesson.
      const lessons = c.modules.flatMap((m) => m.lessons);
      expect(lessons.filter((l) => !l.quiz).map((l) => l.slug)).toEqual([]);
      expect(lessons.filter((l) => l.exercise)).toHaveLength(0);
      expect(Object.keys(c.solutions)).toHaveLength(0);
      return;
    }
    for (const m of c.modules) {
      expect(
        m.lessons.filter((l) => l.quiz && l.quiz.title !== LESSON_QUIZ_TITLE),
        m.title,
      ).toHaveLength(1);
    }
    const withExercise = c.modules.flatMap((m) => m.lessons.filter((l) => l.exercise));
    expect(withExercise.length).toBeGreaterThan(c.modules.length);
    expect(Object.keys(c.solutions).sort()).toEqual(withExercise.map((l) => l.slug).sort());
  });
});

describe.each(CONTENT_COURSES.map((c) => [c.slug, c] as const))(
  '%s lesson tests and exercise mini-tests',
  (_, c) => {
    // Lesson tests and exercise mini-tests follow the same quality rules.
    const lessonTests = c.modules.flatMap((m) =>
      m.lessons.flatMap((l) => [
        ...(l.quiz?.title === LESSON_QUIZ_TITLE ? [{ slug: l.slug, quiz: l.quiz }] : []),
        ...(l.miniQuiz ? [{ slug: `${l.slug} (mini)`, quiz: l.miniQuiz }] : []),
      ]),
    );

    it.runIf(lessonTests.length > 0)('explain every answer and mix question kinds', () => {
      for (const { slug, quiz } of lessonTests) {
        expect(quiz.questions.length, slug).toBeGreaterThanOrEqual(3);
        for (const x of quiz.questions)
          expect(x.explanation?.length ?? 0, `${slug} ${x.id}`).toBeGreaterThan(10);
        const kinds = new Set(quiz.questions.map((x) => x.kind ?? 'SINGLE'));
        expect(kinds.size, slug).toBeGreaterThanOrEqual(2);
      }
    });

    it('give every exercise a self-check mini-test', () => {
      const missing = c.modules.flatMap((m) =>
        m.lessons.filter((l) => l.exercise && !l.miniQuiz).map((l) => l.slug),
      );
      expect(missing).toEqual([]);
    });

    it.runIf(lessonTests.length > 0)('are answerable: the keyed answers score 100%', () => {
      for (const { slug, quiz } of lessonTests) {
        const r = gradeQuiz(quiz.questions, quiz.questions.map(rightAnswer), quiz.passingPercent);
        expect(r.score, slug).toBe(100);
      }
    });
  },
);

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
    const withQuiz = HTML.modules.flatMap((m) => m.lessons.filter((l) => l.quiz)).length;
    expect(r).toMatchObject({ modules: 12, lessons: 60, quizzes: withQuiz, replaced: false });
    expect(r.miniQuizzes).toBe(r.exercises);
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
  const manifestLessons = HTML.modules.flatMap((m) => m.lessons);

  /** Passes the lesson's test (if any) with the manifest's right answers. */
  async function passLessonTest(index: number) {
    const lesson = await get(student, `${course()}/lessons/${lessonIds[index]}`).expect(200);
    const def = manifestLessons[index]!.quiz;
    if (!def) return;
    const [quiz] = lesson.body.quizzes;
    const res = await send(student, 'post', `${course()}/quizzes/${quiz.id}/attempts`, {
      answers: def.questions.map(rightAnswer),
    }).expect(201);
    expect(res.body.status, manifestLessons[index]!.slug).toBe('PASSED');
  }

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

    await passLessonTest(0);
    // Lesson 2 (editors) has no exercise: its lesson test completes it.
    await passLessonTest(1);
    const map = await get(student, `${course()}/map`).expect(200);
    const states = map.body.modules[0].lessons.map((l: { state: string }) => l.state);
    expect(states.slice(0, 3)).toEqual(['COMPLETED', 'COMPLETED', 'AVAILABLE']);
  });

  it('serves the module quiz without correct answers', async () => {
    // Lessons 3-5 have exercises (3-4 also a lesson test); pass them so the module quiz opens.
    for (const [i, id] of lessonIds.slice(2, 5).entries()) {
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
      if (i < 2) await passLessonTest(i + 2);
    }
    const lesson = await get(student, `${course()}/lessons/${lessonIds[4]}`).expect(200);
    expect(lesson.body.quizzes).toHaveLength(1);
    const quiz = await get(student, `${course()}/quizzes/${lesson.body.quizzes[0].id}`).expect(200);
    expect(quiz.body.questions.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(quiz.body)).not.toContain('correct');
  });
});

describe('quiz sync into a seeded course', () => {
  it('adds missing lesson tests once, keeping student progress', async () => {
    const syncOrg = await createOrg(ctx, 'sync-org');
    const owner = await createMember(ctx, 'owner@sync.uz', syncOrg, 'TEACHER');
    const learner = await createMember(ctx, 'learner@sync.uz', syncOrg, 'STUDENT');
    // The course as it was seeded before lesson tests existed.
    const old = {
      ...HTML,
      modules: HTML.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({
          ...l,
          quiz: l.quiz?.title === LESSON_QUIZ_TITLE ? undefined : l.quiz,
        })),
      })),
    };
    const seeded = await seedCourse(ctx.handle.db, old, {
      organizationId: syncOrg,
      teacherId: owner.userId,
    });
    const base = `/orgs/${syncOrg}/courses/${seeded.courseId}`;
    await send(learner, 'post', `${base}/enroll`).expect(201);
    const before = await get(learner, `${base}/map`).expect(200);
    const second = before.body.modules[0].lessons[1].id;
    // "editors" had no requirements then: completed by hand.
    const first = before.body.modules[0].lessons[0];
    await send(
      owner,
      'put',
      `${base}/exercises/${first.exercises[0].id}/students/${learner.userId}/status`,
      { status: 'PASSED' },
    ).expect(200);
    await send(learner, 'post', `${base}/lessons/${second}/complete`).expect(201);

    const r = await syncCourseQuizzes(ctx.handle.db, HTML, { organizationId: syncOrg });
    const expected = HTML.modules.flatMap((m) =>
      m.lessons.filter((l) => l.quiz?.title === LESSON_QUIZ_TITLE),
    ).length;
    expect(r).toMatchObject({ lessonQuizzes: expected, skipped: [] });
    expect(
      (await syncCourseQuizzes(ctx.handle.db, HTML, { organizationId: syncOrg })).lessonQuizzes,
    ).toBe(0);

    const after = await get(learner, `${base}/map`).expect(200);
    const lessons = after.body.modules[0].lessons;
    expect(lessons[1].quizzes).toEqual([
      expect.objectContaining({ title: LESSON_QUIZ_TITLE, status: 'NOT_STARTED' }),
    ]);
    // Already completed lessons stay completed; the next one stays open.
    expect(lessons.slice(0, 3).map((l: { state: string }) => l.state)).toEqual([
      'COMPLETED',
      'COMPLETED',
      'AVAILABLE',
    ]);
  });

  it('refuses a course that is not seeded', async () => {
    const empty = await createOrg(ctx, 'sync-empty');
    await expect(syncCourseQuizzes(ctx.handle.db, HTML, { organizationId: empty })).rejects.toThrow(
      /not seeded/,
    );
  });
});

describe('lesson text sync', () => {
  it('adds new interactive blocks but never overwrites a lesson a teacher edited', async () => {
    const syncOrg = await createOrg(ctx, 'lesson-sync-org');
    const owner = await createMember(ctx, 'owner@lessonsync.uz', syncOrg, 'TEACHER');
    // "Old" files: what the course was seeded from.
    const oldDir = mkdtempSync(join(tmpdir(), 'wd-old-'));
    cpSync(contentDirOf(HTML), oldDir, { recursive: true });
    const seeded = await seedCourse(ctx.handle.db, HTML, {
      organizationId: syncOrg,
      teacherId: owner.userId,
      contentDir: oldDir,
    });
    // "New" files: two lessons gain a self-check block.
    const newDir = mkdtempSync(join(tmpdir(), 'wd-new-'));
    cpSync(oldDir, newDir, { recursive: true });
    const block = '\n\n```tekshir\nSavol?\n- yo‘q\n+ ha\n> Izoh.\n```\n';
    for (const slug of ['introduction', 'editors']) {
      const f = join(newDir, `${slug}.md`);
      writeFileSync(f, readFileSync(f, 'utf8') + block);
    }
    // A teacher edits "editors" in the meantime.
    const base = `/orgs/${syncOrg}/courses/${seeded.courseId}`;
    const map = await get(owner, `${base}/structure`).expect(200);
    const editorsId = map.body.modules[0].lessons[1].id;
    await ctx
      .http()
      .patch(`${base}/lessons/${editorsId}`)
      .set('Cookie', owner.cookie)
      .send({ content: 'O‘qituvchi yozgan matn.' })
      .expect(200);

    const r = await syncCourseLessons(ctx.handle.db, HTML, {
      organizationId: syncOrg,
      contentDir: newDir,
    });
    expect(r).toMatchObject({ updated: 1, edited: ['editors'], skipped: [] });
    const intro = await get(owner, `${base}/lessons/${map.body.modules[0].lessons[0].id}/edit`);
    expect(intro.body.content).toContain('```tekshir');
    const editors = await get(owner, `${base}/lessons/${editorsId}/edit`);
    expect(editors.body.content).toBe('O‘qituvchi yozgan matn.');
    // Running again changes nothing.
    const again = await syncCourseLessons(ctx.handle.db, HTML, {
      organizationId: syncOrg,
      contentDir: newDir,
    });
    expect(again.updated).toBe(0);
  });
});

describe('course glossary', () => {
  it('every bundled glossary is valid (manifest check runs in prepareCourse)', () => {
    for (const c of CONTENT_COURSES) {
      if (!c.glossary) continue;
      expect(() => prepareCourse(c)).not.toThrow();
      for (const g of c.glossary) expect(g.definition.length).toBeGreaterThan(15);
    }
    expect(HTML.glossary?.length).toBeGreaterThanOrEqual(60);
    for (const slug of ['css', 'js']) {
      const course = CONTENT_COURSES.find((c) => c.slug === slug);
      expect(course?.glossary?.length).toBeGreaterThanOrEqual(60);
    }
    for (const slug of ['bootstrap3', 'bootstrap4', 'bootstrap5']) {
      const course = CONTENT_COURSES.find((c) => c.slug === slug);
      expect(course?.glossary?.length).toBeGreaterThanOrEqual(50);
    }
    // Every bundled course has a glossary of a useful size.
    for (const c of CONTENT_COURSES) {
      expect(c.glossary?.length ?? 0, c.slug).toBeGreaterThanOrEqual(35);
    }
  });

  it('every lesson of every bundled course has a self-check block', () => {
    for (const c of CONTENT_COURSES) {
      const without = prepareCourse(c)
        .flatMap((m) => m.lessons)
        .filter((l) => !l.content.includes('```tekshir'))
        .map((l) => l.slug);
      expect(without, c.slug).toEqual([]);
    }
  });

  it('a broken glossary entry fails the manifest', () => {
    expect(() =>
      prepareCourse({ ...HTML, glossary: [{ term: 'X', definition: 'Ta’rif', lesson: 'yoq' }] }),
    ).toThrow(/unknown lesson "yoq"/);
    expect(() =>
      prepareCourse({
        ...HTML,
        glossary: [
          { term: 'Teg', definition: 'Birinchi ta’rif' },
          { term: ' teg', definition: 'Ikkinchi ta’rif' },
        ],
      }),
    ).toThrow(/duplicate term/);
  });

  it('seeding creates terms tied to lessons; sync adds only missing ones', async () => {
    const org = await createOrg(ctx, 'glossary-org');
    const owner = await createMember(ctx, 'owner@glossary.uz', org, 'TEACHER');
    const few = { ...HTML, glossary: HTML.glossary!.slice(0, 5) };
    const seeded = await seedCourse(ctx.handle.db, few, {
      organizationId: org,
      teacherId: owner.userId,
    });
    expect(seeded.terms).toBe(5);
    const base = `/orgs/${org}/courses/${seeded.courseId}`;
    const list = await get(owner, `${base}/glossary`).expect(200);
    expect(list.body.terms).toHaveLength(5);
    const html = list.body.terms.find((t: { term: string }) => t.term === 'HTML');
    expect(html.lessonTitle).toBeTruthy();

    // A teacher edits a term; sync must not overwrite it.
    await ctx
      .http()
      .patch(`${base}/glossary/${html.id}`)
      .set('Cookie', owner.cookie)
      .send({ term: 'HTML', definition: 'O‘qituvchi yozgan ta’rif' })
      .expect(200);
    const r = await syncCourseGlossary(ctx.handle.db, HTML, { organizationId: org });
    expect(r).toMatchObject({ added: HTML.glossary!.length - 5, existing: 5, skipped: [] });
    const after = await get(owner, `${base}/glossary`).expect(200);
    expect(after.body.terms).toHaveLength(HTML.glossary!.length);
    expect(after.body.terms.find((t: { id: string }) => t.id === html.id).definition).toBe(
      'O‘qituvchi yozgan ta’rif',
    );
    const again = await syncCourseGlossary(ctx.handle.db, HTML, { organizationId: org });
    expect(again.added).toBe(0);
  });
});

describe('quiz question helper', () => {
  it('shuffles options deterministically and keeps the right answers', () => {
    const a = q('savol', 'Qaysi biri?', ['to‘g‘ri', 'xato 1', 'xato 2', 'xato 3'], [0]);
    expect(q('savol', 'Qaysi biri?', ['to‘g‘ri', 'xato 1', 'xato 2', 'xato 3'], [0])).toEqual(a);
    const right = a.options.filter((o) => a.correct.includes(o.id)).map((o) => o.text);
    expect(right).toEqual(['to‘g‘ri']);
    expect(a.options.map((o) => o.id)).toEqual(['a', 'b', 'c', 'd']);

    const m = q('kop', 'Qaysilari?', ['A', 'B', 'C', 'D', 'E'], [1, 3]);
    expect(m.kind).toBe('MULTIPLE');
    expect(
      m.options
        .filter((o) => m.correct.includes(o.id))
        .map((o) => o.text)
        .sort(),
    ).toEqual(['B', 'D']);
  });
});
