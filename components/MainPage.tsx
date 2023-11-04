import React, { useState, useEffect } from "react";
//import ChatPage from '../pages/home';
import ChatPage from "@/pages/chat_page";
import WorkChatPage from "@/pages/work_chat_page";
import ConceptBase from '../pages/concept_base';
import Settings from '@/pages/settings';
import AudioRecorder from "./AudioRecorder";
import { PageData } from "./types";
import MainPageList from "@/pages/main_page_list";
import basic_value from "@/public/basic_value.json";
import scene_practice_data from "@/public/jp_practice_data/info.json";
import AboutPage from "@/pages/AboutPage";
import AccountPage from "@/pages/live2D";
import PracticeBasic from "@/pages/practice_basic";
import InterativeListPage from "@/pages/interative_list_page";
import WorkPage from "@/pages/work_page";

interface MainPageProps {
  selectedPage: string;
  setSelectPage: React.Dispatch<React.SetStateAction<string>>;
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  pageData: PageData;
  setPageData: React.Dispatch<React.SetStateAction<PageData>>;
}

interface CharacterSetting {

  id: number;
  imageUrl: string;
  title: string;
  description: string;
  chatSettings: any;
  show: boolean;
  quiz: any;
}

interface ChatPageData {
  id: string;
  title: string;
  chatSettings: any;
  messages: Message[];

}

interface Message {
  id: string;
  senderName: string;
  senderImage: string;
  text: string;
  isOwnMessage: boolean;
}



function MainPage({ setShowHeader, selectedPage, setSelectPage, pageData, setPageData }: MainPageProps) {

  console.log("pageData", scene_practice_data[0])
  const [chatSettings, setChatSettings] = useState<any>(null);
  const [chatPageData, setChatPageData] = useState<ChatPageData>({} as ChatPageData);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<ChatPageData[]>([]);

  const [practiceBasicPageData, setPracticeBasicPageData] = useState<any>(null);
  const [practiceChatData, setPracticeChatData] = useState<any>(null);



  // Helper function to save allMessages to local storage
  const saveAllMessagesToLocalStorage = (allMessages: ChatPageData[]) => {
    localStorage.setItem("allMessages", JSON.stringify(allMessages));
  };

  // Helper function to load allMessages from local storage
  const loadAllMessagesFromLocalStorage = (): ChatPageData[] => {
    const storedData = localStorage.getItem("allMessages");
    return storedData ? JSON.parse(storedData) : [];


  };

  // Load data from local storage when the component mounts on the client-side
  useEffect(() => {
    setAllMessages(loadAllMessagesFromLocalStorage());
  }, []);

  // Update allMessages and save to local storage when messages or chatPageData change
  useEffect(() => {
    if (chatPageData.id) {
      setAllMessages((prevAllMessages) => {
        const index = prevAllMessages.findIndex((chat) => chat.id === chatPageData.id);

        let updatedAllMessages;

        if (index === -1) {
          // If the id is not found in the allMessages array, add the new chatPageData
          updatedAllMessages = [...prevAllMessages, chatPageData];
        } else {
          // If the id is found, update the corresponding singleSectionChat
          updatedAllMessages = prevAllMessages?.map((chat, i) =>
            i === index
              ? {
                ...chat,
                messages: messages,
              }
              : chat
          );
        }


        // Save updated allMessages to local storage
        saveAllMessagesToLocalStorage(updatedAllMessages);

        return updatedAllMessages;
      });
    }
  }, [messages, chatPageData, setMessages]);

  const [userSetting, setUserSetting] = useState({
    englishLevel: "A2",
    userName: "Alice",
    language: "English",
    imageUrl: '/usericon.png',
  }
  );

  useEffect(() => {
    if (pageData) {
      setUserSetting({
        englishLevel: pageData.setting.englishLevel,
        userName: pageData.setting.userName,
        language: pageData.setting.language,
        imageUrl: '/usericon.png',
      });
    }
  }, [pageData]);

  const piazza_items = [
    {
      id: 0,
      imageUrl: '/character.png',
      title: '咖啡馆',
      description: "",
      chatSettings: {
        bot: {
          botName: "Frank",
          title: "咖啡馆",
          description: basic_value.scene_interative.coffee_shop.prompt,
          objective: basic_value.scene_interative.coffee_shop.objective,
          imageUrl: '/character.png',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    },
    {
      id: 1,
      imageUrl: '/character.png',
      title: '机场：值机',
      description: "",
      chatSettings: {
        bot: {
          botName: "Frank",
          title: "机场：值机",
          description: basic_value.scene_interative.airport_checkin.prompt,
          objective: basic_value.scene_interative.airport_checkin.objective,
          imageUrl: '/character.png',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    },
    {
      id: 2,
      imageUrl: '/character.png',
      title: '机场：免税店"',
      description: "",
      chatSettings: {
        bot: {
          botName: "Frank",
          title: "机场：免税店",
          description: basic_value.scene_interative.duty_free_shop.prompt,
          objective: basic_value.scene_interative.duty_free_shop.objective,
          imageUrl: '机场：免税店',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    },
    {
      id: 3,
      imageUrl: '/character.png',
      title: '机场：信息台',
      description: "",
      chatSettings: {
        bot: {
          botName: "Frank",
          title: "机场：信息台",
          description: basic_value.scene_interative.information_desk.prompt,
          objective: basic_value.scene_interative.information_desk.objective,
          imageUrl: '/character.png',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    },
    {
      id: 3,
      imageUrl: '/character.png',
      title: '电影院：购票',
      description: "",
      chatSettings: {
        bot: {
          botName: "Frank",
          title: "电影院：购票",
          description: basic_value.scene_interative.movie_ticket_purchase.prompt,
          objective: basic_value.scene_interative.movie_ticket_purchase.objective,
          imageUrl: '/character.png',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    },
  ];

  const handleListItemClick = (item: CharacterSetting) => {

    // Update chatPageData
    setChatPageData(
      {
        id: item.title,
        title: item.title,
        chatSettings: item.chatSettings,
        messages: allMessages.find((chat) => chat.id === item.title)?.messages || []
      }
    );
    setSelectPage("chat");
  };

  const handleInterativeListItemClick = (item: any) => {
    setChatPageData(
      {
        id: item.title,
        title: item.title,
        chatSettings: item.chatSettings,
        messages: allMessages.find((chat) => chat.id === item.title)?.messages || []
      }
    );
    setSelectPage("practice");
  }

  const handlePracticeListItemClick = (item: any) => {

    // Update chatPageData
    setPracticeBasicPageData(
      {
        audio_path: item.wav_path,
        text_content: {
          jp_text: item.jp_text,
          zh_text: item.zh_text,
          roma_text: item.roma_text,
          stable_ts: item.stable_ts,
        },
        n: 100,
        color: "#FFC300"
      }
    );

    setSelectPage("practice");
  };

  const handleBackClick = () => {
    setSelectPage("main");
    setShowHeader(true);
  };

  const handleSendMessage = (text: string) => {
    //console.log('Message sent:', text);
  };

  const handleResetClick = () => {
    // setChatPageData message to empty
    setChatPageData(
      {
        id: chatPageData.title,
        title: chatPageData.title,
        chatSettings: chatPageData.chatSettings,
        messages: []
      }
    );
  };


  // handle hide header
  useEffect(() => {
    if (selectedPage === 'chat') {
      setShowHeader(false);
    } else {

      setShowHeader(false);
    }
  }, [selectedPage]);

  switch (selectedPage) {
    // case "account":
    //   return <AccountPage />
    // case "setting":
    //   return <Settings pageData={pageData} setPageData={setPageData} />;
    // case "concept base":
    //   return pageData && <ConceptBase pageData={pageData} setPageData={setPageData} />;
    // case "main":
    //   return pageData && <InterativeListPage interative_scene={piazza_items} onListItemClick={handleListItemClick} />;
    // case "chat":
    //   return <ChatPage
    //     key={chatPageData.messages.length}
    //     chatName={chatPageData.title || "Chat Name"}
    //     messages={chatPageData.messages}
    //     botchatSettings={chatPageData.chatSettings.bot}
    //     userChatSettings={chatPageData.chatSettings.user}
    //     pageData={pageData}
    //     setPageData={setPageData}
    //     setMessages={setMessages}
    //     onReset={handleResetClick}
    //     onBackClick={handleBackClick}
    //     onSendMessage={handleSendMessage}
    //   />
    case "about":
      return <AboutPage />;
    case "practice":
      return <WorkPage
        work_data={scene_practice_data[0].partice}
        practice_page_data={practiceBasicPageData}
        chat_page_data={chatPageData}
        onListItemClick={handlePracticeListItemClick}
        pageData={pageData}
        setPageData={setPageData}
        setMessages={setMessages}
        onReset={handleResetClick}
        onBackClick={handleBackClick}
        onSendMessage={handleSendMessage}/>;
    default:
      return <InterativeListPage interative_scene={piazza_items} onListItemClick={handleInterativeListItemClick} />;
  }
}

export default MainPage;
