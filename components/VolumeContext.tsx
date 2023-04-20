import React from 'react';

interface VolumeContextData {
  volumeSequence: number[];
  setVolumeSequence: (volumeSequence: number[]) => void;
}

const VolumeContext = React.createContext<VolumeContextData>({
  volumeSequence: [],
  setVolumeSequence: () => {},
});

export default VolumeContext;