import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono()
  .basePath("/api")

  .get("/hello", (c) => {
    return c.json({
      message: "Hello from Hono!",
    });
  });

export const GET = handle(app);

export type AppType = typeof app;
