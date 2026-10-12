import { loadConfig } from '../config';
import { createDb } from './client';

async function main() {
  const config = loadConfig();
  const handle = createDb(config.DATABASE_URL, { poolMax: config.DATABASE_POOL_MAX });
  await handle.migrate();
  await handle.close();
  console.warn('Migrations applied');
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : 'Migration failed');
  process.exit(1);
});
