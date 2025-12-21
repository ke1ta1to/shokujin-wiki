import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

const app = new Hono();

// POST /reviews

const createReviewSchema = z.object({
  comment: z.string().min(1).nullable(),
});

app.post("/", zValidator("json", createReviewSchema), async (c) => {
  const { comment } = c.req.valid("json");
  return c.json(
    { message: "Review created successfully", review: { comment } },
    201,
  );
});

// GET /reviews

app.get("/", (c) => {
  return c.json({ message: "Hello from the Reviews route!" });
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
    return c.json(
      { message: `Review ${id} updated successfully`, review: { comment } },
      200,
    );
  },
);

// DELETE /reviews/:id

const deleteReviewParamSchema = z.object({
  id: z.coerce.number().int(),
});

app.delete("/:id", zValidator("param", deleteReviewParamSchema), async (c) => {
  const { id } = c.req.valid("param");
  return c.json({ message: `Review ${id} deleted successfully` }, 200);
});

export default app;
