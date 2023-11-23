import React, { useState, useEffect, useRef, use } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    AppBar,
    Box,
    Button,
    Menu,
    MenuItem,
    Container,
    IconButton,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';
import { Item, PageData } from '@/components/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ChatMessage from '../components/chatMessage';
import FunctionalButtons from '../components/FunctionalButtons';
import DuoIcon from '@mui/icons-material/Duo';
import CircularProgress from '@mui/material/CircularProgress';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import styles from '@/styles/AudioWave.module.css';
import FormattedMessage from '@/components/FormattedMessage';
import AudioRecorder from '@/components/AudioRecorder';
import { AudioConfig, SpeechConfig, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';
import toWav from 'audiobuffer-to-wav';
import ProgressCircle from '@/components/ui/progressCicle';
import { send } from 'process';

// ...

interface Message {
    id: string;
    senderName: string;
    senderImage: string;
    text: string;
    isOwnMessage: boolean;
}

interface UserChatInfo {
    englishLevel: string;
    userName: string;
    language: string;
    [key: string]: string;

}

interface ChatSettings {
    title: string;
    describe: string;
    botName: string;
    objective: string;
    imageUrl: string;
    [key: string]: string;
}

interface WorkChatPageProps {
    chatName: string;
    messages: Message[];
    botchatSettings: ChatSettings;
    userChatSettings: UserChatInfo;
    setMessages: (value: React.SetStateAction<Message[]>) => void
    onReset: () => void;
    onBackClick: () => void;
    onSendMessage: (text: string) => void;
}

const WorkChatPage: React.FC<WorkChatPageProps> = ({
    chatName,
    messages,
    botchatSettings,
    userChatSettings,
    setMessages,
    onReset,
    onBackClick,
    onSendMessage,
}) => {

    const [messageText, setMessageText] = useState('');
    const messageListRef = useRef<HTMLDivElement>(null);
    const [lastMessageRef, setLastMessageRef] = useState<null | HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [useTTS, setUseTTS] = useState(false);
    const [isVoiceInput, setIsVoiceInput] = useState(true);
    const [showWindow, setShowWindow] = useState(true);

    const [currentMessages, setCurrentMessages] = useState<Message[]>(messages);
    const [submitFalg, setSubmitFlag] = useState(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [autoSubmit, setAutoSubmit] = useState<boolean>(false);
    const isSynthesizingRef = useRef(false);

    const defaultObjective = [
        {
            "zh_text": "默认目标",
            "en_text": "Default Objective"
        }
    ];
    const safeBotChatSettings = botchatSettings || { objective: defaultObjective };

    const [objective, setObjective] = useState<any>(safeBotChatSettings.objective);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Function to select a random objective
    const selectRandomObjective = () => {
        if (safeBotChatSettings.objective && safeBotChatSettings.objective.length) {
            const randomIndex = Math.floor(Math.random() * safeBotChatSettings.objective.length);
            setObjective(safeBotChatSettings.objective[randomIndex]);
            console.log('objective', safeBotChatSettings.objective[randomIndex])
        }
    };

    const handleSendMessage = () => {
        if (!messageText) {
            return;
        }

        if (messageText.trim()) {
            onSendMessage(messageText);
            const newMessage = {
                id: uuidv4(),
                senderName: 'user',
                senderImage: '/usericon.png',
                text: messageText,
                isOwnMessage: true,
            };

            setCurrentMessages((prev) => {
                const lastMessage = prev[prev.length - 1];

                // Check if the last message's text is equal to the new message's text
                if (lastMessage && lastMessage.text === newMessage.text) {
                    // If they are equal, don't add the new message and return the previous state
                    return prev;
                } else {
                    // If they are not equal, add the new message
                    return [...prev, newMessage];
                }
            });

            setSubmitFlag(true);

        }

    };

    useEffect(() => {
        selectRandomObjective();
    }, [safeBotChatSettings.objective]);

    useEffect(() => {
        if (submitFalg) {
            handleSubmit({ preventDefault: () => { } });
            setSubmitFlag(false);
            setMessageText('');
        }
    }, [submitFalg]);


    const handleEnterPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleVoiceInputToggle = () => {
        setIsVoiceInput(!isVoiceInput);
    };

    const handResetMessages = () => {
        setCurrentMessages([]);
        selectRandomObjective(); // change task
        onReset();

    };

    useEffect(() => {
        if (messageText && !isRecording && autoSubmit) {
            handleSendMessage();
            setAutoSubmit(false);
            setMessageText("");
        }
    }, [messageText, isRecording, autoSubmit]);

    useEffect(() => {
        setMessages(currentMessages);
    }, [currentMessages, messages, onBackClick]);


    useEffect(() => {
        // scroll to the bottom of the chat when a new message is added
        const timeoutId = setTimeout(() => {
            if (messageListRef.current && lastMessageRef && messageListRef.current.parentElement) {
                const container = messageListRef.current.parentElement;
                const scrollDifference = lastMessageRef.offsetTop - container.scrollTop;

                container.scrollBy({ top: scrollDifference, behavior: "smooth" });
            }
        }, 10);

        return () => clearTimeout(timeoutId);
    }, [currentMessages, lastMessageRef]);


    const latestNMessages = (currentMessages: Message[], n: number) => {
        return currentMessages.slice(Math.max(currentMessages?.length - n, 0));
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();


        if (messageText.trim() === "" && currentMessages.length > 2 ) {
            return;
        }

        setLoading(true);
        let n_chat_history = 10;
        let history_messages: Message[] = [];
        let roleSettings = botchatSettings.description
        const chat_history = latestNMessages(currentMessages, n_chat_history);

        let n_history = 10;
        history_messages = latestNMessages(currentMessages, n_history);
        roleSettings = botchatSettings.description

        let request_message = FormattedMessage({
            chat_history: chat_history,
            history_messages: history_messages,
            roleSettings: roleSettings,
            title: botchatSettings.title,
            userName: "user_name",
            botName: botchatSettings.botName,
            objective: objective.en_text,
        });

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


        // Reset user input
        setMessageText("");
        const data = await response.json();


        if (data.error === "Unauthorized") {
            console.log("Unauthorized");
            handleError();
            return;
        }


        const newMessage = {
            id: uuidv4(),
            senderName: 'bot',
            senderImage: botchatSettings?.imageUrl || '/character.png',
            text: data.answer,
            isOwnMessage: false,
        };
        setCurrentMessages((prevMessages) => [...prevMessages, newMessage]);


        setLoading(false);
        // setNextQuiz(true);
    };

    const handleError = () => {
        const newMessage = {
            id: uuidv4(),
            senderName: 'bot',
            senderImage: botchatSettings?.imageUrl || '/character.png',
            text: "Oops! There seems to be an error. Please try again.",
            isOwnMessage: false,
        };
        currentMessages.push(newMessage);
        setLoading(false);
        setMessageText("");
    }

    //azures tts
    const speechConfig = SpeechConfig.fromSubscription(
        process.env.REACT_APP_AZURE_SPEECH_KEY as string,
        process.env.REACT_APP_AZURE_SPEECH_REGION as string

    );
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElInfo, setAnchorElInfo] = React.useState(null);
    const [selectedModel, setSelectedModel] = React.useState("ja-JP-NanamiNeural");

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickInfo = (event: any) => {
        setAnchorElInfo(event.currentTarget);
    };

    const handleMenuItemClick = (model: any) => {
        setSelectedModel(model);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleInfoClose = () => {
        setAnchorElInfo(null);
    };

    const getModelName = (voiceId: string) => {
        const nameParts = voiceId.split('-');
        return nameParts.length > 2 ? nameParts[2].replace(/Neural$/, '') : voiceId;
    };


    // enable/disable TTS
    const [prevMessages, setPrevMessages] = useState<Message>();
    const [volumeData, setVolumeData] = useState<Float32Array | null>();
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0);
    const [volumeIndex, setVolumeIndex] = useState<number>(0);

    const toggleTTS = () => {
        setUseTTS(!useTTS);
    };
    const playAudioRef = useRef(true);

    const resampleData = (data: Float32Array, n: number, smooth: boolean = false, windowSize: number = 3) => {
        const step = Math.ceil(data.length / n);
        const resampled = [];
        for (let i = 0; i < data.length; i += step) {
            const averagedValue = data.slice(i, i + step).reduce((a, b) => a + b) / step;
            const roundedValue = parseFloat(Math.abs(averagedValue).toFixed(5));  // Round to 2 decimal places and convert back to number
            resampled.push(roundedValue); // Taking the absolute value
        }

        if (smooth) {
            // Apply a simple moving average
            const smoothedData = [];
            for (let i = 0; i < resampled.length; i++) {
                const start = Math.max(0, i - Math.floor(windowSize / 2));
                const end = Math.min(resampled.length, i + Math.ceil(windowSize / 2));
                const avg = resampled.slice(start, end).reduce((a, b) => a + b) / (end - start);
                smoothedData.push(avg);
            }
            resampled.splice(0, resampled.length, ...smoothedData);
        }

        // Find min and max values for normalization
        const minValue = Math.min(...resampled);
        const maxValue = Math.max(...resampled);

        // Normalize the resampled data
        const normalizedData = resampled.map(value => (value - minValue) / (maxValue - minValue));
        return normalizedData;
    };

    useEffect(() => {
        if (volumeData && volumeData.length > 0 && audioDuration > 0) {
            const intervalTime = audioDuration / volumeData.length;
            let index = 0;
            const intervalId = setInterval(() => {
                index++;
                if (volumeData) {
                    setVolume(volumeData[index] * 0.8);
                }
                if (index >= volumeData.length) {
                    clearInterval(intervalId);
                    setVolume(0)
                }
            }, intervalTime * 1000); // Convert seconds to milliseconds


            // Clear interval on unmount or when the data changes
            return () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };
        }

        setVolumeData(null);
    }, [volumeData, audioDuration]);

    // Effect to post message to iframe
    useEffect(() => {
        if (iframeRef.current && !isNaN(Number(volume))) {
            const contentWindow = iframeRef.current.contentWindow;
            if (contentWindow) {
                contentWindow.postMessage({ volume: volume }, '*');
            }
        }
    }, [volume]);

    const synthesizeTextToSpeech = async (text: string) => {
        return new Promise(async (resolve, reject) => {
            const audioConfig = AudioConfig.fromDefaultSpeakerOutput();

            // The language of the voice that speaks.
            speechConfig.speechSynthesisVoiceName = selectedModel;
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

                            const channelData = audioBuffer.getChannelData(0);
                            let n = Math.floor(audioBuffer.duration * 60)
                            const resampledAudioData = resampleData(channelData, n, true, 8);
                            setVolumeData(new Float32Array(resampledAudioData));
                            setAudioDuration(audioBuffer.duration);

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

    const filterText = (text: string) => {
        return text.replace(/[!@#$%^&*]/g, '');
    };

    useEffect(() => {
        const latestMessage = currentMessages[currentMessages?.length - 1];
        if (latestMessage && !latestMessage.isOwnMessage && useTTS
            && latestMessage.text !== prevMessages?.text && !isSynthesizingRef.current) {

            // Set the flag to true, indicating synthesis is in progress
            isSynthesizingRef.current = true;

            // Set the flag to false, which will stop the previous synthesized audio
            playAudioRef.current = false;
            synthesizeTextToSpeech(filterText(latestMessage.text))
                .then((result) => {
                    console.log('Text-to-speech synthesis succeeded:', result);
                })
                .catch((error) => {
                    if (error.message !== 'Synthesis stopped.') {
                        console.error('Text-to-speech synthesis failed:', error);
                    }
                })
                .finally(() => {
                    // Reset the flag when synthesis is done (whether successful or not)
                    isSynthesizingRef.current = false;
                });

        }
        setPrevMessages(latestMessage);
    }, [currentMessages?.length, useTTS, prevMessages]);


    // First submit
    const [initialMessageSent, setInitialMessageSent] = useState(false);
    const greeting_messages = [""]

    const getRandomValue = (list: string | any[]) => list[Math.floor(Math.random() * list.length)];

    useEffect(() => {
        console.log('handleSubmit 123', currentMessages)

        if (currentMessages.length < 1) {
            // setMessageText(getRandomValue(greeting_messages));
            handleSubmit({ preventDefault: () => { } });
            setInitialMessageSent(true);
        }
    }, [currentMessages]);

    // handle task complete check

    const handleCheckTaskComplete = () => {
        handleCheckTaskCompleteSend({ preventDefault: () => { } });
    };

    const handleResetObjective = () => {
        selectRandomObjective()
    };

    const handleCheckTaskCompleteSend = async (e: any) => {
        e.preventDefault();
    
        setLoading(true);
    
    
        let request_message = FormattedMessage({
          chat_history: currentMessages,
          history_messages: [],
          roleSettings: "'''\n ${chat_history} \n'''\n According to the above chat history, check if the user has completed the following task: '${objective}'. ‘是’或 ‘否 xxx’, 并用中文解释原因。",
          title: "Functional button",
          objective: objective.en_text,
          userName: "",
          botName: "",
          functionMessage: "",
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
        alert(data.answer);
        // setNextQuiz(true);
      };



    return (
        <Box
            sx={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'start',
                    height: '93vh',
                    width: '92%',
                    margin: '5px',
                    borderRadius: '20px',
                    backgroundImage: `url(${ botchatSettings?.imageUrl || '/character.png'})`, // Replace imgurl with your actual image URL
                    backgroundSize: 'cover', // This will ensure that the background covers the entire Box
                    backgroundPosition: 'center', // This will center the background image in the Box
                    backgroundRepeat: 'no-repeat' // This will prevent the background image from repeating
                }
            }
        >
            {/* live2d Part */}
            <Box
                sx={{
                    width: '50%',
                    height: '80%',
                    backgroundColor: 'transparent',
                    padding: '0px',
                    pointerEvents: 'auto',
                    overflow: 'hidden', // This will hide any overflow
                    borderRadius: '20px',
                    right: '5px',
                    bottom: '5px',
                    position: 'absolute',
                }}
            >
                <iframe
                    title="Account Page"
                    ref={iframeRef}
                    src="/live2d.html"
                    allowFullScreen
                    style={{
                        position: 'relative', // This enables the iframe to be moved with top and left
                        left: `${100}px`, // Replace xValue with the desired x offset
                        top: `${-100}px`, // Replace yValue with the desired y offset
                        width: '110%',
                        height: '300%',
                        border: 'none',
                        borderRadius: '20px',
                    }}
                ></iframe>
            </Box>
            
            {/* top bar part */}
            <Toolbar
                sx={{
                    backgroundColor: '#faf6f6',
                    width: '100%',
                    borderRadius: '20px',
                    borderBottom: '3px solid #70ae6e',
                    marginBottom: '12px',
                }}
            >
                <Typography variant="h6" component="div" sx={{
                    flexGrow: 1,
                    color: '#70ae6e',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 'calc(100% - 160px)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',

                }}>
                    {chatName}
                </Typography>
                <Button
                    sx={{
                        color: '#ffffff', // Text color
                        fontWeight: 'bold',
                        backgroundColor: '#70ae6e !important',
                        mx: '20px',
                        my: '10px',
                        '&:hover': {
                            backgroundColor: '#33333333 !important', // Light grey background on hover
                            color: '#5e8b5a', // A darker shade of green on hover
                        },
                        
                    }}
                    onClick={handleClickInfo}
                >互动任务</Button>
                <Menu
                    anchorEl={anchorElInfo}
                    open={Boolean(anchorElInfo)}
                    onClose={handleInfoClose}
                    
                >
                    <MenuItem style={{ whiteSpace: 'pre-wrap' }}>
                        {objective.zh_text}
                    </MenuItem>
                    <Button
                    onClick={handleCheckTaskComplete}
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff', // Text color
                        borderRadius: '12px',
                        backgroundColor: '#70ae6e !important',
                        mx: '20px',
                        my: '10px',
                        '&:hover': {
                            backgroundColor: '#33333333 !important', // Light grey background on hover
                            color: '#5e8b5a', // A darker shade of green on hover
                        },}}>
                        完成任务
                    </Button>
                    <Button
                    onClick={handleResetObjective}
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#70ae6e', // Text color
                        borderRadius: '12px',
                        my: '10px',
                        }}>
                        换一个任务
                    </Button>
                </Menu>

                <Button
                    sx={{ color: '#70ae6e' }}
                    onClick={handleClick}
                >{getModelName(selectedModel)}</Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => handleMenuItemClick('ja-JP-NanamiNeural')}>
                        Nanami
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick('en-US-BrandonNeural')}>
                        Brandon
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick('zh-CN-XiaohanNeural')}>
                        Xiaohan
                    </MenuItem>
                    {/* Add more MenuItem components for each model you want to include */}
                </Menu>

                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="toggle-window"
                    onClick={toggleTTS}
                    sx={{ color: "#70ae6e", mx: "10px" }}
                >
                    {useTTS ? <VolumeUpIcon /> : <VolumeOffIcon />}
                </IconButton>
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="toggle-window"
                    onClick={handResetMessages}
                    sx={{ color: "#70ae6e", mx: "10px" }}
                >
                    <RefreshIcon />
                </IconButton>
            </Toolbar>

            <Box

                sx={{
                    height: 'max-content',
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'start',
                    width: '65%',
                    mx: '5px',
                    my: '5px',
                    borderRadius: '20px',
                    padding: '10px',
                    backgroundColor: '#00000099',
                }}>


                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxHeight: '70vh', 
                        minHeight: '70vh', 
                        padding: '10px',
                        marginLeft: '0px', // Centers the content horizontally if the Box has a width less than 100%
                        overflowY: 'auto', // Enables vertical scrolling if the content overflows
                        scrollbarColor: 'transparent transparent', // Hide the scrollbar
                    }}
                >
                    {currentMessages?.map((message, index) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            isOwnMessage={message.isOwnMessage}
                            setLoading={setLoading}
                            selectedModel={selectedModel}
                            ref={index === currentMessages?.length - 2 ? setLastMessageRef : null}
                        />
                    ))}
                    {loading && (<ProgressCircle />)}
                    <div ref={messageListRef} />


                </Box>
                {/* send message part */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        backgroundColor: '#faf6f6',
                        width: '100%',
                        borderRadius: '0px 0px 20px 20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Button sx={{
                        alignSelf: 'flex-end', weight: "48px", height: '48px', justifyContent: 'center', m: "8px",

                        '&:hover': {
                            color: '#333333',
                        },

                    }}
                        onClick={handleVoiceInputToggle}>
                        {isVoiceInput ? <MicOffIcon sx={{ color: '#70ae6e' }} /> : <MicIcon sx={{ color: '#70ae6e' }} />}
                    </Button>
                    {isVoiceInput ? (
                        <Box
                            sx={{
                                width: '50%',
                                minWidth: '200px',
                                maxWidth: '400px',
                            }}
                        >
                            <AudioRecorder
                                messageText={messageText}
                                isRecording={isRecording}
                                autoSubmit={autoSubmit}
                                setLoading={setLoading}
                                setMessageText={setMessageText}
                                setIsRecording={setIsRecording}
                                setAutoSubmit={setAutoSubmit}
                                handleSendMessage={handleSendMessage} />
                        </Box>
                    ) : (
                        <>
                            <TextField
                                disabled={loading}
                                value={messageText}
                                onChange={(e: any) => setMessageText(e.target.value)}
                                onKeyPress={handleEnterPress}
                                placeholder="请输入信息..."
                                variant="outlined"
                                sx={{
                                    width: '50%',
                                    minWidth: '200px',
                                    maxWidth: '400px',
                                    my: '8px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none', // Remove the default border
                                            color: '#000000'
                                        },
                                        '&:hover fieldset': {
                                            border: 'none', // Remove the border on hover
                                        },
                                        '&.Mui-focused fieldset': {
                                            border: 'none', // Remove the border when focused
                                            borderBottom: '2px solid #70ae6e', // Add a bottom border when focused
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'black',
                                        height: '100%',
                                        padding: '12px',
                                    },

                                }}
                            />
                        </>
                    )}
                    <Button
                        onClick={handleSendMessage}
                        sx={{
                            alignSelf: 'flex-end', weight: "48px", height: '48px', justifyContent: 'center', m: "8px",

                            '&:hover': {
                                color: '#333333',
                            },

                        }}
                    >
                        <SendIcon sx={{ color: '#70ae6e', }} />

                    </Button>

                </Box>
            </Box>
            

        </Box>
    );
};

export default WorkChatPage;