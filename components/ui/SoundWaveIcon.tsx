import React from 'react';
import styles from '@/styles/SoundWave.module.css';

interface SoundWaveIconProps {
  color?: string;
}

const SoundWaveIcon: React.FC<SoundWaveIconProps> = ({ color = '#fff' }) => {
  return (
    <div className={styles.soundWave}>
        <div className={styles.bar} style={{ backgroundColor: color }} />
        <div className={styles.bar} style={{ backgroundColor: color }} />
        <div className={styles.bar} style={{ backgroundColor: color }} />
        <div className={styles.bar} style={{ backgroundColor: color }} />
    </div>
  );
};

export default SoundWaveIcon;
