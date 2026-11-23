import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildXlsx } from '../src/common/xlsx';
import { readSpreadsheet } from '../src/common/xlsx-read';
import { auditEvents, gradebookColumns, gradebookScores, users } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };
const FIXTURE = readFileSync(join(__dirname, 'fixtures/jurnal.xlsx'));

let ctx: TestContext;
let orgA: string;
let orgB: string;
let admin: Member;
let teacherA: Member;
let teacherB: Member;
let foreignTeacher: Member;
let s1: Member;
let s2: Member;
let s3: Member;
let groupA: string;
let groupB: string;

const req = (
  who: Member | null,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  body?: object,
) => {
  const r = ctx.http()[method](path);
  if (who) r.set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};
const books = (g = groupA, org = orgA) => `/orgs/${org}/groups/${g}/gradebooks`;

beforeAll(async () => {
  ctx = await setup();
  orgA = await createOrg(ctx, 'org-a');
  orgB = await createOrg(ctx, 'org-b');
  admin = await createMember(ctx, 'admin@a.uz', orgA, 'ORG_ADMIN');
  teacherA = await createMember(ctx, 'teacher-a@a.uz', orgA, 'TEACHER');
  teacherB = await createMember(ctx, 'teacher-b@a.uz', orgA, 'TEACHER');
  foreignTeacher = await createMember(ctx, 'teacher@b.uz', orgB, 'TEACHER');
  s1 = await createMember(ctx, 's1@a.uz', orgA, 'STUDENT');
  s2 = await createMember(ctx, 's2@a.uz', orgA, 'STUDENT');
  s3 = await createMember(ctx, 's3@a.uz', orgA, 'STUDENT');
  for (const [s, name] of [
    [s1, 'TESTOV ALI VALIYEVICH'],
    [s2, 'SINOVOVA LOLA'],
    [s3, 'BOSHQA GURUH TALABASI'],
  ] as const)
    await ctx.handle.db.update(users).set({ fullName: name }).where(eq(users.id, s.userId));

  await req(admin, 'post', `/orgs/${orgA}/admin/roster/import`, {
    groups: [
      { name: '8-24 ATT', students: ['BIR TALABA'] },
      { name: '9-24 ATT', students: ['IKKI TALABA'] },
    ],
  }).expect(200);
  const list = (await req(admin, 'get', `/orgs/${orgA}/admin/groups`).expect(200)).body as {
    id: string;
    name: string;
  }[];
  groupA = list.find((g) => g.name === '8-24 ATT')!.id;
  groupB = list.find((g) => g.name === '9-24 ATT')!.id;
  for (const [s, g] of [
    [s1, groupA],
    [s2, groupA],
    [s3, groupB],
  ] as const)
    await req(admin, 'put', `/orgs/${orgA}/admin/students/${s.userId}/group`, {
      groupId: g,
    }).expect(200);
  await req(admin, 'put', `/orgs/${orgA}/admin/teachers/${teacherA.userId}/groups`, {
    groupIds: [groupA],
  }).expect(200);
  await req(admin, 'put', `/orgs/${orgA}/admin/teachers/${teacherB.userId}/groups`, {
    groupIds: [groupB],
  }).expect(200);
});
afterAll(async () => {
  await ctx.app.close();
});

describe('gradebook access', () => {
  it('only teachers of the group and admins reach a group gradebook', async () => {
    await req(null, 'get', books()).expect(401);
    await req(s1, 'get', books()).expect(403);
    await req(teacherB, 'get', books()).expect(404); // not their group
    await req(foreignTeacher, 'get', books(groupA, orgB)).expect(404);
    await req(teacherA, 'get', books()).expect(200);
    await req(admin, 'get', books(groupB)).expect(200);
  });
});

describe('gradebook editing', () => {
  let id: string;
  let colA: string;
  let colB: string;

  it('creates one gradebook per subject name in a group', async () => {
    const r = await req(teacherA, 'post', books(), { title: 'Veb dizayn' }).expect(201);
    id = r.body.id;
    expect(r.body).toMatchObject({ title: 'Veb dizayn', columns: 0, students: 3, average: null });
    await req(admin, 'post', books(), { title: '  veb   DIZAYN ' })
      .expect(409)
      .expect((x) => expect(x.body.code).toBe('GRADEBOOK_EXISTS'));
    await req(teacherA, 'post', books(), { title: 'x' }).expect(400);
  });

  it('adds lesson columns (date and/or topic), refusing duplicates', async () => {
    let v = await req(teacherA, 'post', `${books()}/${id}/columns`, {
      date: '2026-09-05',
      title: 'HTML teglari',
    }).expect(201);
    v = await req(teacherA, 'post', `${books()}/${id}/columns`, { title: '1-oraliq' }).expect(201);
    expect(v.body.columns.map((c: { title: string }) => c.title)).toEqual([
      'HTML teglari',
      '1-oraliq',
    ]);
    [colA, colB] = v.body.columns.map((c: { id: string }) => c.id);
    await req(teacherA, 'post', `${books()}/${id}/columns`, { title: '1-ORALIQ' }).expect(409);
    await req(teacherA, 'post', `${books()}/${id}/columns`, {}).expect(400);
    await req(teacherA, 'post', `${books()}/${id}/columns`, { date: '2026-02-30' }).expect(400);
  });

  it('stores 0–100 scores for students of the group; averages and bands', async () => {
    const v = await req(teacherA, 'put', `${books()}/${id}/scores`, {
      entries: [
        { columnId: colA, userId: s1.userId, score: 90 },
        { columnId: colB, userId: s1.userId, score: 85.5 },
        { columnId: colA, userId: s2.userId, score: 50 },
      ],
    }).expect(200);
    const row = (u: string) => v.body.students.find((s: { userId: string }) => s.userId === u);
    expect(row(s1.userId)).toMatchObject({ average: 87.8, filled: 2 });
    expect(row(s2.userId)).toMatchObject({ average: 50, filled: 1 });
    expect(v.body.stats).toMatchObject({
      average: 75.2,
      columnAverages: [70, 85.5],
      bands: { EXCELLENT: 0, GOOD: 1, SATISFACTORY: 0, FAIL: 1 },
      filledCells: 3,
      totalCells: 6,
    });

    const bad = (entry: object) =>
      req(teacherA, 'put', `${books()}/${id}/scores`, { entries: [entry] }).expect(400);
    await bad({ columnId: colA, userId: s1.userId, score: 101 });
    await bad({ columnId: colA, userId: s1.userId, score: 80.25 });
    await bad({ columnId: colA, userId: s3.userId, score: 80 }); // other group
    await bad({ columnId: '00000000-0000-4000-8000-000000000000', userId: s1.userId, score: 80 });

    // null clears a cell.
    const cleared = await req(teacherA, 'put', `${books()}/${id}/scores`, {
      entries: [{ columnId: colA, userId: s2.userId, score: null }],
    }).expect(200);
    expect(
      cleared.body.students.find((s: { userId: string }) => s.userId === s2.userId).average,
    ).toBeNull();
  });

  it('students see only their own grades; other groups see nothing', async () => {
    const mine = await req(s1, 'get', `/orgs/${orgA}/gradebooks/mine`).expect(200);
    expect(mine.body).toHaveLength(1);
    expect(mine.body[0]).toMatchObject({
      title: 'Veb dizayn',
      groupName: '8-24 ATT',
      average: 87.8,
      band: 'GOOD',
    });
    expect(mine.body[0].columns.map((c: { score: number | null }) => c.score)).toEqual([90, 85.5]);
    expect(JSON.stringify(mine.body)).not.toContain(s2.userId);
    const other = await req(s3, 'get', `/orgs/${orgA}/gradebooks/mine`).expect(200);
    expect(other.body).toEqual([]);
  });

  it('removing a column keeps positions dense; renaming checks duplicates', async () => {
    await req(teacherA, 'delete', `${books()}/${id}/columns/${colA}`).expect(200);
    const cols = await ctx.handle.db
      .select()
      .from(gradebookColumns)
      .where(eq(gradebookColumns.gradebookId, id));
    expect(cols.map((c) => c.position)).toEqual([0]);
    const scores = await ctx.handle.db
      .select()
      .from(gradebookScores)
      .where(eq(gradebookScores.columnId, colA));
    expect(scores).toEqual([]);
    await req(teacherA, 'post', books(), { title: 'Algoritmlar' }).expect(201);
    await req(teacherA, 'patch', `${books()}/${id}`, { title: 'algoritmlar' }).expect(409);
    await req(teacherA, 'patch', `${books()}/${id}`, { title: 'Veb dizayn asoslari' }).expect(200);
  });
});

describe('gradebook import and export', () => {
  let id: string;

  beforeAll(async () => {
    id = (await req(teacherA, 'post', books(), { title: 'Import fani' }).expect(201)).body.id;
    await req(teacherA, 'post', `${books()}/${id}/columns`, { title: '1-oraliq' }).expect(201);
  });

  it('previews an Excel file: matched students, new/existing columns, problems', async () => {
    const r = await ctx
      .http()
      .post(`${books()}/${id}/import/preview`)
      .set('Cookie', teacherA.cookie)
      .attach('file', FIXTURE, 'jurnal.xlsx')
      .expect(200);
    expect(r.body.columns).toEqual([
      { title: '', date: '2026-09-05', existing: false },
      { title: 'CSS selektorlar', date: '2026-09-12', existing: false },
      { title: '1-oraliq', date: null, existing: true },
    ]);
    expect(r.body.rows.map((x: { userId: string }) => x.userId)).toEqual([s1.userId, s2.userId]);
    expect(r.body.issues.length).toBe(2); // unknown student, and O‘RINOVA is not in this group
    expect(r.body.missing).toEqual(['BIR TALABA']);
    // Nothing is written by a preview.
    const cols = await ctx.handle.db
      .select()
      .from(gradebookColumns)
      .where(eq(gradebookColumns.gradebookId, id));
    expect(cols).toHaveLength(1);
  });

  it('rejects files that are not spreadsheets', async () => {
    await ctx
      .http()
      .post(`${books()}/${id}/import/preview`)
      .set('Cookie', teacherA.cookie)
      .attach('file', Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 1, 2, 3, 4]), 'old.xls')
      .expect(400)
      .expect((x) => expect(x.body.message).toMatch(/\.xlsx/));
    await ctx
      .http()
      .post(`${books()}/${id}/import/preview`)
      .set('Cookie', teacherA.cookie)
      .expect(400);
  });

  it('applies the confirmed plan; empty cells never erase existing grades', async () => {
    const plan = {
      columns: [
        { title: '', date: '2026-09-05' },
        { title: '1-oraliq', date: null },
      ],
      rows: [
        { userId: s1.userId, scores: [90, 70] },
        { userId: s2.userId, scores: [72, null] },
      ],
    };
    const first = await req(teacherA, 'post', `${books()}/${id}/import`, plan).expect(201);
    expect(first.body).toEqual({ columnsCreated: 1, cellsWritten: 3 });
    // s2 gets a grade in "1-oraliq" by hand; a re-import with an empty cell keeps it.
    const v0 = await req(teacherA, 'get', `${books()}/${id}`).expect(200);
    const oraliq = v0.body.columns.find((c: { title: string }) => c.title === '1-oraliq').id;
    await req(teacherA, 'put', `${books()}/${id}/scores`, {
      entries: [{ columnId: oraliq, userId: s2.userId, score: 64 }],
    }).expect(200);
    const again = await req(teacherA, 'post', `${books()}/${id}/import`, plan).expect(201);
    expect(again.body).toEqual({ columnsCreated: 0, cellsWritten: 3 });
    const v = await req(teacherA, 'get', `${books()}/${id}`).expect(200);
    const s2row = v.body.students.find((s: { userId: string }) => s.userId === s2.userId);
    expect(s2row.scores[oraliq]).toBe(64);

    await req(teacherA, 'post', `${books()}/${id}/import`, {
      ...plan,
      rows: [{ userId: s3.userId, scores: [90, 90] }],
    }).expect(400);
    await req(teacherB, 'post', `${books(groupA)}/${id}/import`, plan).expect(404);
    const audits = await ctx.handle.db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.action, 'gradebook.import'));
    expect(audits).toHaveLength(2);
  });

  it('exports an Excel journal that imports back unchanged', async () => {
    const r = await req(teacherA, 'get', `${books()}/${id}/export.xlsx`)
      .buffer(true)
      .parse((res, cb) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => cb(null, Buffer.concat(chunks)));
      })
      .expect(200)
      .expect('Content-Type', /spreadsheetml/);
    const rows = readSpreadsheet(r.body as Buffer);
    expect(rows[0]).toEqual(['№', 'F.I.Sh.', '1-oraliq', '05.09.2026', 'O‘rtacha']);
    expect(rows.find((x) => x[1] === 'TESTOV ALI VALIYEVICH')).toEqual([
      expect.any(Number),
      'TESTOV ALI VALIYEVICH',
      70,
      90,
      80,
    ]);
    const back = await ctx
      .http()
      .post(`${books()}/${id}/import/preview`)
      .set('Cookie', teacherA.cookie)
      .attach('file', r.body as Buffer, 'jurnal.xlsx')
      .expect(200);
    expect(back.body.columns.every((c: { existing: boolean }) => c.existing)).toBe(true);
    expect(back.body.issues).toEqual([]);
  });

  it('deleting a gradebook removes its columns and scores', async () => {
    await req(teacherA, 'delete', `${books()}/${id}`).expect(204);
    await req(teacherA, 'get', `${books()}/${id}`).expect(404);
    const cols = await ctx.handle.db
      .select()
      .from(gradebookColumns)
      .where(eq(gradebookColumns.gradebookId, id));
    expect(cols).toEqual([]);
  });
});

describe('credit gradebook (JN / ON / YaN)', () => {
  let id: string;
  const col = (v: { columns: { id: string; control: string }[] }, c: string) =>
    v.columns.find((x) => x.control === c)!.id;

  it('is created with the five controls and their maxima; controls are fixed', async () => {
    const r = await req(teacherA, 'post', books(), {
      title: 'Kompyuter grafikasi',
      scheme: 'CREDIT',
    }).expect(201);
    id = r.body.id;
    expect(r.body.scheme).toBe('CREDIT');
    const v = (await req(teacherA, 'get', `${books()}/${id}`).expect(200)).body;
    expect(
      v.columns.map((c: { control: string; maxScore: number }) => [c.control, c.maxScore]),
    ).toEqual([
      ['JN1', 20],
      ['JN2', 20],
      ['ON1', 10],
      ['ON2', 10],
      ['YN', 40],
    ]);
    await req(teacherA, 'post', `${books()}/${id}/columns`, { title: 'Qo‘shimcha' }).expect(400);
    await req(teacherA, 'delete', `${books()}/${id}/columns/${col(v, 'ON2')}`).expect(400);
    await req(teacherA, 'post', books(), { title: 'X fan', scheme: 'OTHER' }).expect(400);
  });

  it('refuses a score above the control maximum; computes JN, ON and the pending total', async () => {
    const v0 = (await req(teacherA, 'get', `${books()}/${id}`).expect(200)).body;
    await req(teacherA, 'put', `${books()}/${id}/scores`, {
      entries: [{ columnId: col(v0, 'JN1'), userId: s1.userId, score: 21 }],
    }).expect(400);
    const entries: [Member, string, number][] = [
      [s1, 'JN1', 20],
      [s1, 'JN2', 18],
      [s1, 'ON1', 9],
      [s1, 'ON2', 5],
      [s2, 'JN1', 6],
      [s2, 'JN2', 8],
      [s2, 'ON2', 5],
    ];
    const v = (
      await req(teacherA, 'put', `${books()}/${id}/scores`, {
        entries: entries.map(([s, c, score]) => ({
          columnId: col(v0, c),
          userId: s.userId,
          score,
        })),
      }).expect(200)
    ).body;
    const row = (u: string) => v.students.find((s: { userId: string }) => s.userId === u);
    expect(row(s1.userId)).toMatchObject({
      total: 52,
      final: 'PENDING',
      band: 'GOOD', // 52 of the 60 held so far
      sections: {
        JN: { score: 38, max: 40, band: 'EXCELLENT' },
        ON: { score: 14, max: 20, band: 'GOOD' },
      },
    });
    expect(row(s2.userId)).toMatchObject({
      total: 19,
      sections: { JN: { score: 14, band: 'FAIL' } },
    });
    expect(v.stats).toMatchObject({ heldMax: 60, pending: 2, average: 35.5, jnAverage: 26 });

    // YaN below 24: not passed; at least 24: final mark out of 100.
    const fin = (
      await req(teacherA, 'put', `${books()}/${id}/scores`, {
        entries: [
          { columnId: col(v0, 'YN'), userId: s1.userId, score: 36 },
          { columnId: col(v0, 'YN'), userId: s2.userId, score: 20 },
        ],
      }).expect(200)
    ).body;
    const frow = (u: string) => fin.students.find((s: { userId: string }) => s.userId === u);
    expect(frow(s1.userId)).toMatchObject({ total: 88, final: 'PASSED', band: 'GOOD' });
    expect(frow(s2.userId)).toMatchObject({ total: 39, final: 'YN_FAILED', band: 'FAIL' });

    // The student sees their own JN mark.
    const mine = (await req(s1, 'get', `/orgs/${orgA}/gradebooks/mine`).expect(200)).body;
    expect(mine.find((b: { id: string }) => b.id === id)).toMatchObject({
      scheme: 'CREDIT',
      total: 88,
      final: 'PASSED',
      sections: { JN: { score: 38, band: 'EXCELLENT' } },
    });
  });

  it('imports only the control totals from a credit vedomost and checks JAMI', async () => {
    const file = buildXlsx([
      {
        name: 'Varaq',
        rows: [
          [
            '#',
            'FISH',
            '1-amaliy ish\nGnomchalar\n2-ball',
            'AMALIY JAMI\n20 ball',
            'Izoh',
            '2\nJN\nReklama\n3 ball',
            '2\nJN\nJAMI\n(20)',
            '1\nON\n(10)',
            '2\nON\n(10)',
            'YaN\n(40)',
            'JAMI',
          ],
          [1, 'Testov Ali', 2, 20, 'izoh matni', 3, 19, 10, 5, null, 54],
          [2, 'SINOVOVA LOLA', 1, 13, null, 2, 16, 25, 5, null, 99],
        ],
      },
    ]);
    const p = (
      await ctx
        .http()
        .post(`${books()}/${id}/import/preview`)
        .set('Cookie', teacherA.cookie)
        .attach('file', file, 'baholar.xlsx')
        .expect(200)
    ).body;
    expect(p.columns.map((c: { title: string }) => c.title)).toEqual([
      'Joriy nazorat-1',
      'Joriy nazorat-2',
      'Oraliq nazorat-1',
      'Oraliq nazorat-2',
      'Yakuniy nazorat',
    ]);
    expect(p.ignored).toEqual(['1-amaliy ish Gnomchalar 2-ball', 'Izoh', '2 JN Reklama 3 ball']);
    expect(p.rows.map((r: { scores: unknown[] }) => r.scores)).toEqual([
      [20, 19, 10, 5, null],
      [13, 16, null, 5, null],
    ]);
    const messages = p.issues.map((i: { message: string }) => i.message).join('\n');
    expect(messages).toMatch(/25 — ball 10 dan oshmaydi/);
    expect(messages).toMatch(/JAMI \(99\).*\(34\)/);
    expect(messages).not.toMatch(/Testov Ali: fayldagi JAMI/);

    const done = await req(teacherA, 'post', `${books()}/${id}/import`, {
      columns: p.columns.map((c: { title: string; date: string | null }) => ({
        title: c.title,
        date: c.date,
      })),
      rows: p.rows.map((r: { userId: string; scores: unknown[] }) => ({
        userId: r.userId,
        scores: r.scores,
      })),
    }).expect(201);
    expect(done.body).toEqual({ columnsCreated: 0, cellsWritten: 7 });
    // A plan that would add a column or exceed a maximum is refused.
    await req(teacherA, 'post', `${books()}/${id}/import`, {
      columns: [{ title: 'Boshqa', date: null }],
      rows: [{ userId: s1.userId, scores: [5] }],
    }).expect(400);
    await req(teacherA, 'post', `${books()}/${id}/import`, {
      columns: [{ title: 'Oraliq nazorat-1', date: null }],
      rows: [{ userId: s1.userId, scores: [11] }],
    }).expect(400);

    const r = await req(teacherA, 'get', `${books()}/${id}/export.xlsx`)
      .buffer(true)
      .parse((res, cb) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => cb(null, Buffer.concat(chunks)));
      })
      .expect(200);
    const rows = readSpreadsheet(r.body as Buffer);
    expect(rows[0]).toEqual([
      '№',
      'F.I.Sh.',
      'JN-1 (20)',
      'JN-2 (20)',
      'ON-1 (10)',
      'ON-2 (10)',
      'YaN (40)',
      'JN jami (40)',
      'JN bahosi',
      'ON jami (20)',
      'Jami (100)',
      'Baho',
      'Holat',
    ]);
    expect(rows.find((x) => x[1] === 'TESTOV ALI VALIYEVICH')).toEqual([
      expect.any(Number),
      'TESTOV ALI VALIYEVICH',
      20,
      19,
      10,
      5,
      36,
      39,
      5,
      15,
      90,
      5,
      'Yakuniy baho',
    ]);
  });
});
