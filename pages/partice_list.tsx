import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Button,
    Typography,
    LinearProgress,
    TextField,
    IconButton
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { get } from 'http';


interface PraticeListProps {
    scene_items: any;
    onListItemClick: (chatSettings: any) => void;
}


const PraticeList: React.FC<PraticeListProps> = ({ scene_items, onListItemClick }) => {

    // State to hold the sorted items
    const [sortedItems, setSortedItems] = useState<any>([]);

    useEffect(() => {
        // Function to retrieve the score for an item from localStorage
        const getScore = (item: any) => {
            const score = localStorage.getItem(`score-${item.uid}`);
            return score !== null ? parseInt(score, 10) : 0;
        };

        // Sort the items based on their score
        const itemsWithScore = scene_items.map((item: any) => ({
            ...item,
            score: getScore(item),
        }));

        itemsWithScore.sort((a: any, b: any) => a.score - b.score);

        setSortedItems(itemsWithScore);
    }, [scene_items]);

    // Conditional rendering based on the data
    if (!scene_items?.length) {
        // Show loading only if the data is undefined or the array is empty
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const onListItemPlayClick = (wavPath: string, uid: string, score: any) => {
        // Create a new audio object with the path to the wav file
        const audio = new Audio(wavPath);

        // Play the audio
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            // Handle any errors playing the audio file here
        });

        // Update the score for the item in localStorage
        const newScore = score + 1; // for example increment by 1

        // Update the score in localStorage
        localStorage.setItem(`score-${uid}`, newScore.toString());

        // Update the state to re-render the list with the new score
        setSortedItems((prevItems: any) => {
            return prevItems.map((i: any) => {
                if (i.uid === uid) {
                    return { ...i, score: newScore };
                }
                return i;
            }).sort((a: any, b: any) => a.score - b.score);
        });


    };

    const getScore = (item: any) => {
        const score = localStorage.getItem(`score-${item.uid}`);
        return score !== null ? parseInt(score, 10) : 0;
      };

    const ResetItemScore = (item: any) => {
        const resetScore = 0
        localStorage.setItem(`score-${item.uid}`, '0');

        // Update the state to re-render the list with the new score
        setSortedItems((prevItems: any) => {
            return prevItems.map((i: any) => {
                if (i.uid === item.uid) {
                    return { ...i, score: resetScore };
                }
                return i;
            }).sort((a: any, b: any) => a.score - b.score);
        });
    };
    const ScoreUp = (item: any) => {
        const resetScore = getScore(item) + 1
        localStorage.setItem(`score-${item.uid}`, resetScore.toString());

        // Update the state to re-render the list with the new score
        setSortedItems((prevItems: any) => {
            return prevItems.map((i: any) => {
                if (i.uid === item.uid) {
                    return { ...i, score: resetScore };
                }
                return i;
            }).sort((a: any, b: any) => a.score - b.score);
        });
    };
    const ScoreDown = (item: any) => {
        const resetScore = getScore(item) - 1
        localStorage.setItem(`score-${item.uid}`, resetScore.toString());

        // Update the state to re-render the list with the new score
        setSortedItems((prevItems: any) => {
            return prevItems.map((i: any) => {
                if (i.uid === item.uid) {
                    return { ...i, score: resetScore };
                }
                return i;
            }).sort((a: any, b: any) => a.score - b.score);
        });
    };

    const interpolateColor = (score: number) => {
        // Ensure score is within bounds
        const boundedScore = Math.min(10, Math.max(score, 0));
        // Calculate the ratio of the score
        const ratio = boundedScore / 10;

        // Red color components (hex FA5151)
        const redStart = { r: 0xFA, g: 0x51, b: 0x51 };
        // Green color components (hex 70ae6e)
        const greenEnd = { r: 0x70, g: 0xAE, b: 0x6E };

        // Interpolate between red and green
        const r = Math.round(redStart.r + ratio * (greenEnd.r - redStart.r));
        const g = Math.round(redStart.g + ratio * (greenEnd.g - redStart.g));
        const b = Math.round(redStart.b + ratio * (greenEnd.b - redStart.b));

        // Convert the components back to a hex string
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };



    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}
        >
            {sortedItems.map((item: any, idx: any) => {
                const lock = localStorage.getItem(`item-${item.id}`) || 'yes';

                return (
                    <Card
                        onClick={() => onListItemClick(item)}
                        key={item.id}
                        sx={{
                            width: '100%',
                            height: '80px',
                            borderRadius: '12px',
                            my: '2px',
                            display: 'flex',
                            color: '#70ae6e',
                            // backgroundColor: '#edede9',
                            backgroundColor: interpolateColor(item.score),
                            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                            opacity: "90%",
                            alignItems: 'center',
                            position: 'relative',
                            '&:hover': {
                                backgroundColor: '#333333',
                                opacity: 0.7, // Dim the card on hover
                                boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.5)', // Add a deeper shadow to the card on hover
                                '& .hover-button': {
                                  opacity: 1,
                                  visibility: 'visible',
                                },
                            },
                        }}
                    >
                        <CardActionArea
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                maxWidth: '80%',
                            }}
                        >
                            <CardContent sx={{
                                margin: "5px", width: "100%",
                                height: "100%", justifyContent: 'center',
                                padding: "5px",
                            }}>
                                <Typography
                                    gutterBottom
                                    variant="body1"
                                    component="div"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#333333',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '100%', // Or a specific pixel value
                                    }}
                                >
                                    {item.jp_text || 'Default text'}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="caption"
                                    component="div"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#333333',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '100%', // Or a specific pixel value
                                    }}
                                >
                                    {item.zh_text || 'Default text'}
                                </Typography>

                            </CardContent>
                        </CardActionArea>
                        {/* <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                maxWidth: '30%',
                            }}
                        >
                            <Button
                                sx={{
                                    color: '#33333333', // Text color
                                    fontWeight: 'bold',
                                    backgroundColor: 'trasparent !important',
                                    mx: '5px',
                                    my: '2px',
                                    '&:hover': {
                                        backgroundColor: '#33333333 !important', // Light grey background on hover
                                        color: '#5e8b5a', // A darker shade of green on hover
                                    },

                                }}
                                onClick={() => ResetItemScore(item)}
                            >忘记</Button>

                        </Box> */}
                        <IconButton>
                            <VolumeUpIcon onClick={() => onListItemPlayClick(item.wav_path, item.uid, item.score)} />
                        </IconButton>
                        <Box
                            className="hover-button"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '16px',
                                transform: 'translateY(-50%)',
                                color: 'white',
                                opacity: 0,
                                visibility: 'hidden',
                                transition: 'opacity 0.3s ease, visibility 0.3s ease',
                                zIndex: 2, // Ensure the button is above other elements
                                display: 'flex',
                                gap: '5px',
                            }}>
                            <Button
                                sx={{
                                    color: 'white', // Text color
                                    fontWeight: 'bold',
                                    backgroundColor: 'trasparent !important',
                                    mx: '5px',
                                    my: '2px',
                                    '&:hover': {
                                        backgroundColor: '#333333aa !important', // Light grey background on hover
                                        color: 'white', // A darker shade of green on hover
                                    },

                                }}
                                onClick={() => ScoreUp(item)}
                            >熟悉</Button>
                            <Button
                                sx={{
                                    color: 'white', // Text color
                                    fontWeight: 'bold',
                                    backgroundColor: 'trasparent !important',
                                    mx: '5px',
                                    my: '2px',
                                    '&:hover': {
                                        backgroundColor: '#333333aa !important', // Light grey background on hover
                                        color: 'white', // A darker shade of green on hover
                                    },

                                }}
                                onClick={() => ScoreDown(item)}
                            >陌生</Button>
                            <Button
                                sx={{
                                    color: 'white', // Text color
                                    fontWeight: 'bold',
                                    backgroundColor: 'trasparent !important',
                                    mx: '5px',
                                    my: '2px',
                                    '&:hover': {
                                        backgroundColor: '#333333aa !important', // Light grey background on hover
                                        color: 'white', // A darker shade of green on hover
                                    },

                                }}
                                onClick={() => ResetItemScore(item)}
                            >忘记</Button>

                        </Box>

                    </Card>

                );
            })}
        </Box>
    );
};


export default PraticeList;
