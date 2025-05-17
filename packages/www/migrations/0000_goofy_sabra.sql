CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"author_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;