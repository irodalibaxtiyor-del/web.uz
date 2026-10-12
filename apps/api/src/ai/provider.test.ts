import { describe, expect, it } from 'vitest';
import { loadConfig } from '../config';
import {
  AiProviderError,
  createAiProvider,
  HttpAiProvider,
  MAX_RESPONSE_CHARS,
  type ProviderRequest,
} from './provider';

const KEY = 'test-key-1234567890';
const cfg = {
  AI_PROVIDER_URL: 'https://ai.example.test/v1/chat/completions',
  AI_PROVIDER_API_KEY: KEY,
  AI_PROVIDER_MODEL: 'demo-model',
  AI_REQUEST_TIMEOUT_MS: 1000,
  AI_MAX_ATTEMPTS: 3,
};
const req = { system: 'sys', user: 'usr', plan: {} } as unknown as ProviderRequest;
const ok = (content: string) =>
  new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
const noSleep = async () => {};

describe('HttpAiProvider', () => {
  it('sends the key only in the Authorization header', async () => {
    let seen: { url: string; init: RequestInit } | undefined;
    const p = new HttpAiProvider(cfg, async (url, init) => {
      seen = { url, init };
      return ok('{"answer":"a","question":"q?"}');
    });
    const r = await p.complete(req);
    expect(r).toMatchObject({
      text: '{"answer":"a","question":"q?"}',
      model: 'demo-model',
      attempts: 1,
    });
    expect((seen!.init.headers as Record<string, string>).Authorization).toBe(`Bearer ${KEY}`);
    expect(seen!.url).not.toContain(KEY);
    expect(String(seen!.init.body)).not.toContain(KEY);
    expect(JSON.parse(String(seen!.init.body)).messages).toEqual([
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'usr' },
    ]);
  });

  it('retries transient errors a bounded number of times', async () => {
    let calls = 0;
    const p = new HttpAiProvider(
      cfg,
      async () => {
        calls++;
        return calls < 3 ? new Response('busy', { status: 503 }) : ok('done');
      },
      noSleep,
    );
    expect((await p.complete(req)).attempts).toBe(3);

    calls = 0;
    const always = new HttpAiProvider(
      cfg,
      async () => {
        calls++;
        return new Response('nope', { status: 500 });
      },
      noSleep,
    );
    await expect(always.complete(req)).rejects.toMatchObject({ code: 'UNAVAILABLE', attempts: 3 });
    expect(calls).toBe(3);
  });

  it('does not retry a bad request and never exposes the provider body', async () => {
    let calls = 0;
    const p = new HttpAiProvider(
      cfg,
      async () => {
        calls++;
        return new Response(`invalid key ${KEY}`, { status: 401 });
      },
      noSleep,
    );
    const err = await p.complete(req).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(AiProviderError);
    expect((err as AiProviderError).code).toBe('BAD_RESPONSE');
    expect(String((err as Error).message)).not.toContain(KEY);
    expect(calls).toBe(1);
  });

  it('times out', async () => {
    const p = new HttpAiProvider(
      { ...cfg, AI_REQUEST_TIMEOUT_MS: 1000, AI_MAX_ATTEMPTS: 1 },
      (_url, init) =>
        new Promise((_, reject) =>
          init.signal!.addEventListener('abort', () => reject(new Error('aborted'))),
        ),
      noSleep,
    );
    await expect(p.complete(req)).rejects.toMatchObject({ code: 'TIMEOUT' });
  });

  it('maps 429 and malformed bodies to safe codes and truncates long answers', async () => {
    const limited = new HttpAiProvider(
      { ...cfg, AI_MAX_ATTEMPTS: 1 },
      async () => new Response('', { status: 429 }),
    );
    await expect(limited.complete(req)).rejects.toMatchObject({ code: 'RATE_LIMITED' });
    const bad = new HttpAiProvider(cfg, async () => new Response('not json', { status: 200 }));
    await expect(bad.complete(req)).rejects.toMatchObject({ code: 'BAD_RESPONSE' });
    const long = new HttpAiProvider(cfg, async () => ok('x'.repeat(MAX_RESPONSE_CHARS + 500)));
    expect((await long.complete(req)).text).toHaveLength(MAX_RESPONSE_CHARS);
  });
});

describe('provider selection', () => {
  const http = {
    AI_PROVIDER: 'http',
    AI_PROVIDER_URL: 'https://ai.example.test/v1/chat/completions',
    AI_PROVIDER_API_KEY: KEY,
  };

  it('uses the mock unless every precondition for a real provider holds', () => {
    expect(loadConfig({}).aiMode).toBe('mock');
    expect(loadConfig(http).aiMode).toBe('mock'); // no explicit consent
    expect(
      loadConfig({ ...http, AI_ALLOW_REAL_STUDENT_DATA: 'true', AI_PROVIDER_API_KEY: undefined })
        .aiMode,
    ).toBe('mock');
    expect(loadConfig({ ...http, AI_ALLOW_REAL_STUDENT_DATA: 'true' }).aiMode).toBe('http');
    expect(createAiProvider(loadConfig({})).name).toBe('mock');
  });

  it('requires https in production and never echoes the key', () => {
    const env = {
      ...http,
      AI_PROVIDER_URL: 'http://ai.example.test/v1',
      AI_ALLOW_REAL_STUDENT_DATA: 'true',
      NODE_ENV: 'production',
      DATABASE_URL: 'postgres://u@h/db',
    };
    expect(() => loadConfig(env)).toThrow(/AI_PROVIDER_URL/);
    expect(() => loadConfig(env)).not.toThrow(new RegExp(KEY));
  });
});
