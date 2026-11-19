import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { and, asc, eq, inArray, lte, sql } from 'drizzle-orm';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import {
  DEFAULT_NOTIFICATION_PREFS,
  REVIEW_REMINDER_HOUR,
  TELEGRAM_LINK_TTL_MINUTES,
  type NotificationKind,
  type NotificationPrefsInput,
  type TelegramLinkStart,
  type TelegramStatus,
} from '@webdizayn/shared';
import type { AuthContext } from '../common/types';
import { APP_CONFIG, type AppConfig } from '../config';
import { DbService } from '../db/db.module';
import {
  courses,
  notificationOutbox,
  telegramLinks,
  telegramLinkTokens,
  termReviews,
} from '../db/schema';
import { TELEGRAM_CLIENT, type TelegramClient } from './telegram-client';

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const MAX_ATTEMPTS = 5;
const FLUSH_MS = 15_000;
const DIGEST_MS = 10 * 60_000;
const TASHKENT_MS = 5 * 3_600_000;

/** Minimal shape of a Telegram update we act on. */
interface TelegramUpdate {
  message?: { text?: string; chat?: { id?: number | string; type?: string } };
}

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger('Notifications');
  private timers: NodeJS.Timeout[] = [];

  constructor(
    private readonly dbs: DbService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    @Inject(TELEGRAM_CLIENT) private readonly telegram: TelegramClient,
  ) {}

  onModuleInit() {
    // Tests drive flush/digest directly; without a bot there is nothing to send.
    if (!this.config.telegramEnabled || this.config.NODE_ENV === 'test') return;
    const every = (ms: number, fn: () => Promise<unknown>) => {
      const t = setInterval(() => {
        fn().catch((err: unknown) =>
          this.log.warn(`notification tick failed: ${err instanceof Error ? err.name : 'error'}`),
        );
      }, ms);
      t.unref();
      this.timers.push(t);
    };
    every(FLUSH_MS, () => this.flush());
    every(DIGEST_MS, () => this.reviewDigest());
  }

  onModuleDestroy() {
    for (const t of this.timers) clearInterval(t);
  }

  // ---- Linking --------------------------------------------------------------

  async status(auth: AuthContext): Promise<TelegramStatus> {
    const [link] = await this.dbs.db
      .select()
      .from(telegramLinks)
      .where(eq(telegramLinks.userId, auth.userId));
    return {
      enabled: this.config.telegramEnabled,
      botUsername: this.config.telegramEnabled ? (this.config.TELEGRAM_BOT_USERNAME ?? null) : null,
      linked: Boolean(link),
      linkedAt: link?.linkedAt.toISOString() ?? null,
      prefs: { ...DEFAULT_NOTIFICATION_PREFS, ...(link?.prefs ?? {}) },
    };
  }

  /** One-time deep link; any older unused token of the user is replaced. */
  async startLink(auth: AuthContext, now = new Date()): Promise<TelegramLinkStart> {
    if (!this.config.telegramEnabled) {
      throw new ServiceUnavailableException({
        message: 'Telegram xabarnomalari serverda sozlanmagan',
        code: 'TELEGRAM_DISABLED',
      });
    }
    const token = randomBytes(24).toString('base64url');
    const expiresAt = new Date(now.getTime() + TELEGRAM_LINK_TTL_MINUTES * 60_000);
    await this.dbs.db.transaction(async (tx) => {
      await tx.delete(telegramLinkTokens).where(eq(telegramLinkTokens.userId, auth.userId));
      await tx
        .insert(telegramLinkTokens)
        .values({ tokenHash: sha256(token), userId: auth.userId, expiresAt });
    });
    return {
      url: `https://t.me/${this.config.TELEGRAM_BOT_USERNAME}?start=${token}`,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async unlink(auth: AuthContext) {
    await this.dbs.db.delete(telegramLinks).where(eq(telegramLinks.userId, auth.userId));
  }

  async updatePrefs(auth: AuthContext, input: NotificationPrefsInput): Promise<TelegramStatus> {
    const current = await this.status(auth);
    if (current.linked) {
      await this.dbs.db
        .update(telegramLinks)
        .set({ prefs: { ...current.prefs, ...input } })
        .where(eq(telegramLinks.userId, auth.userId));
    }
    return this.status(auth);
  }

  /** Constant-time check of the webhook secret header. */
  webhookAuthorized(secret: string | undefined): boolean {
    const expected = this.config.TELEGRAM_WEBHOOK_SECRET;
    if (!this.config.telegramEnabled || !expected || !secret) return false;
    const a = Buffer.from(sha256(secret));
    const b = Buffer.from(sha256(expected));
    return timingSafeEqual(a, b);
  }

  /** `/start <token>` links the chat; `/stop` unlinks it. Anything else gets a short help. */
  async handleUpdate(update: TelegramUpdate, now = new Date()): Promise<void> {
    const text = update.message?.text?.trim() ?? '';
    const chat = update.message?.chat;
    if (!chat?.id || chat.type !== 'private') return;
    const chatId = String(chat.id);
    const db = this.dbs.db;

    const start = /^\/start(?:\s+([A-Za-z0-9_-]{16,64}))?$/.exec(text);
    if (start?.[1]) {
      const linked = await db.transaction(async (tx) => {
        const [tok] = await tx
          .delete(telegramLinkTokens)
          .where(eq(telegramLinkTokens.tokenHash, sha256(start[1]!)))
          .returning();
        if (!tok || tok.expiresAt <= now) return false;
        // A chat belongs to one account: drop any previous owner first.
        await tx.delete(telegramLinks).where(eq(telegramLinks.chatId, chatId));
        await tx
          .insert(telegramLinks)
          .values({ userId: tok.userId, chatId, prefs: DEFAULT_NOTIFICATION_PREFS, linkedAt: now })
          .onConflictDoUpdate({
            target: telegramLinks.userId,
            set: { chatId, linkedAt: now },
          });
        return true;
      });
      await this.telegram.sendMessage(
        chatId,
        linked
          ? 'WEBDIZAYN.UZ hisobingiz ulandi. Takrorlash eslatmalari, tekshirilgan topshiriqlar va sertifikatlar haqida shu yerda xabar beramiz. O‘chirish: /stop'
          : 'Havola eskirgan yoki allaqachon ishlatilgan. Saytdagi profilingizdan yangi havola oling.',
      );
      return;
    }
    if (text === '/stop') {
      await db.delete(telegramLinks).where(eq(telegramLinks.chatId, chatId));
      await this.telegram.sendMessage(
        chatId,
        'Xabarnomalar o‘chirildi. Qayta ulash — saytdagi profilingizdan.',
      );
      return;
    }
    await this.telegram.sendMessage(
      chatId,
      'Bu bot faqat WEBDIZAYN.UZ xabarnomalarini yuboradi. Ulash uchun saytdagi “Telegram” bo‘limidan havola oling.',
    );
  }

  // ---- Sending ----------------------------------------------------------------

  /**
   * Queues a message for a linked user who keeps this kind switched on; otherwise nothing is
   * stored. With `dedupeKey`, a second message with the same key is ignored.
   */
  async enqueue(userId: string, kind: NotificationKind, text: string, dedupeKey?: string) {
    if (!this.config.telegramEnabled) return false;
    const [link] = await this.dbs.db
      .select({ prefs: telegramLinks.prefs })
      .from(telegramLinks)
      .where(eq(telegramLinks.userId, userId));
    if (!link || !{ ...DEFAULT_NOTIFICATION_PREFS, ...link.prefs }[kind]) return false;
    const rows = await this.dbs.db
      .insert(notificationOutbox)
      .values({ userId, kind, text: text.slice(0, 4000), dedupeKey: dedupeKey ?? null })
      .onConflictDoNothing()
      .returning({ id: notificationOutbox.id });
    return rows.length > 0;
  }

  /** Never throws: notifications must not break the action that triggered them. */
  async notify(userId: string, kind: NotificationKind, text: string, dedupeKey?: string) {
    try {
      return await this.enqueue(userId, kind, text, dedupeKey);
    } catch (err) {
      this.log.warn(`enqueue failed: ${err instanceof Error ? err.name : 'error'}`);
      return false;
    }
  }

  /** Sends due messages (at most `limit`). Returns how many were delivered. */
  async flush(now = new Date(), limit = 20): Promise<number> {
    const db = this.dbs.db;
    const due = await db
      .select({
        id: notificationOutbox.id,
        userId: notificationOutbox.userId,
        text: notificationOutbox.text,
        attempts: notificationOutbox.attempts,
        chatId: telegramLinks.chatId,
      })
      .from(notificationOutbox)
      .leftJoin(telegramLinks, eq(telegramLinks.userId, notificationOutbox.userId))
      .where(
        and(eq(notificationOutbox.status, 'PENDING'), lte(notificationOutbox.nextAttemptAt, now)),
      )
      .orderBy(asc(notificationOutbox.createdAt))
      .limit(limit);
    let sent = 0;
    for (const m of due) {
      if (!m.chatId) {
        await this.fail(m.id, m.attempts, 'unlinked', true);
        continue;
      }
      const r = await this.telegram.sendMessage(m.chatId, m.text);
      if (r.ok) {
        sent++;
        await db
          .update(notificationOutbox)
          .set({ status: 'SENT', sentAt: now, attempts: m.attempts + 1, lastError: null })
          .where(eq(notificationOutbox.id, m.id));
      } else {
        if (r.reason === 'blocked') {
          await db.delete(telegramLinks).where(eq(telegramLinks.userId, m.userId));
        }
        await this.fail(m.id, m.attempts, r.detail, r.reason !== 'retry', now);
      }
    }
    return sent;
  }

  private async fail(
    id: string,
    attempts: number,
    error: string,
    final: boolean,
    now = new Date(),
  ) {
    const n = attempts + 1;
    const giveUp = final || n >= MAX_ATTEMPTS;
    await this.dbs.db
      .update(notificationOutbox)
      .set({
        attempts: n,
        lastError: error.slice(0, 200),
        status: giveUp ? 'FAILED' : 'PENDING',
        // 1, 2, 4, 8 minutes.
        nextAttemptAt: new Date(now.getTime() + 60_000 * 2 ** (n - 1)),
      })
      .where(eq(notificationOutbox.id, id));
  }

  /**
   * Once per Tashkent day (from REVIEW_REMINDER_HOUR) tells each linked student how many
   * review cards are due, per course. Returns the number of reminders queued.
   */
  async reviewDigest(now = new Date()): Promise<number> {
    if (!this.config.telegramEnabled) return 0;
    const local = new Date(now.getTime() + TASHKENT_MS);
    if (local.getUTCHours() < REVIEW_REMINDER_HOUR) return 0;
    const day = local.toISOString().slice(0, 10);
    const db = this.dbs.db;
    const links = await db.select().from(telegramLinks);
    const wanting = links.filter((l) => ({ ...DEFAULT_NOTIFICATION_PREFS, ...l.prefs }).REVIEW_DUE);
    if (wanting.length === 0) return 0;
    const rows = await db
      .select({
        userId: termReviews.userId,
        courseId: termReviews.courseId,
        orgId: courses.organizationId,
        title: courses.title,
        n: sql<number>`count(*)::int`,
      })
      .from(termReviews)
      .innerJoin(courses, eq(courses.id, termReviews.courseId))
      .where(
        and(
          inArray(
            termReviews.userId,
            wanting.map((l) => l.userId),
          ),
          lte(termReviews.dueAt, now),
          eq(courses.status, 'PUBLISHED'),
        ),
      )
      .groupBy(termReviews.userId, termReviews.courseId, courses.organizationId, courses.title);
    const byUser = new Map<string, typeof rows>();
    for (const r of rows) byUser.set(r.userId, [...(byUser.get(r.userId) ?? []), r]);
    const site = this.config.webOrigins[0] ?? '';
    let queued = 0;
    for (const [userId, list] of byUser) {
      const lines = list
        .sort((a, b) => b.n - a.n)
        .map(
          (c) =>
            `• ${c.title}: ${c.n} ta karta — ${site}/orgs/${c.orgId}/courses/${c.courseId}/review`,
        );
      const text = ['Bugun takrorlash vaqti keldi:', ...lines].join('\n');
      if (await this.enqueue(userId, 'REVIEW_DUE', text, `review:${userId}:${day}`)) queued++;
    }
    return queued;
  }

  /** Public link of the site, for messages. */
  siteUrl(path: string) {
    return `${this.config.webOrigins[0] ?? ''}${path}`;
  }
}
