const axios = require('axios');

const getAddress = async (lat, long) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=jsonv2`;

  const { data } = await axios.get(url, {
    headers: {
      'Accept-Language': 'en-GB,en;q=0.5',
    },
  });

  return data.address;
};

// eslint-disable-next-line import/prefer-default-export
const getLocation = async (lat, long) => {
  const address = await getAddress(lat, long);
  const {
    // eslint-disable-next-line camelcase
    country_code,
    country,
    postcode,
    state,
    state_district: region,
    county,
    city,
    suburb,
    village,
    town,
    road,
    footway,
    cycleway,
    neighbourhood,
    ...rest
  } = address;

  const extraLines = Object.values(rest).map((part) => part.trim());
  const extraLinesStr = extraLines.length > 0 ? `"${extraLines.join(', ')}"` : undefined;

  const addressFields = [
    extraLinesStr,
    road || footway || cycleway,
    town || village || suburb,
    city,
    county,
    region,
    state,
    postcode,
    country,
  ];

  return addressFields;
};

module.exports = {
  getLocation,
};
