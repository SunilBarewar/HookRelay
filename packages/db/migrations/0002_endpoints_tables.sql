CREATE TYPE "public"."endpoint_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TABLE "endpoint_subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "endpoints" (
	"id" uuid PRIMARY KEY NOT NULL,
	"application_id" uuid NOT NULL,
	"url" text NOT NULL,
	"status" "endpoint_status" DEFAULT 'active' NOT NULL,
	"signing_secret" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "endpoint_subscriptions" ADD CONSTRAINT "endpoint_subscriptions_endpoint_id_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "endpoint_subscriptions_endpoint_event_idx" ON "endpoint_subscriptions" USING btree ("endpoint_id","event_type");--> statement-breakpoint
CREATE INDEX "endpoints_application_id_idx" ON "endpoints" USING btree ("application_id");