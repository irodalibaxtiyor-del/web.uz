import { describe, expect, it } from 'vitest';
import {
  columnKey,
  columnLabel,
  excelSerialToIso,
  gradeBand,
  gradebookImportSchema,
  gradebookStats,
  gradeScoreSchema,
  isIgnoredHeader,
  meanScore,
  parseColumnHeader,
  parseScoreCell,
} from './gradebook';

describe('gradebook helpers', () => {
  it('bands follow the 100-point scale', () => {
    expect([100, 86, 85.9, 71, 70, 55, 54.9, 0].map(gradeBand)).toEqual([
      'EXCELLENT',
      'EXCELLENT',
      'GOOD',
      'GOOD',
      'SATISFACTORY',
      'SATISFACTORY',
      'FAIL',
      'FAIL',
    ]);
  });

  it('means ignore empty cells and round to one decimal', () => {
    expect(meanScore([90, null, 85, 80])).toBe(85);
    expect(meanScore([70, 71, 71])).toBe(70.7);
    expect(meanScore([null, undefined])).toBeNull();
  });

  it('stats: overall mean, column means and bands', () => {
    const cols = [{ id: 'a' }, { id: 'b' }];
    const s = gradebookStats(cols, [
      { scores: { a: 90, b: 100 } },
      { scores: { a: 60, b: null } },
      { scores: {} },
    ]);
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
