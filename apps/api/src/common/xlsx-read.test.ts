import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { buildXlsx } from './xlsx';
import { readSpreadsheet, SpreadsheetError } from './xlsx-read';

describe('readSpreadsheet', () => {
  it('reads back what the platform writes (inline strings, numbers, gaps)', () => {
    const buf = buildXlsx([
      {
        name: 'Jurnal',
        rows: [
          ['№', 'F.I.Sh.', '05.09.2026 — HTML <teglar> & atributlar'],
          [1, 'O‘RINOVA DILNOZA', 85.5],
          [2, 'Ali', null],
        ],
      },
    ]);
    expect(readSpreadsheet(buf)).toEqual([
      ['№', 'F.I.Sh.', '05.09.2026 — HTML <teglar> & atributlar'],
      [1, 'O‘RINOVA DILNOZA', 85.5],
      [2, 'Ali'],
    ]);
  });

  it('reads an Excel-style file with shared strings and a date cell', () => {
    const rows = readSpreadsheet(readFileSync(join(__dirname, '../../test/fixtures/jurnal.xlsx')));
    expect(rows[0]).toEqual([
      '№',
      'F.I.Sh.',
      46270, // 2026-09-05 as an Excel serial date
      '12.09.2026 — CSS selektorlar',
      '1-oraliq',
      'O‘rtacha',
    ]);
    expect(rows[1]).toEqual([1, 'TESTOV ALI VALIYEVICH', 90, 85.5, 'nb']);
    expect(rows[4]).toEqual([4, 'O‘RINOVA DILNOZA', 'a’lo', 95, 101]);
  });

  it('reads CSV with a semicolon delimiter and quoted cells', () => {
    const csv = '\uFEFFF.I.Sh.;"05.09 — HTML; teglar"\r\n"Ali ""Vali""";90\r\nLola;\r\n';
    expect(readSpreadsheet(Buffer.from(csv))).toEqual([
      ['F.I.Sh.', '05.09 — HTML; teglar'],
      ['Ali "Vali"', 90],
      ['Lola', null],
    ]);
  });

  it('refuses old .xls, broken archives and oversized entries', () => {
    const xls = Buffer.alloc(16);
    xls.writeUInt32LE(0xe011cfd0, 0);
    expect(() => readSpreadsheet(xls)).toThrow(/\.xls/);
    const broken = Buffer.from('PK\u0003\u0004 not really a zip');
    expect(() => readSpreadsheet(broken)).toThrow(SpreadsheetError);

    // A tiny archive whose sheet inflates past the cap is rejected, not expanded.
    const bomb = deflateRawSync(Buffer.alloc(25 * 1024 * 1024, 0x20));
    expect(() =>
      readSpreadsheet(zipOf('xl/worksheets/sheet1.xml', bomb, 25 * 1024 * 1024)),
    ).toThrow(SpreadsheetError);
  });
});

/** One-entry deflate ZIP with a declared uncompressed size. */
function zipOf(name: string, data: Buffer, size: number): Buffer {
  const n = Buffer.from(name);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(8, 8);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(size, 22);
  local.writeUInt16LE(n.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(8, 10);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt32LE(size, 24);
  central.writeUInt16LE(n.length, 28);
  const cdOffset = 30 + n.length + data.length;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(1, 8);
  eocd.writeUInt16LE(1, 10);
  eocd.writeUInt32LE(46 + n.length, 12);
  eocd.writeUInt32LE(cdOffset, 16);
  return Buffer.concat([local, n, data, central, n, eocd]);
}
