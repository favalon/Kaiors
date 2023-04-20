let volumeSequence = [];
let volumeSequenceIndex = 0;

document.addEventListener("DOMContentLoaded", async function () {
  // Load the local .wav file
  const audioContext = new AudioContext();
    // Load the stored .wav file from local storage
    const wavUrl = localStorage.getItem('tts_wav_url');
    if (!wavUrl) {
      console.error('No stored .wav file found.');
      return;
    }
  
    const audioBuffer = await loadWavFile(audioContext, wavUrl);

  const lAppModel = new LAppModel();

  const updateVolumeDisplay = () => {
    const volumeElement = document.getElementById("volume");

    if (volumeSequenceIndex < volumeSequence.length) {
      lAppModel.volume = volumeSequence[volumeSequenceIndex];
      volumeSequenceIndex++;
    }

    const volumePercentage = (lAppModel.volume * 100).toFixed(2);
    setTimeout(updateVolumeDisplay, 100);
  };

  // Initialize the MouthController with the audio context and audio buffer
  const mouthController = new MouthController(audioContext, audioBuffer, (volume) => {
    lAppModel.volume = volume;
  });

  updateVolumeDisplay();
});

async function loadWavFile(audioContext, url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}
