CREATE TABLE "course_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"lesson_id" uuid,
	"term" text NOT NULL,
	"term_key" text NOT NULL,
	"definition" text NOT NULL,
	"example" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "term_reviews" (
	"user_id" uuid NOT NULL,
	"term_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"ease" real NOT NULL,
	"interval_days" integer NOT NULL,
	"reps" integer NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"last_grade" text NOT NULL,
	"review_count" integer DEFAULT 1 NOT NULL,
	"reviewed_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "term_reviews_user_id_term_id_pk" PRIMARY KEY("user_id","term_id"),
	CONSTRAINT "term_reviews_grade" CHECK ("term_reviews"."last_grade" in ('AGAIN', 'HARD', 'GOOD', 'EASY')),
	CONSTRAINT "term_reviews_interval" CHECK ("term_reviews"."interval_days" >= 0)
);
--> statement-breakpoint
ALTER TABLE "course_terms" ADD CONSTRAINT "course_terms_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_terms" ADD CONSTRAINT "course_terms_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_reviews" ADD CONSTRAINT "term_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_reviews" ADD CONSTRAINT "term_reviews_term_id_course_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."course_terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_reviews" ADD CONSTRAINT "term_reviews_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "course_terms_key_uq" ON "course_terms" USING btree ("course_id","term_key");--> statement-breakpoint
CREATE INDEX "course_terms_lesson_idx" ON "course_terms" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "term_reviews_due_idx" ON "term_reviews" USING btree ("user_id","course_id","due_at");--> statement-breakpoint
CREATE INDEX "term_reviews_term_idx" ON "term_reviews" USING btree ("term_id");--> statement-breakpoint
CREATE INDEX "term_reviews_course_idx" ON "term_reviews" USING btree ("course_id");