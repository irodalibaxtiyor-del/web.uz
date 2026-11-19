import { z } from 'zod';

/**
 * Telegram notifications. A student links their Telegram chat with a one-time deep link
 * (`t.me/<bot>?start=<token>`); the bot then sends plain-text messages for the kinds the
 * student keeps switched on. Without a configured bot the feature reports itself disabled.
 */

export const NOTIFICATION_KINDS = ['REVIEW_DUE', 'ASSIGNMENT', 'CERTIFICATE'] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

export const NOTIFICATION_KIND_LABEL: Record<NotificationKind, string> = {
  REVIEW_DUE: 'Kunlik eslatma: takrorlash kartalari',
  ASSIGNMENT: 'Topshiriq tekshirildi',
  CERTIFICATE: 'Sertifikat berildi',
};

export type NotificationPrefs = Record<NotificationKind, boolean>;
export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  REVIEW_DUE: true,
  ASSIGNMENT: true,
  CERTIFICATE: true,
};

export const notificationPrefsSchema = z
  .object({
    REVIEW_DUE: z.boolean(),
    ASSIGNMENT: z.boolean(),
    CERTIFICATE: z.boolean(),
  })
  .partial()
  .strict();
export type NotificationPrefsInput = z.infer<typeof notificationPrefsSchema>;

/** One-time link tokens live this long. */
export const TELEGRAM_LINK_TTL_MINUTES = 15;
/** Local hour (Tashkent) from which the daily review reminder may be sent. */
export const REVIEW_REMINDER_HOUR = 9;

export interface TelegramStatus {
  /** False when the server has no bot configured: nothing can be linked or sent. */
  enabled: boolean;
  botUsername: string | null;
  linked: boolean;
  linkedAt: string | null;
  prefs: NotificationPrefs;
}

export interface TelegramLinkStart {
  url: string;
  expiresAt: string;
}
