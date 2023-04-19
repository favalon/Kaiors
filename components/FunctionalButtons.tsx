import React from 'react';
import { Box, Button } from '@mui/material';


interface FunctionalButtonsProps {
    buttons: {
        id: string;
        label: string;
        isVisible: boolean;
    }[];
    onStartQuiz: () => void;
    onCreateNote: () => void;
    onGetResult: () => void;
}

const FunctionalButtons:  React.FC<FunctionalButtonsProps>= ({ buttons, onCreateNote, onStartQuiz, onGetResult}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'space-between',
        gap: '8px',
        height: '32px',
        width: '100%',
        backgroundColor: '#333333',
        marginBottom: '8px',
        position: 'fixed',
        bottom: '72px', // Adjust this value based on the height of your input area container
        left: 0,
      }}
    >
      {buttons.map(({ id, label, isVisible }) => (
        isVisible && (
          <Button
            key={id}
            onClick={() => {
              if (id === 'start_quiz') {
                onStartQuiz();
              } else if (id === 'create_note') {
                console.log('Create note button clicked');
                onCreateNote();
              } else if (id === 'get_test_result') {
                onGetResult();
              }
            }}
            sx={{
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: '#555555',
              },
              color: '#FFC300',
              fontWeight: 'bold',
            }}
          >
            {label}
          </Button>
        )
      ))}
    </Box>
  );
};

export default FunctionalButtons;
