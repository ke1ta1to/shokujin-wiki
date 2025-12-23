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

describe("GET /reviews/{id}", () => {
  it("指定したIDのレビューを取得できる", async () => {
    await db.insert(reviewsTable).values({ comment: "sample comment" });

    const res = await app.request("/1");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      id: 1,
      comment: "sample comment",
    });
  });

  it("存在しないIDのレビューを取得しようとすると404が返る", async () => {
    const res = await app.request("/9999");

    expect(res.status).toBe(404);
  });

  it("IDが数値でない場合は400が返る", async () => {
    const res = await app.request("/abc");

    expect(res.status).toBe(400);
  });
});
