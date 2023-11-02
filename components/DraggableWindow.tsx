import React, { useState, useEffect, useRef } from "react";
import Draggable from 'react-draggable';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import styles from '@/styles/live2D.module.css'
import { copyFileSync } from "fs";

interface DraggableWindowProps {
    showWindow: boolean;
    setShowWindow: () => void;
    volume: number;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({ showWindow, setShowWindow, volume }) => {
    // Hooks are called at the top level, not conditionally
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Even if showWindow is false, this useEffect will now run correctly.
    useEffect(() => {
        // If showWindow is false, we don't want to do anything.
        // This check replaces the conditional early return we had before.
        if (!showWindow) return;

        // Now we know showWindow is true, so we continue with our logic.
        if (iframeRef.current && !isNaN(Number(volume))) {
            const contentWindow = iframeRef.current.contentWindow;
            if (contentWindow) {
                contentWindow.postMessage({ volume: volume }, '*');
            }
        }
    }, [showWindow, volume]); // Added showWindow as a dependency, it is safe because it won't change the hook call order

    // Conditional rendering based on showWindow, after all hooks have been called
    if (!showWindow) return null;

    return (
        <Draggable bounds="parent">
            <Box
                sx={{
                    position: 'absolute',
                    top: '100px',
                    left: '78%',
                    width: '300px',
                    height: '600px',
                    backgroundColor: '#333333',
                    borderRadius: '20px',
                    padding: '0px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    //border: '3px solid #333333',

                }}
            >
                <div className={styles.iframe_wrapper}>
                <iframe
                    // src="/account-page.html"
                    title="Account Page"
                    ref={iframeRef}
                    src="/account-page.html"
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
                {/* <Box
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
                </Box> */}
            </Box>
        </Draggable>
    );
};

export default DraggableWindow;
