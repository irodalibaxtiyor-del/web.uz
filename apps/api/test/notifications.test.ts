import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config';
import {
  courseTerms,
  notificationOutbox,
  telegramLinks,
  telegramLinkTokens,
  termReviews,
} from '../src/db/schema';
import { NotificationsService } from '../src/notifications/notifications.service';
import type { SendResult, TelegramClient } from '../src/notifications/telegram-client';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

class FakeTelegram implements TelegramClient {
  sent: { chatId: string; text: string }[] = [];
  next: SendResult = { ok: true };
  sendMessage(chatId: string, text: string): Promise<SendResult> {
    this.sent.push({ chatId, text });
    return Promise.resolve(this.next);
  }
}

const SECRET = 'w'.repeat(40);
const ENV = {
  TELEGRAM_BOT_TOKEN: `123456:${'A'.repeat(35)}`,
  TELEGRAM_BOT_USERNAME: 'webdizayn_test_bot',
  TELEGRAM_WEBHOOK_SECRET: SECRET,
  WEB_ORIGINS: 'http://localhost:3000',
};

const req = (
  ctx: TestContext,
  who: Member | null,
  method: 'get' | 'post' | 'patch' | 'delete',
  path: string,
  body?: object,
) => {
  const r = ctx.http()[method](path);
  if (who) r.set('Cookie', who.cookie);
  return body ? r.send(body) : r;
};
const hook = (ctx: TestContext, text: string, chatId = 777, secret: string | null = SECRET) => {
  const r = ctx.http().post('/telegram/webhook');
  if (secret !== null) r.set('X-Telegram-Bot-Api-Secret-Token', secret);
  return r.send({ update_id: 1, message: { text, chat: { id: chatId, type: 'private' } } });
};
const tokenOf = (url: string) => new URL(url).searchParams.get('start')!;

describe('telegram disabled (default)', () => {
  let ctx: TestContext;
  let user: Member;
  beforeAll(async () => {
    ctx = await setup();
    const org = await createOrg(ctx, 'org-d');
    user = await createMember(ctx, 'u@d.uz', org, 'STUDENT');
  });
  afterAll(async () => {
    await ctx.app.close();
  });

  it('reports itself disabled and refuses to link; the webhook is closed', async () => {
    const st = await req(ctx, user, 'get', '/me/telegram').expect(200);
    expect(st.body).toMatchObject({ enabled: false, linked: false, botUsername: null });
    await req(ctx, user, 'post', '/me/telegram/link')
      .expect(503)
      .expect((r) => expect(r.body.code).toBe('TELEGRAM_DISABLED'));
    await hook(ctx, '/start x').expect(401);
    const svc = ctx.app.get(NotificationsService);
    expect(await svc.enqueue(user.userId, 'CERTIFICATE', 'x')).toBe(false);
  });

  it('a partial bot configuration is a startup error', () => {
    expect(() =>
      loadConfig({ NODE_ENV: 'test', TELEGRAM_BOT_TOKEN: ENV.TELEGRAM_BOT_TOKEN }),
    ).toThrow(/TELEGRAM_BOT_USERNAME/);
  });
});

describe('telegram enabled', () => {
  const tg = new FakeTelegram();
  let ctx: TestContext;
  let student: Member;
  let other: Member;
  let orgId: string;
  let courseId: string;

  beforeAll(async () => {
    ctx = await setup(ENV, { telegramClient: tg });
    orgId = await createOrg(ctx, 'org-t');
    const owner = await createMember(ctx, 'owner@t.uz', orgId, 'TEACHER');
    student = await createMember(ctx, 's@t.uz', orgId, 'STUDENT');
    other = await createMember(ctx, 'o@t.uz', orgId, 'STUDENT');
    const c = await req(ctx, owner, 'post', `/orgs/${orgId}/courses`, {
      title: 'HTML',
      slug: 'html',
    });
    courseId = c.body.course.id;
    const mod = await req(ctx, owner, 'post', `/orgs/${orgId}/courses/${courseId}/modules`, {
      title: '1-modul',
    });
    await req(
      ctx,
      owner,
      'post',
      `/orgs/${orgId}/courses/${courseId}/modules/${mod.body.id}/lessons`,
      { title: 'Teglar' },
    );
    await req(ctx, owner, 'patch', `/orgs/${orgId}/courses/${courseId}`, {
      status: 'PUBLISHED',
    }).expect(200);
    await req(ctx, student, 'post', `/orgs/${orgId}/courses/${courseId}/enroll`).expect(201);
  });
  afterAll(async () => {
    await ctx.app.close();
  });

  it('webhook calls without the right secret are refused', async () => {
    await hook(ctx, '/start abc', 1, null).expect(401);
    await hook(ctx, '/start abc', 1, 'x'.repeat(40)).expect(401);
  });

  it('links a chat with a one-time deep link token (stored hashed)', async () => {
    const st = await req(ctx, student, 'get', '/me/telegram').expect(200);
    expect(st.body).toMatchObject({
      enabled: true,
      linked: false,
      botUsername: 'webdizayn_test_bot',
    });
    const link = await req(ctx, student, 'post', '/me/telegram/link').expect(200);
    expect(link.body.url).toMatch(/^https:\/\/t\.me\/webdizayn_test_bot\?start=[A-Za-z0-9_-]{32}$/);
    const token = tokenOf(link.body.url);
    const stored = await ctx.handle.db.select().from(telegramLinkTokens);
    expect(JSON.stringify(stored)).not.toContain(token);

    // Group chats are ignored.
    await ctx
      .http()
      .post('/telegram/webhook')
      .set('X-Telegram-Bot-Api-Secret-Token', SECRET)
      .send({ message: { text: `/start ${token}`, chat: { id: 5, type: 'group' } } })
      .expect(200);
    expect(tg.sent).toHaveLength(0);

    await hook(ctx, `/start ${token}`, 777).expect(200);
    expect(tg.sent.at(-1)).toMatchObject({
      chatId: '777',
      text: expect.stringContaining('ulandi'),
    });
    const after = await req(ctx, student, 'get', '/me/telegram').expect(200);
    expect(after.body.linked).toBe(true);

    // The token is single-use: replaying it (e.g. from another chat) links nothing.
    await hook(ctx, `/start ${token}`, 999).expect(200);
    expect(tg.sent.at(-1)!.text).toContain('eskirgan');
    const links = await ctx.handle.db.select().from(telegramLinks);
    expect(links.map((l) => l.chatId)).toEqual(['777']);
  });

  it('an expired token is refused', async () => {
    const link = await req(ctx, other, 'post', '/me/telegram/link').expect(200);
    await ctx.handle.db
      .update(telegramLinkTokens)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(telegramLinkTokens.userId, other.userId));
    await hook(ctx, `/start ${tokenOf(link.body.url)}`, 888).expect(200);
    expect(tg.sent.at(-1)!.text).toContain('eskirgan');
    const st = await req(ctx, other, 'get', '/me/telegram').expect(200);
    expect(st.body.linked).toBe(false);
  });

  it('queues only for linked users with the kind switched on; flush delivers', async () => {
    const svc = ctx.app.get(NotificationsService);
    expect(await svc.enqueue(other.userId, 'CERTIFICATE', 'x')).toBe(false); // not linked
    await req(ctx, student, 'patch', '/me/telegram', { ASSIGNMENT: false }).expect(200);
    await req(ctx, student, 'patch', '/me/telegram', { NOPE: true }).expect(400);
    expect(await svc.enqueue(student.userId, 'ASSIGNMENT', 'x')).toBe(false);

    // Completing the course and claiming the certificate queues a message with its link.
    const base = `/orgs/${orgId}/courses/${courseId}`;
    const map = await req(ctx, student, 'get', `${base}/map`).expect(200);
    await req(
      ctx,
      student,
      'post',
      `${base}/lessons/${map.body.modules[0].lessons[0].id}/complete`,
    ).expect(201);
    const cert = await req(ctx, student, 'post', `${base}/certificate`).expect(200);
    tg.sent = [];
    expect(await svc.flush()).toBe(1);
    expect(tg.sent[0]).toMatchObject({ chatId: '777' });
    expect(tg.sent[0]!.text).toContain(`http://localhost:3000/sertifikat/${cert.body.code}`);
    expect(await svc.flush()).toBe(0);
  });

  it('daily review reminder: once per Tashkent day, not before 9:00', async () => {
    const db = ctx.handle.db;
    const [term] = await db
      .insert(courseTerms)
      .values({ courseId, term: 'Teg', termKey: 'teg', definition: 'Element belgisi' })
      .returning();
    const now = new Date('2026-11-20T06:00:00Z'); // 11:00 in Tashkent
    await db.insert(termReviews).values({
      userId: student.userId,
      termId: term!.id,
      courseId,
      ease: 2.5,
      intervalDays: 1,
      reps: 1,
      dueAt: new Date('2026-11-20T00:00:00Z'),
      lastGrade: 'GOOD',
      reviewedAt: new Date('2026-11-19T00:00:00Z'),
    });
    const svc = ctx.app.get(NotificationsService);
    expect(await svc.reviewDigest(new Date('2026-11-20T03:00:00Z'))).toBe(0); // 08:00
    expect(await svc.reviewDigest(now)).toBe(1);
    expect(await svc.reviewDigest(new Date('2026-11-20T12:00:00Z'))).toBe(0); // same day
    const [msg] = await db
      .select()
      .from(notificationOutbox)
      .where(eq(notificationOutbox.kind, 'REVIEW_DUE'));
    expect(msg!.text).toContain('HTML: 1 ta karta');
    expect(msg!.text).toContain(`/courses/${courseId}/review`);
  });

  it('retries transient errors and drops the link when the bot is blocked', async () => {
    const svc = ctx.app.get(NotificationsService);
    const db = ctx.handle.db;
    await db.delete(notificationOutbox);
    await svc.enqueue(student.userId, 'CERTIFICATE', 'salom');
    tg.next = { ok: false, reason: 'retry', detail: 'HTTP 429' };
    expect(await svc.flush()).toBe(0);
    let [row] = await db.select().from(notificationOutbox);
    expect(row).toMatchObject({ status: 'PENDING', attempts: 1, lastError: 'HTTP 429' });
    expect(row!.nextAttemptAt.getTime()).toBeGreaterThan(Date.now());

    tg.next = { ok: false, reason: 'blocked', detail: 'HTTP 403' };
    await svc.flush(new Date(Date.now() + 120_000));
    [row] = await db.select().from(notificationOutbox);
    expect(row).toMatchObject({ status: 'FAILED', attempts: 2 });
    const st = await req(ctx, student, 'get', '/me/telegram').expect(200);
    expect(st.body.linked).toBe(false);
    tg.next = { ok: true };
  });

  it('/stop and DELETE unlink', async () => {
    const link = await req(ctx, student, 'post', '/me/telegram/link').expect(200);
    await hook(ctx, `/start ${tokenOf(link.body.url)}`, 777).expect(200);
    await hook(ctx, '/stop', 777).expect(200);
    expect((await req(ctx, student, 'get', '/me/telegram')).body.linked).toBe(false);
    const again = await req(ctx, student, 'post', '/me/telegram/link').expect(200);
    await hook(ctx, `/start ${tokenOf(again.body.url)}`, 777).expect(200);
    await req(ctx, student, 'delete', '/me/telegram').expect(204);
    expect((await req(ctx, student, 'get', '/me/telegram')).body.linked).toBe(false);
    await req(ctx, null, 'get', '/me/telegram').expect(401);
  });
});
