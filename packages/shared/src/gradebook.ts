import { z } from 'zod';

/**
 * Teacher gradebook ("Baholash jurnali"): scores a teacher gave in class. These are recorded as
 * the teacher's own grades — they are never turned into platform activity (quiz attempts,
 * lesson progress or time on task).
 *
 * Two schemes:
 * - LESSONS: one column per lesson/date, each scored out of 100; a student's mark is the mean.
 * - CREDIT: the credit rating system — fixed controls JN-1 (20), JN-2 (20), ON-1 (10), ON-2 (10)
 *   and YaN (40); a student's mark is the sum out of 100, and a final mark exists only once the
 *   final control (YaN) is graded. Fewer than 24 of 40 in YaN means the final is not passed.
 *   Current control (JN, 40) and midterm control (ON, 20) also get their own marks.
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

export const GRADEBOOK_SCHEMES = ['LESSONS', 'CREDIT'] as const;
export type GradebookScheme = (typeof GRADEBOOK_SCHEMES)[number];
export const GRADEBOOK_SCHEME_LABEL: Record<GradebookScheme, string> = {
  LESSONS: 'Darslar bo‘yicha (har dars 100 ball, o‘rtacha)',
  CREDIT: 'Kredit tizimi (JN 40 + ON 20 + YaN 40 = 100 ball)',
};

export const CREDIT_CONTROLS = ['JN1', 'JN2', 'ON1', 'ON2', 'YN'] as const;
export type CreditControl = (typeof CREDIT_CONTROLS)[number];
/** Title and maximum of each control (“Ballar taqsimoti”). */
export const CREDIT_CONTROL_INFO: Record<
  CreditControl,
  { title: string; short: string; max: number }
> = {
  JN1: { title: 'Joriy nazorat-1', short: 'JN-1', max: 20 },
  JN2: { title: 'Joriy nazorat-2', short: 'JN-2', max: 20 },
  ON1: { title: 'Oraliq nazorat-1', short: 'ON-1', max: 10 },
  ON2: { title: 'Oraliq nazorat-2', short: 'ON-2', max: 10 },
  YN: { title: 'Yakuniy nazorat', short: 'YaN', max: 40 },
};
/** Control groups with their own mark: current control (JN, 40) and midterm control (ON, 20). */
export const CREDIT_SECTIONS = {
  JN: { title: 'Joriy nazorat', controls: ['JN1', 'JN2'] as CreditControl[], max: 40 },
  ON: { title: 'Oraliq nazorat', controls: ['ON1', 'ON2'] as CreditControl[], max: 20 },
} as const;
export type CreditSection = keyof typeof CREDIT_SECTIONS;
/** Below this YaN score (60 % of 40) the final control counts as not passed. */
export const CREDIT_YN_PASS = 24;

export const createGradebookSchema = z
  .object({
    title: z.string().trim().min(2).max(GRADEBOOK_TITLE_MAX),
    scheme: z.enum(GRADEBOOK_SCHEMES).default('LESSONS'),
  })
  .strict();
export type CreateGradebookInput = z.input<typeof createGradebookSchema>;

export const renameGradebookSchema = z
  .object({ title: z.string().trim().min(2).max(GRADEBOOK_TITLE_MAX) })
  .strict();
export type RenameGradebookInput = z.infer<typeof renameGradebookSchema>;

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
  /** Highest score this column accepts (100 for LESSONS). */
  maxScore: number;
  /** CREDIT only: which control the column is. */
  control: CreditControl | null;
}

/**
 * Final state of a CREDIT row: PENDING — YaN not graded yet; PASSED — YaN graded and ≥ 24;
 * YN_FAILED — YaN graded but below 24.
 */
export type CreditFinal = 'PENDING' | 'PASSED' | 'YN_FAILED';

/** CREDIT: sum and mark of a control group (null when none of its controls is graded). */
export interface SectionMark {
  score: number;
  max: number;
  band: GradeBand;
}

export interface GradebookSummary {
  id: string;
  title: string;
  groupId: string;
  groupName: string;
  scheme: GradebookScheme;
  columns: number;
  students: number;
  /** LESSONS: mean of all filled cells; CREDIT: mean student total. Null when nothing is filled. */
  average: number | null;
  updatedAt: string;
}

export interface GradebookStudentRow {
  userId: string;
  fullName: string;
  /** columnId → score (null = empty cell). */
  scores: Record<string, number | null>;
  /** LESSONS: mean of the student's cells. CREDIT: null. */
  average: number | null;
  /** CREDIT: sum of the student's controls (empty counts as 0). LESSONS: null. */
  total: number | null;
  /** CREDIT: JN and ON sums with their marks. */
  sections: Record<CreditSection, SectionMark | null> | null;
  /** Band of the current mark (CREDIT before YaN: points so far against what was held). */
  band: GradeBand | null;
  /** CREDIT only. */
  final: CreditFinal | null;
  filled: number;
}

export interface GradebookView {
  id: string;
  title: string;
  scheme: GradebookScheme;
  group: { id: string; name: string };
  columns: GradebookColumn[];
  students: GradebookStudentRow[];
  stats: GradebookStats;
  updatedAt: string;
}

export interface GradebookStats {
  /** LESSONS: mean of all filled cells; CREDIT: mean student total. */
  average: number | null;
  /** CREDIT: sum of the maxima of the controls held so far (any score entered). */
  heldMax: number | null;
  /** CREDIT: students without a YaN score. */
  pending: number;
  /** CREDIT: how many students' JN (current control) marks fall into each band. */
  jnBands: Record<GradeBand, number> | null;
  /** CREDIT: mean JN sum. */
  jnAverage: number | null;
  /** CREDIT: JN maximum so far (20 until JN-2 is held, then 40). */
  jnMax: number | null;
  /** Mean per column, in column order. */
  columnAverages: (number | null)[];
  /** How many students' current marks fall into each band. */
  bands: Record<GradeBand, number>;
  filledCells: number;
  totalCells: number;
}

/** Student's own view of one gradebook. */
export interface MyGradebook {
  id: string;
  title: string;
  groupName: string;
  scheme: GradebookScheme;
  columns: (GradebookColumn & { score: number | null })[];
  average: number | null;
  total: number | null;
  heldMax: number | null;
  sections: Record<CreditSection, SectionMark | null> | null;
  final: CreditFinal | null;
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
  /** File columns that were not taken (CREDIT: everything except the control totals). */
  ignored: string[];
  /** Worksheet the preview was read from, and every sheet with its matched-student count. */
  sheet?: string;
  sheets?: { name: string; matched: number }[];
}

export interface GradebookImportResult {
  columnsCreated: number;
  cellsWritten: number;
}

// ---- Grade bands (credit system “Ballar taqsimoti”: share of the maximum) ------

export const GRADE_BANDS = ['EXCELLENT', 'GOOD', 'SATISFACTORY', 'FAIL'] as const;
export type GradeBand = (typeof GRADE_BANDS)[number];
export const GRADE_BAND_LABEL: Record<GradeBand, string> = {
  EXCELLENT: '“5” a’lo (90–100 %)',
  GOOD: '“4” yaxshi (70–89,9 %)',
  SATISFACTORY: '“3” qoniqarli (60–69,9 %)',
  FAIL: '“2” qoniqarsiz (0–59,9 %)',
};
export const GRADE_BAND_MARK: Record<GradeBand, number> = {
  EXCELLENT: 5,
  GOOD: 4,
  SATISFACTORY: 3,
  FAIL: 2,
};

/** Band of `score` out of `max`: ≥ 90 % “5”, ≥ 70 % “4”, ≥ 60 % “3”, else “2”. */
export function gradeBand(score: number, max: number = GRADE_MAX): GradeBand {
  const pct = (score * 100) / max + 1e-9;
  if (pct >= 90) return 'EXCELLENT';
  if (pct >= 70) return 'GOOD';
  if (pct >= 60) return 'SATISFACTORY';
  return 'FAIL';
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Mean rounded to one decimal, or null for no values. */
export function meanScore(values: readonly (number | null | undefined)[]): number | null {
  const v = values.filter((x): x is number => typeof x === 'number');
  if (v.length === 0) return null;
  return Math.round((v.reduce((s, x) => s + x, 0) / v.length) * 10) / 10;
}

type ScoreColumn = Pick<GradebookColumn, 'id' | 'maxScore' | 'control'>;
type ScoreMap = Record<string, number | null>;
const emptyBands = (): Record<GradeBand, number> => ({
  EXCELLENT: 0,
  GOOD: 0,
  SATISFACTORY: 0,
  FAIL: 0,
});

/** CREDIT: ids of the controls anyone has a score in (“held so far”). */
export function creditHeld(
  columns: readonly ScoreColumn[],
  rows: readonly ScoreMap[],
): Set<string> {
  return new Set(
    columns
      .filter((c) => rows.some((r) => r[c.id] !== null && r[c.id] !== undefined))
      .map((c) => c.id),
  );
}

/** CREDIT: sum of the maxima of the held controls. */
export function creditHeldMax(columns: readonly ScoreColumn[], rows: readonly ScoreMap[]): number {
  const held = creditHeld(columns, rows);
  return round1(columns.filter((c) => held.has(c.id)).reduce((s, c) => s + c.maxScore, 0));
}

/**
 * Sum of a control group over its controls held so far: before JN-2 is held, JN is out of 20,
 * not 40 (otherwise everyone would look failing halfway through the term).
 */
function sectionMark(
  section: CreditSection,
  columns: readonly ScoreColumn[],
  scores: ScoreMap,
  held: ReadonlySet<string>,
): SectionMark | null {
  const def = CREDIT_SECTIONS[section];
  const cols = columns.filter(
    (c) => c.control && def.controls.includes(c.control) && held.has(c.id),
  );
  const vals = cols.map((c) => scores[c.id] ?? null);
  if (vals.every((v) => v === null)) return null;
  const score = round1(vals.reduce<number>((s, v) => s + (v ?? 0), 0));
  const max = round1(cols.reduce((s, c) => s + c.maxScore, 0));
  return { score, max, band: gradeBand(score, max) };
}

/** One student's mark under the gradebook's scheme. */
export function gradebookMark(
  scheme: GradebookScheme,
  columns: readonly ScoreColumn[],
  scores: ScoreMap,
  held: ReadonlySet<string>,
): Pick<GradebookStudentRow, 'average' | 'total' | 'sections' | 'band' | 'final' | 'filled'> {
  const vals = columns.map((c) => scores[c.id] ?? null);
  const filled = vals.filter((v) => v !== null).length;
  if (scheme === 'LESSONS') {
    const average = meanScore(vals);
    return {
      average,
      total: null,
      sections: null,
      band: average === null ? null : gradeBand(average),
      final: null,
      filled,
    };
  }
  const heldMax = round1(columns.filter((c) => held.has(c.id)).reduce((s, c) => s + c.maxScore, 0));
  const sections = {
    JN: sectionMark('JN', columns, scores, held),
    ON: sectionMark('ON', columns, scores, held),
  };
  if (filled === 0)
    return { average: null, total: null, sections, band: null, final: null, filled };
  const total = round1(vals.reduce<number>((s, v) => s + (v ?? 0), 0));
  const yn = columns.find((c) => c.control === 'YN');
  const ynScore = yn ? (scores[yn.id] ?? null) : null;
  if (ynScore === null)
    return {
      average: null,
      total,
      sections,
      band: heldMax > 0 ? gradeBand(total, heldMax) : null,
      final: 'PENDING',
      filled,
    };
  if (ynScore < CREDIT_YN_PASS)
    return { average: null, total, sections, band: 'FAIL', final: 'YN_FAILED', filled };
  return {
    average: null,
    total,
    sections,
    band: gradeBand(total, GRADE_MAX),
    final: 'PASSED',
    filled,
  };
}

export function gradebookStats(
  scheme: GradebookScheme,
  columns: readonly ScoreColumn[],
  students: readonly Pick<
    GradebookStudentRow,
    'scores' | 'band' | 'total' | 'final' | 'sections'
  >[],
): GradebookStats {
  const bands = emptyBands();
  const all: number[] = [];
  for (const s of students) {
    for (const c of columns) {
      const v = s.scores[c.id] ?? null;
      if (v !== null) all.push(v);
    }
    if (s.band) bands[s.band]++;
  }
  const credit = scheme === 'CREDIT';
  let jnBands: Record<GradeBand, number> | null = null;
  if (credit) {
    jnBands = emptyBands();
    for (const s of students) if (s.sections?.JN) jnBands[s.sections.JN.band]++;
  }
  return {
    average: credit ? meanScore(students.map((s) => s.total)) : meanScore(all),
    heldMax: credit
      ? creditHeldMax(
          columns,
          students.map((s) => s.scores),
        )
      : null,
    pending: credit ? students.filter((s) => s.final === 'PENDING').length : 0,
    jnBands,
    jnAverage: credit ? meanScore(students.map((s) => s.sections?.JN?.score ?? null)) : null,
    jnMax: credit ? (students.find((s) => s.sections?.JN)?.sections?.JN?.max ?? null) : null,
    columnAverages: columns.map((c) => meanScore(students.map((s) => s.scores[c.id] ?? null))),
    bands,
    filledCells: all.length,
    totalCells: columns.length * students.length,
  };
}

/**
 * CREDIT import: which control a spreadsheet header holds. Only the control totals are taken:
 * - numbered totals are exact: “1 JN JAMI (20)”, “2 JN JAMI (20)”, “JN-2”, “1 ON (10)”, “1-ON 10-ball”;
 * - “AMALIY JAMI” or an unnumbered “JAMI JN” is a weak JN-1: used only when the sheet has no
 *   exact JN-1 column (some vedomosts keep a practical-work subtotal next to the JN total);
 * - “YaN (40)” is YaN; a bare “JAMI” is TOTAL (only cross-checks the sum).
 * Item columns (“1-amaliy ish … 2 ball”, “1 ON yozma ish 5 ball”, “Hemis ON 5 ball”) give null.
 */
export function creditHeaderMatch(
  raw: string | number | null | undefined,
): { control: CreditControl | 'TOTAL'; weak: boolean } | null {
  if (raw === null || raw === undefined || typeof raw === 'number') return null;
  const t = raw
    .toLowerCase()
    .replace(/[‘’ʻʼ`']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (t === '') return null;
  const exact = (control: CreditControl) => ({ control, weak: false });
  if (/\b(yan|yn|yakuniy)\b/.test(t)) return exact('YN');
  // Short ON headers only: [n] ON|oraliq nazorat [-n] [jami] [(10) | 10-ball].
  const on =
    /^(?:([12])\s*[-–]?\s*)?(?:on|oraliq nazorat)(?:\s*[-–]?\s*([12]))?(?:\s*jami)?(?:\s*\(?\d+(?:\s*-?\s*ball)?\)?)?$/.exec(
      t,
    );
  if (on) {
    const n = on[1] ?? on[2];
    return n === '1' ? exact('ON1') : n === '2' ? exact('ON2') : null;
  }
  const lead = /^([12])\b/.exec(t)?.[1];
  const suffix = /\b(?:jn|nazorat)\s*[-–]?\s*([12])\b/.exec(t)?.[1];
  const n = lead ?? suffix;
  if (/\bjami\b/.test(t) && /\b(jn|joriy|amaliy)\b/.test(t)) {
    if (n === '1') return exact('JN1');
    if (n === '2') return exact('JN2');
    // “AMALIY JAMI 20 ball”, “JAMI JN”, “JN JAMI” without a number.
    return { control: 'JN1', weak: true };
  }
  const short = /^(?:jn|joriy nazorat)\s*[-–]?\s*([12])(?:\s*\(?\d+(?:\s*-?\s*ball)?\)?)?$/.exec(t);
  if (short) return exact(short[1] === '1' ? 'JN1' : 'JN2');
  if (/^(jami|umumiy)(\s*ball)?(\s*\(?100\)?)?$/.test(t)) return { control: 'TOTAL', weak: false };
  return null;
}

/** The control a header holds (exact or weak), or null. */
export function creditControlOf(
  raw: string | number | null | undefined,
): CreditControl | 'TOTAL' | null {
  return creditHeaderMatch(raw)?.control ?? null;
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
