import { zValidator } from "@hono/zod-validator";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { z } from "zod";

import { reviewsTable } from "../db/schema.js";

export interface Variables {
  db: NodePgDatabase;
}

const app = new Hono<{ Variables: Variables }>();

app.get("/", async (c) => {
  const db = c.get("db");
  const reviews = await db.select().from(reviewsTable);
  return c.json(reviews);
});

const createReviewSchema = z.object({
  comment: z.string().min(1).nullable(),
});

app.post("/", zValidator("json", createReviewSchema), async (c) => {
  const db = c.get("db");
  const data = c.req.valid("json");

  const insertedReview = (
    await db.insert(reviewsTable).values({ comment: data.comment }).returning()
  )[0];
  return c.json(insertedReview, 201);
});

export default app;
