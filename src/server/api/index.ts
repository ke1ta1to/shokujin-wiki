import "server-only";

import { Hono } from "hono";

import reviews from "./routes/reviews";

export const app = new Hono().basePath("/api");

app.route("/reviews", reviews);
