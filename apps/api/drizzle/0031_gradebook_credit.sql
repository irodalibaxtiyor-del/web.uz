ALTER TABLE "gradebook_columns" ADD COLUMN "max_score" real DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "gradebook_columns" ADD COLUMN "control" text;--> statement-breakpoint
ALTER TABLE "gradebooks" ADD COLUMN "scheme" text DEFAULT 'LESSONS' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "gradebook_columns_control_idx" ON "gradebook_columns" USING btree ("gradebook_id","control") WHERE "gradebook_columns"."control" is not null;--> statement-breakpoint
ALTER TABLE "gradebook_columns" ADD CONSTRAINT "gradebook_columns_max" CHECK ("gradebook_columns"."max_score" > 0 and "gradebook_columns"."max_score" <= 100);--> statement-breakpoint
ALTER TABLE "gradebook_columns" ADD CONSTRAINT "gradebook_columns_control" CHECK ("gradebook_columns"."control" is null or "gradebook_columns"."control" in ('JN1', 'JN2', 'ON1', 'ON2', 'YN'));--> statement-breakpoint
ALTER TABLE "gradebooks" ADD CONSTRAINT "gradebooks_scheme" CHECK ("gradebooks"."scheme" in ('LESSONS', 'CREDIT'));