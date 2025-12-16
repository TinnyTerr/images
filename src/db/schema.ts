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
  PRIMARY KEY (file_id, tag_id)
);

CREATE TABLE IF NOT EXISTS ratings (
  file_id INTEGER PRIMARY KEY,
  quality INTEGER,
  usefulness INTEGER,
  personal INTEGER
);

CREATE TABLE IF NOT EXISTS analytics (
  file_id INTEGER PRIMARY KEY,
  views INTEGER DEFAULT 0,
  last_viewed INTEGER
);
`;
