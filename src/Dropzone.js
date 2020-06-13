import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './Dropdown.css';
import FileList from './FileList';

const Dropzone = () => {
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
    accept: ['text/plain', 'application/vnd.ms-excel'],
    multiple: false,
    onDrop: handleDrop,
    onDropRejected: rejectedHandler,
  });

  return (
    <div className="container">

      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag csv files here, or click to select files</p>
      </div>
      <div>

        {errorMessages.map((message) => <p key={message} className="uploadError">{message}</p>)}
      </div>
      <div>
        {<FileList acceptedFiles={acceptedFiles} handleDelete={handleDelete}/>}
      </div>
    </div>
  );
};

export default Dropzone;
