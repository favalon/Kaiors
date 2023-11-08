import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    Button
} from '@mui/material';
import styles from '@/styles/interativeList.module.css';
import CheckInTracker from '@/components/ui/checkin';
import LockIcon from '@mui/icons-material/Lock';

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
    language: string;
    interative_scene: any[];
    basic_learning_items: any[];
    onListItemClick: (chatSettings: any) => void;
}

const InterativeListPage: React.FC<InterativeListPageProps> = ({ language, basic_learning_items, interative_scene, onListItemClick }) => {
    // 使用state来控制打卡按钮的状态
    const [hasCheckedIn, setHasCheckedIn] = useState(false);

    // 检查用户是否已经打卡
    useEffect(() => {
        const today = new Date().toDateString();
        const lastCheckInDate = localStorage.getItem('lastCheckInDate');
        if (lastCheckInDate === today) {
            // 如果用户今天已经打卡，设置按钮状态为不可点击
            setHasCheckedIn(true);
        }
    }, []);

    // 使用state来控制打卡数据
    const [checkInData, setCheckInData] = useState(() => {
        // 尝试从localStorage获取打卡数据并解析成数组
        try {
            const data = localStorage.getItem('checkInData');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Parsing error: ', e);
            return []; // 如果解析失败，则返回空数组
        }
        console.log(checkInData);
    });

    // 更新localStorage的逻辑
    const handleCheckIn = () => {
        const today = new Date().toDateString();

        setCheckInData((prevData: any) => {
            // Check if today's date is already in the array
            if (!prevData.includes(today)) {
                const newData = [...prevData, today]; // Add today's date
                localStorage.setItem('checkInData', JSON.stringify(newData)); // Save the new array to localStorage
                localStorage.setItem('lastCheckInDate', today); // Update the last check-in date
                return newData;
            }
            return prevData; // Return the previous data if today is already included
        });

        setHasCheckedIn(true); // Disable the check-in button
    };


    return (

        <Box
            sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'start',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '1200px',
                mx: 'auto',
                height: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    mx: '10px',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        color: 'black',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
                        borderRadius: '12px',
                        padding: '8px',
                        height: '80px',
                        width: '90px',
                        mx: '10px',
                    }}>
                    <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', color: '#FA5151' }}>
                        解锁
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#333333' }}>
                        {checkInData.length}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        color: 'black',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
                        borderRadius: '12px',
                        padding: '8px',
                        height: '80px',
                        width: '90px',
                        mx: '10px',
                    }}>
                    <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', color: '#FA5151' }}>
                        累计天数
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#333333' }}>
                        {checkInData.length}
                    </Typography>
                </Box>
                <CheckInTracker checkInData={checkInData} handleCheckIn={handleCheckIn} />
            </Box>


            <Box
                sx={{
                    justifyContent: 'center',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '100px',
                }}>

                {language === 'JP' && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', width: '100%',
                        maxWidth: '400px',
                        maxHeight: '100vh',
                        my: '10px',
                    }}>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#333333' }}>
                            基础:五十音
                        </Typography>
                        <Grid container spacing={2} sx={{ maxWidth: '100%', margin: '0 auto' }}>
                            {basic_learning_items?.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item.id}> {/* Adjust grid breakpoints as needed */}
                                    <Card
                                        onClick={() => onListItemClick(item)}
                                        className={styles.cube}  // Add the cube class here
                                        sx={{
                                            height: '100px',
                                            borderRadius: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#70ae6e',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
                                            '&:hover': {
                                                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25)',
                                            },
                                            // You may need to adjust the transformOrigin based on your design
                                            transformOrigin: 'center center'
                                        }}
                                    >
                                        <CardActionArea
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'start',
                                                justifyContent: 'start',
                                                width: '100%', // make sure action area fills the card
                                            }}
                                        >
                                            <CardContent sx={{ marginLeft: "20px" }}>
                                                <Typography gutterBottom variant="h5" component="div"
                                                    sx={{ fontWeight: 'bold', color: 'white', fontSize: 'clamp(14px, 4vw, 24px)' }}
                                                >
                                                    {item.title || 'Default title'}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>)}

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', width: '100%',
                    maxWidth: '400px',
                    maxHeight: '100vh',
                    my: '10px',
                }}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#333333' }}>
                        实战互动
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            maxWidth: '400px',
                            margin: '10px',
                            padding: '10px',
                            overflow: 'auto', // Enable scrolling for overflow content
                        }}
                    >

                        {interative_scene?.map((item) => (
                            <Card
                                key={item.id}
                                sx={{
                                    width: '100%',
                                    height: '100px',
                                    borderRadius: '20px',
                                    mx: '25px',
                                    display: 'flex',
                                    color: '#333333',
                                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                    backgroundImage: `url(${item.imageUrl || 'https://via.placeholder.com/100'})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    position: 'relative', // Needed for pseudo-element positioning
                                    '&:after': { // Pseudo-element for overlay
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust darkness here
                                        borderRadius: 'inherit', // To match the Card's border radius
                                    },
                                    // Ensure that content of the card is positioned above the overlay
                                    '& > *': { position: 'relative', zIndex: 1 },
                                }}
                                onClick={() => {
                                    if (!item.lock) {
                                        onListItemClick(item);
                                    } else {
                                        alert(`还需要获得${item.starsNeeded}个星星进行解锁。`); // Show message if locked
                                    }
                                }}
                            >
                                {/* Add an overlay if the item is locked */}
                                {item.lock && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)', // More darkness for locked items
                                            zIndex: 1, // Below the lock icon but above the content
                                            borderRadius: 'inherit',
                                        }}
                                    />
                                )}
                                <CardActionArea
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'start',
                                        my: 'auto',
                                    }}
                                >
                                    <CardContent sx={{ marginLeft: "20px", position: 'relative' }}>
                                        {item.lock && (
                                            <LockIcon
                                                sx={{
                                                    color: 'white',
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    zIndex: 2, // Make sure the lock icon appears above the content
                                                    fontSize: '2rem', // Adjust the size as needed
                                                }}
                                            />
                                        )}

                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="div"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: item.lock ? 'rgba(255, 255, 255, 0.5)' : 'white', // Dimmed color for locked items
                                                fontSize: 'clamp(14px, 4vw, 24px)',
                                                position: 'relative',
                                                zIndex: 1
                                            }}
                                        >
                                            {item.title || 'Default title'}
                                        </Typography>
                                        {item.description !== "" && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: item.lock ? 'rgba(255, 255, 255, 0.5)' : '#f2f2f2', // Dimmed color for locked items
                                                    position: 'relative',
                                                    zIndex: 1
                                                }}
                                            >
                                                {item.description || 'Default description'}
                                            </Typography>
                                        )}


                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};


export default InterativeListPage;
