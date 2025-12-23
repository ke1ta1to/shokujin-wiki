import { eq } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { beforeEach, describe, expect, it } from "vitest";

import { createReviewsRoute } from "@/server/api/routes/reviews";
import { reviewsTable } from "@/server/db/schema";

let db: LibSQLDatabase;
let app: ReturnType<typeof createReviewsRoute>;

beforeEach(async () => {
  db = drizzle(":memory:");
  await migrate(db, { migrationsFolder: "drizzle" });
  app = createReviewsRoute(db);
});

describe("POST /reviews", async () => {
  it("コメント付きで新しくレビューを登録できる", async () => {
    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment: "This is a test review.",
      }),
    });
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data).toEqual({
      id: 1,
      comment: "This is a test review.",
    });

    const createdReview = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.id, data.id));
    expect(createdReview[0]).toEqual({
      id: 1,
      comment: "This is a test review.",
    });
  });

  it("コメントなしで新しくレビューを登録できる", async () => {
    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment: null,
      }),
    });
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data).toEqual({
      id: 1,
      comment: null,
    });

    const createdReview = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.id, data.id));
    expect(createdReview[0]).toEqual({
      id: 1,
      comment: null,
    });
  });

  it("コメントが空文字列の場合はエラーになる", async () => {
    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment: "",
      }),
    });

    expect(res.status).toBe(400);
  });

  it("コメントがない場合はエラーになる", async () => {
    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
  });
});
