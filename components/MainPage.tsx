import React, { useState, useEffect } from "react";
//import ChatPage from '../pages/home';
import ChatPage from "@/pages/chat_page";
import ConceptBase from '../pages/concept_base';
import Settings from '@/pages/settings';
import AudioRecorder from "./AudioRecorder";
import { PageData } from "./types";
import MainPageList from "@/pages/main_page_list";
import basic_value from "@/public/basic_value.json";
import AboutPage from "@/pages/AboutPage";
import AccountPage from "@/pages/live2D";

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

  const [chatSettings, setChatSettings] = useState<any>(null);
  const [taskItem, setTaskItems] = useState<CharacterSetting>();
  const [piazzaCharacter, setPiazzaCharacter] = useState<CharacterSetting>();
  const [chatPageData, setChatPageData] = useState<ChatPageData>({} as ChatPageData);
  const [messages, setMessages] = useState<Message[]>([]);
  // Initialize allMessages state with data from local storage
  const [allMessages, setAllMessages] = useState<ChatPageData[]>([]);


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

        console.log("allmesage", allMessages);

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

  const test_item = {
    id: 1,
    imageUrl: '/mentor1.png',
    title: 'Get Your English Level',
    description: '',
    chatSettings: {
      bot: {
        botName: "Kairos",
        title: "Get Your English Level",
        description: basic_value.role_setting.test,
        quiz: basic_value.role_setting.quiz,
        imageUrl: '/mentor1.png',
        createNote: basic_value.role_setting.create_note,
        getResult: basic_value.role_setting.get_level,
      },
      user: userSetting
    },
    show: true
  }

  const task_items = [
    {
      id: 1,
      imageUrl: '/mentor1.png',
      title: 'The influence of the internet on the way we communicate',
      description: '',
      chatSettings: {
        bot: {
          botName: "Kairos",
          title: "The influence of the internet on the way we communicate",
          description: basic_value.role_setting.concept,
          quiz: basic_value.role_setting.quiz,
          imageUrl: '/mentor1.png',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    },
    {
      id: 2,
      imageUrl: '/mentor2.png',
      title: 'Alpha and Beta testing',
      description: '',
      chatSettings: {
        bot: {
          botName: "Kairos",
          title: "Alpha and Beta testing",
          description: basic_value.role_setting.concept,
          quiz: basic_value.role_setting.quiz,
          imageUrl: '/mentor2.png',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    },
    {
      id: 3,
      imageUrl: '/mentor3.png',
      title: 'Bitcoin',
      description: '',
      chatSettings: {
        bot: {
          botName: "Kairos",
          title: "Bitcoin",
          description: basic_value.role_setting.concept,
          quiz: basic_value.role_setting.quiz,
          imageUrl: '/mentor3.png',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    },
    {
      id: 4,
      imageUrl: '/mentor4.png',
      title: 'The History of the Internet',
      description: '',
      chatSettings: {
        bot: {
          botName: "Kairos",
          title: "The History of the Internet",
          description: basic_value.role_setting.concept,
          quiz: basic_value.role_setting.quiz,
          imageUrl: '/mentor4.png',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    }
    // ... more items
  ];

  const piazza_items = [
    {
      id: 0,
      imageUrl: '/character.png',
      title: 'Reasoning Game',
      description: "I am your game mate, now let's enjoy it.",
      chatSettings: {
        bot: {
          botName: "Kairos",
          title: "Amadeus",
          description: "You are a Game designer. \nYou create a text-based game for the user.It can be any game you want, you just have to describe the rules, and as it is a text-based game, you must explain everything in depth with the following markdown format. \n# Game title: [title] \n## Objective:[...] \n## Gameplay:\n[\n1.\n2.\n3.\n] \n## Tips: \n[\n1.\n2.\n3.\n]",
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
      imageUrl: '/dnd.png',
      title: 'Dungeon Master',
      description: 'Hello adventurers, prepare to embark on an epic journey in Harray Potter World.',
      chatSettings: {
        bot: {
          botName: "Kairos",
          title: "Dungeon Master",
          description: basic_value.role_setting.dnd,
          imageUrl: '/dnd.png',
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
      title: 'Makise Kurisu',
      description: "Tuturu! I am Makise Kurisu, a brilliant scientist with a background in neuroscience and time travel research. ",
      chatSettings: {
        bot: {
          botName: "Kairos",
          title: "Amadeus",
          description: basic_value.role_setting.character,
          imageUrl: '/character.png',
          createNote: basic_value.role_setting.create_note,
          getResult: basic_value.role_setting.get_level,
        },
        user: userSetting
      },
      show: true
    },
    // ... more items
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

  const handleBackClick = () => {
    setSelectPage("main");
    setShowHeader(true);
  };

  const handleSendMessage = (text: string) => {
    console.log('Message sent:', text);
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

      setShowHeader(true);
    }
  }, [selectedPage]);

  switch (selectedPage) {
    case "account":
      
      return <AccountPage />
    case "setting":
      return <Settings pageData={pageData} setPageData={setPageData} />;
    case "concept base":
      return pageData && <ConceptBase pageData={pageData} setPageData={setPageData} />;
    case "main":
      return pageData && <MainPageList userSetting={userSetting} test_item={test_item} task_items={task_items} piazza_character={piazza_items} userEnglishLevel={pageData.setting.englishLevel} onListItemClick={handleListItemClick} />;
    case "chat":
      return <ChatPage
        key={chatPageData.messages.length}
        chatName={chatPageData.title || "Chat Name"}
        messages={chatPageData.messages}
        botchatSettings={chatPageData.chatSettings.bot}
        userChatSettings={chatPageData.chatSettings.user}
        pageData={pageData}
        setPageData={setPageData}
        setMessages={setMessages}
        onReset={handleResetClick}
        onBackClick={handleBackClick}
        onSendMessage={handleSendMessage}
      />
    case "about":
      return <AboutPage />;
    default:
      return pageData && <MainPageList userSetting={userSetting} test_item={test_item} task_items={task_items} piazza_character={piazza_items} userEnglishLevel={pageData.setting.englishLevel} onListItemClick={handleListItemClick} />;
  }
}

export default MainPage;
