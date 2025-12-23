import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
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

describe("PATCH /reviews/{id}", () => {
  it("指定したIDのレビューを更新できる", async () => {
    await db.insert(reviewsTable).values({ comment: "old comment" });

    const res = await app.request("/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: "new comment" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      id: 1,
      comment: "new comment",
    });

    const updatedReview = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.id, 1))
      .get();
    expect(updatedReview).toEqual({
      id: 1,
      comment: "new comment",
    });
  });

  it("コメントなしでレビューを更新できる", async () => {
    await db.insert(reviewsTable).values({ comment: "old comment" });

    const res = await app.request("/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: null }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      id: 1,
      comment: null,
    });

    const updatedReview = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.id, 1))
      .get();
    expect(updatedReview).toEqual({
      id: 1,
      comment: null,
    });
  });

  it("コメントが空文字列の場合はエラーになる", async () => {
    await db.insert(reviewsTable).values({ comment: "old comment" });

    const res = await app.request("/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: "" }),
    });

    expect(res.status).toBe(400);
  });

  it("存在しないIDのレビューを更新しようとすると404が返る", async () => {
    const res = await app.request("/9999", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: "new comment" }),
    });

    expect(res.status).toBe(404);
  });

  it("IDが数値でない場合は400が返る", async () => {
    const res = await app.request("/abc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: "new comment" }),
    });

    expect(res.status).toBe(400);
  });
});
