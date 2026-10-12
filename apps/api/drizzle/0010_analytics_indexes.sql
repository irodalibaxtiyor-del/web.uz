CREATE INDEX "check_runs_course_status_idx" ON "check_runs" USING btree ("course_id","status","created_at");--> statement-breakpoint
CREATE INDEX "lesson_progress_course_idx" ON "lesson_progress" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_course_idx" ON "quiz_attempts" USING btree ("course_id","created_at");--> statement-breakpoint
CREATE INDEX "student_exercises_course_idx" ON "student_exercises" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "submission_reviews_reviewer_idx" ON "submission_reviews" USING btree ("reviewer_id","created_at");--> statement-breakpoint
CREATE INDEX "submission_versions_assignment_idx" ON "submission_versions" USING btree ("assignment_id","submitted_at");--> statement-breakpoint
CREATE INDEX "submissions_course_status_idx" ON "submissions" USING btree ("course_id","status");