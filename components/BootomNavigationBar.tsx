import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import styles from 'styles/BottomNavigationBar.module.css';


interface BottomNavigationBarProps {
  onSelect: (selectedItem: string) => void;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ onSelect }) => {
  const [selectedItem, setSelectedItem] = useState('home');

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    onSelect(item);
  };

  return (
    <div className={styles.bottomnavigationbar}>
      <button className={styles.button} onClick={() => handleSelect('test')}>English Level Test</button>
      <button className={styles.button} onClick={() => handleSelect('concept')}>Concept Interative</button>
      <button className={styles.button} onClick={() => handleSelect('travel')}>Travel Interative</button>
      <button className={styles.button} onClick={() => handleSelect('dnd')}>Dungeon Master</button>
    </div>
  );
};

export default BottomNavigationBar;
