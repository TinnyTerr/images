import { scanDir } from "./indexer/scan";
import { startTui } from "./tui/app";

const target = process.argv[2];

if (!target) {
	console.error("Usage: bun run src/main.ts <dir>");
	process.exit(1);
}

scanDir(target);
startTui();
