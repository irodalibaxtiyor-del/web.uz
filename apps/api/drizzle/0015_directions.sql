CREATE TABLE "course_directions" (
	"course_id" uuid NOT NULL,
	"direction_id" uuid NOT NULL,
	CONSTRAINT "course_directions_course_id_direction_id_pk" PRIMARY KEY("course_id","direction_id")
);
--> statement-breakpoint
CREATE TABLE "directions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 1000 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "directions_position_nonneg" CHECK ("directions"."position" >= 0)
);
--> statement-breakpoint
ALTER TABLE "course_directions" ADD CONSTRAINT "course_directions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_directions" ADD CONSTRAINT "course_directions_direction_id_directions_id_fk" FOREIGN KEY ("direction_id") REFERENCES "public"."directions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "course_directions_direction_idx" ON "course_directions" USING btree ("direction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "directions_slug_idx" ON "directions" USING btree ("slug");