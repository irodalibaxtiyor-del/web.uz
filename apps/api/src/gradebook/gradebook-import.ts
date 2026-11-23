import {
  columnKey,
  columnLabel,
  CREDIT_CONTROL_INFO,
  creditHeaderMatch,
  type CreditControl,
  type GradebookScheme,
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
  existing: readonly {
    title: string;
    date: string | null;
    maxScore?: number;
    control?: CreditControl | null;
  }[],
  fallbackYear: number,
  scheme: GradebookScheme = 'LESSONS',
): GradebookImportPreview {
  const issues: GradebookImportIssue[] = [];
  const ignored: string[] = [];

  // Header: the first of the top rows with a name header ("F.I.Sh."), else the first non-empty.
  const top = rows.slice(0, 15);
  let h = top.findIndex((r) => r.some((c) => isIgnoredHeader(text(c)) === 'name'));
  if (h < 0) h = rows.findIndex((r) => r.some((c) => text(c) !== ''));
  if (h < 0)
    return {
      columns: [],
      rows: [],
      issues: [{ row: 0, message: 'Fayl bo‘sh' }],
      missing: [],
      ignored,
    };
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
    return { columns: [], rows: [], issues, missing: roster.map((s) => s.fullName), ignored };
  }

  // Grade columns: every other non-empty header that is not "№" or "O‘rtacha".
  // CREDIT: only the control totals (JN-1, JN-2, ON-1, ON-2, YaN) are taken; "JAMI" is a check.
  const seen = new Set<string>();
  const columns: {
    index: number;
    title: string;
    date: string | null;
    existing: boolean;
    max: number;
  }[] = [];
  let totalCol = -1;
  // CREDIT: an exact control header wins over a weak one ("AMALIY JAMI" next to "1 JN JAMI").
  const hasExact = new Set<string>();
  if (scheme === 'CREDIT')
    header.forEach((cell, index) => {
      const m = index === nameCol ? null : creditHeaderMatch(text(cell));
      if (m && !m.weak) hasExact.add(m.control);
    });
  header.forEach((cell, index) => {
    if (index === nameCol) return;
    if (scheme === 'CREDIT') {
      const label = text(cell).replace(/\s+/g, ' ');
      if (label === '' || isIgnoredHeader(label) === 'number') return;
      const m = creditHeaderMatch(text(cell));
      if (m?.control === 'TOTAL') {
        totalCol = index;
        return;
      }
      const control = m && !(m.weak && hasExact.has(m.control)) ? m.control : null;
      const target = control ? existing.find((c) => c.control === control) : undefined;
      if (!control || !target) {
        ignored.push(label);
        return;
      }
      if (seen.has(control)) {
        issues.push({
          row: h + 1,
          message: `${CREDIT_CONTROL_INFO[control].short} ustuni ikki marta uchradi — ikkinchisi olinmadi`,
        });
        return;
      }
      seen.add(control);
      columns.push({
        index,
        title: target.title,
        date: target.date,
        existing: true,
        max: target.maxScore ?? CREDIT_CONTROL_INFO[control].max,
      });
      return;
    }
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
    const prior = existing.find((c) => columnKey(c) === key);
    columns.push({ index, ...col, existing: !!prior, max: prior?.maxScore ?? 100 });
  });
  if (scheme === 'CREDIT') columns.sort((a, b) => existingPos(a) - existingPos(b));
  if (columns.length === 0)
    issues.push({
      row: h + 1,
      message:
        scheme === 'CREDIT'
          ? 'JN, ON yoki YaN jami ustunlari topilmadi (masalan, “AMALIY JAMI”, “JN JAMI”, “1 ON”, “YaN”)'
          : 'Baho ustunlari topilmadi',
    });
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
      if (p.ok && (p.score === null || p.score <= c.max)) return p.score;
      issues.push({
        row: rowNo,
        message: `${name}, “${columnLabel(c)}”: ${
          p.ok ? `${p.score} — ball ${c.max} dan oshmaydi` : p.message
        } — katak olinmadi`,
      });
      return null;
    });
    // CREDIT: the file's own "JAMI" must equal the sum of the controls taken.
    if (totalCol >= 0) {
      const t = parseScoreCell(r[totalCol]);
      const sum = Math.round(scores.reduce<number>((a, v) => a + (v ?? 0), 0) * 10) / 10;
      if (t.ok && t.score !== null && Math.abs(t.score - sum) > 0.05)
        issues.push({
          row: rowNo,
          message: `${name}: fayldagi JAMI (${t.score}) nazoratlar yig‘indisiga (${sum}) teng emas — tekshiring`,
        });
    }
    out.push({ userId: student.userId, fullName: student.fullName, sourceName: name, scores });
  });

  return {
    columns: columns.map(({ title, date, existing: e }) => ({ title, date, existing: e })),
    rows: out,
    issues,
    missing: roster.filter((s) => !used.has(s.userId)).map((s) => s.fullName),
    ignored,
  };

  function existingPos(c: { title: string; date: string | null }) {
    return existing.findIndex((e) => columnKey(e) === columnKey(c));
  }
}
