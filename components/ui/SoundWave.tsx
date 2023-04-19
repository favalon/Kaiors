import React from 'react';
import styles from '@/styles/SoundWave.module.css';

interface SoundWaveProps {
  color?: string;
}

const SoundWave: React.FC<SoundWaveProps> = ({ color = '#000' }) => {
  return (
    <div className={styles.soundWave}>
        <div className={styles.bar} style={{ backgroundColor: color }} />
        <div className={styles.bar} style={{ backgroundColor: color }} />
        <div className={styles.bar} style={{ backgroundColor: color }} />
        <div className={styles.bar} style={{ backgroundColor: color }} />
        <div className={styles.bar} style={{ backgroundColor: color }} />
        <div className={styles.bar} style={{ backgroundColor: color }} />
    </div>
  );
};

export default SoundWave;
