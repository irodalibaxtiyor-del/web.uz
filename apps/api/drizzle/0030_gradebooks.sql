CREATE TABLE "gradebook_columns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gradebook_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"held_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gradebook_columns_label" CHECK ("gradebook_columns"."title" <> '' or "gradebook_columns"."held_on" is not null)
);
--> statement-breakpoint
CREATE TABLE "gradebook_scores" (
	"column_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"score" real NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gradebook_scores_column_id_user_id_pk" PRIMARY KEY("column_id","user_id"),
	CONSTRAINT "gradebook_scores_range" CHECK ("gradebook_scores"."score" >= 0 and "gradebook_scores"."score" <= 100)
);
--> statement-breakpoint
CREATE TABLE "gradebooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"title" text NOT NULL,
	"title_key" text NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gradebook_columns" ADD CONSTRAINT "gradebook_columns_gradebook_id_gradebooks_id_fk" FOREIGN KEY ("gradebook_id") REFERENCES "public"."gradebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gradebook_scores" ADD CONSTRAINT "gradebook_scores_column_id_gradebook_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."gradebook_columns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gradebook_scores" ADD CONSTRAINT "gradebook_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gradebook_scores" ADD CONSTRAINT "gradebook_scores_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gradebooks" ADD CONSTRAINT "gradebooks_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gradebooks" ADD CONSTRAINT "gradebooks_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gradebooks" ADD CONSTRAINT "gradebooks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gradebook_columns_book_idx" ON "gradebook_columns" USING btree ("gradebook_id","position");--> statement-breakpoint
CREATE INDEX "gradebook_scores_user_idx" ON "gradebook_scores" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "gradebook_scores_updated_by_idx" ON "gradebook_scores" USING btree ("updated_by");--> statement-breakpoint
CREATE UNIQUE INDEX "gradebooks_group_title_idx" ON "gradebooks" USING btree ("group_id","title_key");--> statement-breakpoint
CREATE INDEX "gradebooks_org_idx" ON "gradebooks" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "gradebooks_created_by_idx" ON "gradebooks" USING btree ("created_by");