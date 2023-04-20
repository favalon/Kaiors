import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { Box, Avatar, Typography, List, ListItem, ListItemText, IconButton, Chip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { rootCertificates } from 'tls';
import FormattedMessage from '@/components/FormattedMessage';
import ReactMarkdown from 'react-markdown';
import toWav from 'audiobuffer-to-wav';
import { AudioConfig, SpeechConfig, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import TranslateIcon from '@mui/icons-material/Translate';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';



interface Message {
  id: string;
  senderName: string;
  senderImage: string;
  text: string;
  isOwnMessage: boolean;
}


interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(({
  message,
  isOwnMessage,
  setLoading,
}, ref) => {

  const [showOptions, setShowOptions] = useState(false);
  const [showFunctionArea, setShowFunctionArea] = useState(false);
  const [roleSettings, setRoleSettings] = useState(" ");
  const grammer_role = "Act as a grammar check, check the input grammar problem, and explain it only in Chinese.\nInput:${function_message}";
  const translate_role = "Act as a translator, translating the user input between Chinese and English. Only Response with target language result. \nTranslate the following : ${function_message}";
  const [resultString, setResultString] = useState(" ");
  const [resultTitle, setResultTitle] = useState(" ");


  const handleOnClick = () => {
    setShowOptions(true);
    setResultString(" ");
  };



  const handleClose = () => {
    setShowOptions(false);
    setShowFunctionArea(false);
    setResultString(" ");
  };

  const handleTranslate = () => {
    setShowFunctionArea(true);
    setRoleSettings(translate_role);
    setResultTitle("Translate");
    setShowButton(false);
  };

  useEffect(() => {
    if (showFunctionArea) {
      handleSubmit({ preventDefault: () => { } });
    }
  }, [showFunctionArea, roleSettings]);

  const handleGrammer = () => {
    setShowFunctionArea(true);
    setRoleSettings(grammer_role);
    setResultTitle("Grammer Check");
    setShowButton(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log('handleSubmit')

    setLoading(true);


    let request_message = FormattedMessage({
      chat_history: [],
      history_messages: [],
      roleSettings: roleSettings,
      title: "Functional button",
      userName: "",
      userEnglishLevel: "",
      userLanguage: "",
      botName: "",
      functionMessage: message.text,
    });


    console.log('send-messages:', request_message)

    // Send user question and history to API
    const response = await fetch('/api/chat1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request_message: request_message }
      ),
    });


    if (!response.ok) {
      console.log('response not ok');
      handleError();
      return;
    }

    const data = await response.json();


    if (data.error === "Unauthorized") {
      console.log("Unauthorized");
      handleError();
      return;
    }


    setLoading(false);
    setResultString(data.answer);
    // setNextQuiz(true);
  };

  const handleError = () => {
    setLoading(false);
  }

  // read select text
  const [showButton, setShowButton] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const getSelectedText = () => {
    const selection = window.getSelection();
    return selection ? selection.toString() : '';
  };

  const speakSelectedText = async () => {
    if (selectedText) {
      try {
        await synthesizeTextToSpeech(selectedText);
        setShowOptions(false);
      } catch (error) {
        console.error('Error synthesizing selected text:', error);
      }
    }
  };

  const handleMouseUp = () => {
    const text = getSelectedText();
    if (text) {
      setSelectedText(text);
      setShowButton(true);

      // Get the position of the selected text
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        setButtonPosition({ x: rect.right, y: rect.top });
      }
    } else {
      setShowButton(false);
    }
  };

  // Inside your component
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const speechConfig = SpeechConfig.fromSubscription(
    process.env.REACT_APP_AZURE_SPEECH_KEY as string,
    process.env.REACT_APP_AZURE_SPEECH_REGION as string

  );

  const playAudioRef = useRef(true);

  const synthesizeTextToSpeech = async (text: string) => {
    return new Promise(async (resolve, reject) => {
      const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
      const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

      playAudioRef.current = true;

      synthesizer.speakTextAsync(
        text,
        async (result) => {
          if (result) {
            if (playAudioRef.current) {
              // Decode the audio data from the TTS result
              const audioContext = new AudioContext();
              const audioBuffer = await audioContext.decodeAudioData(result.audioData);
              console.log('audioBuffer', audioBuffer.sampleRate);
              // Get the volume sequence from the audio buffer

              // volumeSequence = await getVolumeSequence(audioBuffer, 10);

              // Convert the AudioBuffer to a .wav file
              const wav = toWav(audioBuffer);
              const wavBlob = new Blob([new DataView(wav)], { type: 'audio/wav' });

              // Store the .wav file in the browser
              const wavUrl = URL.createObjectURL(wavBlob);
              localStorage.setItem('tts_wav_url', wavUrl);

              synthesizer.close();
              resolve(result);
            } else {
              synthesizer.close();
              reject(new Error('Synthesis stopped.'));
            }
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

  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });


  return (
    <div ref={ref} >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isOwnMessage ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          my: '12px',
        }}
      >
        <Avatar
          alt={message.senderName}
          src={message.senderImage}
          sx={{
            marginRight: isOwnMessage ? '8px' : '2px',
            marginLeft: isOwnMessage ? '2px' : '8px',
            backgroundColor: isOwnMessage ? '#FFC300' : '#ffffff',
          }}
        />
        <Box
          onClick={handleOnClick}

          sx={{
            position: 'relative',
            px: '12px',
            py: '4px',
            mx: '8px',
            borderRadius: '12px',
            backgroundColor: isOwnMessage ? '#FFC300' : '#ffffff',
            color: isOwnMessage ? '#fff' : '#333333',
            maxWidth: '75%',
            wordBreak: 'break-word',
            '&::before': {
              content: "''",
              position: 'absolute',
              width: '12px',
              height: '12px',
              backgroundColor: isOwnMessage ? '#FFC300' : '#ffffff',
              borderRadius: '50%',
              bottom: '2px',
              right: isOwnMessage ? '-7px' : 'auto',
              left: isOwnMessage ? 'auto' : '-7px',
              clipPath: isOwnMessage
                ? 'polygon(0% 0%, 100% 50%, 0% 100%)'
                : 'polygon(0% 50%, 100% 0%, 100% 100%)',

            },

            '& h1': { fontSize: '2em', margin: '0.67em 0' },
            '& h2': { fontSize: '1.5em', margin: '0.83em 0' },
            '& h3': { fontSize: '1.17em', margin: '1em 0' },
            '& h4': { fontSize: '1em', margin: '1.33em 0' },
            '& h5': { fontSize: '0.83em', margin: '1.67em 0' },
            '& h6': { fontSize: '0.67em', margin: '2.33em 0' },

          }}
        >
          <ReactMarkdown

          >{message.text}
          </ReactMarkdown>
          {showOptions && (
          <Box
            sx={{
              borderTop: isOwnMessage ? '1px solid #fff' : '1px solid #333333',
              display: 'flex',
              flexDirection: 'row',
              mx: '8px',
              marginY: '2px',
              width: 'fit-content',
              marginLeft: isOwnMessage ? 'auto' : '0px',
              marginRight: isOwnMessage ? '0px' : 'auto',
            }}
          >
            {!isOwnMessage && (<Box
              sx={{
                color: isOwnMessage ? '#fff' : '#333333',
                borderRadius: '12px',
                mx: '8px',
                my: '2px',
                px: '8px',
                width: 'fit-content',
                ':hover': {
                  backgroundColor: '#333333',
                  color: '#fff',
                },
              }}
              onClick={handleTranslate}
            >
              <TranslateIcon sx={{ fontSize: '1rem', padding: 0 }} />
            </Box>
            )}
            {isOwnMessage && (<Box
              sx={{
                color: isOwnMessage ? '#fff' : '#333333',
                borderRadius: '12px',
                mx: '8px',
                my: '2px',
                px: '8px',
                width: 'fit-content',
                ':hover': {
                  backgroundColor: '#333333',
                  color: '#fff',
                },
              }}
              onClick={handleGrammer}
            >
              <SpellcheckIcon sx={{ fontSize: '1rem', padding: 0 }} />
            </Box>
            )}
            {!isOwnMessage && (<Box
              sx={{
                color: isOwnMessage ? '#fff' : '#333333',
                borderRadius: '12px',
                mx: '8px',
                my: '2px',
                px: '8px',
                width: 'fit-content',
                ':hover': {
                  backgroundColor: '#333333',
                  color: '#fff',
                },
              }}
              onClick={speakSelectedText}
            >
              <VolumeUpIcon sx={{ fontSize: '1rem', padding: 0 }} />
            </Box>
            )}
          </Box>
          )}
        </Box>
      </Box>
      {/* {showButton && (
        <button
          onClick={speakSelectedText}
          style={{
            position: 'absolute',
            left: buttonPosition.x,
            top: buttonPosition.y,
            zIndex: 1000, // Ensure the button is above other elements
          }}
        >
          <VolumeUpIcon />
        </button>
      )} */}


      {/* {(showOptions || showButton) && ( */}

      {showFunctionArea && (
        <Dialog open={showFunctionArea} onClose={handleClose}
        >
          <DialogTitle
            sx={{
              backgroundColor: '#FFC300',
              color: '#333333',
              padding: '4px',
              minWidth: '300px',
              display: 'flex', // Add this line
              alignItems: 'center', // Add this line
              justifyContent: 'center', // Add this line
            }}
          >{resultTitle}</DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: '#333333',
              color: '#FFC300',
              minWidth: '300px',
              minHeight: '100px',
              padding: '8px',
              display: 'flex', // Add this line
              alignItems: 'center', // Add this line
              justifyContent: 'center', // Add this line
            }}>
            <Typography variant="h5">{resultString}</Typography>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;

