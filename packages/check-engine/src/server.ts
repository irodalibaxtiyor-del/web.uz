import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import { checkRulesSchema, projectFilesSchema, type CheckEngineResult } from '@webdizayn/shared';
import { runChecksIsolated, type IsolatedOptions } from './isolated';

/**
 * CHECK worker service for production: runs in its own container, next to no database and no
 * application secrets. The API sends files + rules and gets the verdict back. Every run still
 * happens in a killable child process with a minimal environment (see `isolated.ts`).
 */
export interface CheckWorkerOptions {
  /** Shared secret; requests must send `Authorization: Bearer <token>`. */
  token: string;
  /** Runs at the same time; further requests get 503 (the API reports ERROR, never PASS). */
  concurrency?: number;
  /** Requests allowed to wait for a free slot. */
  queue?: number;
  maxBodyBytes?: number;
  engine?: IsolatedOptions;
  /** Replaceable for tests. */
  run?: typeof runChecksIsolated;
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
}

function authorized(req: IncomingMessage, token: string): boolean {
  const header = req.headers.authorization ?? '';
  const expected = Buffer.from(`Bearer ${token}`);
  const given = Buffer.from(header);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

function readBody(req: IncomingMessage, limit: number): Promise<string | null> {
  return new Promise((resolve) => {
    let size = 0;
    const chunks: Buffer[] = [];
    const onData = (c: Buffer) => {
      size += c.length;
      if (size > limit) {
        // Stop buffering; the caller answers 413 with Connection: close.
        req.off('data', onData);
        chunks.length = 0;
        req.resume();
        resolve(null);
        return;
      }
      chunks.push(c);
    };
    req.on('data', onData);
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', () => resolve(null));
  });
}

export function createCheckWorkerServer(options: CheckWorkerOptions): Server {
  if (options.token.length < 32) throw new Error('CHECK worker token must be at least 32 chars');
  const concurrency = options.concurrency ?? 2;
  const queueLimit = options.queue ?? 8;
  const maxBody = options.maxBodyBytes ?? 1_500_000;
  const run = options.run ?? runChecksIsolated;
  let active = 0;
  const waiting: (() => void)[] = [];

  async function slot<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= concurrency) await new Promise<void>((r) => waiting.push(r));
    active++;
    try {
      return await fn();
    } finally {
      active--;
      waiting.shift()?.();
    }
  }

  return createServer(async (req, res) => {
    const url = req.url ?? '/';
    if (req.method === 'GET' && url === '/health') return send(res, 200, { ok: true });
    if (url !== '/run') return send(res, 404, { error: 'not_found' });
    if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
    if (!authorized(req, options.token)) return send(res, 401, { error: 'unauthorized' });
    if (active + waiting.length >= concurrency + queueLimit) {
      return send(res, 503, { error: 'busy' });
    }
    const raw = await readBody(req, maxBody);
    if (raw === null) {
      res.setHeader('connection', 'close');
      return send(res, 413, { error: 'too_large' });
    }
    let body: { files?: unknown; rules?: unknown };
    try {
      body = JSON.parse(raw) as typeof body;
    } catch {
      return send(res, 400, { error: 'invalid_json' });
    }
    const files = projectFilesSchema.safeParse(body?.files);
    const rules = checkRulesSchema.safeParse(body?.rules);
    if (!files.success || !rules.success) return send(res, 400, { error: 'invalid_request' });
    const result: CheckEngineResult = await slot(() => run(files.data, rules.data, options.engine));
    send(res, 200, result);
  });
}
