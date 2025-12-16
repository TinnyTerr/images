import { db } from "./db";

const getTag = db.prepare(`
  INSERT INTO tags (name)
  VALUES (?)
  ON CONFLICT(name) DO NOTHING
  RETURNING id
`);

const getTagId = db.prepare(`
  SELECT id FROM tags WHERE name = ?
`);

const attach = db.prepare(`
  INSERT OR IGNORE INTO file_tags (file_id, tag_id)
  VALUES (?, ?)
`);

export function addTags(fileId: number, tags: string[]) {
	for (const raw of tags) {
		const name = raw.trim();
		if (!name) continue;

		getTag.run(name);
		const { id } = getTagId.get(name) as { id: number };
		attach.run(fileId, id);
	}
}
