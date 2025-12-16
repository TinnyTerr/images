export const schema = `
CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY,
  path TEXT UNIQUE,
  size INTEGER,
  mtime INTEGER,
  ext TEXT,
  indexed_at INTEGER
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS file_tags (
  file_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (file_id, tag_id),
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ratings (
  file_id INTEGER PRIMARY KEY,
  quality INTEGER,
  usefulness INTEGER,
  personal INTEGER,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analytics (
  file_id INTEGER PRIMARY KEY,
  views INTEGER DEFAULT 0,
  last_viewed INTEGER,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);
`;
