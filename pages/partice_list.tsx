import React, { useEffect } from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    LinearProgress,
    TextField,
    IconButton
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';


interface PraticeListProps {
    scene_items: any;
    onListItemClick: (chatSettings: any) => void;
}


const PraticeList: React.FC<PraticeListProps> = ({ scene_items, onListItemClick }) => {

    // Conditional rendering based on the data
    if (!scene_items?.length) {
        // Show loading only if the data is undefined or the array is empty
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const onListItemPlayClick = (wavPath: string) => {
        // Create a new audio object with the path to the wav file
        const audio = new Audio(wavPath);

        // Play the audio
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            // Handle any errors playing the audio file here
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}
        >
            {scene_items.map((item: any, idx: any) => (
                <Card
                    onClick={() => onListItemClick(item)}
                    key={item.id}
                    sx={{
                        width: '100%',
                        height: '80px',
                        borderRadius: '12px',
                        my: '2px',
                        display: 'flex',
                        color: '#70ae6e',
                        backgroundColor: '#edede9',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        opacity: "90%",
                        alignItems: 'center',
                    }}
                >
                    {/* <Typography gutterBottom
                                variant="body1"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#d3d3d3',
                                    backgroundColor: '#70ae6e',
                                    padding: '5px',
                                    borderRadius: '12px',
                                }}>
                                {idx || '0'}
                        </Typography> */}
                    <CardActionArea
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            maxWidth: '80%',
                        }}
                    >
                        <CardContent sx={{
                            margin: "5px", width: "100%",
                            height: "100%", justifyContent: 'center',
                            padding: "5px",
                        }}>
                            <Typography
                                gutterBottom
                                variant="body1"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#333333',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100%', // Or a specific pixel value
                                }}
                            >
                                {item.jp_text || 'Default text'}
                            </Typography>
                            <Typography
                                gutterBottom
                                variant="caption"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#333333',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100%', // Or a specific pixel value
                                }}
                            >
                                {item.zh_text || 'Default text'}
                            </Typography>

                        </CardContent>
                    </CardActionArea>
                    <IconButton>
                        <VolumeUpIcon onClick={() => onListItemPlayClick(item.wav_path)} />
                    </IconButton>
                </Card>

            ))}
        </Box>
    );
};


export default PraticeList;
