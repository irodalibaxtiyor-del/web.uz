CREATE TYPE "public"."portfolio_item_kind" AS ENUM('EXERCISE', 'ASSIGNMENT');--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "portfolio_item_kind" NOT NULL,
	"source_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"course_title" text NOT NULL,
	"files" jsonb NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_items_position_nonneg" CHECK ("portfolio_items"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"slug" text,
	"display_name" text NOT NULL,
	"headline" text DEFAULT '' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolios_published_has_slug" CHECK (not "portfolios"."is_published" or "portfolios"."slug" is not null)
);
--> statement-breakpoint
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_user_id_portfolios_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."portfolios"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_items_user_source_idx" ON "portfolio_items" USING btree ("user_id","kind","source_id");--> statement-breakpoint
CREATE INDEX "portfolio_items_user_pos_idx" ON "portfolio_items" USING btree ("user_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "portfolios_slug_idx" ON "portfolios" USING btree ("slug");