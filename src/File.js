import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemText, ListItemSecondaryAction, Button, Box, LinearProgress, Typography,
} from '@material-ui/core';

import { getHeaders, processRow } from './services/analyse';
import './file.css';

const rowLimit = 20;

const downloadFile = (filename, fileType, fileContent) => {
  const element = document.createElement('a');
  const file = new Blob([fileContent], { type: fileType });
  element.href = URL.createObjectURL(file);
  element.download = `${filename}-output.csv`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}


const File = ({ file, removeFile }) => {
  const [isRunning, setRunning] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const runFile = async () => {
    setRunning(true);
    const rows = file.content.split('\n');
    if (rows.length > 2) {
      const config = getHeaders(rows[0]);
      config.filename = file.name.split('.').slice(0, -1);
      const limit = rowLimit || rows.length - 1;
      const outputHeaders = config.headers.join(',');
      const output = [
        `${outputHeaders},Duration,FirstLine,SecondLine,Area,City,County,Region,State,Postcode,Country`,
      ];

      for (let index = 1; index <= limit; index += 1) {
        setPercentage((index / limit) * 100);
        const row = rows[index];
        console.log(`${index} of ${limit}`);
        // eslint-disable-next-line no-await-in-loop
        const rowOutput = await processRow(row, index, config);

        output.push(rowOutput);
      }

      console.log(file);
      downloadFile(config.filename, 'text/plain', output.join('\n'));
    }
  };

  return (
    <ListItem className= "listItem" key={file.name}>
      <div className="fileWrapper">

        <ListItemText>{file.name} - {file.size / 1000} KB </ListItemText>
        <ListItemSecondaryAction className="fileButtons">
          <Button className="run-button" disabled={isRunning} onClick={runFile} variant="contained">Run</Button>
          <Button onClick={() => removeFile(file.name)} variant="contained">Delete</Button>
        </ListItemSecondaryAction>
      </div>
      <div className="progress">
        {isRunning && <LinearProgressWithLabel value={percentage} />}
      </div>
    </ListItem>
  );
};

File.propTypes = {
  file: PropTypes.object.isRequired,
  removeFile: PropTypes.func.isRequired,
};

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default File;
