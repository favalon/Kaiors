import React, { useState } from 'react';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
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
    { label: 'Main Page', value: 'main', icon: <HomeIcon /> },
    { label: 'Partice Test Page', value: 'sound wave', icon: <AboutIcon /> },
    // { label: 'Concept Base', value: 'concept base', icon: <BlurOnIcon /> },
    // { label: 'Account', value: 'account', icon: <AccountIcon /> },
    // { label: 'Setting', value: 'setting', icon: <SettingIcon /> },
    { label: 'About', value: 'about', icon: <AboutIcon /> },
  ];

  const toggleDrawer = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            backgroundColor: '#edede9',
            width: '20%',
            minWidth: '200px',
          },
        }}
        SlideProps={{
          unmountOnExit: true,
        }}
      >
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => {
              handleMenuItemClick(item.value);
              toggleDrawer();
            }}
            sx={{
              backgroundColor: '#edede9',
              color: '#333333',
              '&:hover': {
                backgroundColor: '#70ae6e',
              },
            }}
          >
            <ListItemIcon
            // sx={{
            //     backgroundColor: '#edede9',
            //     color: '#333333',
            //     '&:hover': {
            //       backgroundColor: '#70ae6e',
            //     },
            //   }}
            >{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </Drawer>
    </>
  );
};

export default LeftSideMenu;
