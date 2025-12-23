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

describe("DELETE /reviews/{id}", () => {
  it("指定したIDのレビューを削除できる", async () => {
    await db.insert(reviewsTable).values({ comment: "to be deleted" });

    const res = await app.request("/1", {
      method: "DELETE",
    });

    expect(res.status).toBe(204);

    const deletedReviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.id, 1));
    expect(deletedReviews.length).toBe(0);
  });

  it("存在しないIDのレビューを削除しようとすると404が返る", async () => {
    const res = await app.request("/9999", {
      method: "DELETE",
    });

    expect(res.status).toBe(404);
  });

  it("IDが数値でない場合は400が返る", async () => {
    const res = await app.request("/abc", {
      method: "DELETE",
    });

    expect(res.status).toBe(400);
  });
});
