import express from 'express';
import compression from 'compression';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import { downloadCedict } from './fileHelpers'; // Import the download function

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Enable gzip compression
app.use(compression());

// Schedule the download to run once every day at midnight
cron.schedule(process.env.CRON_TIME!, () => {
    console.log('Running the scheduled task to download CC-CEDICT...');
    downloadCedict();
});

// Endpoint to serve the CC-CEDICT JSON data
app.get('/cedict', (req, res) => {
    const jsonFilePath = path.join(__dirname, 'cedict', 'cedict.json');
    res.setHeader('Content-Type', 'application/json');

    // Stream the JSON file with compression
    const readStream = fs.createReadStream(jsonFilePath);
    readStream.pipe(res).on('error', (err) => {
        console.error('Error streaming the JSON file:', err);
        res.status(500).send('Error serving the CC-CEDICT JSON file.');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Initially call the download function on server start to ensure the latest data is available
downloadCedict();
