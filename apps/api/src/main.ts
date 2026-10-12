import 'reflect-metadata';
import { createApp } from './app';
import { AppLogger } from './common/observability';
import { loadConfig } from './config';

async function main() {
  const config = loadConfig();
  const logger = new AppLogger(config);
  if (config.NODE_ENV === 'production' && config.CHECK_ENGINE === 'process') {
    logger.log('warn', 'check_engine_in_api_process', {
      hint: 'Use CHECK_ENGINE=remote so Chromium never runs next to the API secrets',
    });
  }
  const app = await createApp(config);
  await app.listen(config.PORT);
  logger.log('info', 'api_listening', { port: config.PORT, checkEngine: config.CHECK_ENGINE });
}

main().catch((err: unknown) => {
  // Only the message: config errors already avoid values, and stacks may contain paths.
  process.stderr.write(`${err instanceof Error ? err.message : 'Startup failed'}\n`);
  process.exit(1);
});
