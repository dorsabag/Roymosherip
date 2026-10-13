CREATE TYPE "public"."memory_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "memories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"relationship" varchar(100) NOT NULL,
	"email" varchar(254),
	"prompt_key" varchar(30) NOT NULL,
	"memory_text" text NOT NULL,
	"consent" boolean NOT NULL,
	"status" "memory_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp (6) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "memories_status_created_idx" ON "memories" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "admin_sessions_expire_idx" ON "admin_sessions" USING btree ("expire");