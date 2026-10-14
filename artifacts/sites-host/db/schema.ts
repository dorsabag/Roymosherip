import { sqliteTable, integer, text, index, primaryKey } from "drizzle-orm/sqlite-core";

export const memories = sqliteTable("memories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  email: text("email"),
  promptKey: text("prompt_key").notNull(),
  memoryText: text("memory_text").notNull(),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  reviewedAt: text("reviewed_at"),
}, t => [index("memories_status_created_idx").on(t.status, t.createdAt)]);

// Shared by all Worker instances; only salted IP digests are stored.
export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").notNull(),
  window: integer("window").notNull(),
  count: integer("count").notNull(),
}, t => [primaryKey({ columns: [t.key, t.window] })]);
