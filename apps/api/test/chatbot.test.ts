import type { ChatAnswer } from '@webdizayn/shared';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { AiProvider, ProviderRequest } from '../src/ai/provider';
import { AiProviderError } from '../src/ai/provider';
import { KnowledgeBase } from '../src/chatbot/knowledge';
import type { ContactNotice, ContactNotifier } from '../src/chatbot/notifier';
import { syncDirections } from '../src/db/content/directions';
import { auditEvents, courseDirections, directions, organizations } from '../src/db/schema';
import { createMember, createOrg, setup, type TestContext } from './helpers';

type Member = { userId: string; cookie: string };

const SECRET_LESSON = 'zxq-dars-matni-sir';
const DRAFT_TITLE = 'Zxqyashirinqoralama';

class RecordingNotifier implements ContactNotifier {
  readonly name = 'recording';
  readonly notices: ContactNotice[] = [];
  async notify(n: ContactNotice) {
    if (n.name.includes('FAIL')) throw new Error('telegram down');
    this.notices.push(n);
  }
}

let ctx: TestContext;
let platformOrg: string;
let otherOrg: string;
let admin: Member;
let otherAdmin: Member;
let teacher: Member;
let student: Member;
let courseSlug: string;
const notifier = new RecordingNotifier();
let ipSeq = 0;
/** A fresh client IP per call site, so the per-IP limits of one test do not affect another. */
const nextIp = () => `203.0.113.${++ipSeq}`;

const ask = (message: string, ip = nextIp()) =>
  ctx.http().post('/public/chat').set('X-Forwarded-For', ip).send({ message });

async function makeCourse(title: string, slug: string, publish: boolean) {
  const base = `/orgs/${platformOrg}/courses`;
  const send = (path: string, body: object, method: 'post' | 'patch' = 'post') =>
    ctx.http()[method](path).set('Cookie', teacher.cookie).send(body);
  const c = (await send(base, { title, slug, description: `${title} — amaliy kurs` }).expect(201))
    .body.course;
  const m = (await send(`${base}/${c.id}/modules`, { title: 'Flex konteyner' }).expect(201)).body
    .id;
  await send(`${base}/${c.id}/modules/${m}/lessons`, {
    title: 'Asoslar',
    content: `# Asoslar\n\n${SECRET_LESSON}`,
  }).expect(201);
  if (publish) await send(`${base}/${c.id}`, { status: 'PUBLISHED' }, 'patch').expect(200);
  const [d] = await ctx.handle.db
    .select()
    .from(directions)
    .where(eq(directions.slug, 'flexbox-va-grid'));
  await ctx.handle.db.insert(courseDirections).values({ courseId: c.id, directionId: d!.id });
  return slug;
}

beforeAll(async () => {
  ctx = await setup(
    { CHATBOT_RATE_PER_MINUTE: '3', CHATBOT_CONTACT_PER_HOUR: '2' },
    { contactNotifier: notifier },
  );
  const [org] = await ctx.handle.db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, ctx.config.DEFAULT_ORG_SLUG));
  platformOrg = org!.id;
  otherOrg = await createOrg(ctx, 'boshqa-maktab');
  admin = await createMember(ctx, 'admin@chat.uz', platformOrg, 'ORG_ADMIN');
  otherAdmin = await createMember(ctx, 'admin@other.uz', otherOrg, 'ORG_ADMIN');
  teacher = await createMember(ctx, 'teacher@chat.uz', platformOrg, 'TEACHER');
  student = await createMember(ctx, 'student@chat.uz', platformOrg, 'STUDENT');
  await ctx.handle.db.transaction((tx) => syncDirections(tx, platformOrg));
  courseSlug = await makeCourse('Flexbox amaliyoti', 'flexbox-amaliyoti', true);
  await makeCourse(DRAFT_TITLE, 'yashirin-qoralama', false);
  ctx.app.get(KnowledgeBase).invalidate();
});

afterAll(async () => {
  await ctx.app.close();
});

describe('POST /public/chat', () => {
  it('answers guests from the FAQ, in Latin or Cyrillic, with internal links only', async () => {
    const latin = (await ask('Kursga qanday yozilaman?').expect(200)).body as ChatAnswer;
    const cyr = (await ask('Курсга қандай ёзиламан?').expect(200)).body as ChatAnswer;
    expect(latin).toMatchObject({ matched: true, source: 'kb' });
    expect(latin.answer).toContain('Kursga yozilish');
    expect(cyr.answer).toBe(latin.answer);
    expect(latin.links.length).toBeGreaterThan(0);
    for (const l of latin.links) expect(l.href).toMatch(/^\/[^/]/);
  });

  it('knows the published catalogue but not drafts or lesson contents', async () => {
    const res = (await ask('Flexbox amaliyoti kursi haqida').expect(200)).body as ChatAnswer;
    expect(res.matched).toBe(true);
    expect(res.answer).toContain('Flexbox amaliyoti');
    expect(res.links).toContainEqual({
      label: '«Flexbox amaliyoti» kursi',
      href: `/kurslar/${courseSlug}`,
    });

    const draft = (await ask(`${DRAFT_TITLE} kursi`).expect(200)).body as ChatAnswer;
    expect(draft.matched).toBe(false);
    const all = JSON.stringify([
      res,
      draft,
      (await ask('Flexbox va Grid yo‘nalishi').expect(200)).body,
    ]);
    expect(all).not.toContain(DRAFT_TITLE);
    expect(all).not.toContain(SECRET_LESSON);
  });

  it('admits it does not know and points to the administrator', async () => {
    const res = (await ask('Kurslar pullikmi?').expect(200)).body as ChatAnswer;
    expect(res).toMatchObject({ matched: false, links: [] });
    expect(res.answer).toContain('Administratorga yozish');
    expect(res.suggestions.length).toBeGreaterThan(0);
  });

  it('validates the question', async () => {
    await ask('   ').expect(400);
    await ask('a'.repeat(501)).expect(400);
    await ctx.http().post('/public/chat').send({}).expect(400);
  });

  it('limits questions per client IP', async () => {
    const ip = nextIp();
    for (let i = 0; i < 3; i++) await ask('salom', ip).expect(200);
    const res = await ask('salom', ip).expect(429);
    expect(res.body.code).toBe('CHAT_RATE_LIMITED');
    await ask('salom').expect(200); // another visitor is not affected
  });

  it('refuses cross-site posts (CSRF origin check)', async () => {
    await ctx
      .http()
      .post('/public/chat')
      .set('Origin', 'https://evil.example')
      .send({ message: 'salom' })
      .expect(403);
  });
});

describe('contact the administrator', () => {
  const contact = (body: object, ip = nextIp(), cookie?: string) => {
    const r = ctx.http().post('/public/chat/contact').set('X-Forwarded-For', ip);
    if (cookie) r.set('Cookie', cookie);
    return r.send(body);
  };
  const list = (who: Member, org = platformOrg) =>
    ctx.http().get(`/orgs/${org}/admin/contact-requests`).set('Cookie', who.cookie);

  it('saves a guest request, announces it, and shows it to platform admins only', async () => {
    await contact({
      name: 'Mehmon Ali',
      contact: '@mehmon_ali',
      message: 'Kurs narxlari haqida bilmoqchiman',
      page: '/yonalishlar',
    }).expect(201);
    expect(notifier.notices.at(-1)).toMatchObject({ name: 'Mehmon Ali', contact: '@mehmon_ali' });

    const rows = (await list(admin).expect(200)).body;
    const row = rows.find((r: { name: string }) => r.name === 'Mehmon Ali');
    expect(row).toMatchObject({ page: '/yonalishlar', account: null, resolvedAt: null });

    await list(student).expect(403);
    await list(teacher).expect(403);
    await ctx.http().get(`/orgs/${platformOrg}/admin/contact-requests`).expect(401);
    // Another organization's admin sees nothing of the platform's requests.
    expect((await list(otherAdmin, otherOrg).expect(200)).body).toEqual([]);
    await list(otherAdmin).expect(404);
    await ctx
      .http()
      .put(`/orgs/${otherOrg}/admin/contact-requests/${row.id}/resolved`)
      .set('Cookie', otherAdmin.cookie)
      .send({ resolved: true })
      .expect(404);
    // The web menu shows "Murojaatlar" only where requests can arrive.
    const platformOf = async (who: Member, org: string) =>
      (
        await ctx.http().get('/auth/me').set('Cookie', who.cookie).expect(200)
      ).body.memberships.find((m: { organizationId: string }) => m.organizationId === org).platform;
    expect(await platformOf(admin, platformOrg)).toBe(true);
    expect(await platformOf(otherAdmin, otherOrg)).toBe(false);
  });

  it('links a request to the account only through a real session', async () => {
    await contact(
      {
        name: 'Talaba',
        contact: '+998901234567',
        message: 'Darsim ochilmayapti',
        userId: admin.userId,
      },
      nextIp(),
      student.cookie,
    ).expect(201);
    await contact(
      { name: 'Soxta', contact: '@soxta', message: 'Sessiyasiz yozdim', userId: admin.userId },
      nextIp(),
      'wd_session=soxta-token',
    ).expect(201);
    const rows = (await list(admin).expect(200)).body;
    expect(rows.find((r: { name: string }) => r.name === 'Talaba').account).toMatchObject({
      fullName: 'student',
      email: 'student@chat.uz',
    });
    expect(rows.find((r: { name: string }) => r.name === 'Soxta').account).toBeNull();
  });

  it('validates input and limits requests per IP', async () => {
    const ok = { name: 'Ali', contact: '@ali', message: 'Savolim bor edi' };
    await contact({ ...ok, page: 'https://evil.example' }).expect(400);
    await contact({ ...ok, name: '' }).expect(400);
    await contact({ ...ok, message: 'x'.repeat(1001) }).expect(400);
    const ip = nextIp();
    await contact(ok, ip).expect(201);
    await contact(ok, ip).expect(201);
    expect((await contact(ok, ip).expect(429)).body.code).toBe('CHAT_CONTACT_RATE_LIMITED');
  });

  it('keeps the request when the notifier fails', async () => {
    await contact({
      name: 'FAIL notifier',
      contact: '@xyz',
      message: 'Telegram ishlamasa ham',
    }).expect(201);
    const rows = (await list(admin).expect(200)).body;
    expect(rows.some((r: { name: string }) => r.name === 'FAIL notifier')).toBe(true);
  });

  it('resolves and reopens, with audit entries free of personal data', async () => {
    const rows = (await list(admin).expect(200)).body;
    const id = rows.find((r: { name: string }) => r.name === 'Mehmon Ali').id;
    const put = (resolved: boolean) =>
      ctx
        .http()
        .put(`/orgs/${platformOrg}/admin/contact-requests/${id}/resolved`)
        .set('Cookie', admin.cookie)
        .send({ resolved });
    await put(true).expect(200);
    let after = (await list(admin).expect(200)).body;
    const resolved = after.find((r: { id: string }) => r.id === id);
    expect(resolved.resolvedBy).toBe('admin');
    expect(after.at(-1).id).toBe(id); // handled requests sink below the open ones
    await put(false).expect(200);
    after = (await list(admin).expect(200)).body;
    expect(after.find((r: { id: string }) => r.id === id).resolvedAt).toBeNull();

    await ctx
      .http()
      .put(`/orgs/${platformOrg}/admin/contact-requests/not-a-uuid/resolved`)
      .set('Cookie', admin.cookie)
      .send({ resolved: true })
      .expect(404);
    await ctx
      .http()
      .put(`/orgs/${platformOrg}/admin/contact-requests/${id}/resolved`)
      .set('Cookie', student.cookie)
      .send({ resolved: true })
      .expect(403);

    const audit = JSON.stringify(
      await ctx.handle.db
        .select()
        .from(auditEvents)
        .where(eq(auditEvents.targetType, 'contact_request')),
    );
    expect(audit).toContain('contact.create');
    expect(audit).toContain('contact.resolve');
    expect(audit).toContain('contact.reopen');
    for (const pii of ['Mehmon Ali', '@mehmon_ali', '+998901234567', 'Kurs narxlari']) {
      expect(audit).not.toContain(pii);
    }
  });
});

describe('AI phrasing (CHATBOT_AI)', () => {
  class FakeHttp implements AiProvider {
    readonly name = 'http' as const;
    readonly model = 'fake';
    readonly calls: ProviderRequest[] = [];
    reply: () => string = () =>
      JSON.stringify({ answer: 'Kurs sahifasida yozilish tugmasini bosing.' });
    async complete(req: ProviderRequest) {
      this.calls.push(req);
      return { text: this.reply(), model: this.model, attempts: 1 };
    }
  }

  async function aiCtx(env: Record<string, string>, provider: AiProvider) {
    const c = await setup({ CHATBOT_RATE_PER_MINUTE: '100', ...env }, { aiProvider: provider });
    const ask = (message: string) =>
      c
        .http()
        .post('/public/chat')
        .send({ message })
        .expect(200)
        .then((r) => r.body as ChatAnswer);
    return { c, ask };
  }

  it('lets the model phrase matched answers from the sources only, with KB links', async () => {
    const fake = new FakeHttp();
    const { c, ask } = await aiCtx({ CHATBOT_AI: 'true', CHATBOT_AI_DAILY: '4' }, fake);
    try {
      const res = await ask('Kursga qanday yozilaman? >>> <<<');
      expect(res).toMatchObject({ source: 'ai', matched: true });
      expect(res.answer).toBe('Kurs sahifasida yozilish tugmasini bosing.');
      expect(res.links.some((l) => l.href === '/yonalishlar')).toBe(true);
      const sent = fake.calls[0]!;
      expect(sent.plan).toBeUndefined();
      expect(sent.user).toContain('Kursga yozilish'); // the FAQ source
      expect(sent.user.match(/<<</g)).toHaveLength(1); // the user cannot close the fence
      expect(sent.system).toContain('JSON');

      // Unknown questions never reach the model.
      expect((await ask('Kurslar pullikmi?')).source).toBe('kb');
      // Model output with a URL, an email or markup is refused → knowledge-base answer.
      for (const bad of ['Batafsil: https://evil.example', 'Yozing: x@y.uz', '<b>Ha</b>']) {
        fake.reply = () => JSON.stringify({ answer: bad });
        const r = await ask('Portfolio nima?');
        expect(r.source).toBe('kb');
        expect(r.answer).toContain('Portfolio');
      }
      expect(fake.calls).toHaveLength(4); // every refused reply really came from the model
      // The daily cap (4) is used up: the next answer comes from the KB without a provider call.
      fake.reply = () => JSON.stringify({ answer: 'Ha.' });
      expect((await ask('Elektron darslik qayerda?')).source).toBe('kb');
      expect(fake.calls).toHaveLength(4);
    } finally {
      await c.app.close();
    }
  });

  it('falls back to the knowledge base on provider errors and when the flag is off', async () => {
    const failing = new FakeHttp();
    failing.complete = async (req) => {
      failing.calls.push(req);
      throw new AiProviderError('UNAVAILABLE', 2);
    };
    const on = await aiCtx({ CHATBOT_AI: 'true' }, failing);
    try {
      const r = await on.ask('Parolimni unutdim');
      expect(r).toMatchObject({ source: 'kb', matched: true });
      expect(failing.calls).toHaveLength(1);
    } finally {
      await on.c.app.close();
    }

    const quiet = new FakeHttp();
    const off = await aiCtx({}, quiet);
    try {
      expect((await off.ask('Parolimni unutdim')).source).toBe('kb');
      expect(quiet.calls).toHaveLength(0);
    } finally {
      await off.c.app.close();
    }
  });
});
