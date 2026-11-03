CREATE TABLE "participations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nickname" text,
	"consent" boolean NOT NULL,
	"status" text DEFAULT 'concluido' NOT NULL,
	"answers" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "participations_created_at_idx" ON "participations" ("created_at");