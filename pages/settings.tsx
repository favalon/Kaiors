import React, { useState } from 'react';
import { Box, TextField, Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { PageData } from "@/components/types";

interface SettingtPageProps {
    pageData: PageData
    setPageData: (pageData: PageData) => void;
}

function Settings({ pageData, setPageData }: SettingtPageProps){
    const [userName, setUserName] = useState('');
    const [language, setLanguage] = React.useState('english');
    const [englishLevel, setEnglishLevel] = useState('');
    const [concept, setTopic] = useState('');

    const handleSave = () => {
        const updatedPageData: PageData = { ...pageData };
        if (updatedPageData.setting) {
            updatedPageData.setting.userName = userName;
            updatedPageData.setting.language = language;
            updatedPageData.setting.englishLevel = englishLevel;
            updatedPageData.setting.concept = concept;
            
            //console.log('save setting', userName, language, englishLevel, concept);
            setPageData(updatedPageData);
        } 

    };

    const handleLanguageChange = (event: any, newLanguage: React.SetStateAction<string> | null) => {
        if (newLanguage !== null) {
            setLanguage(newLanguage);
        }
    };

    const handleEnglishLevelChange = (event: any, newEnglishLevel: React.SetStateAction<string> | null) => {
        if (newEnglishLevel !== null) {
            setEnglishLevel(newEnglishLevel);
        }
    };

    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                '& .MuiButton-root': { m: 2 },
                '& .MuiToggleButtonGroup-root': { m: 1 },
            }}
            noValidate
            autoComplete="off"
        >
            <Typography variant="h6">Settings</Typography>
            <TextField
                label="Learning Topic"
                value={concept}
                onChange={(e) => setTopic(e.target.value)}
            />
            <TextField
                label="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <ToggleButtonGroup
                value={language}
                exclusive
                onChange={handleLanguageChange}
                aria-label="Language"
            >
                <ToggleButton value="english" aria-label="EN">
                    EN
                </ToggleButton>
                <ToggleButton value="中文" aria-label="中文">
                    中文
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                value={englishLevel}
                exclusive
                onChange={handleEnglishLevelChange}
                aria-label="English Level"
            >
                <ToggleButton value="A1" aria-label="A1">
                    A1
                </ToggleButton>
                <ToggleButton value="A2" aria-label="A2">
                    A2
                </ToggleButton>
                <ToggleButton value="B1" aria-label="B1">
                    B1
                </ToggleButton>
                <ToggleButton value="B2" aria-label="B2">
                    B2
                </ToggleButton>
                <ToggleButton value="C1" aria-label="C1">
                    C1
                </ToggleButton>
                <ToggleButton value="C2" aria-label="C2">
                    C2
                </ToggleButton>
            </ToggleButtonGroup>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleSave}
                sx={{
                    typography: {
                        color: 'text.primary',
                    },
                }}
            >
                Save
            </Button>
            {/* <Button variant="outlined" color="secondary" onClick={onClose}>
                Close
            </Button> */}
        </Box>
    );
}


export default Settings;
