require('dotenv').config();
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { File_split } = require('./fileService');
const chokidar = require('chokidar');

const app = express();
const port = process.env.PORT || 3000;

// Define the path to the input and output folders
const inpt_folder = path.join(__dirname, 'input');
const outpt_folder = path.join(__dirname, 'output');

// Create the output folder if it doesn't exist
fs.ensureDirSync(outpt_folder);

// Watch the input folder for new files
const watcher = chokidar.watch(inpt_folder, { persistent: true });

// Event handler for new files
watcher.on('add', async (filePath) => {
  console.log(`File detected: ${filePath}`);
  
  try {
    await File_split(filePath, outpt_folder);
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server Started and Running at http://localhost:${port}`);
});
