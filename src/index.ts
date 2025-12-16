import { db } from "./db/db";
import { addTags } from "./db/tags";
import { scanDir } from "./indexer/scan";

type Row = { id: number; path: string };

function list(args: string[]) {
	const page = args.shift() ?? "1";
	const pageNum = Number(page);
	if (Number.isNaN(pageNum) || pageNum < 1) {
		console.error("Invalid page number");
		return;
	}

	let sql = `
		SELECT DISTINCT files.id, files.path
		FROM files
		LEFT JOIN file_tags
			ON file_tags.file_id = files.id
		LEFT JOIN tags
			ON tags.id = file_tags.tag_id
		WHERE 1=1
	`;
	const params: any[] = [];

	for (const arg of args) {
		if (arg.startsWith("tag:")) {
			sql += " AND tags.name = ?";
			params.push(arg.slice(4));
		} else {
			sql += " AND files.path LIKE ?";
			params.push(`%${arg}%`);
		}
	}

	sql += " ORDER BY files.id ASC LIMIT 50 OFFSET ?";

	const rows = db.query(sql).all(...params, (pageNum - 1) * 50) as Row[];

	for (const r of rows) {
		console.log(`${r.id}\t${r.path}`);
	}
}

function tag(id: number, tags: string[]) {
	addTags(id, tags);
	console.log(`Tagged file ${id}`);
}

function usage() {
	console.log(`
Usage:
  index <dir>         Index directory
  list [page] [tags...]   List files
  tag <id> <tags...>  Add tags
  reset               Reset database
`);
}

const [cmd, ...args] = process.argv.slice(2);

switch (cmd) {
	case "index":
		if (!args[0]) {
			usage();
			break;
		}
		scanDir(args[0]);
		break;

	case "list":
		list(args);
		break;

	case "tag":
		if (args.length < 2) {
			usage();
			break;
		}
		tag(Number(args[0]), args.slice(1));
		break;
	case "reset":
		db.run("DELETE FROM files");
		db.run("DELETE FROM tags");
		db.run("DELETE FROM file_tags");
		db.run("DELETE FROM ratings");
		db.run("DELETE FROM analytics");
		console.log("Database reset.");
		break;

	default:
		usage();
}
