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
import styles from '@/styles/MainPageList.module.css';
import { width } from '@mui/system';
import basic_value from "@/public/basic_value.json";


interface PraticePageProps {
    userSetting: any;
    scene_items: any;
    onListItemClick: (chatSettings: any) => void;
}


const PraticePage: React.FC<PraticePageProps> = ({ userSetting, scene_items, onListItemClick }) => {

    console.log("scene_items", scene_items)
    const safeSceneItems = scene_items || { partice: [] };

    return (
            
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                //gap: '2px',
                my: '5px',
                width: '100%',
            }}
        >
            {Array.from(safeSceneItems.partice || []).map((item: any, idx: number) => (
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
                    {/* <Box sx={{
                            width: '100%', height: '10px',
                            backgroundColor: '#70ae6e',
                            margin: '0px',
                            padding: '0px',
                        }}> 
                    </Box> */}
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


export default PraticePage;
