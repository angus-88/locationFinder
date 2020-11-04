import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, Box, Typography } from '@material-ui/core';

const LinearProgressWithLabel = (props) => (
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

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default LinearProgressWithLabel;
