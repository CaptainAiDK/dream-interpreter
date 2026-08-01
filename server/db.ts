import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  InsertUser,
  users,
  dreams,
  InsertDream,
  dreamInterpretations,
  InsertDreamInterpretation,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

const dbPath =
  ENV.databasePath ||
  (process.env.NODE_ENV === "production"
    ? "/tmp/dream-interpreter.db"
    : "./dream-interpreter.db");

// Initialize SQLite database (creates file if it doesn't exist)
let _db: ReturnType<typeof drizzle> | null = null;

function ensureSchema(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      openId TEXT NOT NULL UNIQUE,
      name TEXT,
      email TEXT,
      loginMethod TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      lastSignedIn TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS dreams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      dreamText TEXT NOT NULL,
      category TEXT,
      scenarioType TEXT,
      interpretation TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS dreamInterpretations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dreamId INTEGER NOT NULL,
      symbolAnalysis TEXT,
      psychologicalInsights TEXT,
      emotionalThemes TEXT,
      recommendations TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export function getDb() {
  if (!_db) {
    try {
      const sqlite = new Database(dbPath);
      // Enable WAL mode for better performance
      sqlite.pragma("journal_mode = WAL");
      ensureSchema(sqlite);
      _db = drizzle(sqlite);
    } catch (error) {
      console.error("[Database] Failed to open SQLite database:", error);
      throw error;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = getDb();

  const values: InsertUser = {
    openId: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    lastSignedIn: user.lastSignedIn ?? new Date().toISOString(),
    role: user.role ?? "user",
  };

  // Check if user is owner
  if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
  }

  const existing = await getUserByOpenId(user.openId);
  if (existing) {
    await db
      .update(users)
      .set({
        ...values,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.openId, user.openId));
  } else {
    await db.insert(users).values(values);
  }
}

export async function getUserByOpenId(openId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new dream record
 */
export async function createDream(dream: InsertDream) {
  const db = getDb();
  const result = await db.insert(dreams).values(dream).returning();
  return result[0];
}

/**
 * Get user's dream history
 */
export async function getUserDreams(userId: number, limit: number = 10) {
  const db = getDb();
  const result = await db
    .select()
    .from(dreams)
    .where(eq(dreams.userId, userId))
    .orderBy(desc(dreams.createdAt))
    .limit(limit);
  return result;
}

/**
 * Get a specific dream by ID
 */
export async function getDreamById(dreamId: number) {
  const db = getDb();
  const result = await db
    .select()
    .from(dreams)
    .where(eq(dreams.id, dreamId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Update dream with interpretation
 */
export async function updateDreamInterpretation(
  dreamId: number,
  interpretation: string
) {
  const db = getDb();
  await db
    .update(dreams)
    .set({ interpretation, updatedAt: new Date().toISOString() })
    .where(eq(dreams.id, dreamId));
}

/**
 * Create a detailed dream interpretation record
 */
export async function createDreamInterpretation(
  interpretation: InsertDreamInterpretation
) {
  const db = getDb();
  const result = await db
    .insert(dreamInterpretations)
    .values(interpretation)
    .returning();
  return result[0];
}

/**
 * Get interpretation for a dream
 */
export async function getDreamInterpretation(dreamId: number) {
  const db = getDb();
  const result = await db
    .select()
    .from(dreamInterpretations)
    .where(eq(dreamInterpretations.dreamId, dreamId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}
