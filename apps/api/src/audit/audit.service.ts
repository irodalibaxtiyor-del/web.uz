import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.module';
import { auditEvents } from '../db/schema';

export interface AuditEntry {
  action: string;
  actorUserId?: string | null;
  organizationId?: string | null;
  targetType?: string;
  targetId?: string;
  /** Must never contain passwords, tokens, or other secrets. */
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(private readonly dbs: DbService) {}

  async record(entry: AuditEntry): Promise<void> {
    await this.dbs.db.insert(auditEvents).values({
      action: entry.action,
      actorUserId: entry.actorUserId ?? null,
      organizationId: entry.organizationId ?? null,
      targetType: entry.targetType,
      targetId: entry.targetId,
      metadata: entry.metadata,
    });
  }
}
