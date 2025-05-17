import { pgTable, uuid } from "drizzle-orm/pg-core";

import { authUsers } from "./supabase-schema";

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => authUsers.id),
});
