import { CHAT_HREF_RE, type ChatLink } from '@webdizayn/shared';

export interface ChatEntry {
  id: string;
  role: 'user' | 'bot';
  text: string;
  links?: ChatLink[];
  suggestions?: string[];
  /** Bot entries: false when it had no answer (the contact button is shown under it). */
  matched?: boolean;
}

/** Kept for the browser session only (the server stores no chat history). */
export const CHAT_STORAGE_KEY = 'wd_chat';
export const CHAT_HISTORY_MAX = 40;

const isStr = (v: unknown, max: number): v is string => typeof v === 'string' && v.length <= max;

/** Links that may be rendered: internal paths only, whatever the server or storage says. */
export function safeLinks(links: unknown): ChatLink[] {
  if (!Array.isArray(links)) return [];
  return links
    .filter(
      (l): l is ChatLink =>
        !!l &&
        typeof l === 'object' &&
        isStr((l as ChatLink).label, 200) &&
        isStr((l as ChatLink).href, 300) &&
        CHAT_HREF_RE.test((l as ChatLink).href),
    )
    .slice(0, 6);
}

/** Parses stored history, dropping anything malformed (storage is user-editable). */
export function parseHistory(raw: string | null): ChatEntry[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  const out: ChatEntry[] = [];
  for (const e of data) {
    if (!e || typeof e !== 'object') continue;
    const r = e as Record<string, unknown>;
    if ((r.role !== 'user' && r.role !== 'bot') || !isStr(r.id, 64) || !isStr(r.text, 4000)) {
      continue;
    }
    out.push({
      id: r.id,
      role: r.role,
      text: r.text,
      links: safeLinks(r.links),
      suggestions: Array.isArray(r.suggestions)
        ? r.suggestions.filter((s): s is string => isStr(s, 200)).slice(0, 4)
        : [],
      matched: r.matched !== false,
    });
  }
  return out.slice(-CHAT_HISTORY_MAX);
}

export function loadHistory(): ChatEntry[] {
  try {
    return parseHistory(sessionStorage.getItem(CHAT_STORAGE_KEY));
  } catch {
    return []; // storage blocked (private mode, sandboxed frame)
  }
}

export function saveHistory(entries: ChatEntry[]) {
  try {
    if (entries.length === 0) sessionStorage.removeItem(CHAT_STORAGE_KEY);
    else sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(entries.slice(-CHAT_HISTORY_MAX)));
  } catch {
    // not saved; the conversation still works in memory
  }
}

/** Plain-text answer → paragraphs → lines (rendered as text, never as HTML). */
export function paragraphs(text: string): string[][] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.split('\n').filter((l) => l.trim() !== ''))
    .filter((p) => p.length > 0);
}
