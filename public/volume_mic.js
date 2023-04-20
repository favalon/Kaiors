let volumeSequence = [];
let volumeSequenceIndex = 0;

document.addEventListener("DOMContentLoaded", async function () {
  // Request access to the user's microphone
  let stream;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } else if (navigator.getUserMedia) {
    stream = await new Promise((resolve, reject) => {
      navigator.getUserMedia({ audio: true }, resolve, reject);
    });
  } else {
    console.error("getUserMedia is not supported in this browser.");
    return;
  }

  const audioContext = new AudioContext();

  const lAppModel = new LAppModel();

  const updateVolumeDisplay = () => {
    const volumeElement = document.getElementById("volume");

    if (volumeSequenceIndex < volumeSequence.length) {
      lAppModel.volume = volumeSequence[volumeSequenceIndex];
      volumeSequenceIndex++;
    }

    const volumePercentage = (lAppModel.volume * 100).toFixed(2);
    //volumeElement.textContent = `${volumePercentage}%`;
    setTimeout(updateVolumeDisplay, 100); // Call updateVolumeDisplay every 100ms (10 samples per second)
  };

  // Initialize the MouthController with the audio context and media stream
  const mouthController = new MouthController(audioContext, stream, (volume) => {
    lAppModel.volume = volume;
  });

  updateVolumeDisplay();
});
