const { getLocation } = require('./location');
const { getDuration } = require('./duration');
const { saveOutput } = require('../../local/file');

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
    saveOutput(output, filename);
  }
};

module.exports = {
  processRows,
};
