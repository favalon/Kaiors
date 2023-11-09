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
import ListCard from '@/components/ui/ListCard';
import ListInterativeCard from '@/components/ui/ListInterativeCard';

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
                    width: '90%',
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
                    alignItems: 'start',
                    justifyContent: 'center',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}>

                {language === 'JP' && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start', width: '100%',
                        maxHeight: '100vh',
                        mx: '20px',
                    }}>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#333333', mx: '20px', my: '8px' }}>
                            基础:五十音
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                overflowX: 'auto',
                                padding: '10px',
                                width: '90%',
                                borderRadius: '20px',
                                // Hide scrollbar for Chrome, Safari and newer versions of Edge
                                '&::-webkit-scrollbar': {
                                    display: 'none',
                                },
                                // Hide scrollbar for Firefox
                                scrollbarWidth: 'none', // Firefox
                                // IE and Edge
                                '-ms-overflow-style': 'none',
                            }}>
                            {basic_learning_items?.map((item) => (
                                <ListCard item={item} onListItemClick={onListItemClick} />

                            ))}
                        </Box>
                    </Box>)}

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start', width: '100%',
                    maxWidth: '400px',
                    maxHeight: '100vh',
                    mx: '20px',
                }}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#333333', mx: '20px', my: '8px' }}>
                        实战互动
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflowX: 'auto',
                            padding: '10px',

                        }}
                    >
                        {interative_scene?.map((item) => (
                            <ListInterativeCard item={item} onListItemClick={onListItemClick} />

                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};


export default InterativeListPage;
