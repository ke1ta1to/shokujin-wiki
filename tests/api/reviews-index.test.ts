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

describe("GET /reviews", () => {
  it("レビュー一覧と総数を取得できる", async () => {
    await db
      .insert(reviewsTable)
      .values([
        { comment: "sample comment 1" },
        { comment: "sample comment 2" },
        { comment: "sample comment 3" },
      ]);

    const res = await app.request("/");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      reviews: [
        { id: 1, comment: "sample comment 1" },
        { id: 2, comment: "sample comment 2" },
        { id: 3, comment: "sample comment 3" },
      ],
      total: 3,
    });
  });
});
