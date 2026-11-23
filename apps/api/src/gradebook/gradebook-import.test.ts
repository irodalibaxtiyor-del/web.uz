import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readSpreadsheet } from '../common/xlsx-read';
import { previewGradebookImport } from './gradebook-import';

const roster = [
  { userId: 'u1', fullName: 'TESTOV ALI VALIYEVICH' },
  { userId: 'u2', fullName: 'SINOVOVA LOLA' },
  { userId: 'u3', fullName: 'O‘RINOVA DILNOZA' },
  { userId: 'u4', fullName: 'KELMAGAN TALABA' },
];

describe('previewGradebookImport', () => {
  it('reads the Excel fixture: columns, matched students, scores and issues', () => {
    const rows = readSpreadsheet(readFileSync(join(__dirname, '../../test/fixtures/jurnal.xlsx')));
    const p = previewGradebookImport(rows, roster, [{ title: '1-oraliq', date: null }], 2026);
    expect(p.columns).toEqual([
      { title: '', date: '2026-09-05', existing: false },
      { title: 'CSS selektorlar', date: '2026-09-12', existing: false },
      { title: '1-oraliq', date: null, existing: true },
    ]);
    expect(p.rows).toEqual([
      {
        userId: 'u1',
        fullName: 'TESTOV ALI VALIYEVICH',
        sourceName: 'TESTOV ALI VALIYEVICH',
        scores: [90, 85.5, null],
      },
      {
        userId: 'u2',
        fullName: 'SINOVOVA LOLA',
        sourceName: 'Sinovova Lola',
        scores: [72, null, 64],
      },
      {
        userId: 'u3',
        fullName: 'O‘RINOVA DILNOZA',
        sourceName: 'O‘RINOVA DILNOZA',
        scores: [null, 95, null],
      },
    ]);
    const msgs = p.issues.map((i) => `${i.row}: ${i.message}`);
    expect(msgs).toEqual([
      expect.stringMatching(/^4: “Noma'lum Talaba” guruh ro‘yxatida topilmadi/),
      expect.stringMatching(/^5: O‘RINOVA DILNOZA, “05\.09\.2026”: “a’lo” — ball emas/),
      expect.stringMatching(/^5: .*“1-oraliq”: 101 — ball 0 dan 100 gacha/),
    ]);
    expect(p.missing).toEqual(['KELMAGAN TALABA']);
  });

  it('matches a name without patronymic only when it is unambiguous', () => {
    const r = [
      { userId: 'a', fullName: 'ALIYEV ALI VALIYEVICH' },
      { userId: 'b', fullName: 'KARIMOV BOBUR A' },
      { userId: 'c', fullName: 'KARIMOV BOBUR B' },
    ];
    const p = previewGradebookImport(
      [
        ['F.I.Sh.', 'Test'],
        ['Aliyev Ali', 80],
        ['Karimov Bobur', 70],
      ],
      r,
      [],
      2026,
    );
    expect(p.rows.map((x) => x.userId)).toEqual(['a']);
    expect(p.issues[0]!.message).toMatch(/Karimov Bobur/);
  });

  it('finds the name column without a header and skips duplicates', () => {
    const p = previewGradebookImport(
      [
        ['', '1-dars', '1-dars'],
        ['Sinovova Lola', 90, 91],
        ['SINOVOVA LOLA', 50, 50],
      ],
      roster,
      [],
      2026,
    );
    expect(p.columns).toHaveLength(1);
    expect(p.rows).toEqual([expect.objectContaining({ userId: 'u2', scores: [90] })]);
    expect(p.issues.map((i) => i.message)).toEqual([
      expect.stringMatching(/ikki marta yozilgan/),
      expect.stringMatching(/ikkinchi marta uchradi/),
    ]);
  });

  it('an empty file is reported, not imported', () => {
    expect(previewGradebookImport([], roster, [], 2026).issues[0]!.message).toBe('Fayl bo‘sh');
  });
});
