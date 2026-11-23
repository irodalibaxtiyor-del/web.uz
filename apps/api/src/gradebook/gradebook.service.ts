import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import {
  columnKey,
  columnLabel,
  GRADE_BAND_LABEL,
  GRADE_BANDS,
  gradeBand,
  GRADEBOOK_MAX_COLUMNS,
  gradebookStats,
  meanScore,
  type CreateGradebookInput,
  type GradebookColumn,
  type GradebookColumnInput,
  type GradebookImportInput,
  type GradebookImportPreview,
  type GradebookImportResult,
  type GradebookScoresInput,
  type GradebookSummary,
  type GradebookView,
  type MyGradebook,
} from '@webdizayn/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthContext, MembershipContext } from '../common/types';
import { buildXlsx, type Cell } from '../common/xlsx';
import { readSpreadsheet, SpreadsheetError } from '../common/xlsx-read';
import type { Db } from '../db/client';
import { DbService } from '../db/db.module';
import { gradebookColumns, gradebooks, gradebookScores, groups, groupStudents } from '../db/schema';
import { MonitoringService, type GroupRef } from '../groups/monitoring.service';
import { previewGradebookImport, type RosterStudent } from './gradebook-import';

const NOT_FOUND = 'Jurnal topilmadi';
const titleKey = (t: string) => t.replace(/\s+/g, ' ').trim().toLowerCase();
const tashkentYear = () => new Date(Date.now() + 5 * 3_600_000).getUTCFullYear();

type BookRow = typeof gradebooks.$inferSelect;

@Injectable()
export class GradebookService {
  constructor(
    private readonly dbs: DbService,
    private readonly monitoring: MonitoringService,
    private readonly audit: AuditService,
  ) {}

  private get db(): Db {
    return this.dbs.db;
  }

  // ---- Staff: gradebooks --------------------------------------------------------------

  async list(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
  ): Promise<GradebookSummary[]> {
    const group = await this.monitoring.assertGroup(auth, m, groupId);
    const books = await this.db
      .select()
      .from(gradebooks)
      .where(eq(gradebooks.groupId, group.id))
      .orderBy(desc(gradebooks.updatedAt));
    const roster = await this.students(group);
    return Promise.all(books.map(async (b) => this.summary(b, group, roster)));
  }

  async create(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    input: CreateGradebookInput,
  ): Promise<GradebookSummary> {
    const group = await this.monitoring.assertGroup(auth, m, groupId);
    const [row] = await this.db
      .insert(gradebooks)
      .values({
        organizationId: m.organizationId,
        groupId: group.id,
        title: input.title,
        titleKey: titleKey(input.title),
        createdBy: auth.userId,
      })
      .onConflictDoNothing()
      .returning();
    if (!row) throw this.exists();
    await this.record(auth, m, 'gradebook.create', row.id);
    return this.summary(row, group, await this.students(group));
  }

  async view(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    id: string,
  ): Promise<GradebookView> {
    const { book, group } = await this.book(auth, m, groupId, id);
    const columns = await this.columns(book.id);
    const roster = await this.students(group);
    const scores = await this.scoresOf(columns, roster);
    const students = roster.map((s) => {
      const row: Record<string, number | null> = {};
      for (const c of columns) row[c.id] = scores.get(`${c.id}|${s.userId}`) ?? null;
      const vals = Object.values(row);
      return {
        userId: s.userId,
        fullName: s.fullName,
        scores: row,
        average: meanScore(vals),
        filled: vals.filter((v) => v !== null).length,
      };
    });
    return {
      id: book.id,
      title: book.title,
      group: { id: group.id, name: group.name },
      columns,
      students,
      stats: gradebookStats(columns, students),
      updatedAt: book.updatedAt.toISOString(),
    };
  }

  async rename(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    id: string,
    input: CreateGradebookInput,
  ): Promise<GradebookView> {
    const { book } = await this.book(auth, m, groupId, id);
    const key = titleKey(input.title);
    const [clash] = await this.db
      .select({ id: gradebooks.id })
      .from(gradebooks)
      .where(and(eq(gradebooks.groupId, book.groupId), eq(gradebooks.titleKey, key)));
    if (clash && clash.id !== book.id) throw this.exists();
    await this.db
      .update(gradebooks)
      .set({ title: input.title, titleKey: key, updatedAt: new Date() })
      .where(eq(gradebooks.id, book.id));
    await this.record(auth, m, 'gradebook.rename', book.id);
    return this.view(auth, m, groupId, id);
  }

  async remove(auth: AuthContext, m: MembershipContext, groupId: string, id: string) {
    const { book } = await this.book(auth, m, groupId, id);
    await this.db.delete(gradebooks).where(eq(gradebooks.id, book.id));
    await this.record(auth, m, 'gradebook.delete', book.id, { title: book.title });
  }

  // ---- Staff: columns and scores -------------------------------------------------------

  async addColumn(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    id: string,
    input: GradebookColumnInput,
  ): Promise<GradebookView> {
    const { book } = await this.book(auth, m, groupId, id);
    await this.db.transaction(async (trx) => {
      const tx = trx as unknown as Db;
      const existing = await this.columns(book.id, tx);
      if (existing.length >= GRADEBOOK_MAX_COLUMNS)
        throw new BadRequestException(`Ustunlar ${GRADEBOOK_MAX_COLUMNS} tadan oshmaydi`);
      if (existing.some((c) => columnKey(c) === columnKey(input)))
        throw new ConflictException({
          message: 'Bunday ustun bor',
          code: 'GRADEBOOK_COLUMN_EXISTS',
        });
      await tx.insert(gradebookColumns).values({
        gradebookId: book.id,
        position: existing.length,
        title: input.title,
        heldOn: input.date,
      });
      await this.touch(tx, book.id);
    });
    return this.view(auth, m, groupId, id);
  }

  async updateColumn(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    id: string,
    columnId: string,
    input: GradebookColumnInput,
  ): Promise<GradebookView> {
    const { book } = await this.book(auth, m, groupId, id);
    const cols = await this.columns(book.id);
    if (!cols.some((c) => c.id === columnId)) throw new NotFoundException('Ustun topilmadi');
    if (cols.some((c) => c.id !== columnId && columnKey(c) === columnKey(input)))
      throw new ConflictException({ message: 'Bunday ustun bor', code: 'GRADEBOOK_COLUMN_EXISTS' });
    await this.db
      .update(gradebookColumns)
      .set({ title: input.title, heldOn: input.date })
      .where(eq(gradebookColumns.id, columnId));
    await this.touch(this.db, book.id);
    return this.view(auth, m, groupId, id);
  }

  async removeColumn(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    id: string,
    columnId: string,
  ): Promise<GradebookView> {
    const { book } = await this.book(auth, m, groupId, id);
    await this.db.transaction(async (trx) => {
      const tx = trx as unknown as Db;
      const [gone] = await tx
        .delete(gradebookColumns)
        .where(and(eq(gradebookColumns.id, columnId), eq(gradebookColumns.gradebookId, book.id)))
        .returning();
      if (!gone) throw new NotFoundException('Ustun topilmadi');
      // Keep positions dense so new columns append at the end.
      const rest = await this.columns(book.id, tx);
      for (const [i, c] of rest.entries())
        if (c.position !== i)
          await tx
            .update(gradebookColumns)
            .set({ position: i })
            .where(eq(gradebookColumns.id, c.id));
      await this.touch(tx, book.id);
    });
    await this.record(auth, m, 'gradebook.column_delete', book.id, { columnId });
    return this.view(auth, m, groupId, id);
  }

  async setScores(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    id: string,
    input: GradebookScoresInput,
  ): Promise<GradebookView> {
    const { book, group } = await this.book(auth, m, groupId, id);
    const columnIds = new Set((await this.columns(book.id)).map((c) => c.id));
    const userIds = new Set((await this.students(group)).map((s) => s.userId));
    for (const e of input.entries) {
      if (!columnIds.has(e.columnId))
        throw new BadRequestException('Ustun bu jurnalga tegishli emas');
      if (!userIds.has(e.userId)) throw new BadRequestException('Talaba bu guruhda emas');
    }
    await this.db.transaction(async (trx) => {
      const tx = trx as unknown as Db;
      await this.writeScores(tx, auth.userId, input.entries);
      await this.touch(tx, book.id);
    });
    await this.record(auth, m, 'gradebook.scores_update', book.id, { cells: input.entries.length });
    return this.view(auth, m, groupId, id);
  }

  // ---- Staff: import / export ------------------------------------------------------------

  async previewImport(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    id: string,
    file: Buffer | undefined,
  ): Promise<GradebookImportPreview> {
    const { book, group } = await this.book(auth, m, groupId, id);
    if (!file || file.length === 0) throw new BadRequestException('Fayl tanlanmagan');
    let rows;
    try {
      rows = readSpreadsheet(file);
    } catch (e) {
      if (e instanceof SpreadsheetError) throw new BadRequestException(e.message);
      throw e;
    }
    return previewGradebookImport(
      rows,
      await this.students(group),
      await this.columns(book.id),
      tashkentYear(),
    );
  }

  async applyImport(
    auth: AuthContext,
    m: MembershipContext,
    groupId: string,
    id: string,
    plan: GradebookImportInput,
  ): Promise<GradebookImportResult> {
    const { book, group } = await this.book(auth, m, groupId, id);
    const userIds = new Set((await this.students(group)).map((s) => s.userId));
    if (plan.rows.some((r) => !userIds.has(r.userId)))
      throw new BadRequestException('Talaba bu guruhda emas');
    const keys = plan.columns.map(columnKey);
    if (new Set(keys).size !== keys.length) throw new BadRequestException('Ustunlar takrorlangan');

    const result = await this.db.transaction(async (trx) => {
      const tx = trx as unknown as Db;
      const existing = await this.columns(book.id, tx);
      const byKey = new Map(existing.map((c) => [columnKey(c), c.id]));
      const fresh = plan.columns.filter((c) => !byKey.has(columnKey(c)));
      if (existing.length + fresh.length > GRADEBOOK_MAX_COLUMNS)
        throw new BadRequestException(`Ustunlar ${GRADEBOOK_MAX_COLUMNS} tadan oshmaydi`);
      let position = existing.length;
      for (const c of fresh) {
        const [row] = await tx
          .insert(gradebookColumns)
          .values({ gradebookId: book.id, position: position++, title: c.title, heldOn: c.date })
          .returning({ id: gradebookColumns.id });
        byKey.set(columnKey(c), row!.id);
      }
      // Empty cells in the file never erase grades already in the gradebook.
      const entries = plan.rows.flatMap((r) =>
        r.scores.flatMap((score, i) =>
          score === null ? [] : [{ columnId: byKey.get(keys[i]!)!, userId: r.userId, score }],
        ),
      );
      await this.writeScores(tx, auth.userId, entries);
      await this.touch(tx, book.id);
      return { columnsCreated: fresh.length, cellsWritten: entries.length };
    });
    await this.record(auth, m, 'gradebook.import', book.id, result);
    return result;
  }

  async exportXlsx(auth: AuthContext, m: MembershipContext, groupId: string, id: string) {
    const v = await this.view(auth, m, groupId, id);
    const head: Cell[] = ['№', 'F.I.Sh.', ...v.columns.map(columnLabel), 'O‘rtacha'];
    const body: Cell[][] = v.students.map((s, i) => [
      i + 1,
      s.fullName,
      ...v.columns.map((c) => s.scores[c.id] ?? null),
      s.average,
    ]);
    const avgRow: Cell[] = ['', 'O‘rtacha', ...v.stats.columnAverages, v.stats.average];
    const stats: Cell[][] = [
      ['Ko‘rsatkich', 'Qiymat'],
      ['Guruh', v.group.name],
      ['Fan / jurnal', v.title],
      ['Talabalar', v.students.length],
      ['Darslar (ustunlar)', v.columns.length],
      ['To‘ldirilgan kataklar', `${v.stats.filledCells} / ${v.stats.totalCells}`],
      ['O‘rtacha ball', v.stats.average],
      [],
      ['Daraja (talaba o‘rtachasi bo‘yicha)', 'Talabalar'],
      ...GRADE_BANDS.map((b): Cell[] => [GRADE_BAND_LABEL[b], v.stats.bands[b]]),
      [],
      ['Manba', 'O‘qituvchi darsda qo‘ygan baholar (100 ballik shkala)'],
    ];
    await this.record(auth, m, 'gradebook.export', v.id);
    return {
      fileName: `jurnal-${v.group.name}-${v.title}.xlsx`.replace(/[\\/:*?"<>|]+/g, '-'),
      data: buildXlsx([
        {
          name: 'Jurnal',
          rows: [head, ...body, avgRow],
          headerRows: 1,
          boldRows: [body.length + 1],
          widths: [5, 34, ...v.columns.map(() => 14), 10],
        },
        { name: 'Statistika', rows: stats, headerRows: 1, widths: [36, 40] },
      ]),
    };
  }

  // ---- Student ------------------------------------------------------------------------

  async mine(auth: AuthContext, m: MembershipContext): Promise<MyGradebook[]> {
    const [membership] = await this.db
      .select({ groupId: groupStudents.groupId, groupName: groups.name })
      .from(groupStudents)
      .innerJoin(groups, eq(groups.id, groupStudents.groupId))
      .where(
        and(
          eq(groupStudents.userId, auth.userId),
          eq(groupStudents.organizationId, m.organizationId),
        ),
      );
    if (!membership) return [];
    const books = await this.db
      .select()
      .from(gradebooks)
      .where(eq(gradebooks.groupId, membership.groupId))
      .orderBy(asc(gradebooks.title));
    const out: MyGradebook[] = [];
    for (const b of books) {
      const columns = await this.columns(b.id);
      if (columns.length === 0) continue;
      const own = await this.scoresOf(columns, [{ userId: auth.userId, fullName: '' }]);
      const withScores = columns.map((c) => ({
        ...c,
        score: own.get(`${c.id}|${auth.userId}`) ?? null,
      }));
      const average = meanScore(withScores.map((c) => c.score));
      out.push({
        id: b.id,
        title: b.title,
        groupName: membership.groupName,
        columns: withScores,
        average,
        band: average === null ? null : gradeBand(average),
      });
    }
    return out;
  }

  // ---- Helpers --------------------------------------------------------------------------

  private async book(auth: AuthContext, m: MembershipContext, groupId: string, id: string) {
    const group = await this.monitoring.assertGroup(auth, m, groupId);
    const [book] = await this.db
      .select()
      .from(gradebooks)
      .where(
        and(
          eq(gradebooks.id, id),
          eq(gradebooks.groupId, group.id),
          eq(gradebooks.organizationId, m.organizationId),
        ),
      );
    if (!book) throw new NotFoundException(NOT_FOUND);
    return { book, group };
  }

  private async students(group: GroupRef): Promise<RosterStudent[]> {
    const r = await this.monitoring.roster(group);
    return r.students.map((s) => ({ userId: s.userId, fullName: s.fullName }));
  }

  private async columns(bookId: string, db: Db = this.db): Promise<GradebookColumn[]> {
    const rows = await db
      .select()
      .from(gradebookColumns)
      .where(eq(gradebookColumns.gradebookId, bookId))
      .orderBy(asc(gradebookColumns.position), asc(gradebookColumns.createdAt));
    return rows.map((c) => ({ id: c.id, title: c.title, date: c.heldOn, position: c.position }));
  }

  /** `${columnId}|${userId}` → score. */
  private async scoresOf(columns: GradebookColumn[], students: RosterStudent[]) {
    const map = new Map<string, number>();
    if (columns.length === 0 || students.length === 0) return map;
    const rows = await this.db
      .select()
      .from(gradebookScores)
      .where(
        and(
          inArray(
            gradebookScores.columnId,
            columns.map((c) => c.id),
          ),
          inArray(
            gradebookScores.userId,
            students.map((s) => s.userId),
          ),
        ),
      );
    for (const r of rows) map.set(`${r.columnId}|${r.userId}`, Math.round(r.score * 10) / 10);
    return map;
  }

  private async writeScores(
    tx: Db,
    actor: string,
    entries: { columnId: string; userId: string; score: number | null }[],
  ) {
    const now = new Date();
    for (let i = 0; i < entries.length; i += 500) {
      const chunk = entries.slice(i, i + 500);
      const set = chunk.filter((e) => e.score !== null);
      const clear = chunk.filter((e) => e.score === null);
      if (set.length)
        await tx
          .insert(gradebookScores)
          .values(set.map((e) => ({ ...e, score: e.score!, updatedBy: actor, updatedAt: now })))
          .onConflictDoUpdate({
            target: [gradebookScores.columnId, gradebookScores.userId],
            set: {
              score: sql`excluded.score`,
              updatedBy: sql`excluded.updated_by`,
              updatedAt: sql`excluded.updated_at`,
            },
          });
      for (const e of clear)
        await tx
          .delete(gradebookScores)
          .where(
            and(eq(gradebookScores.columnId, e.columnId), eq(gradebookScores.userId, e.userId)),
          );
    }
  }

  private async touch(db: Db, bookId: string) {
    await db.update(gradebooks).set({ updatedAt: new Date() }).where(eq(gradebooks.id, bookId));
  }

  private async summary(
    b: BookRow,
    group: GroupRef,
    roster: RosterStudent[],
  ): Promise<GradebookSummary> {
    const columns = await this.columns(b.id);
    const scores = await this.scoresOf(columns, roster);
    return {
      id: b.id,
      title: b.title,
      groupId: group.id,
      groupName: group.name,
      columns: columns.length,
      students: roster.length,
      average: meanScore([...scores.values()]),
      updatedAt: b.updatedAt.toISOString(),
    };
  }

  private exists() {
    return new ConflictException({
      message: 'Bu guruhda shu nomli jurnal bor',
      code: 'GRADEBOOK_EXISTS',
    });
  }

  private record(
    auth: AuthContext,
    m: MembershipContext,
    action: string,
    id: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.audit.record({
      action,
      actorUserId: auth.userId,
      organizationId: m.organizationId,
      targetType: 'gradebook',
      targetId: id,
      metadata,
    });
  }
}
