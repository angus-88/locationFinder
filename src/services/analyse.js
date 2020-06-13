const { getLocation } = require('./location');
const { getDuration } = require('./duration');
// const { saveOutput } = require('../../local/file');

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

const processRows = async (rows, index, output, config) => {
  const {
    limit, filename, latIndex, longIndex,
  } = config;
  console.log(`${index} of ${limit || rows.length}`);
  const currentRow = rows[index];
  const nextIndex = index + 1;
  const nextRow = rows[nextIndex] || '';

  if (currentRow.trim().length > 0 && !Number.isNaN(currentRow.split(',')[0])) {
    const fields = currentRow.split(',');

    const lat = fields[latIndex];
    const long = fields[longIndex];


    const outputRowArray = fields.map((value) => value.trim());

    outputRowArray.push(getDuration(fields, config));

    try {
      const addressFields = await getLocation(lat, long);
      outputRowArray.push(
        ...addressFields,
      );
    } catch (e) {
      console.log(`Error at ${index}: ${e}`);
      outputRowArray.push('Error, unable to determin location');
    } finally {
      const outputStr = outputRowArray.join(',');

      console.log(outputStr);
      output.push(outputStr);
    }
  } else {
    console.log('Row not valid, ignoring');
  }


  if (nextRow && (!limit || nextIndex < limit)) {
    processRows(rows, nextIndex, output, config);
  } else {
    // finish
    // saveOutput(output, filename);
  }
};

const processRow = async (currentRow, index, config) => {
  const {
    latIndex, longIndex,
  } = config;

  if (currentRow.trim().length > 0 && !Number.isNaN(currentRow.split(',')[0])) {
    const fields = currentRow.split(',');

    const lat = fields[latIndex];
    const long = fields[longIndex];


    const outputRowArray = fields.map((value) => value.trim());

    outputRowArray.push(getDuration(fields, config));

    try {
      const addressFields = await getLocation(lat, long);
      outputRowArray.push(
        ...addressFields,
      );
    } catch (e) {
      console.log(`Error at ${index}: ${e}`);
      outputRowArray.push('Error, unable to determin location');
    } finally {
      const outputStr = outputRowArray.join(',');

      console.log(outputStr);
      // eslint-disable-next-line no-unsafe-finally
      return outputStr;
    }
  } else {
    console.log('Row not valid, ignoring');
    return '';
  }
};

module.exports = {
  processRows,
  processRow,
  getHeaders,
};
