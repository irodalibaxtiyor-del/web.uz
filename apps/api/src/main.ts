import 'reflect-metadata';
import { createApp } from './app';
import { loadConfig } from './config';

async function main() {
  const config = loadConfig();
  const app = await createApp(config);
  await app.listen(config.PORT);
  console.warn(`API listening on http://localhost:${config.PORT}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : 'Startup failed');
  process.exit(1);
});
