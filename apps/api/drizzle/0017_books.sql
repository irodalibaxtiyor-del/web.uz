CREATE TYPE "public"."book_status" AS ENUM('PROCESSING', 'READY', 'FAILED');--> statement-breakpoint
CREATE TABLE "book_progress" (
	"user_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"page" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "book_progress_user_id_book_id_pk" PRIMARY KEY("user_id","book_id"),
	CONSTRAINT "book_progress_page_pos" CHECK ("book_progress"."page" >= 1)
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"title" text NOT NULL,
	"author" text DEFAULT '' NOT NULL,
	"year" integer,
	"description" text DEFAULT '' NOT NULL,
	"direction_id" uuid,
	"course_id" uuid,
	"status" "book_status" DEFAULT 'PROCESSING' NOT NULL,
	"error" text,
	"published" boolean DEFAULT false NOT NULL,
	"page_count" integer DEFAULT 0 NOT NULL,
	"page_width" integer DEFAULT 0 NOT NULL,
	"page_height" integer DEFAULT 0 NOT NULL,
	"toc" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"file_size" integer NOT NULL,
	"has_cover" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "books_page_count_nonneg" CHECK ("books"."page_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "book_progress" ADD CONSTRAINT "book_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_progress" ADD CONSTRAINT "book_progress_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_direction_id_directions_id_fk" FOREIGN KEY ("direction_id") REFERENCES "public"."directions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "book_progress_book_idx" ON "book_progress" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "books_org_idx" ON "books" USING btree ("organization_id","published");--> statement-breakpoint
CREATE INDEX "books_direction_idx" ON "books" USING btree ("direction_id");--> statement-breakpoint
CREATE INDEX "books_course_idx" ON "books" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "books_created_by_idx" ON "books" USING btree ("created_by");