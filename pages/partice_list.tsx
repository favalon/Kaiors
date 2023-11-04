import React, { useEffect } from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    LinearProgress,
    TextField
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';



interface PraticeListProps {
    scene_items: any;
    onListItemClick: (chatSettings: any) => void;
}


const PraticeList: React.FC<PraticeListProps> = ({scene_items, onListItemClick }) => {

    console.log("scene_items", scene_items)
    const safeSceneItems = scene_items || { partice: [] };

    // Conditional rendering based on the data
    if (!scene_items?.length) {
        // Show loading only if the data is undefined or the array is empty
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
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
                    <Typography gutterBottom
                                variant="body1"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#d3d3d3',
                                    backgroundColor: '#70ae6e',
                                    margin: '10px',
                                    padding: '5px',
                                    borderRadius: '12px',
                                }}>
                                {idx || '0'}
                        </Typography>
                    <CardActionArea
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <CardContent sx={{
                            margin: "5px", width: "100%",
                            height: "100%", justifyContent: 'center',
                            padding: "5px",
                        }}>
                            <Typography gutterBottom
                                variant="body1"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#333333',
                                }}>
                                {item.jp_text || 'Default text'}
                            </Typography>
                            <Typography gutterBottom
                                variant="caption"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#333333',
                                }}>
                                {item.zh_text || 'Default text'}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

            ))}
        </Box>     
    );
};


export default PraticeList;
