import fs from "node:fs/promises"
import getAppDataPath from "appdata-path";
import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";

const optionDefinitions = [
	{
		name: "help",
		alias: "h",
		type: Boolean,
		description: "Display this usage guide",
	},
    {
		name: "config",
		alias: "c",
		type: Boolean,
		description: "Opens the data directory",
	},
	{
		name: "dirs",
        alias: "d",
		type: String,
		multiple: true,
		description: "The directories to add",
		typeLabel: "<directories relative to cmd>",
	},
    {
        name: "ignore",
        alias: "i",
        type: Boolean,
        description: ""
    },
	{
		name: "reset",
		alias: "r",
		type: Number,
		description: "Reset the list of directories and stop indexing them",
	},
	{
		name: "yes",
		alias: "y",
		type: String,
		description: "Ignore any user prompts and just do it",
	},
];

const options = commandLineArgs(optionDefinitions);

if (options.help) {
	const usage = commandLineUsage([
		{
			header: "Images Indexer",
			content: "A simple app to index, not just images, but all your files and filter them by tags",
		},
		{
			header: "Options",
			optionList: optionDefinitions,
		},
		{
			content: "Project home: {underline https://github.com/tinnyterr/images}",
		},
	]);
	console.log(usage);
} else {
	console.log(options);
}

if (process.platform === "win32") {
    const files = {
        "config.json": false,
        ""
    }

    const dataDir = getAppDataPath("imager");
    const dir = await fs.opendir(dataDir);

    for await (const dirent of dir) {
        if (dirent.isFile()) {
            continue;
        }


    }
}