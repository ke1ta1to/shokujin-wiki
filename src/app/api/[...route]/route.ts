import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import z from "zod";

const helloSchema = z.object({
  name: z.string().min(1).max(100),
});

const app = new Hono()
  .basePath("/api")
  .get("/hello", zValidator("query", helloSchema), (c) => {
    const { name } = c.req.valid("query");
    return c.json({
      message: `Hello, ${name}!`,
    });
  });

export const GET = handle(app);

export type AppType = typeof app;
