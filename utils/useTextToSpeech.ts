import { useState, useEffect } from 'react';
import { SpeechSynthesizer, SpeechConfig, AudioConfig } from 'microsoft-cognitiveservices-speech-sdk';

const useTextToSpeech = (text: string, trigger: boolean) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speechConfig = SpeechConfig.fromSubscription(
    'baa4627d38424fc88dd211f05094ab37', // Replace with your Speech service key
    'eastus' // Replace with your Speech service region
  );

  const synthesizeTextToSpeech = async (text: string) => {
    return new Promise((resolve, reject) => {
      const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
      const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result) {
            synthesizer.close();
            resolve(result);
          } else {
            synthesizer.close();
            reject(new Error('Synthesis failed.'));
          }
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    });
  };

  useEffect(() => {
    if (trigger) {
      setIsPlaying(true);
      synthesizeTextToSpeech(text)
        .then((result) => {
          console.log('Text-to-speech synthesis succeeded:', result);
          setIsPlaying(false);
        })
        .catch((error) => {
          console.error('Text-to-speech synthesis failed:', error);
          setIsPlaying(false);
        });
    }
  }, [trigger, text]);

  return isPlaying;
};

export default useTextToSpeech;
