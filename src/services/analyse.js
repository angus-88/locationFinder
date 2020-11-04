import { getLocation } from './location';
import { getDuration } from './duration';

// pass in a search term and it returns a function that can be used in an array map or find loop.
const searchFor = (search) => (header) => header.trim().toLowerCase().includes(search.trim().toLowerCase());

export const getHeaders = (row) => {
  const latIndex = row.findIndex(searchFor('lat'));
  const longIndex = row.findIndex(searchFor('long'));
  let startIndex = row.findIndex(searchFor('start'));
  let endIndex = row.findIndex(searchFor('end'));

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
    headers: row,
  };

  console.log(config);

  return config;
};

export const processRow = async (currentRow, index, config) => {
  const {
    latIndex, longIndex,
  } = config;

  if (currentRow.length > 0) {
    const lat = currentRow[latIndex];
    const long = currentRow[longIndex];

    const outputRowArray = [...currentRow];

    outputRowArray.push(getDuration(currentRow, config));
    const result = {};

    try {
      const addressFields = await getLocation(`${lat}`, `${long}`); // ensure strings
      outputRowArray.push(
        ...addressFields,
      );
    } catch (e) {
      outputRowArray.push('Error retrieving data for row');
      if (e.response?.data?.error?.message) {
        result.error = `${e.message} - ${e.response?.data?.error?.message}`;
      } else {
        result.error = e.message;
      }
    } finally {
      console.log(outputRowArray.join(','));
      result.row = outputRowArray;
      // eslint-disable-next-line no-unsafe-finally
      return result;
    }
  } else {
    console.log('Row not valid, ignoring');
    return '';
  }
};
