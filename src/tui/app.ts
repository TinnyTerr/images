import blessed from "blessed";
import { db } from "../db/db";

export function startTui() {
    const screen = blessed.screen({
        smartCSR: true,
        title: "File Index",
    });

    const list = blessed.list({
        parent: screen,
        width: "100%",
        height: "100%-1",
        keys: true,
        vi: true,
        border: "line",
        label: "Files",
        style: {
            selected: { bg: "blue" },
        },
    });

    const status = blessed.box({
        parent: screen,
        bottom: 0,
        height: 1,
        content: "q: quit | enter: view",
    });

    const rows = db
        .query("SELECT id, path FROM files ORDER BY path LIMIT 500")
        .all() as { id: number; path: string }[];

    rows.forEach((r) => { list.addItem(r.path) });

    list.on("select", (_, idx) => {
        const file = rows[idx] as { id: number; path: string; }
        db.query(`
      INSERT INTO analytics (file_id, views, last_viewed)
      VALUES (?, 1, ?)
      ON CONFLICT(file_id)
      DO UPDATE SET
        views = views + 1,
        last_viewed = excluded.last_viewed
    `).run(file.id, Date.now());

        status.setContent(file.path);
        screen.render();
    });

    screen.key(["q", "C-c"], () => process.exit(0));
    list.focus();
    screen.render();
}
