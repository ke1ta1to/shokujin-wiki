import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

/**
 * 注文記録
 */
export const eats = pgTable("eats", {
  id: serial("id").primaryKey().notNull(),
  comment: text("comment").notNull(),
  imageUrls: text("image_urls").array(),

  productId: integer("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productNameSnapshot: text("product_name_snapshot").notNull(),

  createdBy: uuid("createdBy")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

/**
 * 商品
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull().unique(),
  price: integer("price"),

  isVerified: boolean("is_verified").notNull().default(false),

  userId: uuid("user_id").references(() => authUsers.id, {
    onDelete: "set null",
  }),
  updatedBy: uuid("updated_by").references(() => authUsers.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

/**
 * オプション
 */
export const options = pgTable("options", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull().unique(),

  isVerified: boolean("is_verified").notNull().default(false),

  createdBy: uuid("created_by").references(() => authUsers.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

/**
 * 注文記録とオプションの中間テーブル
 */
export const eatOptions = pgTable("eat_options", {
  id: serial("id").primaryKey().notNull(),
  eatId: integer("eat_id")
    .notNull()
    .references(() => eats.id, { onDelete: "cascade" }),
  optionId: integer("option_id")
    .notNull()
    .references(() => options.id, { onDelete: "cascade" }),

  optionNameSnapshot: text("option_name_snapshot").notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const eatsRelations = relations(eats, ({ one, many }) => ({
  user: one(authUsers, {
    fields: [eats.createdBy],
    references: [authUsers.id],
  }),
  product: one(products, {
    fields: [eats.productId],
    references: [products.id],
  }),
  eatOptions: many(eatOptions),
}));

export const productsRelations = relations(products, ({ many, one }) => ({
  eats: many(eats),
  creator: one(authUsers, {
    fields: [products.userId],
    references: [authUsers.id],
  }),
  updater: one(authUsers, {
    fields: [products.updatedBy],
    references: [authUsers.id],
  }),
}));

export const optionsRelations = relations(options, ({ many, one }) => ({
  eatOptions: many(eatOptions),
  creator: one(authUsers, {
    fields: [options.createdBy],
    references: [authUsers.id],
  }),
}));

export const eatOptionsRelations = relations(eatOptions, ({ one }) => ({
  eat: one(eats, {
    fields: [eatOptions.eatId],
    references: [eats.id],
  }),
  option: one(options, {
    fields: [eatOptions.optionId],
    references: [options.id],
  }),
}));
