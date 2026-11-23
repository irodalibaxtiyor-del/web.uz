import { inflateRawSync } from 'node:zlib';

/**
 * Minimal, dependency-free reader for the first worksheet of an .xlsx file (and plain CSV).
 * Only the few XML parts needed are inflated, each with a hard size cap, so a crafted archive
 * ("zip bomb") cannot exhaust memory. Formulas are read by their cached value.
 */

export type ReadCell = string | number | null;

export class SpreadsheetError extends Error {}

const MAX_ENTRY_BYTES = 20 * 1024 * 1024;
const MAX_ROWS = 2000;
const MAX_COLS = 400;

interface ZipEntry {
  name: string;
  method: number;
  compressedSize: number;
  size: number;
  localOffset: number;
  flags: number;
}

function zipEntries(buf: Buffer): Map<string, ZipEntry> {
  const min = Math.max(0, buf.length - 65_557);
  let eocd = -1;
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new SpreadsheetError('Fayl Excel (.xlsx) formatida emas');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  if (count === 0xffff || p === 0xffffffff) throw new SpreadsheetError('Fayl juda katta');
  const out = new Map<string, ZipEntry>();
  for (let i = 0; i < count; i++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== 0x02014b50)
      throw new SpreadsheetError('Excel fayli buzilgan');
    const flags = buf.readUInt16LE(p + 8);
    const method = buf.readUInt16LE(p + 10);
    const compressedSize = buf.readUInt32LE(p + 20);
    const size = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    out.set(name, { name, method, compressedSize, size, localOffset, flags });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

function readEntry(buf: Buffer, e: ZipEntry): string {
  if (e.flags & 1) throw new SpreadsheetError('Parol bilan himoyalangan fayl o‘qilmaydi');
  if (e.size > MAX_ENTRY_BYTES) throw new SpreadsheetError('Fayl juda katta');
  const lp = e.localOffset;
  if (lp + 30 > buf.length || buf.readUInt32LE(lp) !== 0x04034b50)
    throw new SpreadsheetError('Excel fayli buzilgan');
  const start = lp + 30 + buf.readUInt16LE(lp + 26) + buf.readUInt16LE(lp + 28);
  const data = buf.subarray(start, start + e.compressedSize);
  if (e.method === 0) return data.toString('utf8');
  if (e.method !== 8) throw new SpreadsheetError('Excel fayli noma’lum usulda siqilgan');
  try {
    return inflateRawSync(data, { maxOutputLength: MAX_ENTRY_BYTES }).toString('utf8');
  } catch {
    throw new SpreadsheetError('Excel fayli buzilgan yoki juda katta');
  }
}

function decodeXml(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|lt|gt|amp|quot|apos);/gi, (_, e: string) => {
    const k = e.toLowerCase();
    if (k === 'lt') return '<';
    if (k === 'gt') return '>';
    if (k === 'amp') return '&';
    if (k === 'quot') return '"';
    if (k === 'apos') return "'";
    const code = k.startsWith('#x') ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10);
    return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : '';
  });
}

/** Concatenated text of all <t> runs (plain and rich text). */
function textRuns(xml: string): string {
  let out = '';
  for (const m of xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)) out += decodeXml(m[1] ?? '');
  return out;
}

function columnIndex(ref: string): number {
  let n = 0;
  for (const ch of ref.replace(/\d+$/, '').toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

function attr(tag: string, name: string): string | null {
  const m = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return m ? decodeXml(m[1] ?? '') : null;
}

function firstSheetPath(entries: Map<string, ZipEntry>, buf: Buffer): string {
  const wb = entries.get('xl/workbook.xml');
  const rels = entries.get('xl/_rels/workbook.xml.rels');
  if (wb && rels) {
    const sheet = /<sheet\b[^>]*>/.exec(readEntry(buf, wb))?.[0];
    const rid = sheet ? attr(sheet, 'r:id') : null;
    if (rid) {
      for (const m of readEntry(buf, rels).matchAll(/<Relationship\b[^>]*>/g)) {
        if (attr(m[0], 'Id') !== rid) continue;
        const target = attr(m[0], 'Target') ?? '';
        const path = target.startsWith('/') ? target.slice(1) : `xl/${target.replace(/^\.\//, '')}`;
        if (entries.has(path)) return path;
      }
    }
  }
  if (entries.has('xl/worksheets/sheet1.xml')) return 'xl/worksheets/sheet1.xml';
  throw new SpreadsheetError('Excel faylida varaq topilmadi');
}

function readXlsx(buf: Buffer): ReadCell[][] {
  const entries = zipEntries(buf);
  const ss = entries.get('xl/sharedStrings.xml');
  const shared = ss
    ? [...readEntry(buf, ss).matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textRuns(m[1] ?? ''))
    : [];
  const sheet = readEntry(buf, entries.get(firstSheetPath(entries, buf))!);
  const rows: ReadCell[][] = [];
  for (const rm of sheet.matchAll(/<row\b([^>]*)>([\s\S]*?)<\/row>/g)) {
    const r = Number(attr(` ${rm[1] ?? ''}`, 'r')) || rows.length + 1;
    if (r > MAX_ROWS) throw new SpreadsheetError(`Faylda ${MAX_ROWS} tadan ko‘p qator bor`);
    const row: ReadCell[] = [];
    for (const cm of (rm[2] ?? '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const tag = ` ${cm[1] ?? ''}`;
      const body = cm[2] ?? '';
      const ref = attr(tag, 'r');
      const col = ref ? columnIndex(ref) : row.length;
      if (col >= MAX_COLS) throw new SpreadsheetError(`Faylda ${MAX_COLS} tadan ko‘p ustun bor`);
      const type = attr(tag, 't');
      const v = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1];
      let value: ReadCell = null;
      if (type === 's') value = v !== undefined ? (shared[Number(v)] ?? null) : null;
      else if (type === 'inlineStr') value = textRuns(body);
      else if (type === 'str' || type === 'e') value = v !== undefined ? decodeXml(v) : null;
      else if (type === 'b') value = v === '1' ? 'TRUE' : 'FALSE';
      else if (v !== undefined) {
        const n = Number(v);
        value = Number.isFinite(n) ? n : decodeXml(v);
      }
      row[col] = typeof value === 'string' && value.trim() === '' ? null : value;
    }
    rows[r - 1] = Array.from(row, (c) => c ?? null);
  }
  return Array.from(rows, (r) => r ?? []);
}

/** Splits CSV/TSV text; the delimiter (`;`, `,` or tab) is taken from the first line. */
function readCsv(text: string): ReadCell[][] {
  const clean = text.replace(/^\uFEFF/, '');
  const first = clean.split(/\r?\n/, 1)[0] ?? '';
  const delim = ['\t', ';', ','].reduce((best, d) =>
    first.split(d).length > first.split(best).length ? d : best,
  );
  const rows: ReadCell[][] = [];
  let row: ReadCell[] = [];
  let cell = '';
  let quoted = false;
  const push = () => {
    const t = cell.trim();
    row.push(t === '' ? null : /^-?\d+(?:\.\d+)?$/.test(t) ? Number(t) : t);
    cell = '';
  };
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i]!;
    if (quoted) {
      if (ch === '"' && clean[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell === '') quoted = true;
    else if (ch === delim) push();
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && clean[i + 1] === '\n') i++;
      push();
      rows.push(row);
      row = [];
      if (rows.length > MAX_ROWS)
        throw new SpreadsheetError(`Faylda ${MAX_ROWS} tadan ko‘p qator bor`);
    } else cell += ch;
  }
  if (cell !== '' || row.length) {
    push();
    rows.push(row);
  }
  return rows;
}

/** Rows of the first sheet of an .xlsx file, or of a CSV file. */
export function readSpreadsheet(buf: Buffer): ReadCell[][] {
  if (buf.length >= 4 && buf.readUInt32LE(0) === 0x04034b50) return readXlsx(buf);
  if (buf.length >= 8 && buf.readUInt32LE(0) === 0xe011cfd0)
    throw new SpreadsheetError('Eski .xls formati o‘qilmaydi — faylni .xlsx qilib saqlang');
  const text = buf.toString('utf8');
  if (text.includes('\u0000')) throw new SpreadsheetError('Fayl Excel (.xlsx) yoki CSV emas');
  return readCsv(text);
}
