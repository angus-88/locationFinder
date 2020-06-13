const fs = require('fs');
const { getHeaders } = require('../src/services/analyse');

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
