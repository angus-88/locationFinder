import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
} from '@material-ui/core';

import './FileList.css';
import File from './File';

const FileList = ({ acceptedFiles, handleDelete }) => <div>
  <List className="file-list">
    {acceptedFiles.map((file) => (
      <File removeFile={handleDelete} key={file.name} file={file} />
    ))}
  </List>
</div>;

FileList.propTypes = {
  acceptedFiles: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default FileList;
