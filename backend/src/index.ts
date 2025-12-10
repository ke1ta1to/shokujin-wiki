import { serveStatic } from "@hono/node-server/serve-static";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { logger } from "hono/logger";

import reviews from "./routes/reviews.js";

export interface Variables {
  db: NodePgDatabase;
}

const app = new Hono<{ Variables: Variables }>().basePath("/api");

app.use(logger());
app.use(async (c, next) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const db = drizzle(DATABASE_URL);
  c.set("db", db);
  await next();
});

app.use("/redoc-static", serveStatic({ path: "./openapi/redoc-static.html" }));
app.use("/swagger-ui", serveStatic({ path: "./openapi/swagger-ui.html" }));
app.use("/openapi.yaml", serveStatic({ path: "./openapi/openapi.yaml" }));

app.route("/reviews", reviews);

export default app;
