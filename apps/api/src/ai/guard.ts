import type { CheckRule } from '@webdizayn/shared';

/**
 * Second line of defence on every tutor answer. The first line is structural: hidden CHECK
 * rules, other students, credentials and PII are never put into the model's context at all,
 * so the model cannot know them. These checks catch what slips through anyway.
 */
export interface GuardInput {
  canary: string;
  systemPrompt: string;
  /** Strings from hidden CHECK rules of this target (titles, selectors, expected values). */
  hiddenStrings: string[];
  /**
   * Everything the student can already see (lesson, instructions, own files, visible check
   * titles). A hidden string that also appears here is not a secret and is not flagged.
   */
  visibleText: string;
  /** Secrets that must never appear (e.g. the provider API key). */
  secrets: string[];
  /** Assignments get a stricter limit on code in the answer. */
  targetKind: 'EXERCISE' | 'ASSIGNMENT';
}

export type GuardReason =
  'SYSTEM_PROMPT' | 'HIDDEN_CHECK' | 'SECRET' | 'PERSONAL_DATA' | 'FULL_SOLUTION';

const MIN_HIDDEN_LEN = 4;
const VERBATIM = 40;
/** Lines of code allowed in one answer (all fenced blocks together). */
const CODE_LINE_LIMIT = { EXERCISE: 12, ASSIGNMENT: 8 } as const;

const SECRET_PATTERNS = [
  /\bwd_session=/i,
  /\bBearer\s+[A-Za-z0-9._~+/-]{16,}/,
  /\bsk-[A-Za-z0-9_-]{16,}/,
  /\b(postgres(ql)?|mysql|redis):\/\/\S+/i,
  /\b[a-f0-9]{40,}\b/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

export function hiddenRuleStrings(rules: CheckRule[]): string[] {
  const out = new Set<string>();
  for (const r of rules.filter((x) => x.hidden)) {
    out.add(r.title);
    if (r.hint) out.add(r.hint);
    const a = r.assert as Record<string, unknown>;
    for (const k of ['selector', 'value', 'name']) {
      if (typeof a[k] === 'string') out.add(a[k] as string);
    }
  }
  return [...out].map((s) => s.trim()).filter((s) => s.length >= MIN_HIDDEN_LEN);
}

function codeLines(text: string): number {
  let lines = 0;
  for (const m of text.matchAll(/```[\w-]*\n([\s\S]*?)```/g)) {
    lines += m[1]!.split('\n').filter((l) => l.trim() !== '').length;
  }
  return lines;
}

export function guardReply(text: string, input: GuardInput): GuardReason[] {
  const reasons = new Set<GuardReason>();
  const lower = text.toLowerCase();

  if (text.includes(input.canary)) reasons.add('SYSTEM_PROMPT');
  // Long verbatim pieces of the instructions also count as leakage.
  // Any 40-character window of the instructions (sampled every 10 characters).
  for (const line of input.systemPrompt.toLowerCase().split('\n')) {
    for (let i = 0; i + VERBATIM <= line.length; i += 10) {
      if (lower.includes(line.slice(i, i + VERBATIM))) {
        reasons.add('SYSTEM_PROMPT');
        break;
      }
    }
  }

  const visible = input.visibleText.toLowerCase();
  for (const s of input.hiddenStrings) {
    const needle = s.toLowerCase();
    if (lower.includes(needle) && !visible.includes(needle)) reasons.add('HIDDEN_CHECK');
  }

  for (const s of input.secrets) {
    if (s && s.length >= 8 && text.includes(s)) reasons.add('SECRET');
  }
  if (SECRET_PATTERNS.some((re) => re.test(text))) reasons.add('SECRET');
  if (EMAIL.test(text)) reasons.add('PERSONAL_DATA');

  if (
    codeLines(text) > CODE_LINE_LIMIT[input.targetKind] ||
    /<!doctype\s+html|<html[\s>]/i.test(text)
  ) {
    reasons.add('FULL_SOLUTION');
  }
  return [...reasons];
}

export const BLOCKED_REPLY =
  'Bu javobni ko‘rsata olmayman: unda tayyor yechim yoki ko‘rsatilmasligi kerak bo‘lgan ma’lumot bor edi. ' +
  'Savolni boshqacha bering yoki “Maslahat” tugmasi bilan keyingi qadamni so‘rang.';
