const fs = require('fs');

const saveOutput = (output, filename) => {
  let finished = false;
  let attempt = 1;
  let outFilename = `./output/${filename}.output-${attempt}.csv`;
  while (!finished) {
    try {
      fs.writeFileSync(outFilename, output.join('\n'));
      finished = true;
    } catch (e) {
      attempt += attempt;
      outFilename = `./output/${filename}.output-${attempt}.csv`;
      console.log(`Unable to write to file, trying ${outFilename}`);
    }
  }
  console.log(`\n------------------------------\n\nFinished, output stored in:\n ${outFilename}`);
};

const findIndex = (search) => (header) => header.trim().toLowerCase().includes(search.trim().toLowerCase());

const getHeaders = (row) => {
  const headers = row.split(',').map((header) => header.trim());
  console.log(headers);

  const latIndex = headers.findIndex(findIndex('lat'));
  const longIndex = headers.findIndex(findIndex('long'));
  let startIndex = headers.findIndex(findIndex('start'));
  let endIndex = headers.findIndex(findIndex('end'));

  if (endIndex >= 0 && startIndex < 0) {
  // found end but not start, assume previous column
    startIndex = endIndex - 1;
  }

  if (startIndex >= 0 && endIndex < 0) {
  // start found but not end, assume next column
    endIndex = startIndex + 1;
  }

  const config = {
    latIndex,
    longIndex,
    startIndex,
    endIndex,
    headers,
  };

  return config;
};

const loadFile = (filename) => {
  const inputData = fs.readFileSync(`./input/${filename}.csv`, 'utf8');

  const rows = inputData.split('\n');

  const config = getHeaders(rows[0]);
  config.filename = filename;

  return {
    rows,
    config,
  };
};

module.exports = {
  saveOutput,
  getHeaders,
  loadFile,
};
