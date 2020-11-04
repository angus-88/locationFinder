import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, Button,
} from '@material-ui/core';
import parse from 'csv-parse/lib/sync';
import stringify from 'csv-stringify/lib/sync';

// eslint-disable-next-line import/named
import { getHeaders, processRow } from './services/analyse';
import LinearProgressWithLabel from './ProgressWithLabel';
import './file.css';
import downloadFile from './services/download';

const File = ({ file, removeFile, rowLimit }) => {
  const [percentage, setPercentage] = useState(0);
  const [errors, setErrors] = useState({});
  const isRunningRef = useRef(false);
  const currentIndexRef = useRef(1);
  const outputRef = useRef([]);
  const configRef = useRef();
  const fileContentRowsRef = useRef();
  const [filename, setFilename] = useState('');
  const [results, setResults] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const [cantRun, setCantRun] = useState(false);

  const addError = (error, row) => {
    setErrors((currentErrors) => {
      const currentError = currentErrors[error] || {};
      if (!currentError.count) {
        currentError.count = 0;
        currentError.rows = [];
      }
      const updatedErrors = {
        ...currentErrors,
        [error]: {
          message: error,
          count: currentError.count + 1,
          rows: [...currentError.rows, row],
        },
      };
      return updatedErrors;
    });
  };

  useEffect(() => {
    setIsRunning(isRunningRef.current);
  });

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
        addError(result.error, currentIndexRef.current + 1);
      }

      currentIndexRef.current += 1;
    }

    if (isRunningRef.current) {
      setResults(stringify(outputRef.current));
      // downloadFile(configRef.current.filename, 'text/plain', outputRef.current.join('\n'));
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
      const contentJson = parse(fileContent);

      fileContentRowsRef.current = contentJson;

      if (contentJson.length > 1) {
        const config = getHeaders(contentJson[0]);
        if (config.latIndex >= 0 && config.longIndex >= 0) {
          configRef.current = config;
          config.filename = file.name.split('.').slice(0, -1);
          setFilename(config.filename);

          outputRef.current.push([
            ...config.headers,
            'Duration',
            'FirstLine',
            'SecondLine',
            'Area',
            'City',
            'County',
            'Region',
            'State',
            'Postcode',
            'Country',
          ]);
          processRows();
        } else {
          addError('Unable to determine lat and long headers', 'header');
          setCantRun(true);
        }
      } else {
        addError('File does not contain enough data', 'header');
        setCantRun(true);
      }
    }
  };

  const handleCancelDelete = () => {
    removeFile(file.name);
  };

  const getRunButtonText = () => {
    if (isRunning) {
      return 'Stop';
    } if (percentage > 0) {
      return 'Continue';
    }
    return 'Start';
  };

  return (
    <ListItem className= "listItem" key={file.name} component="div">
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
             disabled={cantRun}
           >
             {getRunButtonText()}
           </Button>}
          <Button onClick={handleCancelDelete} disabled={isRunning} variant="contained">Delete</Button>
        </div>
        <div className="progress">
          {percentage > 0 && <LinearProgressWithLabel value={percentage} />}
        </div>
        <div className="fileErrors">
          {Object.values(errors).map(
            (error) => <p
              key={error.message}
              className="error">
              {`Error count: ${error.count} - ${error.message} on rows: ${error.rows}`}
            </p>,
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
