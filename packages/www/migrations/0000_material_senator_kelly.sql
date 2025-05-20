CREATE TABLE "eat_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"eat_id" integer NOT NULL,
	"option_id" integer NOT NULL,
	"option_name_snapshot" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eats" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment" text NOT NULL,
	"image_urls" text[],
	"product_id" integer,
	"product_name_snapshot" text NOT NULL,
	"createdBy" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "options" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "options_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer,
	"is_verified" boolean DEFAULT false NOT NULL,
	"user_id" uuid,
	"updated_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "eat_options" ADD CONSTRAINT "eat_options_eat_id_eats_id_fk" FOREIGN KEY ("eat_id") REFERENCES "public"."eats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eat_options" ADD CONSTRAINT "eat_options_option_id_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eats" ADD CONSTRAINT "eats_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eats" ADD CONSTRAINT "eats_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "options" ADD CONSTRAINT "options_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;