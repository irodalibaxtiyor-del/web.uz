import { eq } from 'drizzle-orm';
import { bootstrapAdmin } from '../accounts/bootstrap-admin';
import { ensureDefaultOrg } from '../app';
import { PasswordService } from '../auth/password.service';
import { loadConfig } from '../config';
import { createDb } from './client';
import { organizations } from './schema';

/**
 * Creates the first administrator of the default organization (production included):
 *
 *   BOOTSTRAP_ADMIN_LOGIN=admin@example.uz BOOTSTRAP_ADMIN_NAME="Ism Familiya" \
 *   BOOTSTRAP_ADMIN_PASSWORD=… node dist/db/bootstrap-admin.js
 *
 * Pass the password through the secret manager / a one-off shell variable, never a file in the
 * repository. Nothing happens when an administrator already exists. The password is not logged.
 */
async function main() {
  const config = loadConfig();
  const identifier = process.env.BOOTSTRAP_ADMIN_LOGIN ?? '';
  const fullName = process.env.BOOTSTRAP_ADMIN_NAME ?? '';
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? '';
  delete process.env.BOOTSTRAP_ADMIN_PASSWORD;

  const handle = createDb(config.DATABASE_URL, { poolMax: config.DATABASE_POOL_MAX });
  try {
    await ensureDefaultOrg(handle.db, config);
    const [org] = await handle.db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, config.DEFAULT_ORG_SLUG));
    if (!org) throw new Error('Default organization missing');
    const result = await bootstrapAdmin(handle.db, new PasswordService(), org.id, {
      identifier,
      fullName,
      password,
    });
    const messages = {
      CREATED: 'Administrator created; the password must be changed on first sign-in.',
      ADMIN_EXISTS: 'An administrator already exists; nothing changed.',
      IDENTIFIER_TAKEN: 'That login/email is already used by another account; nothing changed.',
    };
    console.warn(messages[result]);
    if (result === 'IDENTIFIER_TAKEN') process.exitCode = 1;
  } finally {
    await handle.close();
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : 'Bootstrap failed');
  process.exit(1);
});
