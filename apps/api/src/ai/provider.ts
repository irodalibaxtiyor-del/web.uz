import type { AppConfig } from '../config';
import { mockAnswer, type TutorPlan } from './pedagogy';

export interface ProviderRequest {
  system: string;
  user: string;
  /**
   * Structured teaching plan; the mock answers from it, real models get it inside `user`.
   * Absent for non-tutor prompts (the help chatbot), which only a real model can answer.
   */
  plan?: TutorPlan;
}

export interface ProviderResult {
  text: string;
  model: string;
  attempts: number;
}

export type AiProviderErrorCode = 'TIMEOUT' | 'UNAVAILABLE' | 'RATE_LIMITED' | 'BAD_RESPONSE';

/** Carries only a code: provider bodies, URLs and keys never reach logs or clients. */
export class AiProviderError extends Error {
  constructor(
    readonly code: AiProviderErrorCode,
    readonly attempts: number,
  ) {
    super(`AI provider error: ${code}`);
  }
}

export interface AiProvider {
  readonly name: 'mock' | 'http';
  readonly model: string;
  complete(req: ProviderRequest): Promise<ProviderResult>;
}

export const AI_PROVIDER = Symbol('AI_PROVIDER');

/** Longest provider answer we accept; anything beyond is cut before parsing. */
export const MAX_RESPONSE_CHARS = 6000;

/** Deterministic, offline tutor built from the teaching plan. The default provider. */
export class MockProvider implements AiProvider {
  readonly name = 'mock' as const;
  readonly model = 'mock-tutor';

  async complete(req: ProviderRequest): Promise<ProviderResult> {
    if (!req.plan) throw new AiProviderError('BAD_RESPONSE', 1);
    return { text: JSON.stringify(mockAnswer(req.plan)), model: this.model, attempts: 1 };
  }
}

type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

/**
 * OpenAI-compatible chat-completions adapter without a vendor SDK. The API key is only ever
 * placed in the Authorization header.
 */
export class HttpAiProvider implements AiProvider {
  readonly name = 'http' as const;
  readonly model: string;

  constructor(
    private readonly cfg: Pick<
      AppConfig,
      | 'AI_PROVIDER_URL'
      | 'AI_PROVIDER_API_KEY'
      | 'AI_PROVIDER_MODEL'
      | 'AI_REQUEST_TIMEOUT_MS'
      | 'AI_MAX_ATTEMPTS'
    >,
    private readonly fetchImpl: FetchLike = fetch,
    private readonly sleep: (ms: number) => Promise<void> = (ms) =>
      new Promise((r) => setTimeout(r, ms)),
  ) {
    this.model = cfg.AI_PROVIDER_MODEL;
  }

  async complete(req: ProviderRequest): Promise<ProviderResult> {
    let last: AiProviderErrorCode = 'UNAVAILABLE';
    for (let attempt = 1; attempt <= this.cfg.AI_MAX_ATTEMPTS; attempt++) {
      try {
        const text = await this.once(req);
        return { text, model: this.model, attempts: attempt };
      } catch (e) {
        last = e instanceof AiProviderError ? e.code : 'UNAVAILABLE';
        // Only transient failures are retried, with a short bounded backoff.
        if (last === 'BAD_RESPONSE' || attempt === this.cfg.AI_MAX_ATTEMPTS) {
          throw new AiProviderError(last, attempt);
        }
        await this.sleep(Math.min(250 * 2 ** (attempt - 1), 2000));
      }
    }
    throw new AiProviderError(last, this.cfg.AI_MAX_ATTEMPTS);
  }

  private async once(req: ProviderRequest): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.cfg.AI_REQUEST_TIMEOUT_MS);
    let res: Response;
    try {
      res = await this.fetchImpl(this.cfg.AI_PROVIDER_URL!, {
        method: 'POST',
        signal: controller.signal,
        redirect: 'error',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.cfg.AI_PROVIDER_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.3,
          max_tokens: 900,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: req.system },
            { role: 'user', content: req.user },
          ],
        }),
      });
    } catch {
      throw new AiProviderError(controller.signal.aborted ? 'TIMEOUT' : 'UNAVAILABLE', 1);
    } finally {
      clearTimeout(timer);
    }
    if (res.status === 429) throw new AiProviderError('RATE_LIMITED', 1);
    if (res.status >= 500) throw new AiProviderError('UNAVAILABLE', 1);
    if (!res.ok) throw new AiProviderError('BAD_RESPONSE', 1);
    let body: unknown;
    try {
      body = JSON.parse((await res.text()).slice(0, 200_000));
    } catch {
      throw new AiProviderError('BAD_RESPONSE', 1);
    }
    const content = (body as { choices?: { message?: { content?: unknown } }[] })?.choices?.[0]
      ?.message?.content;
    if (typeof content !== 'string' || content.trim() === '') {
      throw new AiProviderError('BAD_RESPONSE', 1);
    }
    return content.slice(0, MAX_RESPONSE_CHARS);
  }
}

export function createAiProvider(config: AppConfig): AiProvider {
  return config.aiMode === 'http' ? new HttpAiProvider(config) : new MockProvider();
}
