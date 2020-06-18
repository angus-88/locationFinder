import { getLocation } from './location';
import { getDuration } from './duration';

const findIndex = (search) => (header) => header.trim().toLowerCase().includes(search.trim().toLowerCase());

const trim = (field) => {
  if (field.startsWith('"')) {
    return field.substring(1, field.length - 1).trim();
  }
  return field.trim();
};

export const getHeaders = (row) => {
  const rawHeaders = row.split(',');
  const headers = rawHeaders.map(trim);

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

  console.log(config);

  return config;
};

export const processRow = async (currentRow, index, config) => {
  const {
    latIndex, longIndex,
  } = config;

  if (trim(currentRow).length > 0 && !Number.isNaN(currentRow.split(',')[0])) {
    const fields = currentRow.split(',').map(trim);

    const lat = fields[latIndex];
    const long = fields[longIndex];

    const outputRowArray = fields.map(trim);

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
