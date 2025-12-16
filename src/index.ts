import { db } from "./db/db";
import { addTags } from "./db/tags";
import { scanDir } from "./indexer/scan";

type Row = { id: number; path: string };

function list(args: string[]) {
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

	sql += " ORDER BY files.path LIMIT 100";

	const rows = db.query(sql).all(...params) as Row[];

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
  list [tags...]   List files
  tag <id> <tags...>  Add tags
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

	default:
		usage();
}
