import { describe, expect, test } from "vitest";

import app from "../src/index.js";

describe("GET /api/reviews", () => {
  test("should return a list of reviews", async () => {
    const res = await app.request("/api/reviews");
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
  });
});

describe("POST /api/reviews", () => {
  test("should create a new review", async () => {
    const newReview = {
      comment: "Hello, this is a test review.",
    };
    const res = await app.request("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    });
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json).toHaveProperty("id");
    expect(json.comment).toBe("Hello, this is a test review.");
  });
});
