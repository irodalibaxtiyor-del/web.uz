ALTER TABLE "ai_handoffs" ADD COLUMN "resolved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_handoffs" ADD COLUMN "resolved_by" uuid;--> statement-breakpoint
ALTER TABLE "ai_handoffs" ADD CONSTRAINT "ai_handoffs_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_handoffs_resolved_by_idx" ON "ai_handoffs" USING btree ("resolved_by");