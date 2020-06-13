import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './Dropdown.css';
import FileList from './FileList';

const Dropzone = () => {
  const [errorMessages, setErrorMessages] = useState([]);
  const rejectedHandler = (errors) => {
    setErrorMessages(errors.map((error) => `${error.file.name} could not be uploaded: ${error.errors[0].code}`));
  };


  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: ['text/plain', 'application/vnd.ms-excel'],
    multiple: false,
    onDropAccepted: () => setErrorMessages([]),
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
        {acceptedFiles && <FileList acceptedFiles={acceptedFiles} />}
      </div>
    </div>
  );
};

export default Dropzone;
