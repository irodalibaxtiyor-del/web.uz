import { describe, expect, it } from 'vitest';
import {
  columnKey,
  columnLabel,
  creditControlOf,
  creditHeaderMatch,
  excelSerialToIso,
  gradeBand,
  gradebookImportSchema,
  gradebookMark,
  gradebookStats,
  gradeScoreSchema,
  isIgnoredHeader,
  meanScore,
  parseColumnHeader,
  parseScoreCell,
} from './gradebook';

describe('gradebook helpers', () => {
  it('bands follow “Ballar taqsimoti”: 90 / 70 / 60 % of the maximum', () => {
    expect([100, 90, 89.9, 70, 69.9, 60, 59.9, 0].map((x) => gradeBand(x))).toEqual([
      'EXCELLENT',
      'EXCELLENT',
      'GOOD',
      'GOOD',
      'SATISFACTORY',
      'SATISFACTORY',
      'FAIL',
      'FAIL',
    ]);
    // Joriy nazorat (40): 36 / 28 / 24; one control (20): 18 / 14 / 12; ON (10): 9 / 7 / 6.
    expect([36, 35.9, 28, 27.9, 24, 23.9].map((x) => gradeBand(x, 40))).toEqual([
      'EXCELLENT',
      'GOOD',
      'GOOD',
      'SATISFACTORY',
      'SATISFACTORY',
      'FAIL',
    ]);
    expect([18, 17.9, 14, 12, 11.9].map((x) => gradeBand(x, 20))).toEqual([
      'EXCELLENT',
      'GOOD',
      'GOOD',
      'SATISFACTORY',
      'FAIL',
    ]);
    expect([9, 8.9, 7, 6, 5.9].map((x) => gradeBand(x, 10))).toEqual([
      'EXCELLENT',
      'GOOD',
      'GOOD',
      'SATISFACTORY',
      'FAIL',
    ]);
  });

  it('credit marks: JN / ON sections, pending final, YaN pass rule', () => {
    const cols = (
      [
        ['j1', 'JN1', 20],
        ['j2', 'JN2', 20],
        ['o1', 'ON1', 10],
        ['o2', 'ON2', 10],
        ['y', 'YN', 40],
      ] as const
    ).map(([id, control, maxScore]) => ({ id, control, maxScore }));
    const H60 = new Set(['j1', 'j2', 'o1', 'o2']);
    const ALL = new Set(['j1', 'j2', 'o1', 'o2', 'y']);
    // Only JN-1 held so far: JN is out of 20, not 40.
    expect(gradebookMark('CREDIT', cols, { j1: 15 }, new Set(['j1'])).sections).toEqual({
      JN: { score: 15, max: 20, band: 'GOOD' },
      ON: null,
    });
    const pending = gradebookMark('CREDIT', cols, { j1: 20, j2: 18, o1: 9, o2: 5, y: null }, H60);
    expect(pending).toMatchObject({ total: 52, final: 'PENDING', band: 'GOOD', filled: 4 });
    expect(pending.sections).toEqual({
      JN: { score: 38, max: 40, band: 'EXCELLENT' },
      ON: { score: 14, max: 20, band: 'GOOD' },
    });
    // An empty control counts as 0 in its section.
    expect(gradebookMark('CREDIT', cols, { j2: 8, o2: 5 }, H60).sections?.JN).toEqual({
      score: 8,
      max: 40,
      band: 'FAIL',
    });
    expect(
      gradebookMark('CREDIT', cols, { j1: 20, j2: 20, o1: 10, o2: 10, y: 36 }, ALL),
    ).toMatchObject({ total: 96, final: 'PASSED', band: 'EXCELLENT' });
    expect(
      gradebookMark('CREDIT', cols, { j1: 20, j2: 20, o1: 10, o2: 10, y: 23 }, ALL),
    ).toMatchObject({ total: 83, final: 'YN_FAILED', band: 'FAIL' });
    expect(gradebookMark('CREDIT', cols, {}, H60)).toMatchObject({ total: null, band: null });

    const rows = [
      { scores: { j1: 20, j2: 18, o1: 9, o2: 5 } },
      { scores: { j1: 6, j2: 8, o1: 3, o2: 5 } },
    ].map((r) => ({ ...r, ...gradebookMark('CREDIT', cols, r.scores, H60) }));
    const st = gradebookStats('CREDIT', cols, rows);
    expect(st).toMatchObject({ heldMax: 60, pending: 2, average: 37, jnAverage: 26 });
    expect(st.jnBands).toEqual({ EXCELLENT: 1, GOOD: 0, SATISFACTORY: 0, FAIL: 1 });
  });

  it('finds the control totals in a credit vedomost header', () => {
    const map = (h: string) => creditControlOf(h);
    expect(map('AMALIY JAMI\r\n20 ball')).toBe('JN1');
    expect(map('2\r\nJN\r\nJAMI\r\n(20)')).toBe('JN2');
    expect(map('1\r\nON\r\n(10)')).toBe('ON1');
    expect(map('2\r\nON\r\n(10)')).toBe('ON2');
    expect(map('YaN\r\n(40)')).toBe('YN');
    expect(map('JAMI')).toBe('TOTAL');
    expect(map('Joriy nazorat-2')).toBe('JN2');
    expect(map('Oraliq nazorat-1')).toBe('ON1');
    expect(map('Yakuniy nazorat')).toBe('YN');
    // Item columns are not controls.
    expect(map('1-amaliy ish\r\nGnomchalar\r\n2-ball')).toBeNull();
    expect(map('2\r\nJN\r\n1-Amaliy ish\r\nPhoto mantaj\r\n2 ball')).toBeNull();
    expect(map('Jami ball\r\n10 ball')).toBeNull();
    expect(map('02/03\r\nQayta ish topshirganligi')).toBeNull();
    expect(map('29,04,2026')).toBeNull();
    // Other vedomost layouts.
    expect(map('1 JN JAMI (20)')).toBe('JN1');
    expect(map('1-ON 10-ball')).toBe('ON1');
    expect(map('1 ON  yozma ish 5 ball')).toBeNull();
    expect(map('Hemis ON 5 ball')).toBeNull();
    expect(map('ON 5-ball')).toBeNull();
    expect(map('JN 5 ball')).toBeNull();
    expect(map('Hemis JN Tabrik 5 ball')).toBeNull();
    expect(creditHeaderMatch('AMALIY JAMI')).toEqual({ control: 'JN1', weak: true });
    expect(creditHeaderMatch('JAMI JN')).toEqual({ control: 'JN1', weak: true });
    expect(creditHeaderMatch('1 JN JAMI (20)')).toEqual({ control: 'JN1', weak: false });
  });

  it('means ignore empty cells and round to one decimal', () => {
    expect(meanScore([90, null, 85, 80])).toBe(85);
    expect(meanScore([70, 71, 71])).toBe(70.7);
    expect(meanScore([null, undefined])).toBeNull();
  });

  it('stats: overall mean, column means and bands', () => {
    const cols = [
      { id: 'a', maxScore: 100, control: null },
      { id: 'b', maxScore: 100, control: null },
    ];
    const s = gradebookStats(
      'LESSONS',
      cols,
      [{ scores: { a: 90, b: 100 } }, { scores: { a: 60, b: null } }, { scores: {} }].map((r) => ({
        ...r,
        ...gradebookMark('LESSONS', cols, r.scores, new Set()),
      })),
    );
    expect(s.average).toBe(83.3);
    expect(s.columnAverages).toEqual([75, 100]);
    expect(s.bands).toEqual({ EXCELLENT: 1, GOOD: 0, SATISFACTORY: 1, FAIL: 0 });
    expect(s).toMatchObject({ filledCells: 3, totalCells: 6 });
  });

  it('scores: 0–100, one decimal at most', () => {
    expect(gradeScoreSchema.safeParse(85.5).success).toBe(true);
    expect(gradeScoreSchema.safeParse(100).success).toBe(true);
    expect(gradeScoreSchema.safeParse(100.5).success).toBe(false);
    expect(gradeScoreSchema.safeParse(-1).success).toBe(false);
    expect(gradeScoreSchema.safeParse(85.55).success).toBe(false);
  });

  it('parses score cells from a spreadsheet', () => {
    expect(parseScoreCell(87)).toEqual({ ok: true, score: 87 });
    expect(parseScoreCell('85,5')).toEqual({ ok: true, score: 85.5 });
    expect(parseScoreCell(' 90 ')).toEqual({ ok: true, score: 90 });
    for (const empty of ['', 'nb', 'NB', '-', 'н/б', null, undefined])
      expect(parseScoreCell(empty)).toEqual({ ok: true, score: null });
    expect(parseScoreCell('a’lo').ok).toBe(false);
    expect(parseScoreCell(120).ok).toBe(false);
  });

  it('parses column headers into date and topic', () => {
    expect(parseColumnHeader('05.09.2026 — HTML teglari', 2026)).toEqual({
      title: 'HTML teglari',
      date: '2026-09-05',
    });
    expect(parseColumnHeader('12.10 CSS selektorlar', 2026)).toEqual({
      title: 'CSS selektorlar',
      date: '2026-10-12',
    });
    expect(parseColumnHeader('1/3/26', 2026)).toEqual({ title: '', date: '2026-03-01' });
    expect(parseColumnHeader('1-dars', 2026)).toEqual({ title: '1-dars', date: null });
    expect(parseColumnHeader(46270, 2026)).toEqual({ title: '', date: excelSerialToIso(46270) });
    expect(parseColumnHeader('31.02.2026', 2026)).toEqual({ title: '31.02.2026', date: null });
  });

  it('excel serial dates', () => {
    expect(excelSerialToIso(45658)).toBe('2025-01-01');
    expect(excelSerialToIso(5)).toBeNull();
  });

  it('recognises non-grade header cells', () => {
    expect(isIgnoredHeader('№')).toBe('number');
    expect(isIgnoredHeader('F.I.Sh.')).toBe('name');
    expect(isIgnoredHeader('Talabaning familiyasi, ismi')).toBe('name');
    expect(isIgnoredHeader('O‘rtacha')).toBe('summary');
    expect(isIgnoredHeader('05.09.2026')).toBeNull();
  });

  it('column keys and labels round-trip through export headers', () => {
    const c = { title: 'HTML teglari', date: '2026-09-05' };
    expect(columnLabel(c)).toBe('05.09.2026 — HTML teglari');
    expect(columnKey(parseColumnHeader(columnLabel(c), 2000))).toBe(columnKey(c));
    expect(columnKey({ title: ' html  TEGLARI', date: '2026-09-05' })).toBe(columnKey(c));
  });

  it('import plan rows must match the column count', () => {
    const id = '00000000-0000-4000-8000-000000000001';
    expect(
      gradebookImportSchema.safeParse({
        columns: [{ title: 'a', date: null }],
        rows: [{ userId: id, scores: [90] }],
      }).success,
    ).toBe(true);
    expect(
      gradebookImportSchema.safeParse({
        columns: [{ title: 'a', date: null }],
        rows: [{ userId: id, scores: [90, 80] }],
      }).success,
    ).toBe(false);
  });
});
