import React from 'react';
import { LinearProgress, useTheme } from '@mui/material';
import { styled } from '@mui/system';

const BorderLinearProgress: React.FC<{ value: number }> = ({ value }) => {
  const theme = useTheme();
  const CustomLinearProgress = styled(LinearProgress)(() => ({
    height: 10, // Change the height here
    borderRadius: 5,
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    '& .MuiLinearProgress-bar': {
      borderRadius: 5,
      backgroundColor: '#1a90ff', // Change the color here
    },
  }));

  return <CustomLinearProgress variant="determinate" value={value} />;
};

export default BorderLinearProgress;
