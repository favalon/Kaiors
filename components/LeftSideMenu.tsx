import React, { useState } from 'react';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AboutIcon from '@mui/icons-material/Info';
import TranslateIcon from '@mui/icons-material/Translate'; 
import AccountIcon from '@mui/icons-material/AccountCircle';
import TestIcon from '@mui/icons-material/Category';
import ChatIcon from '@mui/icons-material/Chat';
import DndIcon from '@mui/icons-material/SportsEsports';
import SettingIcon from '@mui/icons-material/Settings';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import { color } from '@mui/system';

interface LeftSideMenuProps {
  onSelect: (selectedItem: string) => void;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const LeftSideMenu: React.FC<LeftSideMenuProps> = ({ onSelect, language, setLanguage}) => {

  const handleMenuItemClick = (value: string) => {
    onSelect(value);
  };

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'EN' ? 'JP' : 'EN'));
};

  const menuItems = [
    { label: '主页', value: 'main', icon: <HomeIcon /> },
    // { label: 'Concept Base', value: 'concept base', icon: <BlurOnIcon /> },
    // { label: 'Account', value: 'account', icon: <AccountIcon /> },
    { label: '关于', value: 'about', icon: <AboutIcon /> },
  ];


  return (
    <>
      <Box
        sx={{
          width: 'auto', // Width of the side menu
          height: '100vh', // Full viewport height
          backgroundColor: '#edede9',
          overflow: 'auto',
          borderRadius: '20px',
          margin: '5px',
        }}
      >
        <ListItem
            onClick={() => toggleLanguage()}
            sx={{
              backgroundColor: '#edede9',
              width: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333333',
              marginBottom: '20px',
            }}
          >
            <ListItemIcon
            sx={{
              color: '#edede9',
              width: 'auto',
              height: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              backgroundColor: '#70ae6e',
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: '#333333',
              },
            }}
            >
              {language}
            </ListItemIcon>
          </ListItem>
        
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleMenuItemClick(item.value)}
            sx={{
              width: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: '#edede9',
              },
            }}
          >
            <ListItemIcon
            sx={{
              color: '#000000',
              width: 'auto',
              height: '50px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: '#70ae6e',
                color: '#edede9',
              },
            }}
            >{item.icon}</ListItemIcon>
          </ListItem>
        ))}
      </Box>
    </>
  );
};

export default LeftSideMenu;
