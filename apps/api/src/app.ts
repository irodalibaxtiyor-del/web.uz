import { Module, type DynamicModule } from '@nestjs/common';
import { APP_GUARD, HttpAdapterHost, NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AI_PROVIDER, createAiProvider, type AiProvider } from './ai/provider';
import { TutorController } from './ai/tutor.controller';
import { TutorService } from './ai/tutor.service';
import { AiUsageService } from './ai/usage.service';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsService } from './analytics/analytics.service';
import { AssignmentsController } from './assignments/assignments.controller';
import { AssignmentsService } from './assignments/assignments.service';
import { ReviewsController } from './assignments/reviews.controller';
import { ReviewsService } from './assignments/reviews.service';
import { AuditService } from './audit/audit.service';
import { AuthController } from './auth/auth.controller';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { LoginRateLimiter } from './auth/login-rate-limiter';
import { OrgRoleGuard } from './auth/org-role.guard';
import { PasswordService } from './auth/password.service';
import { SessionService } from './auth/session.service';
import { CHECK_EXECUTOR, createCheckExecutor, type CheckExecutor } from './checks/check-executor';
import { CheckQueue } from './checks/check-queue';
import { ChecksController } from './checks/checks.controller';
import { ChecksService } from './checks/checks.service';
import {
  AllExceptionsFilter,
  AppLogger,
  Metrics,
  MetricsController,
  NestLogAdapter,
  requestObserver,
} from './common/observability';
import { originCheck } from './common/origin.middleware';
import { RateLimiter } from './common/rate-limiter';
import { APP_CONFIG, type AppConfig } from './config';
import { CourseAccessService } from './courses/course-access.service';
import { CoursesController } from './courses/courses.controller';
import { CoursesService } from './courses/courses.service';
import { LearningService } from './courses/learning.service';
import { createDb, type Db, type DbHandle } from './db/client';
import { DbModule } from './db/db.module';
import { ExercisesController } from './exercises/exercises.controller';
import { ExercisesService } from './exercises/exercises.service';
import { organizations } from './db/schema';
import { HealthController } from './health/health.controller';
import { OrganizationsController } from './organizations/organizations.controller';
import { PortfolioController } from './portfolio/portfolio.controller';
import { PortfolioService } from './portfolio/portfolio.service';
import { QuizzesController } from './quizzes/quizzes.controller';
import { QuizzesService } from './quizzes/quizzes.service';

@Module({})
export class AppModule {
  static forRoot(
    config: AppConfig,
    handle: DbHandle,
    checkExecutor: CheckExecutor = createCheckExecutor(config),
    aiProvider: AiProvider = createAiProvider(config),
  ): DynamicModule {
    return {
      module: AppModule,
      imports: [DbModule.forHandle(handle)],
      controllers: [
        HealthController,
        AuthController,
        OrganizationsController,
        CoursesController,
        ExercisesController,
        ChecksController,
        AssignmentsController,
        ReviewsController,
        QuizzesController,
        PortfolioController,
        AnalyticsController,
        MetricsController,
        TutorController,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: config },
        AuditService,
        PasswordService,
        SessionService,
        LoginRateLimiter,
        RateLimiter,
        Metrics,
        AuthService,
        CourseAccessService,
        CoursesService,
        LearningService,
        ExercisesService,
        { provide: CHECK_EXECUTOR, useValue: checkExecutor },
        CheckQueue,
        ChecksService,
        AssignmentsService,
        ReviewsService,
        QuizzesService,
        PortfolioService,
        AnalyticsService,
        { provide: AI_PROVIDER, useValue: aiProvider },
        AiUsageService,
        TutorService,
        // Order matters: authenticate first, then resolve org role.
        { provide: APP_GUARD, useClass: AuthGuard },
        { provide: APP_GUARD, useClass: OrgRoleGuard },
      ],
    };
  }
}

export async function ensureDefaultOrg(db: Db, config: AppConfig): Promise<void> {
  await db
    .insert(organizations)
    .values({ slug: config.DEFAULT_ORG_SLUG, name: 'WEBDIZAYN.UZ' })
    .onConflictDoNothing();
}

export interface CreateAppOptions {
  handle?: DbHandle;
  /** Production runs migrations as a separate deploy step (`pnpm db:migrate`). */
  migrate?: boolean;
  /** Replaces the Playwright executor (tests). */
  checkExecutor?: CheckExecutor;
  /** Replaces the configured AI provider (tests). */
  aiProvider?: AiProvider;
}

export async function createApp(
  config: AppConfig,
  opts: CreateAppOptions = {},
): Promise<NestExpressApplication> {
  const handle =
    opts.handle ?? createDb(config.DATABASE_URL, { poolMax: config.DATABASE_POOL_MAX });
  if (opts.migrate ?? config.NODE_ENV !== 'production') await handle.migrate();
  await ensureDefaultOrg(handle.db, config);

  const logger = new AppLogger(config);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot(config, handle, opts.checkExecutor, opts.aiProvider),
    {
      logger:
        config.LOG_LEVEL === 'silent'
          ? false
          : config.LOG_FORMAT === 'json'
            ? new NestLogAdapter(logger)
            : ['error', 'warn', 'log'],
      bodyParser: false,
    },
  );
  // Student projects are capped at 500k chars by validation; 1 MB leaves room for JSON escaping.
  app.useBodyParser('json', { limit: '1mb' });
  app.disable('x-powered-by');
  // req.ip must be the browser, not the Next.js proxy, or IP-based limits are shared by all.
  app.set('trust proxy', config.trustProxy);
  app.use(requestObserver(logger, app.get(Metrics)));
  app.useGlobalFilters(new AllExceptionsFilter(logger, app.get(HttpAdapterHost).httpAdapter));
  app.use(helmet());
  app.use(cookieParser());
  app.use(originCheck(config.webOrigins));
  app.enableCors({ origin: config.webOrigins, credentials: true });
  app.enableShutdownHooks();
  return app;
}
