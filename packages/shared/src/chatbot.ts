import { z } from 'zod';

/** Longest question the help bot accepts. */
export const CHAT_MESSAGE_MAX = 500;

export const chatAskSchema = z.object({
  message: z.string().trim().min(1, 'Savol bo‘sh').max(CHAT_MESSAGE_MAX),
});
export type ChatAskInput = z.infer<typeof chatAskSchema>;

/** Internal links only: one leading `/`, no `//`, `\`, scheme or control characters. */
export const CHAT_HREF_RE = /^\/(?![/\\])[^\s\\]*$/;

export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatAnswer {
  /** Plain text (no HTML, no Markdown); paragraphs separated by blank lines. */
  answer: string;
  links: ChatLink[];
  /** Follow-up questions the user can tap. */
  suggestions: string[];
  /** False when the knowledge base had nothing close enough: the UI offers the admin contact. */
  matched: boolean;
  /** `kb` = taken from the knowledge base as is; `ai` = phrased by the model from the same sources. */
  source: 'kb' | 'ai';
}

/** Shown as buttons when a conversation starts. */
export const CHAT_QUICK_QUESTIONS = [
  'Kursga qanday yozilaman?',
  'Qaysi yo‘nalishdan boshlash kerak?',
  'Mashq qanday tekshiriladi?',
  'Parolimni unutdim',
  'Elektron darslik qayerda?',
  'Portfolio nima?',
] as const;

export const chatContactSchema = z.object({
  name: z.string().trim().min(2, 'Ismingizni yozing').max(100),
  /** Phone, Telegram username or email — whatever the person wants to be reached by. */
  contact: z
    .string()
    .trim()
    .min(3, 'Bog‘lanish uchun telefon, Telegram yoki email yozing')
    .max(120),
  message: z.string().trim().min(5, 'Savolingizni yozing').max(1000),
  /** The page the chat was opened on, for context. Internal path only. */
  page: z.string().max(200).regex(CHAT_HREF_RE).optional(),
});
export type ChatContactInput = z.infer<typeof chatContactSchema>;

export const resolveContactSchema = z.object({ resolved: z.boolean() });

export interface ContactRequestView {
  id: string;
  name: string;
  contact: string;
  message: string;
  page: string | null;
  /** Set when the person was signed in: shown to the admin to find the account. */
  account: { fullName: string; login: string | null; email: string | null } | null;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
}
