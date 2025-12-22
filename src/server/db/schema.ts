import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reviewsTable = sqliteTable("reviews", {
  id: int("id").primaryKey({ autoIncrement: true }),
  comment: text("comment"),
});
