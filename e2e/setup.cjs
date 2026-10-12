// Prepares a fresh E2E database with the compiled API code (run after `pnpm -r build`):
// default org with a teacher, a second teacher and an admin; a second org with its own teacher.
// Usage: DATABASE_URL=pglite://<dir> E2E_PASSWORD=... node e2e/setup.cjs
const path = require('node:path');

const dist = path.join(__dirname, '..', 'apps', 'api', 'dist');
const { createDb } = require(path.join(dist, 'db', 'client.js'));
const { ensureDefaultOrg } = require(path.join(dist, 'app.js'));
const { loadConfig } = require(path.join(dist, 'config.js'));
const { PasswordService } = require(path.join(dist, 'auth', 'password.service.js'));
const { memberships, organizations, users } = require(path.join(dist, 'db', 'schema.js'));
const { eq } = require(require.resolve('drizzle-orm', { paths: [dist] }));

async function main() {
  const password = process.env.E2E_PASSWORD;
  if (!password || password.length < 10) throw new Error('Set E2E_PASSWORD (min 10 chars)');
  const config = loadConfig();
  const handle = createDb(config.DATABASE_URL);
  await handle.migrate();
  await ensureDefaultOrg(handle.db, config);
  const db = handle.db;
  const [main] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.slug, config.DEFAULT_ORG_SLUG));
  const [other] = await db
    .insert(organizations)
    .values({ slug: 'boshqa-maktab', name: 'Boshqa maktab' })
    .returning({ id: organizations.id });

  const passwordHash = await new PasswordService().hash(password);
  const people = [
    ['teacher@e2e.uz', 'Ustoz Karimov', main.id, 'TEACHER'],
    ['teacher2@e2e.uz', 'Ustoz Aliyeva', main.id, 'TEACHER'],
    ['admin@e2e.uz', 'Admin E2E', main.id, 'ORG_ADMIN'],
    ['teacher@other.uz', 'Begona Ustoz', other.id, 'TEACHER'],
  ];
  for (const [email, fullName, organizationId, role] of people) {
    const [u] = await db.insert(users).values({ email, fullName, passwordHash }).returning();
    await db.insert(memberships).values({ userId: u.id, organizationId, role });
  }
  await handle.close();
  console.log(JSON.stringify({ mainOrg: main.id, otherOrg: other.id }));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : 'setup failed');
  process.exit(1);
});
