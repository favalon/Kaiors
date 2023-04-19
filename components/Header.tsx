import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ProjectIcon from '@mui/icons-material/AccountTree'; // Replace with your project icon
import LeftSideMenu from './LeftSideMenu';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import TestIcon from '@mui/icons-material/Category';
import DndIcon from '@mui/icons-material/SportsEsports';
import SettingIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import QuizIcon from '@mui/icons-material/Quiz';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import BlurOnIcon from '@mui/icons-material/BlurOn';

interface HeaderProps {
    selectedPage: string;
    onMenuItemSelect: (selectedItem: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedPage, onMenuItemSelect }) => {

    const [title, setTitle] = useState<string>("Kairos");
    const [icon, setIcon] = useState<React.ElementType>(ProjectIcon);

    useEffect(() => {
        if (selectedPage === "mian") {
            setTitle("Kairos");
        } else if (selectedPage === "chat") {
            setTitle("Kairos");
            setIcon(ChatIcon);
        } else if (selectedPage === "setting") {
            setTitle("Setting");
        } else if (selectedPage === "about") {
            setTitle("About");
        } else if (selectedPage === "help") {
            setTitle("Help");
        } else if (selectedPage === "account") {
            setTitle("Account");
        } else if (selectedPage === "login") {
            setTitle("Login");
        } else if (selectedPage === "register") {
            setTitle("Register");
        } else if (selectedPage === "concept base") {
            setTitle("Concept Base");
        } else if (selectedPage === "quiz") {
            setTitle("Quiz");
        } else{
            setTitle("Kairos");
        }
    }, [selectedPage]);


    const renderIcon = () => {
        if (selectedPage === "mian") {
            return <HomeIcon sx={{mr:"10px"}}/>
        } else if (selectedPage === "chat") {
            return <ChatIcon sx={{mr:"10px"}}/>
        } else if (selectedPage === "setting") {
            return<SettingIcon sx={{mr:"10px"}}/>
        } else if (selectedPage === "about") {
            return<InfoIcon sx={{mr:"10px"}}/>
        } else if (selectedPage === "help") {
            return<HelpIcon sx={{mr:"10px"}}/>
        } else if (selectedPage === "account") {
            return<AccountCircleIcon sx={{mr:"10px"}}/>
        } else if (selectedPage === "login") {
            return<LoginIcon sx={{mr:"10px"}}/>
        } else if (selectedPage === "register") {
            return<AppRegistrationIcon sx={{mr:"10px"}}/>
        } else if (selectedPage === "concept base") {
            return<BlurOnIcon sx={{mr:"10px"}}/>
        } else if (selectedPage === "quiz") {
            return<QuizIcon sx={{mr:"10px"}}/>
        } else{
            return<ProjectIcon sx={{mr:"10px"}}/>
        }
      };


    console.log("selectedPage: ", selectedPage);
    return (
        <AppBar position="static">
            <Toolbar
                sx={{
                    backgroundColor: '#333333',
                    color: '#FFC300',
                    '&:hover': {
                        backgroundColor: '#333333',
                    },
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <LeftSideMenu onSelect={onMenuItemSelect} />
                    </Box>
                    <Typography variant="h6" component="div" sx={{fontWeight:"bold"}}>
                        {renderIcon()}
                        {title}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} >
                        
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
