import { mkdirSync } from "node:fs";
import path from "node:path";
// Node 24 provides the synchronous SQLite API natively.
// @ts-expect-error @types/node in this project predates node:sqlite.
import { DatabaseSync } from "node:sqlite";

const dataDir = path.join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

const database = new DatabaseSync(path.join(dataDir, "content.sqlite"));
database.exec(`CREATE TABLE IF NOT EXISTS content_store (type TEXT PRIMARY KEY, items TEXT NOT NULL, updated_at TEXT NOT NULL)`);

export type ContentType = "products" | "posts" | "services" | "categories";

export function readDatabaseContent<T>(type: ContentType): T[] {
  const row = database.prepare("SELECT items FROM content_store WHERE type = ?").get(type) as { items?: string } | undefined;
  if (!row?.items) return [];
  try {
    const parsed: unknown = JSON.parse(row.items);
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

export function writeDatabaseContent<T>(type: ContentType, items: T[]) {
  database.prepare("INSERT INTO content_store (type, items, updated_at) VALUES (?, ?, ?) ON CONFLICT(type) DO UPDATE SET items = excluded.items, updated_at = excluded.updated_at").run(type, JSON.stringify(items), new Date().toISOString());
}

export function readAllDatabaseContent() {
  const storedTypes = (database.prepare("SELECT type FROM content_store").all() as Array<{ type: ContentType }>).map((row) => row.type);
  return {
    storedTypes,
    products: readDatabaseContent("products"),
    posts: readDatabaseContent("posts"),
    services: readDatabaseContent("services"),
    categories: readDatabaseContent("categories"),
  };
}