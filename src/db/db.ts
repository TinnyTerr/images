import { Database } from "bun:sqlite";
import { schema } from "./schema";
import path from "node:path"

const DB_PATH = process.env.IMAGER_DB
  ? path.resolve(process.env.IMAGER_DB)
  : path.resolve(import.meta.dir, "../index.db");

export const db = new Database(DB_PATH, {
	create: true,
	strict: true,
});

db.run(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA busy_timeout = 5000;
`);

db.run(schema);
