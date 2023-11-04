import * as React from 'react';
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
import basic_value from "@/public/basic_value.json";

interface InterativeSetting {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    chatSettings: any;
    praticeSettings: any;
    show: boolean;
}


interface InterativeListPageProps {
    interative_scene: any[];
    onListItemClick: (chatSettings: any) => void;
}

const InterativeListPage: React.FC<InterativeListPageProps> = ({ interative_scene, onListItemClick }) => {

    return (

    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '95%',
            maxWidth: '500px',
            mx: 'auto',
            height: '100%',
        }}
    >
        <Box sx={{ width: '100%', maxWidth: '500px', }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    margin: '10px',
                }}
            >
                {interative_scene?.map((item) => (
                    <Card
                        key={item.id}
                        onClick={() => onListItemClick(item)}
                        sx={{
                            maxWidth: '450px',
                            width: '100%',
                            height: '100px',
                            borderRadius: '20px',
                            mx: '25px',
                            display: 'flex',
                            color: '#333333',
                            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                            opacity: "90%",
                            backgroundColor: '#f4a261',

                        }}
                    >
                        <CardActionArea
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'start',
                                justifyContent: 'start',
                            }}
                        >
                            <Box sx={{
                                width: '100px', height: '100%',
                                alignItems: 'end',
                                justifyContent: 'end',
                                overflow: 'hidden',
                                backgroundColor: '#f4a261',
                                borderRadius: '20px 0px 0px 0px ',
                            }}>
                                <CardMedia
                                    component="img"
                                    width="100%"
                                    height="auto"
                                    image={item.imageUrl || 'https://via.placeholder.com/100'}
                                    alt={item.title || 'Default title'}
                                />
                            </Box>
                            <CardContent sx={{ marginLeft: "20px" }}>
                                <Typography gutterBottom variant="h5" component="div"
                                    sx={{ fontWeight: 'bold', color: '#000000', fontSize: 'clamp(14px, 4vw, 24px)' }}
                                >
                                    {item.title || 'Default title'}
                                </Typography>
                                <Typography variant="body2" color="#333333">
                                    {item.description || 'Default description'}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </Box>
    </Box>
    );
};


export default InterativeListPage;
