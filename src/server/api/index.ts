import "server-only";

import { Hono } from "hono";

import db from "../db";

import { createReviewsRoute } from "./routes/reviews";

export const app = new Hono().basePath("/api");

app.route("/reviews", createReviewsRoute(db));
