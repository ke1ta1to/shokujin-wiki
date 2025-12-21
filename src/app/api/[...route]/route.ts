import { zValidator } from "@hono/zod-validator";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";
import postgres from "postgres";
import z from "zod";

import { reviewsTable } from "@/db/schema";
import { supabaseAuth } from "@/supabase.middleware";

declare module "hono" {
  interface ContextVariableMap {
    db: ReturnType<typeof drizzle>;
    supabase: SupabaseClient;
    supabaseUser: User;
  }
}

const helloSchema = z.object({
  name: z.string().min(1).max(100),
});

export const createReviewSchema = z.object({
  content: z.string().min(1).max(500).nullable(),
});

const app = new Hono()
  .basePath("/api")
  .use(async (c, next) => {
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
    const client = postgres(DATABASE_URL, {
      prepare: false,
    });
    const db = drizzle({ client });
    c.set("db", db);
    await next();
  })
  .use(async (c, next) => {
    const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env<{
      NEXT_PUBLIC_SUPABASE_URL: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
    }>(c);
    const supabase = createClient(
      NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    );
    c.set("supabase", supabase);
    await next();
  })
  .get("/auth/me", supabaseAuth, (c) => {
    const user = c.get("supabaseUser");
    return c.json({ user }, 200);
  })
  .get("/hello", zValidator("query", helloSchema), (c) => {
    const { name } = c.req.valid("query");
    return c.json({ message: `Hello, ${name}!` });
  })
  .get("/reviews", async (c) => {
    const db = c.get("db");
    const reviews = await db.select().from(reviewsTable);
    return c.json({ reviews });
  })
  .post("/reviews", zValidator("json", createReviewSchema), async (c) => {
    const db = c.get("db");
    const { content } = c.req.valid("json");
    const result = await db
      .insert(reviewsTable)
      .values({ content })
      .returning();
    return c.json({ review: result[0] });
  });

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
