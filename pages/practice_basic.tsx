import SoundWave from 'components/SoundWave';
import Box from '@mui/material/Box'; // Assuming you're using MUI's Box component
import React, { useState, useEffect } from "react";
import PraticeList from './partice_list';

interface PracticeBasicProps {
    scene_items: any;
    onListItemClick: (chatSettings: any) => void;
    audio_path: string;
    text_content: any;
    n: number;
    color: string;
}

const PracticeBasic: React.FC<PracticeBasicProps> = ({ scene_items, onListItemClick, audio_path, text_content, n, color  }) => {
  return (
    <Box
    sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'center',
        width: '100%',
    }}
>
    <Box 
        sx={{ 
            width: '20%', 
            maxWidth: '400px', 
            overflowY: 'auto',  // Allow vertical scrolling
            height: '100vh',    // Optional, make the box take the full viewport height
        }}
    >
        <PraticeList scene_items={scene_items} onListItemClick={onListItemClick} />
    </Box>
    <SoundWave audioPath={audio_path} text_content={text_content} n={n} color={color} />
</Box>
)
}

export default PracticeBasic;
