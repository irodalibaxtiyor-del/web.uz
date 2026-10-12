import { eq } from 'drizzle-orm';
import type { Role } from '@webdizayn/shared';
import { ensureDefaultOrg } from '../app';
import { PasswordService } from '../auth/password.service';
import { loadConfig } from '../config';
import { createDb } from './client';
import { memberships, organizations, users } from './schema';

/**
 * Local-development seed. Creates a teacher and an org admin in the default organization.
 * The password comes from SEED_PASSWORD so no credential is committed to the repository.
 */
async function main() {
  const config = loadConfig();
  if (config.NODE_ENV === 'production') throw new Error('Seed is disabled in production');
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 10) throw new Error('Set SEED_PASSWORD (min 10 chars)');

  const handle = createDb(config.DATABASE_URL, { poolMax: config.DATABASE_POOL_MAX });
  await handle.migrate();
  await ensureDefaultOrg(handle.db, config);
  const db = handle.db;
  const [org] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, config.DEFAULT_ORG_SLUG));
  if (!org) throw new Error('Default organization missing');

  const passwordHash = await new PasswordService().hash(password);
  const people: { email: string; fullName: string; role: Role }[] = [
    { email: 'teacher@webdizayn.local', fullName: "O'qituvchi Demo", role: 'TEACHER' },
    { email: 'admin@webdizayn.local', fullName: 'Admin Demo', role: 'ORG_ADMIN' },
  ];
  for (const p of people) {
    const [u] = await db
      .insert(users)
      .values({ email: p.email, fullName: p.fullName, passwordHash })
      .onConflictDoNothing()
      .returning({ id: users.id });
    if (u) {
      await db.insert(memberships).values({ userId: u.id, organizationId: org.id, role: p.role });
    }
  }
  await handle.close();
  console.warn('Seed complete:', people.map((p) => p.email).join(', '));
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : 'Seed failed');
  process.exit(1);
});
