import { pgTable, pgEnum, serial, varchar, text, timestamp, boolean, index, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const memoryStatus = pgEnum("memory_status", ["pending", "approved", "rejected"]);
export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  email: varchar("email", { length: 254 }),
  promptKey: varchar("prompt_key", { length: 30 }).notNull(),
  memoryText: text("memory_text").notNull(),
  consent: boolean("consent").notNull(),
  status: memoryStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
}, (t) => [index("memories_status_created_idx").on(t.status, t.createdAt)]);
export const insertMemorySchema = createInsertSchema(memories).omit({id:true, status:true, createdAt:true, updatedAt:true, reviewedAt:true});
export type Memory = typeof memories.$inferSelect;

export const sessions = pgTable("admin_sessions", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire", { precision: 6 }).notNull(),
}, (t) => [index("admin_sessions_expire_idx").on(t.expire)]);