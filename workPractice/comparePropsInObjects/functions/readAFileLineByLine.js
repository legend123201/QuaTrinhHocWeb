const fs = require("fs");
const readline = require("readline");

const readAFileLineByLine = (filePath) => {
	// Create a read stream
	const fileStream = fs.createReadStream(filePath);

	// Create readline interface
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity // Handles different newline formats (\n, \r\n)
	});

	// Process each line
	rl.on("line", (line) => {
		const first15Chars = line.slice(0, 15);
		if (first15Chars.includes("MB")) {
			const heapMemUsage = Number(first15Chars.split("MB")[0]);
			if (heapMemUsage > 500) {
				console.log(`${line}`);
			}
		}
	});

	rl.on("close", () => {
		console.log("Finished reading file.");
	});
};

readAFileLineByLine("./AttachmentOnCommentRonan-d27-m11-h9-m43/ovng-backend-5c646f47d6-5dtp7_2024.log");
