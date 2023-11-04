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
import AccountIcon from '@mui/icons-material/AccountCircle';
import TestIcon from '@mui/icons-material/Category';
import ChatIcon from '@mui/icons-material/Chat';
import DndIcon from '@mui/icons-material/SportsEsports';
import SettingIcon from '@mui/icons-material/Settings';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import { color } from '@mui/system';

interface LeftSideMenuProps {
  onSelect: (selectedItem: string) => void;
}

const LeftSideMenu: React.FC<LeftSideMenuProps> = ({ onSelect }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuItemClick = (value: string) => {
    onSelect(value);
    console.log('Selected menu item:', value);
  };

  const menuItems = [
    { label: '主页', value: 'main', icon: <HomeIcon /> },
    // { label: 'Concept Base', value: 'concept base', icon: <BlurOnIcon /> },
    // { label: 'Account', value: 'account', icon: <AccountIcon /> },
    // { label: 'Setting', value: 'setting', icon: <SettingIcon /> },
    { label: '关于', value: 'about', icon: <AboutIcon /> },
  ];

  const toggleDrawer = () => {
    setMenuOpen(!menuOpen);
  };

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
        {/* Menu items */}
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleMenuItemClick(item.value)}
            sx={{
              backgroundColor: '#edede9',
              width: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333333',
              '&:hover': {
                backgroundColor: '#70ae6e',
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
            }}
            >{item.icon}</ListItemIcon>
          </ListItem>
        ))}
      </Box>
    </>
  );
};

export default LeftSideMenu;
