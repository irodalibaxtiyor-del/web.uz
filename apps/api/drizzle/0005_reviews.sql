CREATE TYPE "public"."review_action" AS ENUM('REVISION_REQUESTED', 'GRADED', 'FINALIZED');--> statement-breakpoint
CREATE TABLE "submission_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"version_id" uuid NOT NULL,
	"reviewer_id" uuid,
	"action" "review_action" NOT NULL,
	"feedback" text DEFAULT '' NOT NULL,
	"score" integer,
	"scores" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "score" integer;--> statement-breakpoint
ALTER TABLE "submission_reviews" ADD CONSTRAINT "submission_reviews_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_reviews" ADD CONSTRAINT "submission_reviews_version_id_submission_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."submission_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_reviews" ADD CONSTRAINT "submission_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "submission_reviews_submission_idx" ON "submission_reviews" USING btree ("submission_id","created_at");--> statement-breakpoint
CREATE FUNCTION "submission_reviews_immutable"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- The only permitted change: ON DELETE SET NULL when the reviewer account is removed.
  IF OLD.reviewer_id IS NOT NULL AND NEW.reviewer_id IS NULL
     AND (NEW.id, NEW.submission_id, NEW.version_id, NEW.action, NEW.feedback, NEW.score, NEW.scores, NEW.created_at)
         IS NOT DISTINCT FROM
         (OLD.id, OLD.submission_id, OLD.version_id, OLD.action, OLD.feedback, OLD.score, OLD.scores, OLD.created_at)
  THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'submission_reviews rows are immutable';
END;
$$;--> statement-breakpoint
CREATE TRIGGER "submission_reviews_no_update" BEFORE UPDATE ON "submission_reviews" FOR EACH ROW EXECUTE FUNCTION "submission_reviews_immutable"();
