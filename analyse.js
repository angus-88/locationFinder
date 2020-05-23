// Brent Terrace, North Cricklewood,  London Borough of Barnet, London,         Greater London,   England, NW2 1BY,   United Kingdom
// A11,           Little Abington,    South Cambridgeshire,     Cambridgeshire, East of England,  England, CB21 6AR,  United Kingdom

// 03/05/2020 07:39:39(UTC+1)
const moment = require('moment');
const _ = require('lodash');
const fs = require('fs');

const breakUpRow = (row) => {
  const [lat, long, start, end, ...locations] = row;
  const reversedLocations = locations.reverse();
  const [uk, postcode, country, region, county, area, town, road, ...other] = reversedLocations.map((str) => str.replace('"', '').trim());
  
    if (locations.length !== 8) {
      console.warn('Irregular location found');
      console.log(`${region}, ${county}, ${area}, ${town}, ${road}`, other);
    }
  
  let startTime;
  let endTime;
  let duration;
  if (start) {
    startTime = moment(start, 'DD/MM/YYYY hh:mm:ss');
  }
  if (end) {
    endTime =  moment(end, 'DD/MM/YYYY hh:mm:ss');
  }

  if (start && end) {
    duration =  moment.duration(endTime.diff(startTime)).as('seconds');
  }

  return {
    startTime,
    endTime,
    duration,
    road,
    town,
    area,
    county,
    region,
    country,
    postcode,
  }
}

const analyseRow = line => {
  const row = line.split(',');
  return breakUpRow(row);
  
}

const analyseCsv = () => {
  const locations = {
  /* road: {
      [roadName]: {
        duration: time,
        distinctVisits: number,
        currentStart: moment,
      }    
    }
  */
  };
  const dateTime = {
  /*
    <30: [ // spent less than 30s at location , travelling
      { road, postcode, start, end, duration }
    ]
    30s: [ // spent longer than 30s at location
      { road, postcode, start, end, duration }
    ]
    minute: [ // spent longer than 1m at location
      { road, postcode, start, end, duration }
    ]
    5 minutes: [ // spent longer than 1m at location
      { road, postcode, start, end, duration }
    ]
    10 minute: [ // spent longer than 1m at location
      { road, postcode, start, end, duration }
    ]
    15 minutes: [ // spent longer than 1m at location
      { road, postcode, start, end, duration }
    ]
    30 minute: [ // spent longer than 1m at location
      { road, postcode, start, end, duration }
    ]
    1 hour: [ // spent longer than 1m at location
      { road, postcode, start, end, duration }
    ]
  */
  };
  
  const input = fs.readFileSync('./output/output.csv', 'utf8');
  let prevLine;
  let roadStartTime;
  
  input.split('\n').forEach((line) => {
    if (line.trim().length > 0) {
      const { startTime, endTime, duration, road, town, area, county, region, country, postcode } = analyseRow(line);

      const currentRoadStats = locations.road[road] || {
        duration: 0,
        distinctVisits: 0,
        currentStart: undefined,
      };

      if (road !== prevLine.road) {
        console.log('unique visit');
        roadStartTime = startTime;

        currentRoadStats.duration = currentRoadStats.duration + ;
        currentRoadStats.distinctVisits = currentRoadStats.distinctVisits + 1
      }
      // if (road && locations.roads[road]) {
      //   locations.roads[road]
      // }
    }

    // const roads = groubBy()
  });
}

analyseCsv();