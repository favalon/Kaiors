// src/components/AboutPage.tsx

import React from 'react';
import { Typography, Box, Link, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import { GithubIcon } from 'lucide-react';

interface AboutPageProps {}

const AboutPage: React.FC<AboutPageProps> = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                mx: 'auto',
                px: 2,
                py: 4,
            }}
        >

            <Typography variant="h2" component="h2" gutterBottom>
                Contact Me
            </Typography>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <ChatIcon />
                    </ListItemIcon>
                    <ListItemText primary="微信 WeChat" secondary="@zixiaoyu9" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary="bleedavalon@gmail.com" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <GithubIcon />
                    </ListItemIcon>
                    <ListItemText primary="GitHub: Leran-Language-By-Scene" secondary="https://github.com/favalon/Leran-Language-By-Scene" />
                </ListItem>
            </List>

            {/* <Typography variant="h5" component="h2" gutterBottom>
                Links
            </Typography> */}
        </Box>
    );
};

export default AboutPage;
