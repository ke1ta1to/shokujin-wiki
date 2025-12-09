import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

import reviews from "./reviews.js";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/reviews", reviews);

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
