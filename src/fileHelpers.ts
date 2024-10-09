import AdmZip from 'adm-zip';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Function to get the current timestamp
const getCurrentTime = (): string => {
    return new Date().toISOString();
};

// Function to download the CC-CEDICT ZIP file
export const downloadCedict = async () => {
    const url = process.env.CEDICT_URL!;
    const filePath = path.resolve(process.env.CEDICT_ZIP_FILE!);

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, response.data);
        console.log(`${getCurrentTime()}: CC-CEDICT ZIP file downloaded successfully.`);

        // Unzip the file after download
        await unzipAndConvertToJson(filePath);
    } catch (error) {
        console.error(`${getCurrentTime()}: Error downloading the file:`, error);
    }
};

export const unzipAndConvertToJson = (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const zip = new AdmZip(filePath);
        const outputDir = path.resolve(__dirname, 'cedict');

        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Extract all files to the output directory
        zip.extractAllTo(outputDir, true);

        // Read the unzipped CEDICT file
        const cedictFile = path.join(outputDir, process.env.CEDICT_EXTRACTED_FILE!);
        const cedictContent = fs.readFileSync(cedictFile, 'utf-8');

        const entries: any[] = [];
        let metadata: { [key: string]: string } = {};

        cedictContent.split('\n').forEach(line => {
            if (line.startsWith('#!')) {
                // Extract useful metadata
                const parts = line.split('=');
                if (parts.length === 2) {
                    const key = parts[0].slice(2).trim(); // Remove the #! prefix and trim whitespace
                    const value = parts[1].trim();
                    metadata[key] = value;
                }
            } else if (!line.startsWith('#') && line.trim() !== '') {
                // Process valid CEDICT entries
                const parts = line.split(' ');
                if (parts.length > 2) {
                    entries.push({
                        traditional: parts[0],
                        simplified: parts[1],
                        pinyin: parts[2],
                        translation: parts.slice(3).join(' '),
                    });
                }
            }
        });

        // Save the entries as JSON
        const jsonFilePath = path.join(outputDir, process.env.CEDICT_JSON_FILE!);
        fs.writeFileSync(jsonFilePath, JSON.stringify(entries, null, 2));
        console.log(`${getCurrentTime()}: CC-CEDICT data converted to JSON successfully.`);

        // Save the metadata to a separate file
        const metadataFilePath = path.join(outputDir, process.env.CEDICT_METADATA_FILE!);
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
        console.log(`${getCurrentTime()}: Metadata saved successfully.`);

        resolve();
    });
};
