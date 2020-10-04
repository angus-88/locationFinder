import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './Dropdown.css';
import { TextField } from '@material-ui/core';
import FileList from './FileList';

const showLimit = process.env.NODE_ENV !== 'production';
console.log(process.env.NODE_ENV, showLimit);

const Dropzone = () => {
  const [limit, setLimit] = useState(showLimit ? 5 : undefined);
  const [errorMessages, setErrorMessages] = useState([]);
  const [acceptedFiles, setFiles] = useState([]);
  const rejectedHandler = (errors) => {
    setErrorMessages(errors.map((error) => `${error.file.name} could not be uploaded: ${error.errors[0].code}`));
  };

  const handleDrop = (newFiles) => {
    const dedupedFiles = newFiles.filter((newFile) => !acceptedFiles.find((file) => file.name === newFile.path));
    if (dedupedFiles.length < newFiles.length) {
      setErrorMessages(['Duplicate files detected']);
    } else {
      setErrorMessages(['']);
    }
    setFiles([...acceptedFiles, ...dedupedFiles]);
  };

  const handleDelete = (filename) => {
    const remainingFiles = acceptedFiles.filter((file) => file.name !== filename);
    setFiles(remainingFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['text/plain', 'application/vnd.ms-excel', '.csv'],
    onDrop: handleDrop,
    onDropRejected: rejectedHandler,
  });

  return (
    <div className="container">

      {showLimit
      && <TextField
        label="Row Limit"
        value={limit}
        onChange={(event) => setLimit(Number(event.target.value))} type="number"
      /> }

      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag csv files here, or click to select files</p>
      </div>
      <div>

        {errorMessages.map((message) => <p key={message} className="error">{message}</p>)}
      </div>
      <div>
        <FileList acceptedFiles={acceptedFiles} handleDelete={handleDelete} limit={limit}/>
      </div>
    </div>
  );
};

export default Dropzone;
