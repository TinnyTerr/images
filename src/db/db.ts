import { Database } from "bun:sqlite";
import { schema } from "./schema";

export const db = new Database("index.db", {
  create: true,
  strict: true,
});

db.run(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA busy_timeout = 5000;
`);

db.run(schema);