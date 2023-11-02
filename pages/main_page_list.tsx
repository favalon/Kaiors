import * as React from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    LinearProgress,
    TextField
} from '@mui/material';
import styles from '@/styles/MainPageList.module.css';
import { width } from '@mui/system';
import basic_value from "@/public/basic_value.json";

interface CharacterSetting {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    chatSettings: any;
    show: boolean;
}


interface MainPageListProps {
    userSetting: any;
    test_item: CharacterSetting;
    task_items: CharacterSetting[];
    piazza_character: CharacterSetting[];
    userEnglishLevel: string;
    onListItemClick: (chatSettings: any) => void;
}

interface mainListItem {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    chatSettings: any;
    show: boolean;
}

const MainPageList: React.FC<MainPageListProps> = ({ userSetting, test_item, task_items, piazza_character, userEnglishLevel, onListItemClick }) => {

    const [progress, setProgress] = React.useState(10);

    const [custom_items, setCustomItems] = React.useState<mainListItem[]>([]);
    const [userTopic, setUserTopic] = React.useState('')
    const [userTopicDescription, setUserTopicDescription] = React.useState('')

    const item_tempalte = {
        id: 1,
        imageUrl: '/friend.png',
        title: userTopic,
        description: 'I want to know',
        chatSettings: {
            bot: {
                botName: "Kairos",
                title: userTopic,
                description: basic_value.role_setting.concept,
                quiz: basic_value.role_setting.quiz,
                imageUrl: '/friend.png',
                createNote: basic_value.role_setting.create_note,
                getResult: basic_value.role_setting.get_level,
            },
            user: userSetting
        },
        show: true
    }


    const handleUserAddTopic = (topic: string) => {
        if (topic === '') return
        const item = {
            ...item_tempalte,
            id: custom_items.length + 1,
            title: topic,
            chatSettings: {
                ...item_tempalte.chatSettings,
                bot: {
                    ...item_tempalte.chatSettings.bot,
                    title: topic
                }
            }
        }
        setCustomItems([...custom_items, item])
        setUserTopicDescription('')
    }

    const handleTextFieldKeyDown = (event: any) => {
        if (event.key === ' ') {
          event.stopPropagation(); // Stop the 'space' key event from propagating to the parent Card component
        }
      };



    return (

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                mx: 'auto',
            }}
        >
            {userEnglishLevel === 'N2' ? (

                <Box sx={{ width: '100%', maxWidth: '500px' }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginLeft: '50px'
                    }}>
                        <Typography variant="h4" component="h1" gutterBottom
                            sx={{ marginTop: '20px', fontSize: '30px', fontWeight: 'bold', color: '#333333' }
                            }>
                            Test Your Skill
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                        }}
                    >

                        <Card
                            key={"English task"}
                            onClick={() => onListItemClick(test_item)}
                            sx={{
                                maxWidth: '450px',
                                width: '100%',
                                height: '150px',
                                borderRadius: '20px',
                                mx: '25px',
                                my: '3px',
                                display: 'flex',
                                color: '#333333',
                                backgroundColor: '#FFC200',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                opacity: "90%",
                            }}
                        >
                            <CardActionArea
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <Box sx={{
                                    width: '150px', height: '100%',
                                    minWidth: '150px',
                                    maxWidth: '150px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    <CardMedia
                                        component="img"
                                        width="100%"
                                        height="auto"
                                        image={'/mentor1.png'}
                                        alt={'Default title'}
                                    />
                                </Box>
                                <CardContent sx={{
                                    padding: "20px", width: "300px",
                                    height: "auto", alignSelf: 'center',
                                }}>
                                    <Typography gutterBottom
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#333333'
                                        }}>
                                        Get Your English Level
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <Card
                            onClick={() => onListItemClick({})}
                            sx={{
                                maxWidth: '450px',
                                width: '100%',
                                height: '150px',
                                borderRadius: '20px',
                                mx: '25px',
                                my: '10px',
                                display: 'flex',
                                color: '#333333',
                                backgroundColor: '#FFFFFF',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                opacity: "90%",
                            }}
                        >
                            <CardActionArea
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <Box sx={{
                                    width: '150px', height: '100%',
                                    minWidth: '150px',
                                    maxWidth: '150px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    <CardMedia
                                        component="img"
                                        width="100%"
                                        height="auto"
                                        image={'/mentor2.png'}
                                        alt={'I want to Know'}
                                    />
                                </Box>
                                <CardContent sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    padding: "20px", width: "300px",
                                    height: "auto", alignSelf: 'center',
                                }}>

                                    <Typography gutterBottom
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#333333',
                                            alignSelf: 'flex-start'
                                        }}>
                                        我只想使用中文
                                    </Typography>
                                    <Typography variant="body2" color="#333333">
                                        使用英文会获取更高的点数！
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>

                    </Box>


                </Box>) : (

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        width: '95%',
                        maxWidth: '500px',
                        mx: 'auto',
                    }}
                >
                    {/* <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginLeft: '50px',
                        width: '90%',
                    }}>
                        <Typography variant="h4" component="h1" gutterBottom
                            sx={{ marginTop: '20px', fontSize: '30px', fontWeight: 'bold', color: '#333333' }
                            }>
                            Test Your Skill
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                        }}
                    >

                        <Card
                            key={"English task"}
                            onClick={() => onListItemClick(test_item)}
                            sx={{
                                maxWidth: '450px',
                                width: '100%',
                                height: '150px',
                                borderRadius: '20px',
                                mx: '25px',
                                my: '3px',
                                display: 'flex',
                                color: '#333333',
                                backgroundColor: '#FFC200',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                opacity: "90%",
                            }}
                        >
                            <CardActionArea
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <Box sx={{
                                    width: '150px', height: '100%',
                                    minWidth: '150px',
                                    maxWidth: '150px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    <CardMedia
                                        component="img"
                                        width="100%"
                                        height="auto"
                                        image={'/mentor1.png'}
                                        alt={'Default title'}
                                    />
                                </Box>
                                <CardContent sx={{
                                    padding: "20px", width: "300px",
                                    height: "auto", alignSelf: 'center',
                                }}>
                                    <Typography gutterBottom
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#333333'
                                        }}>
                                        Get Your English Level
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box> */}
                    
                    {/* <Box sx={{ width: '100%', maxWidth: '500px' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '50px'
                        }}>
                            <Typography variant="h4" component="h1" gutterBottom
                                sx={{ marginTop: '20px', fontSize: '30px', fontWeight: 'bold', color: '#333333' }
                                }>
                                Daily Task
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                alignSelf: "flex-start",
                                backgroundColor: (theme: any) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                                width: 'auto',
                                maxWidth: 150,
                                ml: '50px',
                                mb: 3,
                            }}
                        >
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 5,
                                    borderRadius: '15px',
                                    backgroundColor: "#D2D2D2",
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#FFC300', // Change the bar color here
                                    },
                                }}
                            />

                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                width: '100%',
                                mx: 'auto',
                            }}
                        >
                            {task_items?.map((item) => (
                                <Card
                                    onClick={() => onListItemClick(item)}
                                    key={item.id}
                                    sx={{
                                        maxWidth: '450px',
                                        width: '100%',
                                        height: '150px',
                                        borderRadius: '20px',
                                        my: '3px',
                                        display: 'flex',
                                        color: '#333333',
                                        backgroundColor: '#FFC200',
                                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                        opacity: "90%",
                                    }}
                                >
                                    <CardActionArea
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                        }}
                                    >
                                        <Box sx={{
                                            width: '150px', height: '100%',
                                            minWidth: '150px',
                                            maxWidth: '150px',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            backgroundColor: '#333333',
                                            borderRadius: '0px',

                                        }}>
                                            <CardMedia
                                                component="img"
                                                width="100%"
                                                height="auto"
                                                image={item.imageUrl || 'https://via.placeholder.com/100'}
                                                alt={item.title || 'Default title'}
                                            />
                                        </Box>
                                        <CardContent sx={{
                                            padding: "20px", width: "300px",
                                            height: "auto", alignSelf: 'center',
                                        }}>
                                            <Typography gutterBottom
                                                variant="h6"
                                                component="div"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#333333',
                                                    fontSize: 'clamp(14px, 4vw, 24px)'
                                                }}>
                                                {item.title || 'Default title'}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>

                            ))}
                        </Box>
                    </Box> */}

                    <Box sx={{ width: '100%', maxWidth: '500px', }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginLeft: '50px',
                            marginTop: '50px'

                        }}>
                            <Typography variant="h4" component="h1" gutterBottom
                                sx={{ fontSize: '30px', fontWeight: 'bold', color: '#333333' }
                                }>
                                Interative
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                width: '100%',
                            }}
                        >
                            {piazza_character?.map((item) => (
                                <Card
                                    key={item.id}
                                    onClick={() => onListItemClick(item)}
                                    sx={{
                                        maxWidth: '450px',
                                        width: '100%',
                                        height: '100px',
                                        borderRadius: '20px',
                                        mx: '25px',
                                        display: 'flex',
                                        color: '#333333',
                                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                        opacity: "90%",
                                        backgroundColor: '#f4a261',

                                    }}
                                >
                                    <CardActionArea
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'start',
                                            justifyContent: 'start',
                                        }}
                                    >
                                        <Box sx={{
                                            width: '100px', height: '100%',
                                            alignItems: 'end',
                                            justifyContent: 'end',
                                            overflow: 'hidden',
                                            backgroundColor: '#f4a261',
                                            borderRadius: '20px 0px 0px 0px ',
                                        }}>
                                            <CardMedia
                                                component="img"
                                                width="100%"
                                                height="auto"
                                                image={item.imageUrl || 'https://via.placeholder.com/100'}
                                                alt={item.title || 'Default title'}
                                            />
                                        </Box>
                                        <CardContent sx={{ marginLeft: "20px" }}>
                                            <Typography gutterBottom variant="h5" component="div"
                                                sx={{ fontWeight: 'bold', color: '#000000', fontSize: 'clamp(14px, 4vw, 24px)' }}
                                            >
                                                {item.title || 'Default title'}
                                            </Typography>
                                            <Typography variant="body2" color="#333333">
                                                {item.description || 'Default description'}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>

                            ))}
                        </Box>
                    </Box>
                    {/* <Box sx={{ width: '100%', maxWidth: '500px', }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginLeft: '50px',
                            marginTop: '50px'

                        }}>
                            <Typography variant="h4" component="h1" gutterBottom
                                sx={{ fontSize: '30px', fontWeight: 'bold', color: '#333333' }
                                }>
                                Explore
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                width: '100%',
                            }}
                        >
                            {custom_items?.map((item) => (
                                <Card
                                    onClick={() => onListItemClick(item)}
                                    key={item.id}
                                    sx={{
                                        maxWidth: '450px',
                                        width: '100%',
                                        height: '150px',
                                        borderRadius: '20px',
                                        my: '3px',
                                        display: 'flex',
                                        color: '#333333',
                                        backgroundColor: '#10AEFF',
                                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                        opacity: "90%",
                                    }}
                                >
                                    <CardActionArea
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                        }}
                                    >
                                        <Box sx={{
                                            width: '150px', height: '100%',
                                            minWidth: '150px',
                                            maxWidth: '150px',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            backgroundColor: '#333333',
                                            borderRadius: '0px',

                                        }}>
                                            <CardMedia
                                                component="img"
                                                width="100%"
                                                height="auto"
                                                image={item.imageUrl || 'https://via.placeholder.com/100'}
                                                alt={item.title || 'Default title'}
                                            />
                                        </Box>
                                        <CardContent sx={{
                                            padding: "20px", width: "300px",
                                            height: "auto", alignSelf: 'center',
                                        }}>
                                            <Typography gutterBottom
                                                variant="h6"
                                                component="div"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#333333',
                                                    fontSize: 'clamp(14px, 4vw, 24px)'
                                                }}>
                                                {item.title || 'Default title'}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>

                            ))}
                            <Card
                                onClick={() => handleUserAddTopic(userTopicDescription)}
                                onKeyDown={handleTextFieldKeyDown}
                                sx={{
                                    maxWidth: '450px',
                                    width: '100%',
                                    height: '150px',
                                    borderRadius: '20px',
                                    my: '10px',
                                    display: 'flex',
                                    color: '#333333',
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                    opacity: "90%",
                                    mx: 'auto',
                                }}
                            >
                                <CardActionArea
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    <Box sx={{
                                        width: '150px', height: '100%',
                                        minWidth: '150px',
                                        maxWidth: '150px',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <CardMedia
                                            component="img"
                                            width="100%"
                                            height="auto"
                                            image={'/Explore.png'}
                                            alt={'I want to Know'}
                                        />
                                    </Box>
                                    <CardContent sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        padding: "20px", width: "300px",
                                        height: "auto", alignSelf: 'center',
                                    }}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            placeholder="Enter Topic here..."
                                            value={userTopicDescription}
                                            onChange={(e: any) => setUserTopicDescription(e.target.value)}
                                            inputProps={{ style: { height: '10px', borderRadius: "50px" } }}
                                            sx={{
                                                my: '15px',
                                                maxHeight: '50px',
                                                maxWidth: '300px',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#FFC300', // Change the color here
                                                    },
                                                },
                                            }}
                                        />
                                        <Typography gutterBottom
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#FFC300',
                                                alignSelf: 'flex-end'
                                            }}>
                                            I Want to Know
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>

                            
                        </Box>
                    </Box> */}
                </Box>
            )}

        </Box>
    );
};


export default MainPageList;
