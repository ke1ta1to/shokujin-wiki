import { PGlite } from "@electric-sql/pglite";
import "dotenv/config";
import { eq } from "drizzle-orm";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { reset } from "drizzle-seed";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";

import * as schema from "../src/db/schema.js";
import { createApp } from "../src/index.js";
import type { AppType } from "../src/index.js";

let app: AppType;
let client: PGlite;
let testDb: PgliteDatabase<typeof schema>;

beforeAll(async () => {
  client = new PGlite();
  testDb = drizzle(client, { schema });
  await migrate(testDb, { migrationsFolder: "drizzle" });
  app = createApp({ db: testDb });
});

beforeEach(async () => {
  await reset(testDb, schema);
});

afterAll(async () => {
  await client.close();
});

describe("GET /api/reviews", () => {
  test("should return a list of reviews", async () => {
    await testDb
      .insert(schema.reviewsTable)
      .values([
        { comment: "comment test 1" },
        { comment: "comment test 2" },
        { comment: "comment test 3" },
      ]);

    const res = await app.request("/api/reviews");
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual([
      { id: 1, comment: "comment test 1" },
      { id: 2, comment: "comment test 2" },
      { id: 3, comment: "comment test 3" },
    ]);
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
    const insertedReview = await testDb
      .select()
      .from(schema.reviewsTable)
      .where(eq(schema.reviewsTable.id, json.id));
    expect(insertedReview).toEqual([
      {
        id: json.id,
        comment: "Hello, this is a test review.",
      },
    ]);
  });
});
