import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Uses SQLite for local storage – no external database needed.
 */
export const users = sqliteTable("users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: text("createdAt").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updatedAt").notNull().$defaultFn(() => new Date().toISOString()),
  lastSignedIn: text("lastSignedIn").notNull().$defaultFn(() => new Date().toISOString()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Dreams table for storing user dream submissions
 */
export const dreams = sqliteTable("dreams", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("userId").notNull(),
  dreamText: text("dreamText").notNull(),
  category: text("category"),
  scenarioType: text("scenarioType"),
  interpretation: text("interpretation"),
  createdAt: text("createdAt").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updatedAt").notNull().$defaultFn(() => new Date().toISOString()),
});

export type Dream = typeof dreams.$inferSelect;
export type InsertDream = typeof dreams.$inferInsert;

/**
 * Dream interpretations table for storing detailed analysis results
 */
export const dreamInterpretations = sqliteTable("dreamInterpretations", {
  id: int("id").primaryKey({ autoIncrement: true }),
  dreamId: int("dreamId").notNull(),
  symbolAnalysis: text("symbolAnalysis"),
  psychologicalInsights: text("psychologicalInsights"),
  emotionalThemes: text("emotionalThemes"),
  recommendations: text("recommendations"),
  createdAt: text("createdAt").notNull().$defaultFn(() => new Date().toISOString()),
});

export type DreamInterpretation = typeof dreamInterpretations.$inferSelect;
export type InsertDreamInterpretation = typeof dreamInterpretations.$inferInsert;