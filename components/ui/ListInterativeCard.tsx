import React from 'react';
import { Box, Card, CardActionArea, CardContent, Typography, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock'; // Import this only if you're using a lock icon
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
interface ListInterativeCardProps {
  item: {
    id: string;
    imageUrl?: string;
    lock?: boolean;
    starsNeeded?: number;
    title?: string;
    description?: string;
    
  };
  language: string;
  onListItemClick: (item: any) => void; // Replace 'any' with a proper type if available
}

const ListInterativeCard: React.FC<ListInterativeCardProps> = ({ item, language, onListItemClick }) => {
  console.log(language);
  return (
    <Card
      key={item.id}
      sx={{
        width: '200px',
        height: '200px',
        minWidth: '200px',
        borderRadius: '20px',
        mx: '10px',
        display: 'flex',
        color: '#333333',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        backgroundImage: `url(${item.imageUrl || 'https://via.placeholder.com/100'})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative',
        '&:hover': {
            boxShadow: '0 5px 5px rgba(0, 0, 0, 0.25)',
            '& .playIcon': {
              opacity: 1,
            },
        },
        
      }}
      onClick={() => {
        if (!item.lock) {
          onListItemClick(item);
        } else {
          alert(`还需要获得${item.starsNeeded}个星星进行解锁。`);
        }
      }}
    >
      {(item.lock||language=="EN") && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1,
            borderRadius: 'inherit',
          }}
        />
      )}
        <CardContent sx={{}}>
          {(item.lock||language=="EN") && (
            <LockIcon
              sx={{
                color: 'white',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                fontSize: '2rem',
              }}
            />
          )}
          <Box
          sx={{
            width: '200px',
            padding: '12px',
            borderRadius: '20px',
            backgroundColor: item.lock ? 'rgba(0, 0, 0, 0.7)' : '#333333aa',
          }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: item.lock ? 'rgba(255, 255, 255, 0.5)' : 'white',
              fontSize: 'clamp(14px, 4vw, 24px)',
              margin:'auto'
            }}
          >
            {item.title || 'Default title'}
          </Typography>
          </Box>
          {/* {item.description && (
            <Typography
              variant="body2"
              sx={{
                color: item.lock ? 'rgba(255, 255, 255, 0.5)' : '#f2f2f2',
                position: 'relative',
                zIndex: 1
              }}
            >
              {item.description || 'Default description'}
            </Typography> 
          )}*/}
        </CardContent>
        <IconButton
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          opacity: 0,
          transition: 'opacity 0.3s',
          fontSize: '60px',
          '&:hover': {
            backgroundColor: 'white',
            color: '#70ae6e'
          },
        }}
        className="playIcon"
      >
        <PlayArrowIcon fontSize="inherit" />
      </IconButton>
    </Card>
  );
}

export default ListInterativeCard;
