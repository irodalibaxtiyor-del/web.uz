CREATE TYPE "public"."difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
CREATE TYPE "public"."exercise_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'PASSED', 'NEEDS_IMPROVEMENT');--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"instructions" text DEFAULT '' NOT NULL,
	"expected_behavior" text DEFAULT '' NOT NULL,
	"starter_files" jsonb NOT NULL,
	"difficulty" "difficulty" DEFAULT 'EASY' NOT NULL,
	"position" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exercises_position_nonneg" CHECK ("exercises"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "student_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"status" "exercise_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"files" jsonb NOT NULL,
	"teacher_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"passed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_exercises" ADD CONSTRAINT "student_exercises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_exercises" ADD CONSTRAINT "student_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_exercises" ADD CONSTRAINT "student_exercises_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_exercises" ADD CONSTRAINT "student_exercises_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "exercises_lesson_pos_idx" ON "exercises" USING btree ("lesson_id","position");--> statement-breakpoint
CREATE INDEX "exercises_course_idx" ON "exercises" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_exercises_user_exercise_idx" ON "student_exercises" USING btree ("user_id","exercise_id");--> statement-breakpoint
CREATE INDEX "student_exercises_exercise_idx" ON "student_exercises" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX "student_exercises_user_lesson_idx" ON "student_exercises" USING btree ("user_id","lesson_id");