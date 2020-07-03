import React from 'react';
import PropTypes from 'prop-types';
import {
  List, Divider,
} from '@material-ui/core';

import './FileList.css';
import File from './File';
import LeavePrompt from './LeavePrompt';

const FileList = ({ acceptedFiles, handleDelete, limit }) => <div>
  {acceptedFiles.length > 0 && <LeavePrompt />}
  <List className="file-list">
    {acceptedFiles.map((file) => (
      <li key={file.name}>
        <Divider />
        <File removeFile={handleDelete} key={file.name} file={file} rowLimit={limit}/>
      </li>
    ))}
  </List>
</div>;

FileList.propTypes = {
  acceptedFiles: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  limit: PropTypes.number,
};

FileList.defaultProps = {
  limit: undefined,
};

export default FileList;
