# cedict-be

## Description
cedict-be is a Node.js application that automatically downloads the CC-CEDICT Chinese-English dictionary, unzips it, and serves the data as a compressed JSON file via a RESTful API. The server periodically checks for updates to the dictionary and ensures that the latest data is always available.

## Features
- Automatically downloads the CC-CEDICT ZIP file at specified intervals.
- Extracts and converts the dictionary data to JSON format.
- Serves the JSON data via a REST API endpoint with gzip compression.
- Stores metadata alongside the dictionary entries.

## Installation
To install and set up the project locally, follow these steps:

1. Clone the repository:
```bash
   git clone https://github.com/mschndl/cedict-be.git
   cd cedict-be
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables: Create a *.env* file in the root directory with the following:
```bash
CEDICT_URL=https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip
CEDICT_EXTRACTED_FILE=cedict_ts.u8
CEDICT_ZIP_FILE=<zipfile_name>.zip
CEDICT_JSON_FILE=<jsonfile_name>.json
CEDICT_METADATA_FILE=<metadatafile_name>.json
PORT=<port_number>
CRON_SCHEDULE=* * * * *
```
## Usage
To start the server, run:
```bash
npm start
```
## Contributing
If you'd like to contribute, please follow these guidelines:
* Fork the repository
* Create a new branch for your feature
* Submit a pull request

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.




