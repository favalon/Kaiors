import React, { useState, useEffect, useRef } from "react";
import { Typography, Box } from '@mui/material';
import styles from '@/styles/AudioWave.module.css';
import live2Dstyles from '@/styles/live2dmessage.module.css';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';


interface SoundWaveProps {
    uid: string;
    audioPath: string;
    text_content: any;
    n: number;
}

const SoundWave: React.FC<SoundWaveProps> = ({ uid, audioPath, text_content, n }) => {
    // Function to resample the data to the desired length (n)
    const [changedBars, setChangedBars] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    let color = "#70ae6e";
    let recordColor = "#FFC300";


    // text conent  
    const [jpText, setJpText] = useState<string>("");
    const [zhText, setZhText] = useState<string>("");
    const [romaText, setRomaText] = useState<string>("");
    const [stableTs, setStableTs] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    // play audio
    const [audioData, setAudioData] = useState<Float32Array | null>(null);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState<number | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


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
    const [live2dMessage, setLive2dMessage] = useState<string>("");

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

    useEffect(() => {
        if (iframeRef.current && !isNaN(Number(score))) {
            const contentWindow = iframeRef.current.contentWindow;
            if (contentWindow) {
                let expression = "F05"
                let motion = 1
                if (score > 100) {
                    expression = "F05"
                    setLive2dMessage("你的发音简直完美！👏");
                } else if (score > 50) {
                    expression = "F04"
                    motion = 4
                    setLive2dMessage("你的发音已经很好了！👍");
                } else if (score > 0) {
                    expression = "F01"
                    motion = 3
                    setLive2dMessage("你的发音还可以 ！😐");
                } else if (score > -25) {
                    expression = "F02"
                    motion = 2
                    setLive2dMessage("你的发音还有待提高 ！😅");
                }else {
                    expression = "F01"
                    motion = 4
                    setLive2dMessage("你的发音还需要加油 ！💪");
                }
                contentWindow.postMessage({ expression: expression, motion: motion }, '*');
                console.log("score", expression);
            }
        }
    }, [score]);


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

    const allWords = text_content.stable_ts.segments.reduce((accumulator: any, segment: any) => {
        return accumulator.concat(segment.words);
    }, []);


    useEffect(() => {
        // Fetch the JSON content and set it to the text state
        setJpText(text_content.jp_text);
        setZhText(text_content.zh_text);
        setRomaText(text_content.roma_text);
        setStableTs(allWords);
        setImageUrl(text_content.imageUrl);
    }, [text_content]);


    useEffect(() => {
        // Initialize AudioContext and load the audio file
        const context = new AudioContext();

        fetch(audioPath)
            .then(response => response.arrayBuffer())
            .then(data => context.decodeAudioData(data))
            .then(buffer => {
                setAudioBuffer(buffer);
                setAudioDuration(buffer.duration);

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
        if (recordAudioData && audioData && recordAudioData.length === audioData.length) {
            setResampledRecordData(recordAudioData);
            const similarity = computeSimilarity(audioData, recordAudioData);
            setScore(similarity * 100);
        }
    }, [recordAudioData, audioRecorDuration]);

    // Function to clear the interval safely
    const getHighlightedIndex = (currentTime: any) => {
        return stableTs.findIndex((segment: { start: number, end: number }) => {
            return currentTime >= segment.start && currentTime < segment.end;
        });
    };

    const handlePlay = () => {
        if (!audioBuffer || !audioContext) return;

        if (iframeRef.current) {
            const contentWindow = iframeRef.current.contentWindow;
            if (contentWindow) {
                let expression = "F01"
                let motion = 3
                contentWindow.postMessage({ expression: expression, motion: motion }, '*');
                console.log("score", expression);
            }
        }

        // Stop any previously playing audio
        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }

        setCurrentIndex(0);
        setCurrentTime(0);
        setCurrentHighlightedIndex(null);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        sourceRef.current = source;

        // Set up the end event listener
        source.onended = () => {
            //setCurrentIndex(0);
            setCurrentTime(0);
            setCurrentHighlightedIndex(null);
            sourceRef.current = null;
        };

        let index = 0;
        const interval = audioDuration / n;
        const intervalId = setInterval(() => {
            setCurrentIndex(prev => prev + 1);
            index++;

            // Update the current time state based on the interval progress
            setCurrentTime(index * interval);
            setCurrentHighlightedIndex(getHighlightedIndex(index * interval));

            if (volumeData) {
                setVolume(volumeData[index] * 0.8);
            }

            if (index >= n) {
                clearInterval(intervalId);
            }
        }, interval * 1000); // Convert to milliseconds

        // Update the score for the item in localStorage
        const preScore = getScore(uid)
        const newScore = preScore + 1; // for example increment by 1
        // Update the score in localStorage
        localStorage.setItem(`score-${uid}`, newScore.toString());

    };

    const getScore = (item_uid: string) => {
        const score = localStorage.getItem(`score-${item_uid}`);
        return score !== null ? parseInt(score, 10) : 0;
    };

    if (!audioData) return null;  // Wait until audio data is loaded

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const audioChunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
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
            setCurrentRecordIndex(0);

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

    const playSegment = (start: any, end: any) => {
        if (!audioBuffer || !audioContext) return;

        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current = null; // Clear the current source
        }

        // Create a new source for the audioContext
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Connect the source to the context's destination
        source.connect(audioContext.destination);


        // Start playing the segment
        source.start(0, start, end - start);
        setCurrentHighlightedIndex(null); // Optional: Reset highlighted index

        // Optional: when the segment finishes playing, execute some code
        source.onended = () => {
            // Code to execute after playback
            setCurrentHighlightedIndex(null); // Reset highlighted index if necessary
        };
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
                    width: '60%',
                    height: '80%',
                    backgroundColor: 'transparent',
                    padding: '0px',
                    pointerEvents: 'auto',
                    overflow: 'hidden', // This will hide any overflow
                    borderRadius: '20px',
                    right: '5px',
                    bottom: '5px',
                    position: 'absolute',
                    zIndex: 0,

                }}
            >
                {/* <div className={styles.scoreTypo}>
                    {parseFloat(score.toFixed(0))}
                </div> */}
                {live2dMessage && live2dMessage !="" && (
                    <div className={styles.live2Dmessage}>
                    {live2dMessage}
                </div>
                )}
                
                
                <iframe
                    title="live2d"
                    ref={iframeRef}
                    src="/live2d.html"
                    allowFullScreen
                    style={{
                        position: 'relative', // This enables the iframe to be moved with top and left
                        left: `${200}px`, // Replace xValue with the desired x offset
                        top: `${-100}px`, // Replace yValue with the desired y offset
                        width: '110%',
                        height: '300%',
                        border: 'none',
                        borderRadius: '20px',
                    }}
                >
                    
                </iframe>

            </Box>
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
                    maxWidth: '800px',
                }}
            >
                {
                    imageUrl && imageUrl !== "/images/" ? (
                        <img src={imageUrl} alt={jpText} className={styles.represent_image} />
                    ) : (
                        <div className={styles.represent_image_alt}>
                            {jpText}
                        </div>
                    )

                }
                
                {stableTs && zhText && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0px',
                            px: 2,
                            py: 1,
                            zIndex: 1,
                        }}
                    >
                        <Typography variant="body1" component="p" paragraph sx={{ margin: '3px' }}>
                            {zhText}
                        </Typography>
                        <Typography variant="body1" component="p" paragraph sx={{ margin: '3px' }}>
                            {romaText}
                        </Typography>

                        <Typography variant="h5" component="p" paragraph sx={{ margin: '3px' }}>
                            {stableTs.map((segment: any, index: any) => (
                                <span
                                    key={index}
                                    onClick={() => playSegment(segment.start, segment.end)}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    style={{
                                        background: currentHighlightedIndex === index || hoveredIndex === index ? '#70ae6e' : 'transparent',
                                        borderRadius: currentHighlightedIndex === index || hoveredIndex === index ? '20px' : '0',
                                        color: currentHighlightedIndex === index || hoveredIndex === index ? '#ffffff' : 'black',
                                        padding: currentHighlightedIndex === index || hoveredIndex === index ? '0.5em' : '0',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {segment.word}
                                </span>
                            ))}
                            {/* {`  (${jpText})`} */}
                        </Typography>
                        {/* <Typography variant="body1" component="p" paragraph sx={{ margin: '0px' }}>
                            {jpText}
                        </Typography> */}
                        <div className={styles.soundWaveContainer}>
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
                            <div className={styles.soundWaveOverlay}>
                                {Array.from(recordAudioData || []).map((value: number, idx: number) => {
                                    const height = Math.abs(value * 80);
                                    return (
                                        <div
                                            key={idx}
                                            className={styles.bar}
                                            style={{
                                                backgroundColor: idx < currentRecordIndex ? recordColor : '#edede9',
                                                height: `${height}%`,
                                                transitionDuration: `${(audioDuration / n) * 1000}ms`,
                                            }}
                                        />
                                    );
                                })}
                            </div>

                        </div>
                    </Box>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <Button
                        variant="contained"
                        onClick={handlePlay}
                        sx={{
                            alignSelf: 'center',
                            marginTop: '16px',
                            color: '#333333',
                            backgroundColor: '#ffffff !important',
                            '&:hover': {
                                backgroundColor: '#70ae6e',
                                color: '#333333',
                            },
                        }}>
                        <PlayArrowIcon /> 播放
                    </Button>
                    <Button
                        variant="contained"
                        onClick={recording ? stopRecording : startRecording}
                        sx={{
                            alignSelf: 'center',
                            marginTop: '16px',
                            backgroundColor: '#ffffff !important',
                            color: '#333333',
                            '&:hover': {
                                backgroundColor: '#70ae6e',
                                color: '#333333',
                            },
                        }}>
                        {recording ? <div> <StopIcon /> 停止录音 </div> :
                            <div>  <MicIcon /> 开始录音 </div>}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={replayAudio}
                        sx={{
                            alignSelf: 'center',
                            marginTop: '16px',
                            backgroundColor: '#ffffff !important',
                            color: '#333333',
                            '&:hover': {
                                backgroundColor: '#70ae6e',
                                color: '#333333',
                            },
                        }}>
                        <PlayArrowIcon /> 回放录音
                    </Button>

                </div>

            </Box>



        </Box>
    );
};

export default SoundWave;