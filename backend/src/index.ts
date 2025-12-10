import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { logger } from "hono/logger";

import reviews from "./routes/reviews.js";

const app = new Hono();

app.use(logger());

app.use("/redoc-static", serveStatic({ path: "./openapi/redoc-static.html" }));
app.use("/swagger-ui", serveStatic({ path: "./openapi/swagger-ui.html" }));
app.use("/openapi.yaml", serveStatic({ path: "./openapi/openapi.yaml" }));

app.route("/reviews", reviews);

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
