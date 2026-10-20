CREATE TABLE "course_slug_redirects" (
	"organization_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"course_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_slug_redirects_organization_id_slug_pk" PRIMARY KEY("organization_id","slug")
);
--> statement-breakpoint
ALTER TABLE "course_slug_redirects" ADD CONSTRAINT "course_slug_redirects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_slug_redirects" ADD CONSTRAINT "course_slug_redirects_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "course_slug_redirects_course_idx" ON "course_slug_redirects" USING btree ("course_id");