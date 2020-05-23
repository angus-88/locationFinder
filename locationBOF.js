const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const _ = require('lodash');

const getStreet = async (lat, long) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=jsonv2`;

  const { data } = await axios.get(url, {
    headers: {
      'Accept-Language': 'en-GB,en;q=0.5',
    }
  });

  return data.address;
}

let prevRoad;
let roadStart;
const getDuration = (start, end, nextStart) => {
  let startTime;
  let endTime;
  let nextStartTime;
  let duration;
  let gap;

  try {

    if (start && start.trim()) {
      startTime = moment(start, 'DD/MM/YYYY hh:mm:ss');
    }
    if (end && end.trim()) {
      endTime =  moment(end, 'DD/MM/YYYY hh:mm:ss');
    }
    if (nextStart && nextStart.trim()) {
      nextStartTime = moment(nextStart, 'DD/MM/YYYY hh:mm:ss');
    }
    
    if (startTime && endTime) {
      duration = moment.duration(endTime.diff(startTime)).as('minutes').toFixed(0);
    }
    if (nextStartTime && endTime) {
      gap = moment.duration(nextStartTime.diff(endTime)).as('minutes').toFixed(0);
    } else if (nextStartTime && startTime) {
      gap = moment.duration(nextStartTime.diff(startTime)).as('minutes').toFixed(0);
    }
  } catch (e) {
    console.log(e);
    duration = "Error calculating determine duration";
  } finally {
    return {
      duration,
      gap,
    };
  }
}


const doLocationRow = async (rows, index, limit) => {
  console.log(index);
  const currentRow = rows[index];
  const nextIndex = ++index;
  const nextRow = rows[nextIndex] || "";

  if (currentRow.trim().length > 0 && !isNaN(currentRow.split(',')[0])) {
    // TODO use first row
    const [lat, long, date, time, vrm] = currentRow.split(',');
    const [nextLat, nextLong, nextStart, nextEnd] = nextRow.split(',');
    // const { duration, gap } = getDuration(start, end, nextStart);
    const outputRowArray = [lat.trim(), long.trim(), date.trim(), time.trim(), vrm.trim()];
    // const outputRowArray = [lat.trim(), long.trim(), start.trim(), end.trim(), duration, gap];
   try{
     const address = await getStreet(lat, long);
     const { country_code, country, postcode, state, state_district: region, county, city, suburb, village, town, road, footway, cycleway, neighbourhood, ...rest } = address;

     const extraLines = Object.values(rest).map(part => part.trim());

     outputRowArray.push(`"${extraLines.join(', ')}"`, road || footway || cycleway, town || village || suburb, city, county, region, state, postcode, country);
    } catch (e) {
      console.log(`Error at ${index}: ${e}`);
      outputRowArray.push('Error, unable to determin location')
    } finally {
      const outputStr = outputRowArray.join(',');
    
      console.log(outputStr);
      output.push(outputStr);
   }
  
  } else {
    console.log('Row not valid, ignoring');
  }  


  if(nextRow && (!limit || nextIndex < limit)) {
    doLocationRow(rows, nextIndex, limit);
  } else {
    // finish
    try {
      fs.writeFileSync(`./output/${fileName}.output.csv`, output.join('\n'));

    } catch(e) {
      fs.writeFileSync(`./output/${fileName}2.output.csv`, output.join('\n'));
    }
    console.log('finished');
  };
}


const fileName = 'BOF';
const limit = undefined; 

const locations = fs.readFileSync(`./input/${fileName}.csv`, 'utf8');


const output = [
  `Lat,Long,Date,Time,VRM,FirstLine,SecondLine,Area,City,County,Region,State,Postcode,Country`,
];
// const output = [
//   `Lat,Long,Start,End,Duration(minutes),Gap between records (minutes),FirstLine,SecondLine,Area,City,County,Region,State,Postcode,Country`,
// ];

const rows = locations.split('\n');
console.log(rows.length);

doLocationRow(rows, 0, limit);