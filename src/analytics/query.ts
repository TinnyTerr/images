import { db } from "../db/db";

export function mostViewed(limit = 10) {
  return db.query(`
    SELECT path, views
    FROM analytics
    JOIN files ON files.id = analytics.file_id
    ORDER BY views DESC
    LIMIT ?
  `).all(limit);
}

export function avgQualityByTag() {
  return db.query(`
    SELECT tags.name, AVG(ratings.quality) as avg_q
    FROM tags
    JOIN file_tags USING(tag_id)
    JOIN ratings USING(file_id)
    GROUP BY tags.name
  `).all();
}
