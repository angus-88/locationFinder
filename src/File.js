import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, Button,
} from '@material-ui/core';

// eslint-disable-next-line import/named
import { getHeaders, processRow } from './services/analyse';
import LinearProgressWithLabel from './ProgressWithLabel';
import './file.css';
import downloadFile from './services/download';

const File = ({ file, removeFile, rowLimit }) => {
  const [percentage, setPercentage] = useState(0);
  const errorsRef = useRef([]);
  const isRunningRef = useRef(false);
  const currentIndexRef = useRef(1);
  const outputRef = useRef([]);
  const configRef = useRef();
  const fileContentRowsRef = useRef();
  const [filename, setFilename] = useState('');
  const [results, setResults] = useState();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsRunning(isRunningRef.current);
  }, [isRunningRef.current]);

  const processRows = async () => {
    isRunningRef.current = true;
    let limit = fileContentRowsRef.current.length - 2;
    if (rowLimit) {
      limit = fileContentRowsRef.current.length < rowLimit ? fileContentRowsRef.current.length - 2 : rowLimit;
    }

    while (currentIndexRef.current <= limit && isRunningRef.current) {
      setPercentage((currentIndexRef.current / limit) * 100);
      const row = fileContentRowsRef.current[currentIndexRef.current];
      console.log(`${currentIndexRef.current} of ${limit}`);
      // eslint-disable-next-line no-await-in-loop
      const result = await processRow(row, currentIndexRef.current, configRef.current);
      outputRef.current.push(result.row);

      if (result.error) {
        const errorIndex = errorsRef.current.findIndex(((error) => error.message === result.error));
        if (errorIndex >= 0) {
          errorsRef.current[errorIndex].count += 1;
        } else {
          errorsRef.current.push({ message: result.error, count: 1 });
        }
      }

      currentIndexRef.current += 1;
    }

    if (isRunningRef.current) {
      setResults(outputRef.current.join('\n'));
      downloadFile(configRef.current.filename, 'text/plain', outputRef.current.join('\n'));
      isRunningRef.current = false;
      setIsRunning(false);
    }
  };

  const runFile = async () => {
    if (isRunningRef.current) {
      isRunningRef.current = false;
      setIsRunning(false);
    } else if (currentIndexRef > 1) {
      processRows();
    } else {
      const fileContent = await file.text();

      const rows = fileContent.split('\n');
      fileContentRowsRef.current = rows;

      if (rows.length > 2) {
        const config = getHeaders(rows[0]);
        configRef.current = config;
        config.filename = file.name.split('.').slice(0, -1);
        setFilename(config.filename);

        const outputHeaders = config.headers.join(',');
        outputRef.current.push(
          `${outputHeaders},Duration,FirstLine,SecondLine,Area,City,County,Region,State,Postcode,Country`,
        );
        processRows();
      } else {
        errorsRef.current.push('File does not contain enough data');
      }
    }
  };

  const handleCancelDelete = () => {
    removeFile(file.name);
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
           && <Button
             className="run-button"
             onClick={runFile}
             variant="contained"
           >
             {isRunning ? 'Stop' : 'Run'}
           </Button>}
          <Button onClick={handleCancelDelete} disabled={isRunning} variant="contained">Delete</Button>
        </div>
        <div className="progress">
          {percentage > 0 && <LinearProgressWithLabel value={percentage} />}
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

export default File;
