// CheckInTracker.tsx
import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CheckInTrackerProps {
    checkInData: string[];
    handleCheckIn: () => void;
}

const CheckInTracker: React.FC<CheckInTrackerProps> = ({ checkInData, handleCheckIn }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // 用来格式化日期
    const formatDate = (date: any) => {
        const options: Intl.DateTimeFormatOptions = {day: '2-digit' };
        return new Intl.DateTimeFormat('zh-CN', options).format(date);
    };

    useEffect(() => {
        // Now TypeScript knows that scrollRef.current is an HTMLDivElement
        const scrollContainer = scrollRef.current;
        // Inside your useEffect
        if (scrollContainer) {
            const todayItem = scrollContainer.querySelector('.today') as HTMLElement; // Type assertion here
            if (todayItem) {
                const scrollPosition = todayItem.offsetLeft + todayItem.clientWidth - scrollContainer.clientWidth / 1;
                scrollContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            }
        }
    }, []);


    const renderDays = () => {
        const today = new Date();
        const totalDays = 15; // 总共渲染的天数
        const daysBeforeToday = 7; // 今天前后显示的天数
        const days = [];

        for (let i = -daysBeforeToday; i < totalDays - daysBeforeToday; i++) {
            const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
            const formattedDate = day.toDateString();
            const isCheckedIn = checkInData.includes(formattedDate);
            const isToday = i === 0;

            days.push(
                <Box
                    key={formattedDate}
                    className={isToday ? 'today' : ''}
                    onClick={isToday ? handleCheckIn : undefined} 
                    sx={{
                        minWidth: '80px',
                        height: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start',
                        alignItems: 'center',
                        margin: '0 8px',
                        backgroundColor: isCheckedIn ? 'white' : 'lightgrey',
                        color: isCheckedIn ? 'black' : 'grey',
                        boxShadow: isCheckedIn ? '0 4px 8px rgba(0, 0, 0, 0.25)' : 'none',
                        borderRadius: '12px',
                        padding: '8px',
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: isToday ? 'bold' : 'normal',  color: isToday ? 'black': 'grey'}}>
                        {formatDate(day)}
                    </Typography>
                    {isCheckedIn && (
                        <CheckCircleIcon
                            sx={{
                                color: '#70ae6e', // 设置打勾图标的颜色
                                fontSize: '40px', // 设置打勾图标的大小
                                bottom: '4px', // 位于盒子底部
                                right: '4px', // 位于盒子右侧
                            }}
                        />
                    )}
                    {!isCheckedIn && isToday && (
                        <Typography variant="body1" sx={{margin: '8px 8px', fontWeight: 'bold', color: 'black'}}>
                            点击打卡
                        </Typography>
                    )}
                </Box>
            );
        }

        return days;
    };

    return (
        <Box
            ref={scrollRef}
            sx={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                display: 'flex',
                flexDirection: 'row',
                borderRadius: '20px',
                margin: "10px",
                my: 2,
                p: 1,
                maxWidth: '80%',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.1)',
                    borderRadius: '4px',
                },

            }}
        >
            {renderDays()}
        </Box>
    );
};

export default CheckInTracker;
