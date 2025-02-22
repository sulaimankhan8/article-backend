CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"genera_id" integer,
	"fetched_at" text DEFAULT '2025-02-21T19:44:05.894Z'
);
--> statement-breakpoint
CREATE TABLE "genera" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "genera_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_genera" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"genera_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_genera_id_genera_id_fk" FOREIGN KEY ("genera_id") REFERENCES "public"."genera"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_genera" ADD CONSTRAINT "user_genera_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_genera" ADD CONSTRAINT "user_genera_genera_id_genera_id_fk" FOREIGN KEY ("genera_id") REFERENCES "public"."genera"("id") ON DELETE no action ON UPDATE no action;