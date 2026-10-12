CREATE TYPE "public"."handoff_category" AS ENUM('STUCK', 'CONCEPT', 'BUG', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."tutor_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');--> statement-breakpoint
CREATE TYPE "public"."tutor_mode" AS ENUM('HINT', 'CODE_EXPLANATION', 'ERROR_EXPLANATION', 'COMPREHENSION_QUESTION', 'FLEXBOX_HELP', 'ASSIGNMENT_GUIDANCE', 'TEACHER_HANDOFF', 'OUT_OF_SCOPE');--> statement-breakpoint
CREATE TYPE "public"."tutor_target_kind" AS ENUM('EXERCISE', 'ASSIGNMENT');--> statement-breakpoint
CREATE TABLE "ai_feedback" (
	"interaction_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"helpful" boolean NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_handoffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"interaction_id" uuid,
	"target_kind" "tutor_target_kind" NOT NULL,
	"target_id" uuid NOT NULL,
	"category" "handoff_category" NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_hint_states" (
	"user_id" uuid NOT NULL,
	"target_kind" "tutor_target_kind" NOT NULL,
	"target_id" uuid NOT NULL,
	"hints_used" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_hint_states_user_id_target_kind_target_id_pk" PRIMARY KEY("user_id","target_kind","target_id"),
	CONSTRAINT "ai_hint_states_range" CHECK ("ai_hint_states"."hints_used" between 0 and 3)
);
--> statement-breakpoint
CREATE TABLE "ai_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"target_kind" "tutor_target_kind" NOT NULL,
	"target_id" uuid NOT NULL,
	"request_mode" "tutor_mode" NOT NULL,
	"mode" "tutor_mode" NOT NULL,
	"level" "tutor_level" NOT NULL,
	"hint_number" integer,
	"message" text DEFAULT '' NOT NULL,
	"reply" text NOT NULL,
	"comprehension_question" text,
	"refused" text,
	"blocked" boolean DEFAULT false NOT NULL,
	"guard_reasons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"provider" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"interaction_id" uuid,
	"provider" text NOT NULL,
	"model" text NOT NULL,
	"status" text NOT NULL,
	"prompt_chars" integer NOT NULL,
	"completion_chars" integer DEFAULT 0 NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"estimated_cost_micro_usd" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_feedback" ADD CONSTRAINT "ai_feedback_interaction_id_ai_interactions_id_fk" FOREIGN KEY ("interaction_id") REFERENCES "public"."ai_interactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_feedback" ADD CONSTRAINT "ai_feedback_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_handoffs" ADD CONSTRAINT "ai_handoffs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_handoffs" ADD CONSTRAINT "ai_handoffs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_handoffs" ADD CONSTRAINT "ai_handoffs_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_handoffs" ADD CONSTRAINT "ai_handoffs_interaction_id_ai_interactions_id_fk" FOREIGN KEY ("interaction_id") REFERENCES "public"."ai_interactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_hint_states" ADD CONSTRAINT "ai_hint_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_interactions" ADD CONSTRAINT "ai_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_interactions" ADD CONSTRAINT "ai_interactions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_interactions" ADD CONSTRAINT "ai_interactions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_interaction_id_ai_interactions_id_fk" FOREIGN KEY ("interaction_id") REFERENCES "public"."ai_interactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_handoffs_course_idx" ON "ai_handoffs" USING btree ("course_id","created_at");--> statement-breakpoint
CREATE INDEX "ai_interactions_user_target_idx" ON "ai_interactions" USING btree ("user_id","target_kind","target_id","created_at");--> statement-breakpoint
CREATE INDEX "ai_interactions_course_idx" ON "ai_interactions" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "ai_usage_user_created_idx" ON "ai_usage" USING btree ("user_id","created_at");