/**
 * Tiny PDF writer for tests and local demos: one line of Helvetica text per page, an optional
 * outline (table of contents). Not used for user content.
 */
export function makePdf(opts: {
  pages: string[];
  outline?: { title: string; page: number }[];
  width?: number;
  height?: number;
}): Buffer {
  const w = opts.width ?? 420;
  const h = opts.height ?? 595;
  const outline = opts.outline ?? [];
  const objects: string[] = [];
  const add = (body: string) => objects.push(body) as number; // returns the object number

  const esc = (s: string) => s.replace(/[\\()]/g, (c) => `\\${c}`).replace(/[^\x20-\x7e]/g, '?');
  const catalog = add(''); // 1, filled below
  const pagesObj = add(''); // 2
  const font = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const pageNums: number[] = [];
  for (const text of opts.pages) {
    const stream = `BT /F1 28 Tf 40 ${h - 80} Td (${esc(text)}) Tj ET`;
    const content = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    pageNums.push(
      add(
        `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${w} ${h}] ` +
          `/Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${content} 0 R >>`,
      ),
    );
  }
  objects[pagesObj - 1] =
    `<< /Type /Pages /Kids [${pageNums.map((n) => `${n} 0 R`).join(' ')}] /Count ${pageNums.length} >>`;

  let outlinesRef = '';
  if (outline.length > 0) {
    const root = add('');
    const items = outline.map(() => add(''));
    outline.forEach((o, i) => {
      const prev = i > 0 ? ` /Prev ${items[i - 1]} 0 R` : '';
      const next = i < items.length - 1 ? ` /Next ${items[i + 1]} 0 R` : '';
      objects[items[i]! - 1] =
        `<< /Title (${esc(o.title)}) /Parent ${root} 0 R${prev}${next} ` +
        `/Dest [${pageNums[o.page - 1]} 0 R /Fit] >>`;
    });
    objects[root - 1] =
      `<< /Type /Outlines /First ${items[0]} 0 R /Last ${items.at(-1)} 0 R /Count ${items.length} >>`;
    outlinesRef = ` /Outlines ${root} 0 R`;
  }
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObj} 0 R${outlinesRef} >>`;

  let out = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(out, 'latin1'));
    out += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = Buffer.byteLength(out, 'latin1');
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const o of offsets) out += `${String(o).padStart(10, '0')} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, 'latin1');
}
