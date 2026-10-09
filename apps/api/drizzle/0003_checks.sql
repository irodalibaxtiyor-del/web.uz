CREATE TYPE "public"."check_run_status" AS ENUM('QUEUED', 'RUNNING', 'PASSED', 'FAILED', 'ERROR', 'TIMEOUT');--> statement-breakpoint
CREATE TABLE "check_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"status" "check_run_status" DEFAULT 'QUEUED' NOT NULL,
	"error_code" text,
	"files" jsonb NOT NULL,
	"rules" jsonb NOT NULL,
	"results" jsonb,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "checks" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "check_runs" ADD CONSTRAINT "check_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_runs" ADD CONSTRAINT "check_runs_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_runs" ADD CONSTRAINT "check_runs_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "check_runs_user_exercise_idx" ON "check_runs" USING btree ("user_id","exercise_id","created_at");--> statement-breakpoint
CREATE INDEX "check_runs_user_created_idx" ON "check_runs" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "check_runs_status_idx" ON "check_runs" USING btree ("status");