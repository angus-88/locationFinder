const moment = require('moment');

const getDuration = (fields, config) => {
  const { startIndex, endIndex } = config;
  if (startIndex && endIndex) {
    const start = fields[startIndex];
    const end = fields[endIndex];

    try {
      let startTime;
      let endTime;
      let duration;
      if (start && start.trim()) {
        startTime = moment(start, 'DD/MM/YYYY hh:mm:ss');
      }
      if (end && end.trim()) {
        endTime = moment(end, 'DD/MM/YYYY hh:mm:ss');
      }

      if (startTime && endTime) {
        duration = moment.duration(endTime.diff(startTime)).as('minutes').toFixed(0);
      }

      return duration;
    } catch (e) {
      console.log(e);
      return 'Error calculating duration';
    }
  }
  return 'Start or End time missing';
};

module.exports = {
  getDuration,
};
