import SoundWave from 'components/SoundWave';
import Box from '@mui/material/Box'; // Assuming you're using MUI's Box component
import React, { useState, useEffect } from "react";
import PraticeList from './partice_list';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import WorkChatPage from "@/pages/work_chat_page";

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
  work_page_data: any; // chat data;
  onListItemClick: (chatSettings: any) => void;
  setMessages: (value: React.SetStateAction<Message[]>) => void
  onReset: () => void;
  onBackClick: () => void;
  onSendMessage: (text: string) => void;
}

const WorkPage: React.FC<WorkPageProps> = ({ 
  work_data, 
  practice_page_data, 
  work_page_data, 
  onListItemClick,
  setMessages,
  onReset,
  onBackClick,
  onSendMessage
}) => {

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

  useEffect(() => {
    // Trigger click on the first item when the component mounts or when work_data changes
    const defaultClick = () => {
      switch (value) {
        case 0:
          if (work_data.easy?.length && work_data.easy.length > 0) {
            onListItemClick(work_data.easy[0]);
          }
          break;
        case 1:
          if (work_data.mid?.length && work_data.mid.length > 0) {
            onListItemClick(work_data.mid[0]);
          }
          break;
        case 2:
          if (work_data.hard?.length && work_data.hard.length > 0) {
            onListItemClick(work_data.hard[0]);
          }
          break;
        default:
          // Handle other cases or do nothing
          break;
      }
    };

    defaultClick();
  }, [value, work_data]); 

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
      <Box sx={{ width: '20%', maxWidth: '400px', height: 'max-content' }}>
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
            {work_data?.easy && work_data.easy.length > 0 && (<Tab label="简单" />)}
            {work_data?.mid && work_data.mid.length > 0 && (<Tab label="中等" />)}
            {work_data?.hard && work_data.hard.length > 0 && (<Tab label="困难" />)}
          </Tabs>
        </Box>
        {work_data?(
        <Box sx={
          {
            maxWidth: '400px',
            overflowY: 'auto',
            height: '93vh',
            margin: '0px',
            padding: '2px',
            borderRight: '2px solid divider'
          }}>
          <TabPanel value={value} index={0}>
          {work_data.easy?(
            <PraticeList scene_items={work_data.easy} onListItemClick={onListItemClick} />):null}
          </TabPanel>
          <TabPanel value={value} index={1}>
          {work_data.mid?(
            <PraticeList scene_items={work_data.mid} onListItemClick={onListItemClick} />):null}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {work_data.hard?(
            <PraticeList scene_items={work_data.hard} onListItemClick={onListItemClick} />):null}
          </TabPanel>
        </Box>
        ): null}
      </Box>
      <Box sx={{ width: '100%', height: 'max-content' }}>
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
            {practice_page_data && <Tab label="口语练习" />}
            {work_page_data?.interative_option && (<Tab label="互动对话" />)}
          </Tabs>
        </Box>
          <Box>
            <TabPanel value={workType} index={0}>
            {practice_page_data && (<SoundWave
                uid={practice_page_data.uid}
                audioPath={practice_page_data.audio_path}
                text_content={practice_page_data.text_content}
                n={n}/>)}
            </TabPanel>
            <TabPanel value={workType} index={1}>
              {work_page_data && (
              <WorkChatPage
                key={work_page_data.messages.length}
                chatName={work_page_data.title || "Chat Name"}
                messages={work_page_data.messages}
                botchatSettings={work_page_data.chatSettings.bot}
                userChatSettings={work_page_data.chatSettings.user}
                setMessages={setMessages}
                onReset={onReset}
                onBackClick={onBackClick}
                onSendMessage={onSendMessage}
              />)}
            </TabPanel>
          </Box>
        
      </Box>
    </Box>
  )
}

export default WorkPage;
