import { describe, expect, it } from 'vitest';
import { unzip } from '../../test/unzip';
import { attachmentHeader, buildXlsx } from './xlsx';

describe('buildXlsx', () => {
  it('writes a valid package with sheets, strings, numbers and dates', () => {
    const buf = buildXlsx([
      {
        name: 'Ballar',
        headerRows: 1,
        widths: [30, 10],
        rows: [
          ['F.I.Sh.', 'Ball'],
          ['O‘RINOV JASUR', 85],
          ['Sana', new Date('2026-10-12T07:00:00Z')],
        ],
      },
      { name: 'Ballar', rows: [['ikkinchi']] },
    ]);
    const files = unzip(buf);
    expect([...files.keys()]).toEqual(
      expect.arrayContaining([
        '[Content_Types].xml',
        'xl/workbook.xml',
        'xl/styles.xml',
        'xl/worksheets/sheet1.xml',
        'xl/worksheets/sheet2.xml',
      ]),
    );
    const sheet = files.get('xl/worksheets/sheet1.xml')!;
    expect(sheet).toContain('O‘RINOV JASUR');
    expect(sheet).toContain('<c r="B2"><v>85</v></c>');
    expect(sheet).toContain('state="frozen"');
    // 2026-10-12 12:00 Tashkent time.
    expect(sheet).toMatch(/<c r="B3" s="3"><v>46307\.5/);
    // Duplicate sheet names are made unique.
    expect(files.get('xl/workbook.xml')).toContain('name="Ballar (2)"');
  });

  it('never writes formulas and keeps formula-like text as text', () => {
    const payloads = ['=HYPERLINK("http://evil","x")', '+1+1', '-2', '@SUM(A1)', '\tx'];
    const sheet = unzip(buildXlsx([{ name: 'S', rows: payloads.map((p) => [p]) }])).get(
      'xl/worksheets/sheet1.xml',
    )!;
    expect(sheet).not.toContain('<f>');
    expect(sheet).not.toContain('<f ');
    // Every payload is an inline string with the quotePrefix style (2).
    expect(sheet.match(/t="inlineStr" s="2"/g)).toHaveLength(payloads.length);
    expect(sheet).toContain('=HYPERLINK(&quot;http://evil&quot;,&quot;x&quot;)');
  });

  it('escapes markup and drops characters XML cannot hold', () => {
    const sheet = unzip(buildXlsx([{ name: 'S', rows: [['<b>&\u0001</b>']] }])).get(
      'xl/worksheets/sheet1.xml',
    )!;
    expect(sheet).toContain('&lt;b&gt;&amp;&lt;/b&gt;');
    expect(sheet).not.toContain('\u0001');
  });

  it('builds a safe attachment header for Uzbek file names', () => {
    const h = attachmentHeader('ballar-8-24 ATT-o‘quv.xlsx');
    expect(h).toContain('filename="ballar-8-24 ATT-o_quv.xlsx"');
    expect(h).toContain("filename*=UTF-8''ballar-8-24%20ATT-o%E2%80%98quv.xlsx");
  });
});
