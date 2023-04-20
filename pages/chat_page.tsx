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
import DraggableWindow from "../components/DraggableWindow";
import DraggableWindowContainer from '@/components/DraggableWindowContainer';
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
    [key: string]: string;
}

interface ChatPageProps {
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

const ChatPage: React.FC<ChatPageProps> = ({
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
    const [functionalButtons, setFunctionalButtons] = useState([
        { id: 'get_result', label: 'Get Result', isVisible: false },
        { id: 'create_note', label: 'Create Note', isVisible: false },
        { id: 'start_quiz', label: 'Start Quiz', isVisible: false },
    ]);

    const [currentMessages, setCurrentMessages] = useState<Message[]>(messages);
    const [submitFalg, setSubmitFlag] = useState(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [autoSubmit, setAutoSubmit] = useState<boolean>(false);


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
                setQuizMessages((prev) => [...prev, newMessage]);
            } else {
                setCurrentMessages((prevMessages) => [...prevMessages, newMessage]);
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

        console.log("send message", request_message);

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
    const [selectedModel, setSelectedModel] = React.useState("en-US-AnaNeural");

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (model: any) => {
        setSelectedModel(model);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getModelName = (voiceId:string) => {
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
                            console.log('audioBuffer', audioBuffer.sampleRate);
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


    useEffect(() => {
        const latestMessage = currentMessages[currentMessages?.length - 1];

        if (latestMessage && !latestMessage.isOwnMessage && useTTS
            && latestMessage.text !== prevMessages?.text) {
            // Set the flag to false, which will stop the previous synthesized audio
            playAudioRef.current = false;

            synthesizeTextToSpeech(latestMessage.text)
                .then((result) => {
                    console.log('Text-to-speech synthesis succeeded:', result);
                })
                .catch((error) => {
                    if (error.message !== 'Synthesis stopped.') {
                        console.error('Text-to-speech synthesis failed:', error);
                    }
                });


        }
        setPrevMessages(latestMessage)
    }, [currentMessages?.length, useTTS, prevMessages]);



    // Function to handle the functional
    useEffect(() => {
        if (currentMessages?.length > 3 && chatName != 'Get Your English Level') {
            setFunctionalButtons([
                { id: 'get_test_result', label: 'Get Result', isVisible: false },
                { id: 'create_note', label: 'Create Note', isVisible: true },
                { id: 'start_quiz', label: 'Start Quiz', isVisible: true },
            ]);
        } else if (currentMessages?.length > 3 && chatName === 'Get Your English Level') {
            setFunctionalButtons([
                { id: 'get_test_result', label: 'Get Result', isVisible: true },
                { id: 'create_note', label: 'Create Note', isVisible: false },
                { id: 'start_quiz', label: 'Start Quiz', isVisible: false },
            ]);
        }
    }, [currentMessages?.length]);


    // Function to handle the create note
    useEffect(() => {
        if (createNote) {
            handleSubmit({ preventDefault: () => { } });
        }
    }, [createNote]);

    // First submit
    const [initialMessageSent, setInitialMessageSent] = useState(false);
    const greeting_messages = [
        "let's go"]

    const getRandomValue = (list: string | any[]) => list[Math.floor(Math.random() * list.length)];

    useEffect(() => {
        if (currentMessages.length < 1) {
            setMessageText(getRandomValue(greeting_messages));
            setInitialMessageSent(true);
        }
    }, [currentMessages]);

    useEffect(() => {
        if (messageText !== '') {
            handleSendMessage();
        }
    }, [initialMessageSent]);




    return (
        <>
            <AppBar position="static">
                <Toolbar
                    sx={{
                        backgroundColor: '#333333',
                    }}
                >
                    <IconButton
                        edge="start"
                        aria-label="back"
                        onClick={onBackClick}
                        sx={{ color: '#FFC300' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{
                        flexGrow: 1,
                        color: '#FFC300',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 'calc(100% - 160px)'
                    }}>
                        {chatName}
                    </Typography>
                    <Button 
                    sx={{color: '#FFC300'}}
                    onClick={handleClick}
                    >{getModelName(selectedModel)}</Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => handleMenuItemClick('en-US-AmberNeural')}>
                            Amber
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('en-US-AnaNeural')}>
                            Ana
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('en-US-AriaNeural')}>
                            Aria
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
                        sx={{ color: "#FFC300", mx: "10px" }}
                    >
                        {useTTS ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    </IconButton>

                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="toggle-window"
                        onClick={toggleWindow}
                        sx={{ color: "#FFC300" }}
                    >
                        <DuoIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="md"

                sx={{
                    height: '80vh', // Make the container's height match the viewport height
                    overflow: 'hidden', // Hide any content that overflows the container and disable scrolling
                }}
            >
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
                            backgroundColor: "#333333cc",
                            padding: "16px",
                            borderRadius: "12px"
                        }}>
                            <CircularProgress sx={{ color: '#FFC300', m: "auto", my: "6px" }} />
                            <Typography component="div" sx={{
                                flexGrow: 1,
                                color: '#FFC300',

                            }}>
                                Loading...
                            </Typography>
                        </Box>

                    </Box>
                )}

                <Box
                    component="img"
                    src="/chatBackground.svg" // Use the SVG file from the public folder
                    alt="Chat background"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        mx: 'auto',
                        maxHeight: '70vh',
                        overflowY: 'auto',
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


                {functionalButtons.some((button) => button.isVisible) && (
                    <FunctionalButtons
                        buttons={functionalButtons}
                        onCreateNote={handleCreateNote}
                        onStartQuiz={handleStartQuiz}
                        onGetResult={handleGetResult} />
                )}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'fixed',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '8px',
                        backgroundColor: 'white',
                        borderTop: '1px solid #ccc',
                        width: '100%',
                    }}
                >
                    <IconButton sx={{
                        mx: '8px',
                        '&:hover': {
                            backgroundColor: '#FFC300',
                            color: '#333333',
                        },
                    }} onClick={handleVoiceInputToggle}>
                        {isVoiceInput ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                    {isVoiceInput ? (
                        <AudioRecorder
                            messageText={messageText}
                            isRecording={isRecording}
                            autoSubmit={autoSubmit}
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
                        variant="contained"
                        onClick={handleSendMessage}
                        sx={{
                            alignSelf: 'flex-end', weight: "48px", height: '48px', justifyContent: 'center', m: "8px",

                            '&:hover': {
                                backgroundColor: '#FFC300',
                                color: '#333333',
                            },
                            backgroundColor: '#ffffff',

                        }}
                    >
                        <SendIcon sx={{ color: '#333333', backgroundColor: '#ffffff', }} />

                    </Button>
                    <Button
                        variant="contained"
                        onClick={handResetMessages}

                        sx={{
                            alignSelf: 'flex-end', weight: "48px", height: '48px', justifyContent: 'center', m: "8px",
                            '&:hover': {
                                backgroundColor: '#FFC300',
                                color: '#333333',
                            },
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <RefreshIcon sx={{ color: '#333333', backgroundColor: '#ffffff', }} />

                    </Button>
                </Box>

            </Container>
            {isQuiz ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'fixed',
                        top: '10%',
                        left: 0,
                        width: '100%',
                        height: '70%',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '16px',
                            width: '60%',
                            height: '60%',
                            maxHeight: '60vh',
                            minHeight: '30vh',
                            minWidth: '60vw',
                            backgroundColor: '#333333',
                            borderRadius: '16px',
                            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
                            opacity: '0.9',
                            padding: '16px',
                            margin: '16px',
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            onClick={handleEndQuiz}// Add your close button click handler here
                            sx={{
                                position: 'absolute', // Position the close button absolutely within the quiz box
                                top: 8, // Add some space from the top
                                right: 8, // Add some space from the right
                                color: '#FFC300',
                                '&:hover': {
                                    backgroundColor: '#FFC300',
                                    color: '#333333',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <Typography
                            variant="h5"
                            sx={{
                                color: '#FFC300',
                                fontWeight: 'bold',
                                textAlign: 'left',
                                marginBottom: '16px',
                                marginLeft: '30px',
                            }}
                        >
                            Quiz {quizIndex}
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1, // This ensures the box takes up all available space
                                overflowY: 'auto', // Add the scrollable behavior
                                marginBottom: '16px', // Add some space between the messages and the next button
                            }}
                        >
                            {quizMessages?.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    setLoading={setLoading}
                                    isOwnMessage={message.isOwnMessage}
                                    selectedModel={selectedModel}
                                />
                            ))}
                            <div ref={messagesEndRef} /> {/* Add this line to create a reference point at the end of the messages */}
                        </Box>

                        {
                            (quizMessages?.length > 2) ? (
                                <Button
                                    variant="contained"
                                    onClick={handleNextQuiz}
                                    sx={{
                                        alignSelf: 'center',
                                        marginTop: '16px',
                                        color: '#FFC300',
                                        '&:hover': {
                                            backgroundColor: '#FFC300',
                                            color: '#333333',
                                        },
                                    }}
                                >
                                    Next Quiz
                                </Button>
                            ) : null
                        }
                    </Box>
                </Box>
            ) : null}

            <DraggableWindowContainer>
                <DraggableWindow showWindow={showWindow} setShowWindow={coloseWindow} />
            </DraggableWindowContainer>
        </>
    );
};

export default ChatPage;