import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

app.get("/", (c) => {
  const reviews = [{ name: "hello" }, { name: "world" }];
  return c.json(reviews);
});

const createReviewSchema = z.object({
  name: z.string().min(1),
});

app.post("/", zValidator("json", createReviewSchema), (c) => {
  const data = c.req.valid("json");
  return c.json({ message: `Review for ${data.name} created successfully.` });
});

export default app;
