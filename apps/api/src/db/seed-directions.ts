import { eq } from 'drizzle-orm';
import { ensureDefaultOrg } from '../app';
import { loadConfig } from '../config';
import { createDb } from './client';
import { syncDirections } from './content/directions';
import { organizations } from './schema';

/**
 * Upserts the public catalogue directions and links the bundled courses of the default
 * organization to them (as listed in each course manifest). Idempotent.
 * Usage: `pnpm --filter @webdizayn/api db:seed:directions`.
 */
async function main() {
  const config = loadConfig();
  const handle = createDb(config.DATABASE_URL, { poolMax: config.DATABASE_POOL_MAX });
  try {
    await handle.migrate();
    await ensureDefaultOrg(handle.db, config);
    const [org] = await handle.db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, config.DEFAULT_ORG_SLUG));
    if (!org) throw new Error('Default organization missing');
    const r = await handle.db.transaction((tx) => syncDirections(tx, org.id));
    console.warn(
      `Directions synced: ${r.directions} directions, ${r.courses} courses, ${r.links} links`,
    );
  } finally {
    await handle.close();
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : 'Directions seed failed');
  process.exit(1);
});
