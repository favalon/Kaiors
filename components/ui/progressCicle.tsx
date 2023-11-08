/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

// Define the keyframes using Emotion's `keyframes` utility
const ellipsisAnimation = keyframes`
    0% { content: ' .'; }
    20% { content: ' ..'; }
    40% { content: ' ...'; }
    60% { content: ' ....'; }
    80% { content: ' .....'; }
    100% { content: ' .'; }
`;

// Your component
function ProgressCircle() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: "row",
            alignItems: 'start',
            justifyContent: 'start',
            mx: '50px',
        }}>

            {/* <CircularProgress sx={{ color: '#70ae6e', m: "auto", my: "6px" }} /> */}
            <Typography component="div" sx={{
                color: 'black',
                backgroundColor: '#faf6f6',
                borderRadius: '12px',
                height: '40px',
                width: '100px',
                minWidth: '100px',
                display: 'flex',
                padding: '8px',
                alignItems: 'start',
                marginLeft: '12px',
                '&::after': {
                    content: '"."',
                    display: 'inline-block', // Ensure pseudo-element respects animation
                    animation: `${ellipsisAnimation} 2.5s infinite step-start`, // Apply the animation
                    fontSize: '1.5em',
                    
                },
            }}>
            </Typography>
        </Box>
    );
}

export default ProgressCircle;