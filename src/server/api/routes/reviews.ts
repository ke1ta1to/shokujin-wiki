import { zValidator } from "@hono/zod-validator";
import { count, eq } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { Hono } from "hono";
import z from "zod";

import { reviewsTable } from "@/server/db/schema";

export function createReviewsRoute(db: LibSQLDatabase) {
  const app = new Hono();

  // POST /reviews

  const createReviewSchema = z.object({
    comment: z.string().min(1).nullable(),
  });

  app.post("/", zValidator("json", createReviewSchema), async (c) => {
    const { comment } = c.req.valid("json");
    const reviews = await db
      .insert(reviewsTable)
      .values({ comment })
      .returning();
    return c.json(reviews[0], 201);
  });

  // GET /reviews

  app.get("/", async (c) => {
    const reviews = await db.select().from(reviewsTable);
    const total = await db.select({ count: count() }).from(reviewsTable);
    return c.json(
      {
        reviews,
        total: total[0].count,
      },
      200,
    );
  });

  // GET /reviews/:id

  const getReviewParamSchema = z.object({
    id: z.coerce.number().int(),
  });

  app.get("/:id", zValidator("param", getReviewParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.id, id))
      .limit(1);
    if (reviews.length === 0) {
      return c.json({ message: "Review not found" }, 404);
    }
    return c.json(reviews[0], 200);
  });

  // PATCH /reviews/:id

  const updateReviewJsonSchema = z.object({
    comment: z.string().min(1).nullable(),
  });

  const updateReviewParamSchema = z.object({
    id: z.coerce.number().int(),
  });

  app.patch(
    "/:id",
    zValidator("param", updateReviewParamSchema),
    zValidator("json", updateReviewJsonSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { comment } = c.req.valid("json");
      const reviews = await db
        .update(reviewsTable)
        .set({ comment })
        .where(eq(reviewsTable.id, id))
        .returning();
      if (reviews.length === 0) {
        return c.json({ message: "Review not found" }, 404);
      }
      return c.json(reviews[0], 200);
    },
  );

  // DELETE /reviews/:id

  const deleteReviewParamSchema = z.object({
    id: z.coerce.number().int(),
  });

  app.delete(
    "/:id",
    zValidator("param", deleteReviewParamSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const deletedReview = await db
        .delete(reviewsTable)
        .where(eq(reviewsTable.id, id))
        .returning();
      if (deletedReview.length === 0) {
        return c.json({ message: "Review not found" }, 404);
      }
      return c.body(null, 204);
    },
  );

  return app;
}
