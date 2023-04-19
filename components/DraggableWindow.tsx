import React from 'react';
import Draggable from 'react-draggable';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import styles from '@/styles/live2D.module.css'

interface DraggableWindowProps {
    showWindow: boolean;
    setShowWindow: () => void;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({ showWindow, setShowWindow }) => {
    if (!showWindow) return null;

    return (
        <Draggable bounds="parent">
            <Box
                sx={{
                    position: 'absolute',
                    top: '100px',
                    left: '100px',
                    width: '270px',
                    height: '480px',
                    backgroundColor: '#333333',
                    borderRadius: '20px',
                    padding: '0px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    border: '3px solid #333333',

                }}
            >
                <div className={styles.iframe_wrapper}>
                <iframe
                    src="/account-page.html"
                    title="Account Page"
                    frameBorder="0"
                    allowFullScreen
                    style={{
                        padding: 0,
                        margin: 0,
                        top:"-100px",
                        left:"-10px",
                        width: '110%', height: '300%', border: 'none',
                        borderRadius: '20px',
                    }}
                ></iframe>
                </div>
                <Box
                    sx={{
                        position: 'absolute',
                        padding: '0px',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={setShowWindow}
                        onTouchCancel={setShowWindow}
                        sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            padding: '4px',
                            color: '#555555',
                            ':hover': {
                                backgroundColor: '#555555',
                                color: '#FFC300',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
        </Draggable>
    );
};

export default DraggableWindow;
