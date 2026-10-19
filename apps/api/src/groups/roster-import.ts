import { ConflictException } from '@nestjs/common';
import { and, eq, isNotNull, isNull, like, or, sql } from 'drizzle-orm';
import {
  groupCode,
  loginBase,
  ROSTER_BLOCKING,
  ROSTER_ROW_STATUSES,
  rosterKey,
  type RosterImportInput,
  type RosterImportResult,
  type RosterPreview,
  type RosterPreviewGroup,
  type RosterPreviewRow,
  type RosterRowStatus,
} from '@webdizayn/shared';
import { UNUSABLE_PASSWORD_HASH } from '../auth/password.service';
import type { Db } from '../db/client';
import { auditEvents, groups, groupStudents, memberships, users } from '../db/schema';

/** Serializes everything that hands out logins, so two imports cannot pick the same one. */
export const LOGIN_LOCK = 'account-logins';

interface Existing {
  groupsByCode: Map<string, { id: string; name: string }>;
  /** rosterKey → where that name already sits in this organization. */
  grouped: Map<string, { groupId: string; groupName: string; login: string | null }[]>;
  /** rosterKey → students of this organization that are in no group. */
  ungrouped: Map<string, { userId: string; login: string | null; email: string | null }[]>;
}

async function loadExisting(db: Db, orgId: string): Promise<Existing> {
  const groupRows = await db
    .select({ id: groups.id, name: groups.name, code: groups.code })
    .from(groups)
    .where(eq(groups.organizationId, orgId));
  const groupsByCode = new Map(groupRows.map((g) => [g.code, { id: g.id, name: g.name }]));
  const nameById = new Map(groupRows.map((g) => [g.id, g.name]));

  const grouped = new Map<string, { groupId: string; groupName: string; login: string | null }[]>();
  const members = await db
    .select({ key: groupStudents.rosterKey, groupId: groupStudents.groupId, login: users.login })
    .from(groupStudents)
    .innerJoin(users, eq(users.id, groupStudents.userId))
    .where(eq(groupStudents.organizationId, orgId));
  for (const m of members) {
    const list = grouped.get(m.key) ?? [];
    list.push({ groupId: m.groupId, groupName: nameById.get(m.groupId) ?? '', login: m.login });
    grouped.set(m.key, list);
  }

  const ungrouped = new Map<
    string,
    { userId: string; login: string | null; email: string | null }[]
  >();
  const loose = await db
    .select({ userId: users.id, fullName: users.fullName, login: users.login, email: users.email })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .leftJoin(
      groupStudents,
      and(eq(groupStudents.userId, users.id), eq(groupStudents.organizationId, orgId)),
    )
    .where(
      and(
        eq(memberships.organizationId, orgId),
        eq(memberships.role, 'STUDENT'),
        isNull(groupStudents.userId),
      ),
    );
  for (const u of loose) {
    const k = rosterKey(u.fullName);
    const list = ungrouped.get(k) ?? [];
    list.push({ userId: u.userId, login: u.login, email: u.email });
    ungrouped.set(k, list);
  }
  return { groupsByCode, grouped, ungrouped };
}

/** Picks `base`, `base2`, `base3`… avoiding logins already taken in the database or this run. */
async function loginAllocator(db: Db, bases: string[]) {
  const unique = [...new Set(bases)];
  const taken = new Set<string>();
  if (unique.length > 0) {
    // Bases are [a-z0-9.] only, so they contain no LIKE wildcards.
    const rows = await db
      .select({ login: sql<string>`lower(${users.login})` })
      .from(users)
      .where(
        and(
          isNotNull(users.login),
          or(...unique.map((b) => like(sql`lower(${users.login})`, `${b}%`))),
        ),
      );
    for (const r of rows) taken.add(r.login);
  }
  return (base: string): string => {
    let login = base;
    for (let n = 2; taken.has(login); n++) login = `${base}${n}`;
    taken.add(login);
    return login;
  };
}

/**
 * Compares the list with what the organization already has. Nothing is written; the same
 * function runs again inside the import transaction so the preview cannot go stale.
 */
export async function previewRoster(
  db: Db,
  orgId: string,
  input: RosterImportInput,
): Promise<RosterPreview> {
  const existing = await loadExisting(db, orgId);
  const problems: string[] = [];

  const seenCodes = new Set<string>();
  for (const g of input.groups) {
    const code = groupCode(g.name);
    if (seenCodes.has(code)) problems.push(`“${g.name}” guruhi ro‘yxatda ikki marta berilgan`);
    seenCodes.add(code);
  }

  const occurrences = new Map<string, number>();
  for (const g of input.groups) {
    for (const s of g.students) {
      const k = rosterKey(s);
      occurrences.set(k, (occurrences.get(k) ?? 0) + 1);
    }
  }

  const newBases: string[] = [];
  const out: RosterPreviewGroup[] = input.groups.map((g) => {
    const code = groupCode(g.name);
    const group = existing.groupsByCode.get(code);
    const rows = g.students.map((fullName, i): RosterPreviewRow => {
      const key = rosterKey(fullName);
      const base: RosterPreviewRow = {
        position: i + 1,
        fullName,
        rosterKey: key,
        status: 'NEW',
        login: null,
      };
      if ((occurrences.get(key) ?? 0) > 1) return { ...base, status: 'DUPLICATE_IN_INPUT' };
      const placed = existing.grouped.get(key) ?? [];
      const here = group ? placed.find((p) => p.groupId === group.id) : undefined;
      if (here) return { ...base, status: 'ALREADY_IMPORTED', login: here.login };
      if (placed.length > 0) {
        return { ...base, status: 'IN_OTHER_GROUP', otherGroup: placed[0]!.groupName };
      }
      const candidates = existing.ungrouped.get(key);
      if (candidates) {
        const resolution = input.resolutions?.[key];
        const valid =
          resolution?.action === 'CREATE' ||
          (resolution?.action === 'LINK' && candidates.some((c) => c.userId === resolution.userId));
        return {
          ...base,
          status: 'NAME_MATCH',
          candidates,
          ...(valid ? { resolution } : {}),
        };
      }
      newBases.push(loginBase(fullName));
      return base;
    });
    if (g.expectedCount !== undefined && g.expectedCount !== rows.length) {
      problems.push(
        `“${g.name}”: ro‘yxatda ${g.expectedCount} nafar deb yozilgan, lekin ${rows.length} ta ism bor`,
      );
    }
    return {
      name: g.name,
      code,
      exists: Boolean(group),
      expectedCount: g.expectedCount ?? null,
      count: rows.length,
      rows,
    };
  });

  // Logins for every row that will become a new account (NEW, or NAME_MATCH resolved as CREATE).
  const allocate = await loginAllocator(
    db,
    newBases.concat(
      out.flatMap((g) =>
        g.rows
          .filter((r) => r.status === 'NAME_MATCH' && r.resolution?.action === 'CREATE')
          .map((r) => loginBase(r.fullName)),
      ),
    ),
  );
  for (const g of out) {
    for (const r of g.rows) {
      const creates =
        r.status === 'NEW' || (r.status === 'NAME_MATCH' && r.resolution?.action === 'CREATE');
      if (creates) r.login = allocate(loginBase(r.fullName));
    }
  }

  const totals = Object.fromEntries(ROSTER_ROW_STATUSES.map((s) => [s, 0])) as Record<
    RosterRowStatus,
    number
  >;
  let rowCount = 0;
  for (const g of out) {
    for (const r of g.rows) {
      totals[r.status]++;
      rowCount++;
      if (ROSTER_BLOCKING.includes(r.status)) {
        problems.push(
          r.status === 'DUPLICATE_IN_INPUT'
            ? `“${g.name}” ${r.position}: “${r.fullName}” ro‘yxatda bir necha marta uchraydi`
            : `“${g.name}” ${r.position}: “${r.fullName}” allaqachon “${r.otherGroup}” guruhida`,
        );
      } else if (r.status === 'NAME_MATCH' && !r.resolution) {
        problems.push(
          `“${g.name}” ${r.position}: “${r.fullName}” nomli guruhsiz talaba bor — bog‘lash yoki yangi hisob ochishni tanlang`,
        );
      }
    }
  }

  return {
    groups: out,
    totals: { ...totals, rows: rowCount },
    problems,
    canImport: problems.length === 0,
  };
}

/**
 * Creates missing groups and student accounts in one transaction. New accounts get a login,
 * no email and no usable password (an admin issues temporary passwords separately), and must
 * change the password on first sign-in. Re-running the same list changes nothing.
 */
export async function importRoster(
  db: Db,
  orgId: string,
  actorUserId: string | null,
  input: RosterImportInput,
): Promise<RosterImportResult> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${LOGIN_LOCK}))`);
    const preview = await previewRoster(tx, orgId, input);
    if (!preview.canImport) {
      throw new ConflictException({
        code: 'ROSTER_INVALID',
        message: 'Ro‘yxatda hal qilinmagan muammolar bor',
        problems: preview.problems,
      });
    }

    let created = 0;
    let linked = 0;
    let skipped = 0;
    let groupsCreated = 0;
    const summary: RosterImportResult['groups'] = [];

    for (const g of preview.groups) {
      let [group] = await tx
        .select({ id: groups.id })
        .from(groups)
        .where(and(eq(groups.organizationId, orgId), eq(groups.code, g.code)));
      if (!group) {
        [group] = await tx
          .insert(groups)
          .values({ organizationId: orgId, name: g.name, code: g.code })
          .returning({ id: groups.id });
        groupsCreated++;
      }
      const groupId = group!.id;

      for (const r of g.rows) {
        if (r.status === 'ALREADY_IMPORTED') {
          skipped++;
          continue;
        }
        let userId: string;
        if (r.status === 'NAME_MATCH' && r.resolution?.action === 'LINK') {
          userId = r.resolution.userId;
          linked++;
        } else {
          const [u] = await tx
            .insert(users)
            .values({
              login: r.login!,
              fullName: r.fullName,
              passwordHash: UNUSABLE_PASSWORD_HASH,
              mustChangePassword: true,
            })
            .returning({ id: users.id });
          userId = u!.id;
          await tx.insert(memberships).values({ userId, organizationId: orgId, role: 'STUDENT' });
          created++;
        }
        await tx.insert(groupStudents).values({
          groupId,
          organizationId: orgId,
          userId,
          rosterKey: r.rosterKey,
          addedBy: actorUserId,
        });
      }
      const [count] = await tx
        .select({ n: sql<number>`count(*)::int` })
        .from(groupStudents)
        .where(eq(groupStudents.groupId, groupId));
      summary.push({ name: g.name, students: count?.n ?? 0 });
    }

    // Names stay out of the audit trail; counts are enough to reconstruct what happened.
    await tx.insert(auditEvents).values({
      action: 'roster.import',
      actorUserId,
      organizationId: orgId,
      targetType: 'organization',
      targetId: orgId,
      metadata: { created, linked, skipped, groupsCreated, groups: summary },
    });
    return { created, linked, skipped, groupsCreated, groups: summary };
  });
}
