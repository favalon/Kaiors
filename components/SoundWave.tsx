import React, { useState, useEffect, useRef } from "react";
import { Typography, Box, Link, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import styles from '@/styles/AudioWave.module.css';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SoundWaveIcon from "./ui/SoundWaveIcon";
import DraggableWindow from "../components/DraggableWindow";
import DraggableWindowContainer from '@/components/DraggableWindowContainer';
import { margin } from "@mui/system";

interface SoundWaveProps {
    audioPath: string;
    text_content: any;
    n: number;
    color: string;
}


const SoundWave: React.FC<SoundWaveProps> = ({ audioPath, text_content, n, color }) => {
    // Function to resample the data to the desired length (n)
    const [changedBars, setChangedBars] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // text conent  
    const [jpText, setJpText] = useState<string>("");
    const [zhText, setZhText] = useState<string>("");
    const [romaText, setRomaText] = useState<string>("");
    const [stableTs, setStableTs] = useState<any>(null);


    // play audio
    const [audioData, setAudioData] = useState<Float32Array | null>(null);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

    const [text, setText] = useState<string[] | null>([]);

    // record audio
    const [recording, setRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recordAudioData, setRecordAudioData] = useState<Float32Array | null>(new Float32Array(n).fill(0.01));
    const [resampledRecordData, setResampledRecordData] = useState<Float32Array>(new Float32Array(n).fill(0.01));
    const [changedRecordBars, setChangedRecordBars] = useState<number[]>([]);
    const [audioRecorDuration, setAudioRecordDuration] = useState<number>(0);
    const [currentRecordIndex, setCurrentRecordIndex] = useState(0);

    // Score
    const [score, setScore] = useState<number>(0);

    // live2D
    const [showWindow, setShowWindow] = useState<boolean>(false);
    const [volumeData, setVolumeData] = useState<Float32Array | null>(new Float32Array(n).fill(0.01));
    const [volume, setVolume] = useState<number>(0);
    const closeWindow = () => {
        setShowWindow(false);
    };

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Even if showWindow is false, this useEffect will now run correctly.
    useEffect(() => {
        if (iframeRef.current && !isNaN(Number(volume))) {
            const contentWindow = iframeRef.current.contentWindow;
            if (contentWindow) {
                contentWindow.postMessage({ volume: volume }, '*');
            }
        }
    }, [volume]);


    // Function to resample the data to the desired length (n) and normalize values between [0, 1]
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

    const computeDerivative = (arr: Float32Array) => {
        const derivative = new Float32Array(arr.length - 1);
        for (let i = 1; i < arr.length; i++) {
            derivative[i - 1] = arr[i] - arr[i - 1];
        }
        return derivative;
    };

    const dotProduct = (arr1: Float32Array, arr2: Float32Array) => {
        if (arr1.length !== arr2.length) {
            throw new Error('Arrays must be of the same length.');
        }
        let sum = 0;
        for (let i = 0; i < arr1.length; i++) {
            sum += arr1[i] * arr2[i];
        }
        return sum;
    };

    const computeSimilarity = (arr1: Float32Array, arr2: Float32Array) => {
        const derivative1 = computeDerivative(arr1);
        const derivative2 = computeDerivative(arr2);
        return dotProduct(derivative1, derivative2);
    };


    useEffect(() => {
        // Fetch the JSON content and set it to the text state
        setJpText(text_content.jp_text);
        setZhText(text_content.zh_text);
        setRomaText(text_content.roma_text);
        setStableTs(text_content.stable_ts);
    }, [text_content]);


    useEffect(() => {
        console.log("audioPath", audioPath);
        // Initialize AudioContext and load the audio file
        const context = new AudioContext();

        fetch(audioPath)
            .then(response => response.arrayBuffer())
            .then(data => context.decodeAudioData(data))
            .then(buffer => {
                setAudioBuffer(buffer);
                setAudioDuration(buffer.duration);
                // console.log("channelData", audioDuration);

                // Extract pitch or any other data from the buffer.
                const channelData = buffer.getChannelData(0);
                const resampledAudioData = resampleData(channelData, n);
                setAudioData(new Float32Array(resampledAudioData));

                //live2d volume
                const averageChannelData = buffer.getChannelData(0);
                const resampledAverageChannelData = resampleData(averageChannelData, n, true, 5);
                setVolumeData(new Float32Array(resampledAverageChannelData));
                //console.log("resampledAverageChannelData", resampledAverageChannelData);

            })
            .catch(err => console.error(err));

        setAudioContext(context);

        //reset all the data
        setCurrentIndex(0);
        setCurrentRecordIndex(0);
        setChangedBars([]);
        setRecordAudioData(new Float32Array(n).fill(0.01));
        setResampledRecordData(new Float32Array(n).fill(0.01));
        setChangedRecordBars([]);
        setScore(0);

        return () => {
            context.close(); // Clean up AudioContext when component unmounts
        };
    }, [audioPath]);

    useEffect(() => {
        if (recordAudioData && audioData) {
            setResampledRecordData(recordAudioData);
            const similarity = computeSimilarity(audioData, recordAudioData);
            setScore(similarity * 100);
        }
    }, [recordAudioData, audioRecorDuration]);

    const handlePlay = () => {
        if (!audioBuffer || !audioContext) return;

        setCurrentIndex(0);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();

        let index = 0;
        const interval = audioDuration / n;
        const intervalId = setInterval(() => {
            setCurrentIndex(prev => prev + 1);
            index++;

            if (volumeData) {
                setVolume(volumeData[index] * 0.8);
            }

            if (index >= n) {
                clearInterval(intervalId);
            }
        }, interval * 1000); // Convert to milliseconds
    };




    if (!audioData) return null;  // Wait until audio data is loaded

    // const resampledDataNumbers = Array.from(audioData);
    //let resampledRecordData = Array.from(recordAudioData || []);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const audioChunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            console.log("onstop");
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            setRecordedBlob(audioBlob);
            // Process and visualize the recorded audio here...
            // Convert the blob to an ArrayBuffer
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (!(event.target && event.target.result)) return;

                const arrayBuffer = event.target.result as ArrayBuffer;

                // Decode the ArrayBuffer using the AudioContext
                if (!audioContext) return;
                audioContext.decodeAudioData(arrayBuffer).then((buffer) => {
                    // Extract amplitude data
                    setAudioRecordDuration(buffer.duration);
                    const channelData = buffer.getChannelData(0);
                    const resampled = resampleData(channelData, n);
                    setRecordAudioData(new Float32Array(resampled));
                });
            };
            reader.readAsArrayBuffer(audioBlob);

            // Ensure you stop the tracks here
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        };

        console.log("onstart");
        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };


    const replayAudio = () => {
        console.log("replayAudio");
        if (recordedBlob) {
            const audioURL = URL.createObjectURL(recordedBlob);
            const audio = new Audio(audioURL);
            audio.play();

            setChangedRecordBars([]);

            let index = 0;
            const interval = audioRecorDuration / n;
            const intervalId = setInterval(() => {
                setCurrentRecordIndex(prev => prev + 1);
                index++;

                if (index >= n) {
                    clearInterval(intervalId);
                }
            }, interval * 1000)
        }
    };

    return (

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    px: 2,
                    py: 1,
                    backgroundColor: '#faf6f6',
                    alignItems: 'center',
                    justifyContent: 'start',
                    margin: '10px',
                }}
            >
                <Typography variant="h4" component="p" paragraph>
                    Score {parseFloat(score.toFixed(2))}
                </Typography>
                <div className={styles.soundWave}>
                    {Array.from(audioData || []).map((value: number, idx: number) => (
                        <div
                            key={idx}
                            className={styles.bar}
                            style={{
                                backgroundColor: idx < currentIndex ? color : '#D2D2D2',
                                height: `${Math.abs(value * 80)}%`,
                                transitionDuration: `${(audioDuration / n) * 1000}ms`,
                            }}
                        />
                    ))}
                </div>
                {jpText && zhText && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0px',
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Typography variant="h5" component="p" paragraph sx={{ margin: '3px' }}>
                            {jpText}
                        </Typography>
                        <Typography variant="body1" component="p" paragraph sx={{ margin: '0px' }}>
                            {romaText}
                        </Typography>
                        <Typography variant="body1" component="p" paragraph sx={{ margin: '0px' }}>
                            {zhText}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handlePlay}
                            sx={{
                                alignSelf: 'center',
                                marginTop: '16px',
                                color: '#333333',
                                '&:hover': {
                                    backgroundColor: '#FFC300',
                                    color: '#333333',
                                },
                            }}>
                            <PlayArrowIcon /> Play
                        </Button>
                    </Box>
                )}
                <div className={styles.soundWave}>
                    {Array.from(recordAudioData || []).map((value: number, idx: number) => {
                        const height = Math.abs(value * 80);
                        return (
                            <div
                                key={idx}
                                className={styles.bar}

                                style={{
                                    backgroundColor: idx < currentRecordIndex ? color : '#D2D2D2',
                                    height: `${height}%`,
                                    transitionDuration: `${(audioDuration / n) * 1000}ms`,
                                }}
                            />
                        );
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <Button
                        variant="contained"
                        onClick={recording ? stopRecording : startRecording}
                        sx={{
                            alignSelf: 'center',
                            marginTop: '16px',
                            color: '#333333',
                            '&:hover': {
                                backgroundColor: '#FFC300',
                                color: '#333333',
                            },
                        }}>
                        {recording ? <div> <StopIcon /> Stop Recording </div> :
                            <div>  <MicIcon /> Start Recording </div>}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={replayAudio}
                        sx={{
                            alignSelf: 'center',
                            marginTop: '16px',
                            color: '#333333',
                            '&:hover': {
                                backgroundColor: '#FFC300',
                                color: '#333333',
                            },
                        }}>
                        <PlayArrowIcon /> RePlay
                    </Button>
                </div>



                {/* <DraggableWindowContainer>
                <DraggableWindow showWindow={true} setShowWindow={closeWindow} volume={volume}/> 
            </DraggableWindowContainer> */}
            </Box>
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
            </Box>


        </Box>
    );
};

export default SoundWave;