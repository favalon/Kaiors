// src/components/AboutPage.tsx

import React from 'react';
import { Typography, Box, Link, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';

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
            <Typography variant="h4" component="h1" gutterBottom>
                About Kairos
            </Typography>
            <Typography variant="body1" component="p" paragraph>
                Kairos is an innovative language learning app designed to help you master a new language quickly and efficiently. Our app offers a wide range of features, including interactive lessons, immersive exercises, and real-time conversation practice, all tailored to your individual learning style and goals.
            </Typography>
            <Typography variant="body1" component="p" paragraph>
                By leveraging cutting-edge artificial intelligence and machine learning techniques, Kairos creates personalized learning paths that adapt to your progress, ensuring that you stay engaged and motivated throughout your language learning journey.
            </Typography>
            <Typography variant="body1" component="p" paragraph>
                Whether you are a complete beginner or an advanced learner looking to brush up on your skills, Kairos offers a comprehensive and enjoyable learning experience that will help you reach your language goals faster than ever before.
            </Typography>
            <Typography variant="body1" component="p" paragraph>
                Join the Kairos community today and unlock the door to new language learning opportunities!
            </Typography>

            <Typography variant="h5" component="h2" gutterBottom>
                Contact Us
            </Typography>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <ChatIcon />
                    </ListItemIcon>
                    <ListItemText primary="微信" secondary="@zixiaoyu9" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ChatIcon />
                    </ListItemIcon>
                    <ListItemText primary="微信" secondary="@caoyuhao" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary="bleedavalon@gmail.com" />
                </ListItem>
            </List>

            <Typography variant="h5" component="h2" gutterBottom>
                Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="https://www.kairosapp.com/terms" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                </Link>
                <Link href="https://www.kairosapp.com/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                </Link>
            </Box>
        </Box>
    );
};

export default AboutPage;
