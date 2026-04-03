import "dotenv/config";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const prismaDir = resolve(process.cwd(), "prisma");
const migrationsDir = join(prismaDir, "migrations");
const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

function resolveSqlitePath(url: string) {
  if (!url.startsWith("file:")) {
    throw new Error("Only SQLite file DATABASE_URL values are supported by this local migration script.");
  }

  const rawPath = url.replace(/^file:/, "");
  return rawPath.startsWith("/") ? rawPath : resolve(prismaDir, rawPath);
}

function runSqlite(dbPath: string, sql: string) {
  execFileSync("sqlite3", [dbPath], {
    input: sql,
    stdio: ["pipe", "pipe", "pipe"],
  });
}

function querySqlite(dbPath: string, sql: string) {
  return execFileSync("sqlite3", [dbPath, sql], {
    encoding: "utf8",
  }).trim();
}

function main() {
  const dbPath = resolveSqlitePath(databaseUrl);
  mkdirSync(dirname(dbPath), { recursive: true });

  if (!existsSync(migrationsDir)) {
    throw new Error("No prisma/migrations directory was found.");
  }

  runSqlite(
    dbPath,
    `
    CREATE TABLE IF NOT EXISTS "_localreach_migrations" (
      "name" TEXT NOT NULL PRIMARY KEY,
      "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    `,
  );

  const applied = new Set(
    querySqlite(dbPath, 'SELECT "name" FROM "_localreach_migrations" ORDER BY "name";')
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  );

  const migrationFolders = readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const folder of migrationFolders) {
    if (applied.has(folder)) {
      continue;
    }

    const sql = readFileSync(join(migrationsDir, folder, "migration.sql"), "utf8");
    const safeName = folder.replaceAll("'", "''");

    runSqlite(
      dbPath,
      `
      BEGIN;
      ${sql}
      INSERT INTO "_localreach_migrations" ("name") VALUES ('${safeName}');
      COMMIT;
      `,
    );

    console.log(`Applied migration ${folder}`);
  }

  console.log(`SQLite database is ready at ${dbPath}`);
}

main();
