CREATE TYPE "public"."assignment_status" AS ENUM('DRAFT', 'PUBLISHED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'REVISION_REQUESTED', 'GRADED', 'FINALIZED');--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"title" text NOT NULL,
	"instructions" text DEFAULT '' NOT NULL,
	"requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"starter_files" jsonb NOT NULL,
	"rubric" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"grading_policy" jsonb NOT NULL,
	"deadline" timestamp with time zone,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"checks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"position" integer NOT NULL,
	"status" "assignment_status" DEFAULT 'DRAFT' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	CONSTRAINT "assignments_position_nonneg" CHECK ("assignments"."position" >= 0),
	CONSTRAINT "assignments_attempts_range" CHECK ("assignments"."max_attempts" between 1 and 20)
);
--> statement-breakpoint
CREATE TABLE "submission_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version_id" uuid NOT NULL,
	"status" "check_run_status" DEFAULT 'QUEUED' NOT NULL,
	"error_code" text,
	"rules" jsonb NOT NULL,
	"results" jsonb,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "submission_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"assignment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"files" jsonb NOT NULL,
	"is_late" boolean DEFAULT false NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submission_versions_version_pos" CHECK ("submission_versions"."version" >= 1)
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"status" "submission_status" DEFAULT 'DRAFT' NOT NULL,
	"files" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_submitted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_checks" ADD CONSTRAINT "submission_checks_version_id_submission_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."submission_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_versions" ADD CONSTRAINT "submission_versions_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_versions" ADD CONSTRAINT "submission_versions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_versions" ADD CONSTRAINT "submission_versions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assignments_lesson_pos_idx" ON "assignments" USING btree ("lesson_id","position");--> statement-breakpoint
CREATE INDEX "assignments_course_idx" ON "assignments" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "submission_checks_version_idx" ON "submission_checks" USING btree ("version_id");--> statement-breakpoint
CREATE INDEX "submission_checks_status_idx" ON "submission_checks" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "submission_versions_submission_version_idx" ON "submission_versions" USING btree ("submission_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "submissions_assignment_user_idx" ON "submissions" USING btree ("assignment_id","user_id");--> statement-breakpoint
CREATE INDEX "submissions_user_idx" ON "submissions" USING btree ("user_id");--> statement-breakpoint
CREATE FUNCTION "submission_versions_immutable"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'submission_versions rows are immutable';
END;
$$;--> statement-breakpoint
CREATE TRIGGER "submission_versions_no_update" BEFORE UPDATE ON "submission_versions" FOR EACH ROW EXECUTE FUNCTION "submission_versions_immutable"();
