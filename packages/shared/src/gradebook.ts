import { z } from 'zod';

/**
 * Teacher gradebook ("Baholash jurnali"): scores a teacher gave in class, on a 100-point scale,
 * one column per lesson/date. These are recorded as the teacher's own grades — they are never
 * turned into platform activity (quiz attempts, lesson progress or time on task).
 */

export const GRADE_MAX = 100;
export const GRADEBOOK_TITLE_MAX = 120;
export const GRADEBOOK_COLUMN_TITLE_MAX = 120;
export const GRADEBOOK_MAX_COLUMNS = 200;
export const GRADEBOOK_MAX_STUDENTS = 300;
export const GRADEBOOK_MAX_ENTRIES = GRADEBOOK_MAX_COLUMNS * GRADEBOOK_MAX_STUDENTS;
/** Uploaded spreadsheet limit. */
export const GRADEBOOK_IMPORT_MAX_BYTES = 2 * 1024 * 1024;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Sana YYYY-MM-DD ko‘rinishida bo‘lsin')
  .refine((s) => isValidIsoDate(s), 'Bunday sana yo‘q');

/** A score: 0–100, at most one decimal place. `null` clears the cell. */
export const gradeScoreSchema = z
  .number()
  .min(0, 'Ball 0 dan kichik bo‘lmaydi')
  .max(GRADE_MAX, `Ball ${GRADE_MAX} dan oshmaydi`)
  .refine((n) => Math.abs(n * 10 - Math.round(n * 10)) < 1e-9, 'Ko‘pi bilan bitta kasr xona');

export const createGradebookSchema = z
  .object({ title: z.string().trim().min(2).max(GRADEBOOK_TITLE_MAX) })
  .strict();
export type CreateGradebookInput = z.infer<typeof createGradebookSchema>;

export const gradebookColumnSchema = z
  .object({
    title: z.string().trim().max(GRADEBOOK_COLUMN_TITLE_MAX).default(''),
    date: isoDate.nullable().default(null),
  })
  .strict()
  .refine((c) => c.title.length > 0 || c.date !== null, 'Ustunga sana yoki mavzu yozing');
export type GradebookColumnInput = z.infer<typeof gradebookColumnSchema>;

export const gradebookScoresSchema = z
  .object({
    entries: z
      .array(
        z
          .object({
            columnId: z.string().uuid(),
            userId: z.string().uuid(),
            score: gradeScoreSchema.nullable(),
          })
          .strict(),
      )
      .min(1)
      .max(GRADEBOOK_MAX_ENTRIES),
  })
  .strict();
export type GradebookScoresInput = z.infer<typeof gradebookScoresSchema>;

/** The import plan the teacher confirmed after the preview (re-validated by the server). */
export const gradebookImportSchema = z
  .object({
    columns: z
      .array(
        z
          .object({
            title: z.string().trim().max(GRADEBOOK_COLUMN_TITLE_MAX),
            date: isoDate.nullable(),
          })
          .strict(),
      )
      .min(1)
      .max(GRADEBOOK_MAX_COLUMNS),
    rows: z
      .array(
        z
          .object({
            userId: z.string().uuid(),
            scores: z.array(gradeScoreSchema.nullable()),
          })
          .strict(),
      )
      .min(1)
      .max(GRADEBOOK_MAX_STUDENTS),
  })
  .strict()
  .refine((p) => p.rows.every((r) => r.scores.length === p.columns.length), {
    message: 'Har qatorda ustunlar soni bir xil bo‘lsin',
  });
export type GradebookImportInput = z.infer<typeof gradebookImportSchema>;

// ---- Views -------------------------------------------------------------------

export interface GradebookColumn {
  id: string;
  title: string;
  date: string | null;
  position: number;
}

export interface GradebookSummary {
  id: string;
  title: string;
  groupId: string;
  groupName: string;
  columns: number;
  students: number;
  /** Mean of all filled cells, or null when nothing is filled. */
  average: number | null;
  updatedAt: string;
}

export interface GradebookStudentRow {
  userId: string;
  fullName: string;
  /** columnId → score (null = empty cell). */
  scores: Record<string, number | null>;
  average: number | null;
  filled: number;
}

export interface GradebookView {
  id: string;
  title: string;
  group: { id: string; name: string };
  columns: GradebookColumn[];
  students: GradebookStudentRow[];
  stats: GradebookStats;
  updatedAt: string;
}

export interface GradebookStats {
  average: number | null;
  /** Mean per column, in column order. */
  columnAverages: (number | null)[];
  /** How many students' averages fall into each band. */
  bands: Record<GradeBand, number>;
  filledCells: number;
  totalCells: number;
}

/** Student's own view of one gradebook. */
export interface MyGradebook {
  id: string;
  title: string;
  groupName: string;
  columns: (GradebookColumn & { score: number | null })[];
  average: number | null;
  band: GradeBand | null;
}

export interface GradebookImportIssue {
  /** 1-based spreadsheet row, or 0 for the header. */
  row: number;
  message: string;
}

export interface GradebookImportPreview {
  columns: { title: string; date: string | null; existing: boolean }[];
  rows: { userId: string; fullName: string; sourceName: string; scores: (number | null)[] }[];
  issues: GradebookImportIssue[];
  /** Group students that have no row in the file. */
  missing: string[];
}

export interface GradebookImportResult {
  columnsCreated: number;
  cellsWritten: number;
}

// ---- Grade bands (100-point scale used in Uzbek higher education) -----------

export const GRADE_BANDS = ['EXCELLENT', 'GOOD', 'SATISFACTORY', 'FAIL'] as const;
export type GradeBand = (typeof GRADE_BANDS)[number];
export const GRADE_BAND_LABEL: Record<GradeBand, string> = {
  EXCELLENT: 'A’lo (86–100)',
  GOOD: 'Yaxshi (71–85)',
  SATISFACTORY: 'Qoniqarli (55–70)',
  FAIL: 'Qoniqarsiz (0–54)',
};

export function gradeBand(score: number): GradeBand {
  if (score >= 86) return 'EXCELLENT';
  if (score >= 71) return 'GOOD';
  if (score >= 55) return 'SATISFACTORY';
  return 'FAIL';
}

/** Mean rounded to one decimal, or null for no values. */
export function meanScore(values: readonly (number | null | undefined)[]): number | null {
  const v = values.filter((x): x is number => typeof x === 'number');
  if (v.length === 0) return null;
  return Math.round((v.reduce((s, x) => s + x, 0) / v.length) * 10) / 10;
}

export function gradebookStats(
  columns: readonly { id: string }[],
  students: readonly { scores: Record<string, number | null> }[],
): GradebookStats {
  const bands: Record<GradeBand, number> = { EXCELLENT: 0, GOOD: 0, SATISFACTORY: 0, FAIL: 0 };
  const all: number[] = [];
  for (const s of students) {
    const vals = columns.map((c) => s.scores[c.id] ?? null);
    for (const v of vals) if (v !== null) all.push(v);
    const avg = meanScore(vals);
    if (avg !== null) bands[gradeBand(avg)]++;
  }
  return {
    average: meanScore(all),
    columnAverages: columns.map((c) => meanScore(students.map((s) => s.scores[c.id] ?? null))),
    bands,
    filledCells: all.length,
    totalCells: columns.length * students.length,
  };
}

// ---- Spreadsheet parsing helpers ---------------------------------------------

export function isValidIsoDate(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Excel serial day (1900 system) → ISO date; null outside a sane range (2000–2100). */
export function excelSerialToIso(serial: number): string | null {
  if (!Number.isFinite(serial) || serial < 36526 || serial > 73051) return null;
  const ms = Date.UTC(1899, 11, 30) + Math.floor(serial) * 86_400_000;
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

const DATE_IN_TEXT = /(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?/;

/**
 * Splits a column header into a date and a topic: "05.09.2026 — HTML teglari",
 * "05.09 HTML", an Excel date serial, or just "1-dars". `fallbackYear` completes "dd.mm".
 */
export function parseColumnHeader(
  raw: string | number,
  fallbackYear: number,
): { title: string; date: string | null } {
  if (typeof raw === 'number') {
    const iso = excelSerialToIso(raw);
    return iso ? { title: '', date: iso } : { title: String(raw), date: null };
  }
  const text = raw.replace(/\s+/g, ' ').trim();
  const m = DATE_IN_TEXT.exec(text);
  if (m && m.index === 0) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    let year = m[3] ? Number(m[3]) : fallbackYear;
    if (year < 100) year += 2000;
    const iso = `${year}-${pad(month)}-${pad(day)}`;
    if (isValidIsoDate(iso)) {
      const title = text
        .slice(m[0].length)
        .replace(/^[\s—–:|,-]+/, '')
        .trim();
      return { title: title.slice(0, GRADEBOOK_COLUMN_TITLE_MAX), date: iso };
    }
  }
  return { title: text.slice(0, GRADEBOOK_COLUMN_TITLE_MAX), date: null };
}

/** Cells meaning "no grade" (absent, not assessed). */
const EMPTY_MARKS = new Set(['', '-', '–', '—', 'nb', 'n/b', 'н/б', 'нб', 'yo‘q', "yo'q", 'x']);

/** A score cell: number 0–100 (comma decimals allowed); "nb", "-", empty → null. */
export function parseScoreCell(
  raw: string | number | null | undefined,
): { ok: true; score: number | null } | { ok: false; message: string } {
  if (raw === null || raw === undefined) return { ok: true, score: null };
  let n: number;
  if (typeof raw === 'number') n = raw;
  else {
    const t = raw.trim().toLowerCase();
    if (EMPTY_MARKS.has(t)) return { ok: true, score: null };
    if (!/^\d+(?:[.,]\d+)?$/.test(t)) return { ok: false, message: `“${raw}” — ball emas` };
    n = Number(t.replace(',', '.'));
  }
  if (!Number.isFinite(n) || n < 0 || n > GRADE_MAX)
    return { ok: false, message: `${n} — ball 0 dan ${GRADE_MAX} gacha bo‘lishi kerak` };
  return { ok: true, score: Math.round(n * 10) / 10 };
}

/** Header cells that are not grade columns. */
export function isIgnoredHeader(text: string): 'number' | 'name' | 'summary' | null {
  const t = text.replace(/\s+/g, ' ').trim().toLowerCase();
  if (/^(№|#|n|t\/r|т\/р|nr|no\.?)$/.test(t)) return 'number';
  if (/(f\.?\s*i\.?\s*(sh|o)\.?|familiya|ism|talaba|o‘quvchi|o'quvchi|ф\.?\s*и)/.test(t))
    return 'name';
  if (/^(o‘rtacha|o'rtacha|ortacha|jami|umumiy|среднее|итого)/.test(t)) return 'summary';
  return null;
}

/** Key used to match an imported column to an existing one. */
export function columnKey(c: { title: string; date: string | null }): string {
  return `${c.date ?? ''}|${c.title.replace(/\s+/g, ' ').trim().toLowerCase()}`;
}

/** Header text for exports and the template: "05.09.2026 — HTML teglari". */
export function columnLabel(c: { title: string; date: string | null }): string {
  const d = c.date ? `${c.date.slice(8, 10)}.${c.date.slice(5, 7)}.${c.date.slice(0, 4)}` : '';
  return [d, c.title].filter(Boolean).join(' — ');
}
