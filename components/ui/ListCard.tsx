import React from 'react';
import { Card, CardActionArea, CardContent, Typography, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// If you have a specific type for `item`, you can replace `any` with that type
interface ListCardProps {
  item: any;
  onListItemClick: (item: any) => void;
}

const ListCard: React.FC<ListCardProps> = ({ item, onListItemClick }) => {
  return (
    <Card
      onClick={() => onListItemClick(item)}
      sx={{
        position: 'relative',
        height: '100px',
        width: '100px',
        minWidth: '100px',
        mx: '10px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#70ae6e',
        boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
        '&:hover': {
          boxShadow: '0 5px 5px rgba(0, 0, 0, 0.25)',
          '& .playIcon': {
            opacity: 1,
          },
        },
      }}
    >

        <CardContent sx={{ marginLeft: "20px" }}>
          <Typography gutterBottom variant="h5" component="div"
            sx={{ fontWeight: 'bold', color: 'white', fontSize: 'clamp(14px, 4vw, 24px)' }}
          >
            {item.title || 'Default title'}
          </Typography>
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

export default ListCard;
