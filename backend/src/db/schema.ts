import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const reviewsTable = pgTable("reviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  comment: text(),
});
