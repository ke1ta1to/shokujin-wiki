import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { logger } from "hono/logger";

import reviews from "./routes/reviews.js";

const app = new Hono().basePath("/api");

app.use(logger());

app.use("/redoc-static", serveStatic({ path: "./openapi/redoc-static.html" }));
app.use("/swagger-ui", serveStatic({ path: "./openapi/swagger-ui.html" }));
app.use("/openapi.yaml", serveStatic({ path: "./openapi/openapi.yaml" }));

app.route("/reviews", reviews);

export default app;
