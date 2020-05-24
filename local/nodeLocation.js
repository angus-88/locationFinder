
const { loadFile } = require('./file');
const { processRows } = require('../src/services/analyse');

const filename = 'locations';
const limit = 10;

const { config, rows } = loadFile(filename);

config.limit = limit;

const outputHeaders = config.headers.join(',');
const output = [
  `${outputHeaders},Duration,FirstLine,SecondLine,Area,City,County,Region,State,Postcode,Country`,
];

processRows(rows, 1, output, config);
