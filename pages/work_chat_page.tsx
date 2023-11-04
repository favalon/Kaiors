import React, { useState, useEffect, useRef } from 'react';
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
    [key: string]: string;
}

interface WorkChatPageProps {
    chatName: string;
    messages: Message[];
    botchatSettings: ChatSettings;
    userChatSettings: UserChatInfo;
    pageData: PageData;
    setPageData: (value: React.SetStateAction<PageData>) => void;
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
    pageData,
    setPageData,
    onReset,
    onBackClick,
    onSendMessage,
}) => {

    const [isGreating, setIsGreating] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [quizMessages, setQuizMessages] = useState<Message[]>([]);
    const messageListRef = useRef<HTMLDivElement>(null);
    const [lastMessageRef, setLastMessageRef] = useState<null | HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [useTTS, setUseTTS] = useState(false);
    const [isVoiceInput, setIsVoiceInput] = useState(true);
    const [showWindow, setShowWindow] = useState(false);

    const [currentMessages, setCurrentMessages] = useState<Message[]>(messages);
    const [submitFalg, setSubmitFlag] = useState(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [autoSubmit, setAutoSubmit] = useState<boolean>(false);
    const isSynthesizingRef = useRef(false);

    const safeBotChatSettings = botchatSettings || { objective: 'Default Objective' };

    const iframeRef = useRef<HTMLIFrameElement>(null);

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
            if (isQuiz) {
                setQuizMessages((prev) => {
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
            } else {
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
            }
            setSubmitFlag(true);



        }

    };

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


    const toggleWindow = () => {
        setShowWindow(!showWindow);
    };

    const coloseWindow = () => {
        setShowWindow(false);
    };

    // quiz part
    const [isQuiz, setIsQuiz] = useState(false);
    const [quizIndex, setQuizIndex] = useState(1);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleEndQuiz = () => {
        setIsQuiz(false);
        setQuizMessages([]);
    };

    const handleStartQuiz = () => {
        setIsQuiz(true);
        setIsGreating(true);
    };

    const handleNextQuiz = () => {
        setQuizMessages([]);
        setIsGreating(true);
        setQuizIndex(quizIndex + 1);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [quizMessages]);

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


    useEffect(() => {
        if (isQuiz && isGreating) {
            handleSubmit({ preventDefault: () => { } });
        }
    }, [isQuiz, isGreating]);


    const latestNMessages = (currentMessages: Message[], n: number) => {
        return currentMessages.slice(Math.max(currentMessages?.length - n, 0));
    };


    // create note
    const [createNote, setCreateNote] = useState(false);
    const handleCreateNote = () => {
        console.log('handleCreateNote');
        setCreateNote(true);
    };

    // get result
    const [getResult, setGetResult] = useState(false);
    const handleGetResult = () => {
        console.log('handleGetResult');
        setGetResult(true);
    };

    useEffect(() => {
        if (getResult) {
            handleSubmit({ preventDefault: () => { } });
        }
    }, [getResult]);


    const handleSubmit = async (e: any) => {
        e.preventDefault();


        if (messageText.trim() === "" && !isGreating && !createNote && !getResult) {
            return;
        }
        setLoading(true);
        let n_chat_history = 10;
        let history_messages: Message[] = [];
        let roleSettings = botchatSettings.description
        const chat_history = latestNMessages(currentMessages, n_chat_history);

        if (isQuiz) {
            let n_history = 3;
            history_messages = latestNMessages(quizMessages, n_history);
            roleSettings = botchatSettings.quiz
        } else if (createNote) {
            roleSettings = botchatSettings.createNote
        } else if (getResult) {
            roleSettings = botchatSettings.getResult
        } else {
            let n_history = 6;
            history_messages = latestNMessages(currentMessages, n_history);
            roleSettings = botchatSettings.description
        }


        let request_message = FormattedMessage({
            chat_history: chat_history,
            history_messages: history_messages,
            roleSettings: roleSettings,
            title: botchatSettings.title,
            userName: userChatSettings.userName,
            userEnglishLevel: userChatSettings.englishLevel,
            userLanguage: userChatSettings.language,
            botName: botchatSettings.botName,
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

        if (isQuiz) {
            const newMessage = {
                id: uuidv4(),
                senderName: 'bot',
                senderImage: botchatSettings.imageUrl,
                text: data.answer,
                isOwnMessage: false,
            };
            setQuizMessages((prevMessages) => [...prevMessages, newMessage]);
            setIsGreating(false);

        } else if (createNote) {
            const newNote: Item = {
                title: botchatSettings.title,
                content: data.answer,
                tags: [],
            }

            setPageData((prevState: PageData) => {
                return {
                    ...prevState,
                    concept: [...prevState.concept, newNote],
                };
            });

            setCreateNote(false);
        } else {
            const newMessage = {
                id: uuidv4(),
                senderName: 'bot',
                senderImage: botchatSettings.imageUrl,
                text: data.answer,
                isOwnMessage: false,
            };
            setCurrentMessages((prevMessages) => [...prevMessages, newMessage]);
            // messages.push(newMessage);
        }


        setLoading(false);
        // setNextQuiz(true);
    };

    const handleError = () => {
        const newMessage = {
            id: uuidv4(),
            senderName: 'bot',
            senderImage: botchatSettings.imageUrl,
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

    const handleInfoItemClick = (model: any) => {
        setAnchorElInfo(null);
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

    const toggleTTS = () => {
        setUseTTS(!useTTS);
    };
    const playAudioRef = useRef(true);

    const getVolumeSequence = async (audioBuffer: AudioBuffer, sampleRate: number) => {
        const numChannels = audioBuffer.numberOfChannels;
        const bufferSize = audioBuffer.length;

        const chunkSize = Math.floor(audioBuffer.sampleRate / sampleRate);

        let volumeSequence = [];

        for (let i = 0; i < bufferSize; i += chunkSize) {
            let sumOfSquares = 0;
            let numSamples = 0;

            for (let j = 0; j < chunkSize && i + j < bufferSize; j++) {
                for (let c = 0; c < numChannels; c++) {
                    const sample = audioBuffer.getChannelData(c)[i + j];
                    sumOfSquares += sample * sample;
                }
                numSamples++;
            }

            const rms = Math.sqrt(sumOfSquares / (numSamples * numChannels));
            volumeSequence.push(rms);
        }

        return volumeSequence;
    };

    let volumeSequence: number[] = [];

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
                            // console.log('audioBuffer', audioBuffer.sampleRate);
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

    const filterText = (text: string) => {
        return text.replace(/[!@#$%^&*]/g, '');
    };

    useEffect(() => {
        const latestMessage = currentMessages[currentMessages?.length - 1];
        console.log('tts check 1');
        console.log('latestMessage', latestMessage);
        console.log('isSynthesizingRef', isSynthesizingRef);
        if (latestMessage && !latestMessage.isOwnMessage && useTTS
            && latestMessage.text !== prevMessages?.text && !isSynthesizingRef.current) {

            // Set the flag to true, indicating synthesis is in progress
            isSynthesizingRef.current = true;
            console.log('tts check 2');
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
    const greeting_messages = ["Let's start this"]

    const getRandomValue = (list: string | any[]) => list[Math.floor(Math.random() * list.length)];

    useEffect(() => {
        if (currentMessages.length < 1) {
            setMessageText(getRandomValue(greeting_messages));
            setInitialMessageSent(true);
        }
    }, [currentMessages]);

    useEffect(() => {
        if (initialMessageSent) {
            handleSendMessage();
        }

    }, [initialMessageSent]);




    return (
        <Box 
            sx={
                {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'start',
                    justifyContent: 'start',
                    height: '100vh'
                }
            }
        >
            <Box
                sx={{
                    height: '100%',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'start',
                    width: '65%',
                    mx: '5px',
                    my: '5px',
                    borderRadius: '20px',
                    backgroundColor: '#d4f3c12b',
                }}>

                <AppBar
                    position="static"
                    sx={{
                        backgroundColor: '#70ae6e',
                        borderRadius: '20px',
                    }}>
                    <Toolbar
                        sx={{
                            backgroundColor: '#70ae6e',
                            borderRadius: '20px 20px 0px 0px',
                        }}
                    >
                        <Typography variant="h6" component="div" sx={{
                            flexGrow: 1,
                            color: '#e9ecef',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 'calc(100% - 160px)'
                        }}>
                            {chatName}
                        </Typography>
                        <Button
                            sx={{ color: '#e9ecef' }}
                            onClick={handleClickInfo}
                        >查看目标</Button>
                        <Menu
                            anchorEl={anchorElInfo}
                            open={Boolean(anchorElInfo)}
                            onClose={handleInfoClose}
                        >
                            <MenuItem style={{ whiteSpace: 'pre-wrap' }}>
                                {safeBotChatSettings.objective}
                            </MenuItem>
                        </Menu>

                        <Button
                            sx={{ color: '#e9ecef' }}
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
                            sx={{ color: "#e9ecef", mx: "10px" }}
                        >
                            {useTTS ? <VolumeUpIcon /> : <VolumeOffIcon />}
                        </IconButton>

                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="toggle-window"
                            onClick={toggleWindow}
                            sx={{ color: "#e9ecef" }}
                        >
                            <DuoIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {loading && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: (theme) => theme.palette.background.default + "cc",
                            zIndex: 9999,
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: "column",
                            padding: "16px",
                            borderRadius: "12px"
                        }}>
                            <CircularProgress sx={{ color: '#70ae6e', m: "auto", my: "6px" }} />
                            <Typography component="div" sx={{
                                flexGrow: 1,
                                color: '#70ae6e',

                            }}>
                                Loading...
                            </Typography>
                        </Box>

                    </Box>
                )}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        width: '100%',
                        maxHeight: '77vh',
                        marginLeft: '0px', // Centers the content horizontally if the Box has a width less than 100%
                        overflowY: 'auto', // Enables vertical scrolling if the content overflows
                    }}
                >
                    {currentMessages?.slice(1).map((message, index) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            isOwnMessage={message.isOwnMessage}
                            setLoading={setLoading}
                            selectedModel={selectedModel}
                            ref={index === currentMessages?.length - 2 ? setLastMessageRef : null}
                        />
                    ))}
                    <div ref={messageListRef} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        margin: '0px',
                        position: 'fixed',
                        bottom: '0px',
                        left: '25%',
                        right: '22%',
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
                        <AudioRecorder
                            messageText={messageText}
                            isRecording={isRecording}
                            autoSubmit={autoSubmit}
                            setLoading={setLoading}
                            setMessageText={setMessageText}
                            setIsRecording={setIsRecording}
                            setAutoSubmit={setAutoSubmit}
                            handleSendMessage={handleSendMessage} />
                    ) : (
                        <>
                            <TextField
                                fullWidth
                                disabled={loading}
                                value={messageText}
                                onChange={(e: any) => setMessageText(e.target.value)}
                                onKeyPress={handleEnterPress}
                                variant="outlined"
                                placeholder="Type a message"
                                sx={{
                                    flexGrow: 1, my: '8px',
                                    '& .MuiInputBase-root': {
                                        height: '48px',
                                    },
                                    '& .MuiInputBase-input': {
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
                        <SendIcon sx={{ color: '#333333', }} />

                    </Button>
                    <Button
                        onClick={handResetMessages}

                        sx={{
                            alignSelf: 'flex-end', weight: "48px", height: '48px', justifyContent: 'center', m: "8px",
                            '&:hover': {
                                color: '#333333',
                            },
                        }}
                    >
                        <RefreshIcon sx={{ color: '#333333' }} />

                    </Button>
                </Box>
            </Box>
            {showWindow ? (
            <Box
                sx={{
                    width: '20%',
                    height: '80vh',
                    backgroundColor: '#333333',
                    padding: '0px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    pointerEvents: 'auto',
                    overflow: 'hidden', // This will hide any overflow
                    borderRadius: '20px',
                    position:'fixed',
                    right:'5px',
                    top:'100px',
                    
                }}
            >
                <div className={styles.iframe_wrapper} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <iframe
                        title="Account Page"
                        ref={iframeRef}
                        src="/account-page.html"
                        allowFullScreen
                        style={{
                            position: 'relative', // This enables the iframe to be moved with top and left
                            left: `${-10}px`, // Replace xValue with the desired x offset
                            top: `${-100}px`, // Replace yValue with the desired y offset
                            width: '110%',
                            height: '300%',
                            border: 'none',
                            borderRadius: '20px',
                        }}
                    ></iframe>
                </div>
            </Box>) : null}

        </Box>
    );
};

export default WorkChatPage;