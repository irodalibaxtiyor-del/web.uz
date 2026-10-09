import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

let ctx: TestContext;
let orgA: string;
let orgB: string;
let owner: Member;
let otherTeacher: Member;
let student: Member;
let student2: Member;
let foreignTeacher: Member;
let foreignStudent: Member;

let courseId: string;
let l1: string;
let l2: string;
let e1: string;
let e2: string;
let lockedExercise: string;

const STARTER = [
  { path: 'index.html', content: '<h1>Salom</h1>' },
  { path: 'css/style.css', content: 'h1 { color: red; }' },
];

const course = (org = orgA) => `/orgs/${org}/courses/${courseId}`;
const req = (
  who: Member,
  method: 'get' | 'post' | 'put' | 'patch',
  path: string,
  body?: object,
) => {
  const r = ctx.http()[method](path).set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};
const lessonStates = async (who: Member) => {
  const res = await req(who, 'get', `${course()}/map`).expect(200);
  return res.body.modules.flatMap((m: { lessons: { state: string }[] }) =>
    m.lessons.map((l) => l.state),
  );
};

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  owner = await createMember(ctx, 'owner@a.uz', orgA, 'TEACHER');
  otherTeacher = await createMember(ctx, 'other@a.uz', orgA, 'TEACHER');
  student = await createMember(ctx, 'student@a.uz', orgA, 'STUDENT');
  student2 = await createMember(ctx, 'student2@a.uz', orgA, 'STUDENT');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  foreignStudent = await createMember(ctx, 'student@b.uz', orgB, 'STUDENT');

  const c = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'HTML', slug: 'html' });
  courseId = c.body.course.id;
  const mod = await req(owner, 'post', `${course()}/modules`, { title: '1-modul' });
  l1 = (await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Teglar' }))
    .body.id;
  l2 = (
    await req(owner, 'post', `${course()}/modules/${mod.body.id}/lessons`, { title: 'Atributlar' })
  ).body.id;
});
afterAll(async () => {
  await ctx.app.close();
});

describe('exercise authoring', () => {
  it('lets the course teacher create exercises with starter files', async () => {
    const res = await req(owner, 'post', `${course()}/lessons/${l1}/exercises`, {
      title: 'Birinchi sahifa',
      instructions: 'h1 sarlavha yozing',
      expectedBehavior: 'Sahifada sarlavha ko‘rinadi',
      starterFiles: STARTER,
    }).expect(201);
    expect(res.body).toMatchObject({ difficulty: 'EASY', isActive: true, position: 0 });
    e1 = res.body.id;
    e2 = (
      await req(owner, 'post', `${course()}/lessons/${l1}/exercises`, {
        title: 'Ikkinchi mashq',
        difficulty: 'MEDIUM',
      }).expect(201)
    ).body.id;
    lockedExercise = (
      await req(owner, 'post', `${course()}/lessons/${l2}/exercises`, {
        title: 'Yopiq darsdagi mashq',
      }).expect(201)
    ).body.id;
  });

  it('rejects unsafe or duplicate starter file paths', async () => {
    for (const files of [
      [{ path: '../secret.html', content: '' }],
      [{ path: '/etc/x.html', content: '' }],
      [{ path: 'run.php', content: '' }],
      [
        { path: 'index.html', content: '' },
        { path: 'INDEX.html', content: '' },
      ],
    ]) {
      await req(owner, 'post', `${course()}/lessons/${l1}/exercises`, {
        title: 'Yomon',
        starterFiles: files,
      }).expect(400);
    }
  });

  it('denies students, unassigned teachers and other orgs', async () => {
    const body = { title: 'Ruxsatsiz' };
    await req(student, 'post', `${course()}/lessons/${l1}/exercises`, body).expect(403);
    await req(otherTeacher, 'post', `${course()}/lessons/${l1}/exercises`, body).expect(403);
    await req(otherTeacher, 'patch', `${course()}/exercises/${e1}`, body).expect(403);
    await req(foreignTeacher, 'post', `${course(orgB)}/lessons/${l1}/exercises`, body).expect(404);
    await req(foreignTeacher, 'get', `${course(orgB)}/exercises/${e1}/edit`).expect(404);
  });

  it('rejects a lesson from another course', async () => {
    const other = await req(owner, 'post', `/orgs/${orgA}/courses`, { title: 'CSS', slug: 'css' });
    await req(
      owner,
      'post',
      `/orgs/${orgA}/courses/${other.body.course.id}/lessons/${l1}/exercises`,
      {
        title: 'Begona',
      },
    ).expect(404);
    await req(
      owner,
      'get',
      `/orgs/${orgA}/courses/${other.body.course.id}/exercises/${e1}/edit`,
    ).expect(404);
  });

  it('hides exercises of a draft course from students', async () => {
    await req(student, 'get', `${course()}/exercises/${e1}`).expect(404);
  });
});

describe('student workspace', () => {
  beforeAll(async () => {
    await req(owner, 'patch', course(), { status: 'PUBLISHED' }).expect(200);
    await req(student, 'post', `${course()}/enroll`).expect(201);
    await req(student2, 'post', `${course()}/enroll`).expect(201);
  });

  it('lists active exercises on the lesson with NOT_STARTED status', async () => {
    const res = await req(student, 'get', `${course()}/lessons/${l1}`).expect(200);
    expect(res.body.exercises).toEqual([
      { id: e1, title: 'Birinchi sahifa', difficulty: 'EASY', status: 'NOT_STARTED' },
      { id: e2, title: 'Ikkinchi mashq', difficulty: 'MEDIUM', status: 'NOT_STARTED' },
    ]);
  });

  it('opens the exercise with the starter files as the student workspace', async () => {
    const res = await req(student, 'get', `${course()}/exercises/${e1}`).expect(200);
    expect(res.body).toMatchObject({ status: 'NOT_STARTED', files: STARTER, teacherNote: null });
    expect(res.body).not.toHaveProperty('starterFiles');
  });

  it('refuses exercises in locked lessons', async () => {
    const res = await req(student, 'get', `${course()}/exercises/${lockedExercise}`).expect(403);
    expect(res.body.code).toBe('LESSON_LOCKED');
    await req(student, 'put', `${course()}/exercises/${lockedExercise}/workspace`, {
      files: STARTER,
    }).expect(403);
  });

  it('saves files and moves to IN_PROGRESS', async () => {
    const files = [{ path: 'index.html', content: '<h1>Mening sahifam</h1>' }];
    const res = await req(student, 'put', `${course()}/exercises/${e1}/workspace`, {
      files,
    }).expect(200);
    expect(res.body).toMatchObject({ status: 'IN_PROGRESS', files });
  });

  it('validates saved paths and sizes', async () => {
    await req(student, 'put', `${course()}/exercises/${e1}/workspace`, {
      files: [{ path: '../../x.html', content: '' }],
    }).expect(400);
    await req(student, 'put', `${course()}/exercises/${e1}/workspace`, {
      files: [{ path: 'index.html', content: 'x'.repeat(100_001) }],
    }).expect(400);
  });

  it('rejects oversized request bodies', async () => {
    await req(student, 'put', `${course()}/exercises/${e1}/workspace`, {
      files: [{ path: 'index.html', content: 'x'.repeat(1_200_000) }],
    }).expect(413);
  });

  it('keeps each student workspace private (cross-student isolation)', async () => {
    const res = await req(student2, 'get', `${course()}/exercises/${e1}`).expect(200);
    expect(res.body.files).toEqual(STARTER);
    expect(JSON.stringify(res.body)).not.toContain('Mening sahifam');
  });

  it('denies students from other orgs', async () => {
    await req(foreignStudent, 'get', `${course()}/exercises/${e1}`).expect(404);
    await req(foreignStudent, 'get', `${course(orgB)}/exercises/${e1}`).expect(404);
  });

  it('resets the workspace to the starter files', async () => {
    const res = await req(student, 'post', `${course()}/exercises/${e1}/workspace/reset`).expect(
      201,
    );
    expect(res.body.files).toEqual(STARTER);
  });

  it('blocks manual lesson completion while exercises are not passed', async () => {
    const res = await req(student, 'post', `${course()}/lessons/${l1}/complete`).expect(409);
    expect(res.body.code).toBe('EXERCISES_REQUIRED');
  });
});

describe('teacher status and lesson completion', () => {
  const statusPath = (ex: string, who: Member) =>
    `${course()}/exercises/${ex}/students/${who.userId}/status`;

  it('allows only course staff to set a status', async () => {
    await req(student, 'put', statusPath(e1, student), { status: 'PASSED' }).expect(403);
    await req(otherTeacher, 'put', statusPath(e1, student), { status: 'PASSED' }).expect(403);
    await req(
      foreignTeacher,
      'put',
      `${course(orgB)}/exercises/${e1}/students/${student.userId}/status`,
      {
        status: 'PASSED',
      },
    ).expect(404);
  });

  it('refuses students who are not enrolled in the course', async () => {
    await req(owner, 'put', statusPath(e1, foreignStudent), { status: 'PASSED' }).expect(404);
  });

  it('records NEEDS_IMPROVEMENT with a note without completing the lesson', async () => {
    await req(owner, 'put', statusPath(e1, student), {
      status: 'NEEDS_IMPROVEMENT',
      note: 'Sarlavha teg noto‘g‘ri',
    }).expect(200);
    const res = await req(student, 'get', `${course()}/exercises/${e1}`).expect(200);
    expect(res.body).toMatchObject({
      status: 'NEEDS_IMPROVEMENT',
      teacherNote: 'Sarlavha teg noto‘g‘ri',
    });
    expect(await lessonStates(student)).toEqual(['IN_PROGRESS', 'LOCKED']);
  });

  it('shows staff a progress list without files or emails', async () => {
    const res = await req(owner, 'get', `${course()}/exercises/${e1}/students`).expect(200);
    const byName = Object.fromEntries(
      res.body.map((r: { fullName: string; status: string }) => [r.fullName, r.status]),
    );
    expect(byName).toEqual({ student: 'NEEDS_IMPROVEMENT', student2: 'NOT_STARTED' });
    expect(JSON.stringify(res.body)).not.toMatch(/files|@|content/);
  });

  it('completes the lesson automatically once every active exercise is PASSED', async () => {
    await req(owner, 'put', statusPath(e1, student), { status: 'PASSED' }).expect(200);
    expect(await lessonStates(student)).toEqual(['IN_PROGRESS', 'LOCKED']);
    await req(owner, 'put', statusPath(e2, student), { status: 'PASSED' }).expect(200);
    expect(await lessonStates(student)).toEqual(['COMPLETED', 'AVAILABLE']);
    // The other student is unaffected.
    expect(await lessonStates(student2)).toEqual(['AVAILABLE', 'LOCKED']);
  });

  it('does not complete a locked lesson when its exercise is passed early', async () => {
    await req(owner, 'put', statusPath(lockedExercise, student2), { status: 'PASSED' }).expect(200);
    expect(await lessonStates(student2)).toEqual(['AVAILABLE', 'LOCKED']);
  });

  it('hides deactivated exercises and stops requiring them', async () => {
    await req(owner, 'patch', `${course()}/exercises/${e2}`, { isActive: false }).expect(200);
    await req(student2, 'get', `${course()}/exercises/${e2}`).expect(404);
    const lesson = await req(student2, 'get', `${course()}/lessons/${l1}`).expect(200);
    expect(lesson.body.exercises.map((e: { id: string }) => e.id)).toEqual([e1]);
    await req(owner, 'put', statusPath(e1, student2), { status: 'PASSED' }).expect(200);
    expect(await lessonStates(student2)).toEqual(['COMPLETED', 'AVAILABLE']);
  });

  it('ignores forged identity headers on workspace reads', async () => {
    const res = await req(student2, 'get', `${course()}/exercises/${e1}`)
      .set('x-user-id', student.userId)
      .expect(200);
    expect(res.body.status).toBe('PASSED');
    expect(res.body.teacherNote).toBeNull();
  });
});
