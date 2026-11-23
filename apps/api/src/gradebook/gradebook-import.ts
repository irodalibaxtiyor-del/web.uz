import {
  columnKey,
  columnLabel,
  GRADEBOOK_MAX_COLUMNS,
  isIgnoredHeader,
  parseColumnHeader,
  parseScoreCell,
  rosterKey,
  type GradebookImportIssue,
  type GradebookImportPreview,
} from '@webdizayn/shared';
import type { ReadCell } from '../common/xlsx-read';

export interface RosterStudent {
  userId: string;
  fullName: string;
}

const text = (c: ReadCell | undefined) => (c === null || c === undefined ? '' : String(c).trim());
const words = (s: string) => rosterKey(s).split(' ').filter(Boolean);

/**
 * Turns spreadsheet rows into an import preview: which columns, which students (matched to the
 * group roster by name), which scores, and every problem found. Nothing is written here.
 */
export function previewGradebookImport(
  rows: ReadCell[][],
  roster: readonly RosterStudent[],
  existing: readonly { title: string; date: string | null }[],
  fallbackYear: number,
): GradebookImportPreview {
  const issues: GradebookImportIssue[] = [];

  // Header: the first of the top rows with a name header ("F.I.Sh."), else the first non-empty.
  const top = rows.slice(0, 15);
  let h = top.findIndex((r) => r.some((c) => isIgnoredHeader(text(c)) === 'name'));
  if (h < 0) h = rows.findIndex((r) => r.some((c) => text(c) !== ''));
  if (h < 0)
    return { columns: [], rows: [], issues: [{ row: 0, message: 'Fayl bo‘sh' }], missing: [] };
  const header = rows[h]!;
  const body = rows.slice(h + 1);

  // Name column: the "F.I.Sh." header, else the column whose cells are mostly text.
  let nameCol = header.findIndex((c) => isIgnoredHeader(text(c)) === 'name');
  if (nameCol < 0) {
    const width = Math.max(...rows.map((r) => r.length), 0);
    let best = -1;
    let bestCount = 0;
    for (let c = 0; c < width; c++) {
      const n = body.filter(
        (r) => typeof r[c] === 'string' && /\p{L}{2,}/u.test(text(r[c])),
      ).length;
      if (n > bestCount) [best, bestCount] = [c, n];
    }
    nameCol = best;
  }
  if (nameCol < 0) {
    issues.push({ row: h + 1, message: 'Talabalar ismi yozilgan ustun topilmadi (“F.I.Sh.”)' });
    return { columns: [], rows: [], issues, missing: roster.map((s) => s.fullName) };
  }

  // Grade columns: every other non-empty header that is not "№" or "O‘rtacha".
  const existingKeys = new Set(existing.map(columnKey));
  const seen = new Set<string>();
  const columns: { index: number; title: string; date: string | null; existing: boolean }[] = [];
  header.forEach((cell, index) => {
    if (index === nameCol) return;
    const raw = typeof cell === 'number' ? cell : text(cell);
    if (raw === '' || (typeof raw === 'string' && isIgnoredHeader(raw))) return;
    const col = parseColumnHeader(raw, fallbackYear);
    const key = columnKey(col);
    if (seen.has(key)) {
      issues.push({
        row: h + 1,
        message: `“${columnLabel(col)}” ustuni ikki marta yozilgan — ikkinchisi olinmadi`,
      });
      return;
    }
    seen.add(key);
    columns.push({ index, ...col, existing: existingKeys.has(key) });
  });
  if (columns.length === 0) issues.push({ row: h + 1, message: 'Baho ustunlari topilmadi' });
  if (columns.length > GRADEBOOK_MAX_COLUMNS) {
    issues.push({ row: h + 1, message: `Ustunlar ${GRADEBOOK_MAX_COLUMNS} tadan ko‘p` });
    columns.length = GRADEBOOK_MAX_COLUMNS;
  }

  // Students: exact name match, else a unique match on the first words (file may omit the
  // patronymic: "Aliyev Ali" ↔ "ALIYEV ALI VALIYEVICH").
  const byKey = new Map(roster.map((s) => [rosterKey(s.fullName), s]));
  const matchName = (name: string): RosterStudent | null => {
    const exact = byKey.get(rosterKey(name));
    if (exact) return exact;
    const w = words(name);
    if (w.length < 2) return null;
    const hits = roster.filter((s) => {
      const sw = words(s.fullName);
      return w.length <= sw.length && w.every((x, i) => x === sw[i]);
    });
    return hits.length === 1 ? hits[0]! : null;
  };

  const out: GradebookImportPreview['rows'] = [];
  const used = new Set<string>();
  body.forEach((r, i) => {
    const rowNo = h + 2 + i;
    const name = text(r[nameCol]);
    // Blank rows and summary rows ("O‘rtacha", "Jami") are not students.
    if (!name || isIgnoredHeader(name) === 'summary') return;
    const student = matchName(name);
    if (!student) {
      issues.push({ row: rowNo, message: `“${name}” guruh ro‘yxatida topilmadi — qator olinmadi` });
      return;
    }
    if (used.has(student.userId)) {
      issues.push({ row: rowNo, message: `“${name}” ikkinchi marta uchradi — qator olinmadi` });
      return;
    }
    used.add(student.userId);
    const scores = columns.map((c) => {
      const p = parseScoreCell(r[c.index]);
      if (p.ok) return p.score;
      issues.push({
        row: rowNo,
        message: `${name}, “${columnLabel(c)}”: ${p.message} — katak olinmadi`,
      });
      return null;
    });
    out.push({ userId: student.userId, fullName: student.fullName, sourceName: name, scores });
  });

  return {
    columns: columns.map(({ title, date, existing: e }) => ({ title, date, existing: e })),
    rows: out,
    issues,
    missing: roster.filter((s) => !used.has(s.userId)).map((s) => s.fullName),
  };
}
