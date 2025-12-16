import { db } from "../db/db";
import { readdirSync, statSync } from "fs";
import path from "path";

const insert = db.prepare(`
  INSERT OR IGNORE INTO files
  (path, size, mtime, ext, indexed_at)
  VALUES (?, ?, ?, ?, ?)
`);

export function scanDir(root: string) {
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = statSync(full);

      if (stat.isDirectory()) {
        walk(full);
      } else {
        insert.run(
          full,
          stat.size,
          stat.mtimeMs | 0,
          path.extname(entry),
          Date.now()
        );
      }
    }
  };

  walk(root);
}
