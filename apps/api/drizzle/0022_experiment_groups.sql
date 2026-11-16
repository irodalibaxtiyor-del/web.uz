CREATE TABLE "course_experiment_groups" (
	"course_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"role" text NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_experiment_groups_course_id_group_id_pk" PRIMARY KEY("course_id","group_id"),
	CONSTRAINT "course_experiment_groups_role" CHECK ("course_experiment_groups"."role" in ('EXPERIMENT', 'CONTROL'))
);
--> statement-breakpoint
ALTER TABLE "course_experiment_groups" ADD CONSTRAINT "course_experiment_groups_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_experiment_groups" ADD CONSTRAINT "course_experiment_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_experiment_groups" ADD CONSTRAINT "course_experiment_groups_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "course_experiment_groups_group_idx" ON "course_experiment_groups" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "course_experiment_groups_updated_by_idx" ON "course_experiment_groups" USING btree ("updated_by");