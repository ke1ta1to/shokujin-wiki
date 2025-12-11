import { serveStatic } from "@hono/node-server/serve-static";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgDatabase } from "drizzle-orm/pg-core";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { logger } from "hono/logger";

import * as schema from "../src/db/schema.js";

import reviews from "./routes/reviews.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDb = PgDatabase<any, typeof schema, any>;

export interface Variables {
  db: AppDb;
}

export function createApp({
  db: defaultDb,
}: {
  db?: AppDb;
} = {}) {
  const app = new Hono<{ Variables: Variables }>().basePath("/api");

  app.use(logger());
  app.use(async (c, next) => {
    if (defaultDb) {
      c.set("db", defaultDb);
      await next();
      return;
    }
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
    const db = drizzle(DATABASE_URL, { schema });
    c.set("db", db);
    await next();
  });

  app.use(
    "/redoc-static",
    serveStatic({ path: "./openapi/redoc-static.html" }),
  );
  app.use("/swagger-ui", serveStatic({ path: "./openapi/swagger-ui.html" }));
  app.use("/openapi.yaml", serveStatic({ path: "./openapi/openapi.yaml" }));

  app.route("/reviews", reviews);
  return app;
}

export type AppType = ReturnType<typeof createApp>;
