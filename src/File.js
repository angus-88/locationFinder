import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, Button, Box, LinearProgress, Typography,
} from '@material-ui/core';

// eslint-disable-next-line import/named
import { getHeaders, processRow } from './services/analyse';
import './file.css';

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


const File = ({ file, removeFile, rowLimit }) => {
  const [isRunning, setRunning] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const errorsRef = useRef([]);
  const [filename, setFilename] = useState('');
  const [results, setResults] = useState();

  const runFile = async () => {
    setRunning(true);
    const fileContent = await file.text();

    const rows = fileContent.split('\n');
    if (rows.length > 2) {
      const config = getHeaders(rows[0]);
      config.filename = file.name.split('.').slice(0, -1);
      setFilename(config.filename);
      let limit = rows.length - 2;
      if (rowLimit) {
        limit = rows.length < rowLimit ? rows.length - 2 : rowLimit;
      }
      const outputHeaders = config.headers.join(',');
      const output = [
        `${outputHeaders},Duration,FirstLine,SecondLine,Area,City,County,Region,State,Postcode,Country`,
      ];

      for (let index = 1; index <= limit; index += 1) {
        setPercentage((index / limit) * 100);
        const row = rows[index];
        console.log(`${index} of ${limit}`);
        // eslint-disable-next-line no-await-in-loop
        const result = await processRow(row, index, config);
        output.push(result.row);

        if (result.error) {
          const errorIndex = errorsRef.current.findIndex(((error) => error.message === result.error));
          if (errorIndex >= 0) {
            errorsRef.current[errorIndex].count += 1;
          } else {
            errorsRef.current.push({ message: result.error, count: 1 });
          }
        }
      }

      setResults(output.join('\n'));
      setRunning(false);
      downloadFile(config.filename, 'text/plain', output.join('\n'));
    }
  };

  const handleCancelDelete = () => {
    // TODO stop processing loop
    if (isRunning) {
      setRunning(false);
    } else {
      removeFile(file.name);
    }
  };

  return (
    <ListItem className= "listItem" key={file.name}>
      <div className="fileWrapper">

        <div className="fileName">{file.name} - {file.size / 1000} KB </div>
        <div className="fileButtons">
          {results
            && <Button
              className="run-button"
              onClick={() => downloadFile(filename, 'text/plain', results)}
              variant="contained">Download</Button>}
          {!results
           && <Button className="run-button" disabled={isRunning} onClick={runFile} variant="contained">Run</Button>}
          <Button onClick={handleCancelDelete} variant="contained">{isRunning ? 'Stop' : 'Delete'}</Button>
        </div>
        <div className="progress">
          {isRunning && <LinearProgressWithLabel value={percentage} />}
        </div>
        <div className="fileErrors">
          {errorsRef.current.map(
            (error, index) => <p key={index} className="error">{`Error count: ${error.count} - ${error.message}`}</p>,
          )}
        </div>
      </div>
    </ListItem>
  );
};

File.propTypes = {
  file: PropTypes.object.isRequired,
  removeFile: PropTypes.func.isRequired,
  rowLimit: PropTypes.number,
};

File.defaultProps = {
  rowLimit: undefined,
};

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default File;
