import React, { useState, useEffect } from 'react';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AboutIcon from '@mui/icons-material/Info';
import CheckInTracker from '@/components/ui/checkin';

interface LeftSideMenuProps {
  onSelect: (selectedItem: string) => void;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const LeftSideMenu: React.FC<LeftSideMenuProps> = ({ onSelect, language, setLanguage }) => {

  const handleMenuItemClick = (value: string) => {
    onSelect(value);
  };

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'EN' ? 'JP' : 'EN'));
  };

  const menuItems = [
    { label: '主页', value: 'Main', icon: <HomeIcon /> },
    // { label: 'Concept Base', value: 'concept base', icon: <BlurOnIcon /> },
    // { label: 'Account', value: 'account', icon: <AccountIcon /> },
    { label: '关于', value: 'About', icon: <AboutIcon /> },
  ];


  return (
    <>
    
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 'auto',// Width of the side menu
          minHeight: '100vh',
          height: 'max-content',
          backgroundColor: '#edede9',
          overflow: 'auto',
          borderRadius: '20px',
          margin: '5px',
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        <ListItem
          onClick={() => toggleLanguage()}
          sx={{
            backgroundColor: '#edede9',
            width: '100%',
            alignItems: 'end',
            justifyContent: 'center',
            color: '#333333',
          }}
        >
          <ListItemIcon
            sx={{
              color: '#edede9',
              width: '100%',
              height: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              backgroundColor: '#70ae6eee',
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: '#333333aa',
              },
            }}
          >
            {language}
          </ListItemIcon>
        </ListItem>

        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            onClick={() => handleMenuItemClick(item.value)}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: 'auto',
              '&:hover': {
                backgroundColor: '#edede9',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: '#333333',
                alignItems: 'flex-end',
                justifyContent: 'center',
                mx: '10px',
                my: '10px',
                borderRadius: '20px',
                '&:hover': {
                  color: '#70ae6e',
                },
              }}
            >
              {React.cloneElement(item.icon, {
                sx: {
                  fontSize: '30px', // Set the size of the icon here
                }
              })}
            </ListItemIcon>
          </ListItem>
        ))}

      </Box>

    </>
  );
};

export default LeftSideMenu;
