CREATE TABLE "chat_contact_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"contact" text NOT NULL,
	"message" text NOT NULL,
	"page" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"resolved_by" uuid
);
--> statement-breakpoint
ALTER TABLE "chat_contact_requests" ADD CONSTRAINT "chat_contact_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_contact_requests" ADD CONSTRAINT "chat_contact_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_contact_requests" ADD CONSTRAINT "chat_contact_requests_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_contact_org_idx" ON "chat_contact_requests" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "chat_contact_user_idx" ON "chat_contact_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_contact_resolved_by_idx" ON "chat_contact_requests" USING btree ("resolved_by");