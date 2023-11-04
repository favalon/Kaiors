import SoundWave from 'components/SoundWave';
import Box from '@mui/material/Box'; // Assuming you're using MUI's Box component
import React, { useState, useEffect } from "react";
import PraticeList from './partice_list';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import WorkChatPage from "@/pages/work_chat_page";
import { Item, PageData } from '@/components/types';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: '0px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface Message {
  id: string;
  senderName: string;
  senderImage: string;
  text: string;
  isOwnMessage: boolean;
}

interface WorkPageProps {
  work_data: any; // work data;
  practice_page_data: any; // practice data;
  chat_page_data: any; // chat data;
  onListItemClick: (chatSettings: any) => void;
  pageData: PageData;
  setPageData: (value: React.SetStateAction<PageData>) => void;
  setMessages: (value: React.SetStateAction<Message[]>) => void
  onReset: () => void;
  onBackClick: () => void;
  onSendMessage: (text: string) => void;
}

const WorkPage: React.FC<WorkPageProps> = ({ 
  work_data, 
  practice_page_data, 
  chat_page_data, 
  onListItemClick,
  pageData,
  setPageData,
  setMessages,
  onReset,
  onBackClick,
  onSendMessage
}) => {

  console.log("chat_page_data", chat_page_data)

  const color = "#70ae6e";
  const n = 120;

  const [value, setValue] = React.useState(0);
  const [workType, setWorkType] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const handleWorkChange = (event: any, newValue: any) => {
    setWorkType(newValue);
  };

  console.log("practice_page_data", practice_page_data)

  return (

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'start',
        height: '80%',
        overflow: 'hidden',
        backgroundColor: '#faf6f6',
      }}
    >
      <Box sx={{ width: '20%', maxWidth: '400px', height: '100vh' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="practice difficulty tabs" sx={{
            '.MuiTab-root': { // Targets the root of the Tab component
              '&.Mui-selected': { // Targets the selected state of the Tab
                color: '#70ae6e', // Example selected text color
              },
              '&:hover': { // Targets the hover state of the Tab
                color: 'black', // Example hover text color
              }
            }
          }}>
            <Tab label="简单" />
            <Tab label="中等" />
            <Tab label="困难" />
          </Tabs>
        </Box>
        {work_data?(
        <Box sx={
          {
            maxWidth: '400px',
            overflowY: 'auto',
            height: '100vh',
            margin: '0px',
            padding: '2px',
            borderRight: '2px solid divider'
          }}>
          <TabPanel value={value} index={0}>
            <PraticeList scene_items={work_data.easy} onListItemClick={onListItemClick} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PraticeList scene_items={work_data.mid} onListItemClick={onListItemClick} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <PraticeList scene_items={work_data.hard} onListItemClick={onListItemClick} />
          </TabPanel>
        </Box>
        ): null}
      </Box>
      <Box sx={{ width: '100%', height: '100vh' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={workType} onChange={handleWorkChange} aria-label="practice difficulty tabs" sx={{
            '.MuiTab-root': { // Targets the root of the Tab component
              '&.Mui-selected': { // Targets the selected state of the Tab
                color: '#70ae6e', // Example selected text color
              },
              '&:hover': { // Targets the hover state of the Tab
                color: 'black', // Example hover text color
              }
            }
          }}>
            <Tab label="口语练习" />
            <Tab label="互动对话" />
          </Tabs>
        </Box>
          <Box>
            <TabPanel value={workType} index={0}>
            {practice_page_data && (<SoundWave
                audioPath={practice_page_data.audio_path}
                text_content={practice_page_data.text_content}
                n={n}
                color={color} />)}
            </TabPanel>
            <TabPanel value={workType} index={1}>
              {pageData?(
              <WorkChatPage
                key={chat_page_data.messages.length}
                chatName={chat_page_data.title || "Chat Name"}
                messages={chat_page_data.messages}
                botchatSettings={chat_page_data.chatSettings.bot}
                userChatSettings={chat_page_data.chatSettings.user}
                pageData={pageData}
                setPageData={setPageData}
                setMessages={setMessages}
                onReset={onReset}
                onBackClick={onBackClick}
                onSendMessage={onSendMessage}
              />):null}
            </TabPanel>
          </Box>
        
      </Box>
    </Box>
  )
}

export default WorkPage;
