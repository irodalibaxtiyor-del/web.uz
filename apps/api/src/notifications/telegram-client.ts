import type { AppConfig } from '../config';

export const TELEGRAM_CLIENT = Symbol('TELEGRAM_CLIENT');

export type SendResult =
  | { ok: true }
  /** `blocked`: the user blocked the bot or deleted the chat; the link should be dropped. */
  | { ok: false; reason: 'blocked' | 'retry' | 'failed'; detail: string };

export interface TelegramClient {
  sendMessage(chatId: string, text: string): Promise<SendResult>;
}

/** Talks to the Bot API. The token is only part of the request URL, never logged or returned. */
export class HttpTelegramClient implements TelegramClient {
  constructor(
    private readonly token: string,
    private readonly timeoutMs = 10_000,
  ) {}

  async sendMessage(chatId: string, text: string): Promise<SendResult> {
    let res: Response;
    try {
      res = await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // Plain text: no parse_mode, so course titles or names cannot inject markup.
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (err) {
      return { ok: false, reason: 'retry', detail: err instanceof Error ? err.name : 'network' };
    }
    if (res.ok) return { ok: true };
    const detail = `HTTP ${res.status}`;
    if (res.status === 403) return { ok: false, reason: 'blocked', detail };
    if (res.status === 429 || res.status >= 500) return { ok: false, reason: 'retry', detail };
    return { ok: false, reason: 'failed', detail };
  }
}

/** Used when no bot is configured: refuses to pretend anything was delivered. */
export class DisabledTelegramClient implements TelegramClient {
  sendMessage(): Promise<SendResult> {
    return Promise.resolve({ ok: false, reason: 'failed', detail: 'telegram disabled' });
  }
}

export function telegramClientFor(config: AppConfig): TelegramClient {
  return config.telegramEnabled && config.TELEGRAM_BOT_TOKEN
    ? new HttpTelegramClient(config.TELEGRAM_BOT_TOKEN)
    : new DisabledTelegramClient();
}
