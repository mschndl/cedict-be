import fs from "node:fs";
import path from "node:path";
import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import cron from "node-cron";

import { downloadCedict } from "./fileHelpers";
import { getEnvVar } from "./utils";

dotenv.config();

const app = express();
const PORT = getEnvVar("PORT");

// Enable gzip compression
app.use(compression());

// Schedule the download to run periodically
cron.schedule(getEnvVar("CRON_TIME"), () => {
	console.log("Running the scheduled task to download CC-CEDICT...");
	downloadCedict();
});

// Endpoint to serve the CC-CEDICT JSON data
app.get("/cedict", (req, res) => {
	const jsonFilePath = path.join(__dirname, "cedict", "cedict.json");
	res.setHeader("Content-Type", "application/json");

	// Stream the JSON file with compression
	const readStream = fs.createReadStream(jsonFilePath);
	readStream.pipe(res).on("error", (err) => {
		console.error("Error streaming the JSON file:", err);
		res.status(500).send("Error serving the CC-CEDICT JSON file.");
	});
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

// Initially call the download function on server start
downloadCedict();
