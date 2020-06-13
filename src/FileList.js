import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  List,
} from '@material-ui/core';

import './FileList.css';
import File from './File';

const FileList = ({ acceptedFiles }) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const removeFile = (fileName) => {
    const newFiles = files.filter((file) => file.name !== fileName);
    setFiles(newFiles);
  };

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const getFileContents = async () => {
        const dedupedFiles = acceptedFiles.filter((newFile) => !files.find((file) => file.name === newFile.path));
        if (dedupedFiles.length < acceptedFiles.length) {
          setErrorMessages(['Duplicate files detected']);
        }
        const fileContents = await Promise.all(dedupedFiles.map(async (fileBlob) => {
          const text = await fileBlob.text();
          return {
            name: fileBlob.path,
            size: fileBlob.size,
            content: text,
          };
        }));

        setFiles((existingFiles) => ([
          ...existingFiles,
          ...fileContents,
        ]));
      };
      getFileContents();
    }

    return () => console.log('destroying');
  }, [acceptedFiles]);

  const Files = () => files.map((file) => (
    <File removeFile={removeFile} key={file.name} file={file} />
  ));

  return <div>
    <div>
      {errorMessages.map((message) => <p key={message} className="uploadError">{message}</p>)}
    </div>
    <List className="file-list">
      <Files />
    </List>
  </div>;
};

FileList.propTypes = {
  acceptedFiles: PropTypes.array.isRequired,
};

export default FileList;
