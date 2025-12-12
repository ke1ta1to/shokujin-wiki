import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/postgres-js";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import postgres from "postgres";
import z from "zod";

import { reviewsTable } from "@/db/schema";

const helloSchema = z.object({
  name: z.string().min(1).max(100),
});

export const createReviewSchema = z.object({
  content: z.string().min(1).max(500).nullable(),
});

export interface Variables {
  db: ReturnType<typeof drizzle>;
}

const app = new Hono<{ Variables: Variables }>()
  .basePath("/api")
  .use(async (c, next) => {
    const client = postgres(process.env.DATABASE_URL as string, {
      prepare: false,
    });
    const db = drizzle({ client });
    c.set("db", db);
    await next();
  })
  .get("/hello", zValidator("query", helloSchema), (c) => {
    const { name } = c.req.valid("query");
    return c.json({
      message: `Hello, ${name}!`,
    });
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
