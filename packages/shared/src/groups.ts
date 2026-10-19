import { z } from 'zod';

/**
 * Student groups (e.g. "8-24 ATT") and roster import. A student belongs to at most one group
 * per organization; teachers see only the groups an admin assigned to them.
 */

export const GROUP_NAME_MAX = 60;
export const ROSTER_MAX_GROUPS = 20;
export const ROSTER_MAX_STUDENTS_PER_GROUP = 200;

/** 3–40 chars: lowercase latin letters and digits, separated by single dots or hyphens. */
export const LOGIN_RE = /^(?=.{3,40}$)[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

/** Every apostrophe-like character used in Uzbek latin spelling (o‘, g‘, ʼ). */
const APOSTROPHES = /[‘’ʻʼ`´']/g;

/**
 * Canonical form used only to detect duplicates: apostrophe variants unified, whitespace
 * collapsed, upper case. The name itself is always stored exactly as given.
 */
export function rosterKey(fullName: string): string {
  return fullName.replace(APOSTROPHES, "'").replace(/\s+/g, ' ').trim().toUpperCase();
}

/** `familiya.ism` in lowercase latin without apostrophes: "O‘RINOV JASUR …" → "orinov.jasur". */
export function loginBase(fullName: string): string {
  const parts = rosterKey(fullName)
    .toLowerCase()
    .replace(/'/g, '')
    .split(' ')
    .map((p) => p.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 2);
  const base = parts.join('.').slice(0, 36).replace(/\.$/, '');
  return base.length >= 3 ? base : 'talaba';
}

/** "8-24 ATT" → "8-24att"; used as a readable prefix (e.g. in temporary passwords). */
export function groupCode(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const studentName = z
  .string()
  .trim()
  .min(3)
  .max(160)
  .refine((s) => s.split(/\s+/).length >= 2, { message: 'Familiya va ism kerak' });

export const rosterGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(GROUP_NAME_MAX)
    .refine((n) => groupCode(n).length >= 2, { message: 'Guruh nomida harf yoki raqam kerak' }),
  /** Count stated in the source list (e.g. "23 nafar"); checked, never trusted. */
  expectedCount: z.number().int().min(0).max(ROSTER_MAX_STUDENTS_PER_GROUP).optional(),
  students: z.array(studentName).min(1).max(ROSTER_MAX_STUDENTS_PER_GROUP),
});

const resolutionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('CREATE') }),
  z.object({ action: z.literal('LINK'), userId: z.uuid() }),
]);

export const rosterImportSchema = z.object({
  groups: z.array(rosterGroupSchema).min(1).max(ROSTER_MAX_GROUPS),
  /** Admin decisions for names that match an existing ungrouped student, keyed by rosterKey. */
  resolutions: z.record(z.string().max(200), resolutionSchema).optional(),
});
export type RosterImportInput = z.infer<typeof rosterImportSchema>;
export type RosterResolution = z.infer<typeof resolutionSchema>;

export interface ParsedRoster {
  groups: { name: string; expectedCount?: number; students: string[] }[];
  /** Numbered lines that appeared before any group header. */
  orphanLines: number[];
}

/**
 * Parses a pasted list: a non-numbered line starts a group ("### 8-24 ATT — 23 nafar talaba"),
 * numbered lines ("1. ALIYEV ALI") are its students. Blank lines are ignored.
 */
export function parseRosterText(text: string): ParsedRoster {
  const groups: ParsedRoster['groups'] = [];
  const orphanLines: number[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    const student = /^\d+\s*[.)]\s*(.+)$/.exec(line);
    if (student) {
      const current = groups[groups.length - 1];
      if (current) current.students.push(student[1]!.replace(/\s+/g, ' ').trim());
      else orphanLines.push(i + 1);
      return;
    }
    const header = line.replace(/^#+\s*/, '');
    const [name, rest] = header.split(/\s+[—–]\s+/, 2);
    const count = rest ? /(\d+)\s*nafar/i.exec(rest) : null;
    groups.push({
      name: name!.trim(),
      ...(count ? { expectedCount: Number(count[1]) } : {}),
      students: [],
    });
  });
  return { groups, orphanLines };
}

export const ROSTER_ROW_STATUSES = [
  'NEW',
  'ALREADY_IMPORTED',
  'DUPLICATE_IN_INPUT',
  'IN_OTHER_GROUP',
  'NAME_MATCH',
] as const;
export type RosterRowStatus = (typeof ROSTER_ROW_STATUSES)[number];

/** Statuses that stop the import until the list (or a resolution) is fixed. */
export const ROSTER_BLOCKING: RosterRowStatus[] = ['DUPLICATE_IN_INPUT', 'IN_OTHER_GROUP'];

export interface RosterPreviewRow {
  position: number;
  fullName: string;
  rosterKey: string;
  status: RosterRowStatus;
  /** Login the student has (ALREADY_IMPORTED) or will get (NEW). */
  login: string | null;
  /** IN_OTHER_GROUP: where the same name already is. */
  otherGroup?: string;
  /** NAME_MATCH: existing ungrouped students with this name (admin picks LINK or CREATE). */
  candidates?: { userId: string; login: string | null; email: string | null }[];
  resolution?: RosterResolution;
}

export interface RosterPreviewGroup {
  name: string;
  code: string;
  exists: boolean;
  expectedCount: number | null;
  count: number;
  rows: RosterPreviewRow[];
}

export interface RosterPreview {
  groups: RosterPreviewGroup[];
  totals: Record<RosterRowStatus, number> & { rows: number };
  /** Messages that block the import (duplicates, unresolved matches, count mismatches). */
  problems: string[];
  canImport: boolean;
}

export interface RosterImportResult {
  created: number;
  linked: number;
  skipped: number;
  groupsCreated: number;
  groups: { name: string; students: number }[];
}

export interface GroupSummary {
  id: string;
  name: string;
  code: string;
  students: number;
  teachers: number;
  createdAt: string;
}

export interface GroupStudentRow {
  userId: string;
  fullName: string;
  login: string | null;
  email: string | null;
  disabled: boolean;
  mustChangePassword: boolean;
  /** False until an admin issues a password (imported accounts start without one). */
  hasPassword: boolean;
  addedAt: string;
}
