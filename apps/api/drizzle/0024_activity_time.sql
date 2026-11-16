CREATE TABLE "activity_last_ping" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_time" (
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"target_id" uuid NOT NULL,
	"day" date NOT NULL,
	"seconds" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "activity_time_user_id_target_id_day_pk" PRIMARY KEY("user_id","target_id","day"),
	CONSTRAINT "activity_time_kind" CHECK ("activity_time"."kind" in ('LESSON', 'EXERCISE', 'QUIZ', 'ASSIGNMENT')),
	CONSTRAINT "activity_time_seconds" CHECK ("activity_time"."seconds" >= 0)
);
--> statement-breakpoint
ALTER TABLE "activity_last_ping" ADD CONSTRAINT "activity_last_ping_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_time" ADD CONSTRAINT "activity_time_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_time" ADD CONSTRAINT "activity_time_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_time_course_idx" ON "activity_time" USING btree ("course_id","user_id");