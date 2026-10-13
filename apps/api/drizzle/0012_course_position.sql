ALTER TABLE "courses" ADD COLUMN "position" integer DEFAULT 1000 NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_position_nonneg" CHECK ("courses"."position" >= 0);