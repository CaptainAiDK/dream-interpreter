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
import path from "path";

const dbPath = process.env.DATABASE_PATH || "./dream-interpreter.db";

// Initialize SQLite database (creates file if it doesn't exist)
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    try {
      const sqlite = new Database(dbPath);
      // Enable WAL mode for better performance
      sqlite.pragma("journal_mode = WAL");
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
