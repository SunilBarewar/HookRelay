import { connectDatabase, type Database } from "./client.ts";

type Connection = ReturnType<typeof connectDatabase>;

// Cached on globalThis so dev-server hot reloads reuse one pool
// instead of opening a new one on every reload.
const globalForDb = globalThis as typeof globalThis & {
  __hookrelayDb?: Connection;
};

function getConnection(): Connection {
  return (globalForDb.__hookrelayDb ??= connectDatabase());
}

/**
 * Shared database instance. Connects lazily on first use using
 * process.env.DATABASE_URL, so importing this module never throws or
 * opens a connection by itself.
 */
export const db: Database = new Proxy({} as Database, {
  get: (_target, prop) => Reflect.get(getConnection().db, prop),
});

/** Close the shared connection pool (graceful shutdown, tests). */
export async function closeDatabase(): Promise<void> {
  const connection = globalForDb.__hookrelayDb;
  if (!connection) return;
  globalForDb.__hookrelayDb = undefined;
  await connection.client.end();
}
