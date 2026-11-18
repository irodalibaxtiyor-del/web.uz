ALTER TABLE "quizzes" ADD COLUMN "exercise_id" uuid;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quizzes_exercise_idx" ON "quizzes" USING btree ("exercise_id");