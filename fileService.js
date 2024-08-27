require('dotenv').config()
const { createReadStream,
        createWriteStream 
    } = require('fs');
const chunk_size = 10*1024*1024; //10 MB
const path = require('path');
const fs = require('fs-extra');



exports.File_split= async(filePath, outputFolder) =>{
  const file_state = await fs.stat(filePath);
  const file_size = file_state.size;
  if (file_size <= chunk_size) {
    console.log(`<<<<File is smaller than chunk size>>>>. Skipping split for ${filePath}`);
    return;
  }
  const chunk_count = Math.ceil(file_size / chunk_size);
  const read_stream = createReadStream(filePath, { highWaterMark: chunk_size });
  const file_name = path.basename(filePath);
  let bytesRead = 0;
  let index = 0;
  read_stream.on('data', (chunk) => {
    const chunk_path = path.join(outputFolder, `${file_name}.part${index}`);
    const write_stream = createWriteStream(chunk_path);
    write_stream.write(chunk);
    write_stream.end();
    index++;
  });
  read_stream.on('end', () => {console.log(`File Split completed: ${filePath}`);});
  read_stream.on('error', (err) => {console.error(`Error reading file: ${err.message}`);});
}

