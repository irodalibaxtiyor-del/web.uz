import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  /** `pglite://memory`, `pglite://./.data/pg` (local dev/tests) or a `postgres://` URL. */
  DATABASE_URL: z.string().min(1).default('pglite://./.data/pg'),
  /** Postgres connections per API instance (ignored for PGlite). */
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),
  /** Comma-separated list of browser origins allowed to call the API with credentials. */
  WEB_ORIGINS: z.string().default('http://localhost:3000'),
  SESSION_TTL_HOURS: z.coerce
    .number()
    .int()
    .positive()
    .default(24 * 7),
  SESSION_IDLE_HOURS: z.coerce.number().int().positive().default(24),
  DEFAULT_ORG_SLUG: z.string().min(1).default('webdizayn'),
  LOGIN_MAX_FAILURES: z.coerce.number().int().positive().default(5),
  LOGIN_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),
  /**
   * Which proxies may set X-Forwarded-For (Express "trust proxy"): `false`, a hop count, or
   * a comma-separated list of names/IPs/CIDRs such as `loopback, 10.0.0.0/8`. The browser
   * reaches the API through the Next.js server, so without this every client shares one IP.
   * The proxy in front of Next.js must overwrite (not append to) X-Forwarded-For.
   */
  TRUST_PROXY: z
    .string()
    .regex(/^[a-z0-9.,:/ ]{1,200}$/i)
    .default('loopback'),
  /** Accounts that may be created per client IP per hour. */
  REGISTER_MAX_PER_HOUR: z.coerce.number().int().positive().default(10),
  /** Requests per client IP per minute to public (no-login) endpoints. */
  PUBLIC_RATE_PER_MINUTE: z.coerce.number().int().positive().default(120),
  /** `process`: Playwright in a child process. `disabled`: every CHECK reports ERROR (never PASS). */
  CHECK_ENGINE: z.enum(['process', 'remote', 'disabled']).default('process'),
  /**
   * `remote`: the CHECK worker service (packages/check-engine, `server-main.js`) in its own
   * container, so Chrome never runs next to the API's database credentials.
   */
  CHECK_WORKER_URL: z.string().url().optional(),
  /** Shared secret with the worker (>= 32 chars). Never logged or returned. */
  CHECK_WORKER_TOKEN: z.string().min(32).optional(),
  /** Chrome/Chromium executable for CHECK. Empty: the installed Google Chrome. */
  CHECK_CHROME_PATH: z.string().optional(),
  /** Chrome's renderer sandbox. Only `false` where the OS cannot provide it (e.g. some containers). */
  CHECK_CHROMIUM_SANDBOX: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),
  CHECK_CONCURRENCY: z.coerce.number().int().min(1).max(16).default(2),
  CHECK_BUDGET_MS: z.coerce.number().int().min(2_000).max(120_000).default(20_000),
  /** Max CHECK runs per user per 10 minutes. */
  CHECK_RATE_LIMIT: z.coerce.number().int().positive().default(20),
  /** `mock` (default) never leaves the server. `http` needs URL, key and the allow flag below. */
  AI_PROVIDER: z.enum(['mock', 'http']).default('mock'),
  /** Full OpenAI-compatible chat-completions endpoint URL. */
  AI_PROVIDER_URL: z.string().url().optional(),
  AI_PROVIDER_MODEL: z.string().min(1).max(200).default('tutor'),
  /** Sent only in the Authorization header; never logged or returned. */
  AI_PROVIDER_API_KEY: z.string().min(1).optional(),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(120_000).default(20_000),
  AI_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(4).default(2),
  /** Per student per UTC day. */
  AI_DAILY_REQUESTS: z.coerce.number().int().min(1).default(40),
  AI_DAILY_PROMPT_CHARS: z.coerce.number().int().min(1_000).default(150_000),
  /** Per student per minute (burst protection). */
  AI_RATE_PER_MINUTE: z.coerce.number().int().min(1).default(6),
  /** Explicit consent that student work may be sent to the external provider (DPA, data location). */
  AI_ALLOW_REAL_STUDENT_DATA: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  /** Cost estimate in micro-USD per 1000 characters sent and received. */
  AI_COST_PER_1K_CHARS_MICROUSD: z.coerce.number().int().min(0).default(0),
  /** Default: `info`, or `silent` when NODE_ENV=test. */
  LOG_LEVEL: z.enum(['silent', 'error', 'warn', 'info', 'debug']).optional(),
  /** Default: `json` in production (one object per line), `text` otherwise. */
  LOG_FORMAT: z.enum(['json', 'text']).optional(),
  /** Enables GET /metrics (Prometheus) for `Authorization: Bearer <token>`; >= 32 chars. */
  METRICS_TOKEN: z.string().min(32).optional(),
});

export type AppConfig = Omit<z.infer<typeof envSchema>, 'LOG_LEVEL' | 'LOG_FORMAT'> & {
  webOrigins: string[];
  cookieSecure: boolean;
  /** The provider actually used: `http` only when every precondition holds. */
  aiMode: 'mock' | 'http';
  /** Value for Express "trust proxy". */
  trustProxy: boolean | number | string[];
  LOG_LEVEL: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  LOG_FORMAT: 'json' | 'text';
};

function parseTrustProxy(raw: string): boolean | number | string[] {
  const v = raw.trim().toLowerCase();
  if (v === 'false') return false;
  if (/^\d+$/.test(v)) return Number(v);
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  // `KEY=` (as in .env.example) means "not set", not "set to an empty string".
  const present = Object.fromEntries(Object.entries(env).filter(([, v]) => v !== ''));
  const parsed = envSchema.safeParse(present);
  if (!parsed.success) {
    // Only report variable names, never values (they may be secrets).
    const keys = parsed.error.issues.map((i) => i.path.join('.')).join(', ');
    throw new Error(`Invalid environment configuration: ${keys}`);
  }
  const cfg = parsed.data;
  if (cfg.NODE_ENV === 'production' && cfg.DATABASE_URL.startsWith('pglite://')) {
    throw new Error('PGlite is not allowed in production; set DATABASE_URL to a Postgres URL');
  }
  if (cfg.CHECK_ENGINE === 'remote' && (!cfg.CHECK_WORKER_URL || !cfg.CHECK_WORKER_TOKEN)) {
    throw new Error('Invalid environment configuration: CHECK_WORKER_URL, CHECK_WORKER_TOKEN');
  }
  const aiHttp =
    cfg.AI_PROVIDER === 'http' &&
    cfg.AI_ALLOW_REAL_STUDENT_DATA &&
    Boolean(cfg.AI_PROVIDER_URL) &&
    Boolean(cfg.AI_PROVIDER_API_KEY);
  if (aiHttp && cfg.NODE_ENV === 'production' && !cfg.AI_PROVIDER_URL!.startsWith('https://')) {
    throw new Error('Invalid environment configuration: AI_PROVIDER_URL (https required)');
  }
  const webOrigins = cfg.WEB_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  // Secure cookies and CORS credentials only make sense for https origins in production.
  if (
    cfg.NODE_ENV === 'production' &&
    (webOrigins.length === 0 || webOrigins.some((o) => !o.startsWith('https://')))
  ) {
    throw new Error('Invalid environment configuration: WEB_ORIGINS (https required)');
  }
  return {
    ...cfg,
    aiMode: aiHttp ? 'http' : 'mock',
    LOG_LEVEL: cfg.LOG_LEVEL ?? (cfg.NODE_ENV === 'test' ? 'silent' : 'info'),
    LOG_FORMAT: cfg.LOG_FORMAT ?? (cfg.NODE_ENV === 'production' ? 'json' : 'text'),
    trustProxy: parseTrustProxy(cfg.TRUST_PROXY),
    webOrigins,
    cookieSecure: cfg.NODE_ENV === 'production',
  };
}

export const APP_CONFIG = Symbol('APP_CONFIG');
