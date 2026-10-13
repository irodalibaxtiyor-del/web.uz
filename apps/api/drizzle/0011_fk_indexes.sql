CREATE INDEX "ai_feedback_user_idx" ON "ai_feedback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_handoffs_user_idx" ON "ai_handoffs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_handoffs_org_idx" ON "ai_handoffs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_handoffs_interaction_idx" ON "ai_handoffs" USING btree ("interaction_id");--> statement-breakpoint
CREATE INDEX "ai_interactions_org_idx" ON "ai_interactions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_usage_org_idx" ON "ai_usage" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "ai_usage_interaction_idx" ON "ai_usage" USING btree ("interaction_id");--> statement-breakpoint
CREATE INDEX "assignments_created_by_idx" ON "assignments" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "check_runs_exercise_idx" ON "check_runs" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX "courses_created_by_idx" ON "courses" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "lesson_progress_lesson_idx" ON "lesson_progress" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "student_exercises_lesson_idx" ON "student_exercises" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "submission_reviews_version_idx" ON "submission_reviews" USING btree ("version_id");--> statement-breakpoint
CREATE INDEX "submission_versions_user_idx" ON "submission_versions" USING btree ("user_id");