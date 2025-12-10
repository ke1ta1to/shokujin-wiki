import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

app.get("/", (c) => {
  const reviews = [
    { id: 1, comment: "hello" },
    { id: 2, comment: "world" },
  ];
  return c.json(reviews);
});

const createReviewSchema = z.object({
  comment: z.string().min(1).nullable(),
});

app.post("/", zValidator("json", createReviewSchema), (c) => {
  const data = c.req.valid("json");
  return c.json({ id: 3, comment: data.comment }, 201);
});

export default app;
