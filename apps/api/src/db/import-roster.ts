import { readFileSync } from 'node:fs';
import { eq } from 'drizzle-orm';
import { parseRosterText, rosterImportSchema } from '@webdizayn/shared';
import { ensureDefaultOrg } from '../app';
import { loadConfig } from '../config';
import { importRoster, previewRoster } from '../groups/roster-import';
import { createDb } from './client';
import { organizations } from './schema';

/**
 * Imports a student list into the default organization.
 * Usage: `pnpm --filter @webdizayn/api db:import:roster <file.txt> [--apply]`.
 * Without --apply it only prints what would happen. The list holds personal data: keep the
 * file outside the repository (e.g. under the gitignored `.data/`).
 * Names that match an existing ungrouped student must be resolved in the admin panel.
 */
async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) throw new Error('Usage: db:import:roster <file.txt> [--apply]');

  const parsed = parseRosterText(readFileSync(file, 'utf8'));
  if (parsed.orphanLines.length > 0) {
    throw new Error(`Lines before any group header: ${parsed.orphanLines.join(', ')}`);
  }
  const input = rosterImportSchema.parse({ groups: parsed.groups });

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

    const preview = await previewRoster(handle.db, org.id, input);
    for (const g of preview.groups) {
      const by = (s: string) => g.rows.filter((r) => r.status === s).length;
      console.warn(
        `${g.name} (${g.exists ? 'bor' : 'yangi'}): ${g.count} ta — yangi ${by('NEW')}, ` +
          `avval import qilingan ${by('ALREADY_IMPORTED')}`,
      );
    }
    console.warn(`Jami: ${preview.totals.rows}`);
    for (const p of preview.problems) console.warn(`MUAMMO: ${p}`);
    if (!preview.canImport) process.exitCode = 1;
    else if (apply) {
      const r = await importRoster(handle.db, org.id, null, input);
      console.warn(
        `Import: ${r.created} ta yangi hisob, ${r.linked} ta bog‘landi, ${r.skipped} ta o‘tkazib yuborildi, ` +
          `${r.groupsCreated} ta yangi guruh. ` +
          r.groups.map((g) => `${g.name}: ${g.students}`).join(', '),
      );
    } else console.warn('Sinov rejimi: hech narsa yozilmadi (--apply bilan import qiling).');
  } finally {
    await handle.close();
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : 'Import failed');
  process.exit(1);
});
