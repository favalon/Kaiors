import { useEffect, useRef, useState } from 'react';
import { SpeechConfig, AudioConfig, SpeechRecognizer, ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import {
  AppBar,
  Box,
  Button,
} from '@mui/material';
var toWav = require('audiobuffer-to-wav')
import { Buffer } from 'buffer'; 

type Props = {
  onMessageReceived: (text: string) => void;
};

export function HoldToTalk({ onMessageReceived }: Props){
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder>();
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onbeforeunload = () => {
        mediaRecorder.current?.stop();
      };
    }
    return () => {
      mediaRecorder.current?.stop();
    };
  }, []);

  const handleMouseDown = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.addEventListener('dataavailable', (event) => {
        audioChunks.current.push(event.data);
      });

      mediaRecorder.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error while starting the recording:', err);
    }
  };

  const handleMouseUp = async () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const buffer = await blobToArrayBuffer(audioBlob); // Use the recorded audio data directly
        const wavBuffer = await convertToWav(buffer);
        const messageText = await sendAudioToAzure(wavBuffer);
  
        onMessageReceived(messageText);
      });
  
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };
  
  

  return (
    <button
      type="button"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {recording ? 'Recording...' : 'Hold to Talk'}
    </button>
  );
}

function convertToWav(audioBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  // The recorded audio is already in WAV format; you can return the input directly
  return Promise.resolve(audioBuffer);
}



function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as ArrayBuffer);
      } else {
        reject(new Error('Failed to read the Blob as ArrayBuffer.'));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsArrayBuffer(blob);
  });
}

async function sendAudioToAzure(audioData: ArrayBuffer): Promise<string> {
  const speechConfig = SpeechConfig.fromSubscription(
    process.env.REACT_APP_AZURE_SPEECH_KEY as string,
    process.env.REACT_APP_AZURE_SPEECH_REGION as string
  );
  speechConfig.speechRecognitionLanguage = 'en-US';

   // Convert ArrayBuffer to Buffer
   const audioBuffer = Buffer.from(audioData);

  const audioConfig = AudioConfig.fromWavFileInput(audioBuffer);
  const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        if (result.reason === ResultReason.RecognizedSpeech) {
          resolve(result.text);
        } else {
          reject(new Error(`Recognition failed: ${result.errorDetails}`));
        }
        recognizer.close();
      },
      (err) => {
        reject(err);
        recognizer.close();
      }

    );
  });
}



