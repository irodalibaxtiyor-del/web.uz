import {
  ArgumentsHost,
  Catch,
  Controller,
  Get,
  HttpException,
  type HttpServer,
  Inject,
  Injectable,
  type LoggerService,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DrizzleQueryError } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { CheckQueue } from '../checks/check-queue';
import { APP_CONFIG, type AppConfig } from '../config';
import { Public } from './decorators';

/**
 * Logging and metrics. Never logged: cookies, Authorization headers, request/response bodies,
 * query strings and client IPs. A request id ties a client-visible error to the log line.
 */

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const;
export type LogLevel = keyof typeof LEVELS;

export class AppLogger {
  constructor(private readonly config: Pick<AppConfig, 'LOG_LEVEL' | 'LOG_FORMAT'>) {}

  log(level: LogLevel, msg: string, fields: Record<string, unknown> = {}): void {
    if (this.config.LOG_LEVEL === 'silent') return;
    if (LEVELS[level] > LEVELS[this.config.LOG_LEVEL]) return;
    const line =
      this.config.LOG_FORMAT === 'json'
        ? JSON.stringify({ ts: new Date().toISOString(), level, msg, ...fields })
        : `${level.toUpperCase()} ${msg} ${Object.entries(fields)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `${k}=${String(v)}`)
            .join(' ')}`;
    (level === 'error' || level === 'warn' ? process.stderr : process.stdout).write(`${line}\n`);
  }
}

/** Routes Nest's own messages (startup, module errors) through AppLogger, so JSON stays JSON. */
export class NestLogAdapter implements LoggerService {
  constructor(private readonly logger: AppLogger) {}

  private write(level: LogLevel, message: unknown, context?: unknown) {
    const ctx = typeof context === 'string' ? context : undefined;
    this.logger.log(level, typeof message === 'string' ? message : 'nest', {
      ...(ctx ? { context: ctx } : {}),
    });
  }

  log(message: unknown, context?: unknown) {
    this.write('info', message, context);
  }
  error(message: unknown, _trace?: unknown, context?: unknown) {
    this.write('error', message, context);
  }
  warn(message: unknown, context?: unknown) {
    this.write('warn', message, context);
  }
  debug(message: unknown, context?: unknown) {
    this.write('debug', message, context);
  }
  verbose(message: unknown, context?: unknown) {
    this.write('debug', message, context);
  }
}

const REQUEST_ID_RE = /^[A-Za-z0-9._-]{8,64}$/;

/** In-process counters in Prometheus text format. */
@Injectable()
export class Metrics {
  private readonly requests = new Map<string, number>();
  private durationSum = 0;
  private durationCount = 0;
  private readonly started = Date.now();

  observe(method: string, status: number, ms: number): void {
    const key = `method="${method}",status="${Math.floor(status / 100)}xx"`;
    this.requests.set(key, (this.requests.get(key) ?? 0) + 1);
    this.durationSum += ms / 1000;
    this.durationCount++;
  }

  render(queue: { pending: number; active: number }): string {
    const mem = process.memoryUsage();
    const lines = [
      '# TYPE http_requests_total counter',
      ...[...this.requests].map(([k, v]) => `http_requests_total{${k}} ${v}`),
      '# TYPE http_request_duration_seconds summary',
      `http_request_duration_seconds_sum ${this.durationSum.toFixed(3)}`,
      `http_request_duration_seconds_count ${this.durationCount}`,
      '# TYPE check_queue_pending gauge',
      `check_queue_pending ${queue.pending}`,
      '# TYPE check_queue_active gauge',
      `check_queue_active ${queue.active}`,
      '# TYPE process_resident_memory_bytes gauge',
      `process_resident_memory_bytes ${mem.rss}`,
      '# TYPE nodejs_heap_used_bytes gauge',
      `nodejs_heap_used_bytes ${mem.heapUsed}`,
      '# TYPE process_uptime_seconds gauge',
      `process_uptime_seconds ${Math.round((Date.now() - this.started) / 1000)}`,
    ];
    return `${lines.join('\n')}\n`;
  }
}

/** Assigns a request id (a well-formed incoming one is kept), logs and measures each request. */
export function requestObserver(logger: AppLogger, metrics: Metrics) {
  return (req: Request, res: Response, next: NextFunction) => {
    const incoming = req.headers['x-request-id'];
    const id =
      typeof incoming === 'string' && REQUEST_ID_RE.test(incoming) ? incoming : randomUUID();
    req.requestId = id;
    res.setHeader('X-Request-Id', id);
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      metrics.observe(req.method, res.statusCode, ms);
      logger.log(res.statusCode >= 500 ? 'error' : 'info', 'request', {
        requestId: id,
        method: req.method,
        // Path only: query strings are never logged.
        path: req.path,
        status: res.statusCode,
        ms: Math.round(ms),
      });
    });
    next();
  };
}

/**
 * What may be logged about an unexpected error. A failed query's message embeds its SQL
 * parameters (emails, password and session hashes, student code), so for those only the
 * driver's error name, SQLSTATE code and constraint name are kept.
 */
export function errorLogFields(err: unknown): Record<string, string | undefined> {
  if (err instanceof DrizzleQueryError) {
    const cause = err.cause as { name?: unknown; code?: unknown; constraint?: unknown } | undefined;
    const str = (v: unknown) => (typeof v === 'string' ? v : undefined);
    return {
      error: 'DrizzleQueryError',
      cause: str(cause?.name),
      code: str(cause?.code),
      constraint: str(cause?.constraint),
    };
  }
  if (err instanceof Error) return { error: err.name, message: err.message.slice(0, 500) };
  return { error: 'unknown' };
}

/**
 * HttpExceptions keep Nest's normal response. Anything else is logged with the request id and
 * answered with a generic 500 that carries only that id — no message, no stack.
 */
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly logger: AppLogger,
    adapter: HttpServer,
  ) {
    super(adapter);
  }

  override catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) return super.catch(exception, host);
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    // Client errors raised by middleware (body-parser: too large, malformed JSON) keep their
    // status; only a generic message is returned.
    const e = exception as { status?: unknown; expose?: unknown };
    if (typeof e.status === 'number' && e.status >= 400 && e.status < 500 && e.expose === true) {
      res.status(e.status).json({ statusCode: e.status, message: 'So‘rov rad etildi' });
      return;
    }
    this.logger.log('error', 'unhandled_error', {
      requestId: req.requestId,
      ...errorLogFields(exception),
    });
    res.status(500).json({
      statusCode: 500,
      message: 'Ichki xatolik yuz berdi',
      requestId: req.requestId,
    });
  }
}

/** Prometheus scrape endpoint; 404 unless METRICS_TOKEN is configured. */
@Public()
@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metrics: Metrics,
    private readonly queue: CheckQueue,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  @Get()
  scrape(@Req() req: Request): string {
    const token = this.config.METRICS_TOKEN;
    if (!token) throw new NotFoundException();
    const given = Buffer.from(req.headers.authorization ?? '');
    const expected = Buffer.from(`Bearer ${token}`);
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
      throw new UnauthorizedException();
    }
    req.res?.type('text/plain; version=0.0.4');
    return this.metrics.render(this.queue.stats());
  }
}
