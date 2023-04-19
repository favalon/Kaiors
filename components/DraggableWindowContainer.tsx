import React from 'react';
import { Box } from '@mui/material';


interface DraggableWindowContainerProps {
    children: React.ReactNode;
  }

const DraggableWindowContainer: React.FC<DraggableWindowContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {children}
    </Box>
  );
};

export default DraggableWindowContainer;
