import React, { useState, useRef, FC, useEffect } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import toWav from 'audiobuffer-to-wav';
import { Button } from '@mui/material';
import { useTheme, Box } from '@mui/material';

interface AudioRecorderProps {
  messageText: string;
  isRecording: boolean;
  autoSubmit: boolean;
  setMessageText: (text: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  setAutoSubmit: (autoSubmit: boolean) => void;
  handleSendMessage: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ messageText, isRecording, autoSubmit, setMessageText, setIsRecording, setAutoSubmit, handleSendMessage }) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.REACT_APP_AZURE_SPEECH_KEY as string,
    process.env.REACT_APP_AZURE_SPEECH_REGION as string

  );


  const handleStartRecording = async (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorderRef.current.addEventListener('dataavailable', e => {
      recordedChunksRef.current.push(e.data);
    });
    mediaRecorderRef.current.start();
    console.log('Recording started');
  };

  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const arrayBuffer = await audioBlob.arrayBuffer();
    const buffer = await new Promise<AudioBuffer>((resolve, reject) => {
      audioContext.decodeAudioData(
        arrayBuffer,
        (decodedData) => resolve(decodedData),
        (error) => reject(error)
      );
    }).catch((error) => {
      console.error('Error decoding audio data:', error);
      throw error;
    });

    console.log('Converting to WAV');
    
    const wav = toWav(buffer);
    const wavBlob = new Blob([wav], { type: 'audio/wav' });
    return wavBlob;
  };




  const handleStopRecording = async (event: any) => {
    event.preventDefault();
    if (!mediaRecorderRef.current) {
      return;
    }
    console.log("Recording stopped")

    const currentMediaRecorder = mediaRecorderRef.current;

    const onStopPromise = new Promise<void>((resolve) => {
      currentMediaRecorder.addEventListener('stop', () => {
        resolve();
      });
    });

    currentMediaRecorder.stop();

    await onStopPromise;
    const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
    recordedChunksRef.current = [];
    const wavBlob = await convertToWav(blob);
    sendToAzure(wavBlob);
  };

  const sendToAzure = async (audioBlob: Blob, retryCount: number = 0) => {
    const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav', lastModified: Date.now() });
    const audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  
    recognizer.recognizeOnceAsync(
      async result => {
        if (result.text === undefined && retryCount < 5) {
          console.log('Result text is undefined. Retrying...');
          recognizer.close();
          setIsRecording(true);
          await sendToAzure(audioBlob, retryCount + 1);
        } else {
          setMessageText(result.text);
          recognizer.close();
        }
      },
      error => {
        console.error('Error Code:', error);
        recognizer.close();
      }
    );
    setIsRecording(false);
  };

  useEffect(() => {
    handleSendMessage();
  }, [messageText]);

  useEffect(() => {
    const buttonElement = document.getElementById("record-button");
    if (buttonElement) {
      buttonElement.addEventListener("mouseup", handleStopRecording);
    }
  
    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener("mouseup", handleStopRecording);
      }
    };
  }, []);

  return (
    <Button
      id="record-button"
      variant="contained"
      onMouseDown={handleStartRecording}
      // onMouseUp={handleStopRecording}
      sx={{
        flexGrow: 1,
        my: '8px',
        height: '48px',
        color: '#333333',
        fontWeight: 'bold',
        fontSize: '16px',
        '&:hover': {
          backgroundColor: '#FFC300',
          color: '#333333',
        },
        backgroundColor: '#ffffff',
        '@media (max-width: 600px)': {
          fontSize: '12px', // Change the font size based on the breakpoint
        },
      }}
    >
      Hold to Record
    </Button>

  );
};

export default AudioRecorder;
