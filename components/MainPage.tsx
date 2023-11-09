import React, { useState, useEffect, use } from "react";
//import ChatPage from '../pages/home';
import main_page_list from "@/public/jp_practice_data/main_page_list_info.json";
import scene_practice_data from "@/public/jp_practice_data/practice_data_info.json";
import AboutPage from "@/pages/AboutPage";
import InterativeListPage from "@/pages/interative_list_page";
import WorkPage from "@/pages/work_page";

interface MainPageProps {
  language: string;
  selectedPage: string;
  setSelectPage: React.Dispatch<React.SetStateAction<string>>;
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
}

interface WorkPageData {
  id: string;
  title: string;
  chatSettings: any;
  messages: Message[];
  interative_option: boolean;
}

interface Message {
  id: string;
  senderName: string;
  senderImage: string;
  text: string;
  isOwnMessage: boolean;
}

type PracticeInfoKey = keyof typeof scene_practice_data;

function MainPage({ language, setShowHeader, selectedPage, setSelectPage }: MainPageProps) {

  const [workPageData, setWorkPageData] = useState<WorkPageData>({} as WorkPageData);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<WorkPageData[]>([]);

  const [practiceBasicPageData, setPracticeBasicPageData] = useState<any>(null);

  const [interativeItems, setInterativeItems] = useState<any>(null);
  const [basicLearningItems, setBasicLearningItems] = useState<any>(null);
  const [interativeItem, setInterativeItem] = useState<PracticeInfoKey | null >("coffee_shop");
  const [workData, setWorkData] = useState<any>(null);

  // Helper function to save allMessages to local storage
  const saveAllMessagesToLocalStorage = (allMessages: WorkPageData[]) => {
    localStorage.setItem("allMessages", JSON.stringify(allMessages));
  };

  // Helper function to load allMessages from local storage
  const loadAllMessagesFromLocalStorage = (): WorkPageData[] => {
    const storedData = localStorage.getItem("allMessages");
    return storedData ? JSON.parse(storedData) : [];
  };

  // Load data from local storage when the component mounts on the client-side
  useEffect(() => {
    setAllMessages(loadAllMessagesFromLocalStorage());
    setWorkData(scene_practice_data.coffee_shop.practice_jp);
  }, []);

  // Update allMessages and save to local storage when messages or chatPageData change
  useEffect(() => {
    if (workPageData.id) {
      setAllMessages((prevAllMessages) => {
        const index = prevAllMessages.findIndex((chat) => chat.id === workPageData.id);

        let updatedAllMessages;

        if (index === -1) {
          // If the id is not found in the allMessages array, add the new chatPageData
          updatedAllMessages = [...prevAllMessages, workPageData];
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
  }, [messages, workPageData, setMessages]);

  useEffect(() => {
    if (main_page_list && main_page_list.interative_scene) {
      // Assuming that interative_data.scene_interative is an array and you want to map it
      const mappedItems = main_page_list.interative_scene.map((item) => {
        return {
          id: item.id,
          imageUrl: item.imageUrl || '/character.png', // fallback to '/character.png' if imageUrl is not provided
          title: item.scene_name,
          infoKey: item.info_key,
          description: item.description || "",
          chatSettings: {
            bot: {
              botName: "Frank",
              title: item.scene_name || "",
              description: item.prompt || "",
              objective: item.objective || "",
              imageUrl: item.imageUrl || '/character.png'
            },
          },
          interative_option: true,
          lock: false
        };
      });

      setInterativeItems(mappedItems);
    }
  }, []);

  useEffect(() => {
    if (main_page_list && main_page_list.basic_learning) {
      // Assuming that interative_data.scene_interative is an array and you want to map it
      const mappedItems = main_page_list.basic_learning.map((item) => {
        return {
          id: item.id,
          imageUrl: item.imageUrl || '/character.png', // fallback to '/character.png' if imageUrl is not provided
          title: item.scene_name,
          infoKey: item.info_key,
          description: "",
          chatSettings: {
            bot: {
              botName: "Frank",
              title: item.scene_name || "",
              description: "",
              objective:  "",
              imageUrl: '/character.png'
            },
          },
          interative_option: false
        };
      });

      setBasicLearningItems(mappedItems);
    }
  }, []);

  const handleListItemClick = (item: any) => {
    console.log(" handleListItemClick item", item)
    setWorkPageData(
      {
        id: item.title,
        title: item.title,
        chatSettings: item.chatSettings,
        messages: allMessages.find((chat) => chat.id === item.title)?.messages || [],
        interative_option: item.interative_option
      }
    );
    setSelectPage("practice");
    setInterativeItem(item.infoKey);
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
          imageUrl: item.imageUrl
        },
        n: 100,
        color: "#FFC300"
      }
    );

    setSelectPage("practice");
  };

  const handleBackClick = () => {
    setSelectPage("Main");
    setShowHeader(true);
  };

  const handleSendMessage = (text: string) => {
    //console.log('Message sent:', text);
  };

  const handleResetClick = () => {
    // setChatPageData message to empty
    setWorkPageData(
      {
        id: workPageData.title,
        title: workPageData.title,
        chatSettings: workPageData.chatSettings,
        messages: [],
        interative_option: workPageData.interative_option
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

  useEffect(() => {
    const key = language === "JP" ? 'practice_jp' : 'practice_en';
    const practiceData = interativeItem ? scene_practice_data[interativeItem]?.[key] : null;
    if (practiceData) {
      setWorkData(practiceData);
    }
  }, [language, interativeItem]);
  

  switch (selectedPage) {
    case "About":
      return <AboutPage />;
    case "practice":
      return <WorkPage
        work_data={workData}
        practice_page_data={practiceBasicPageData}
        work_page_data={workPageData}
        onListItemClick={handlePracticeListItemClick}
        setMessages={setMessages}
        onReset={handleResetClick}
        onBackClick={handleBackClick}
        onSendMessage={handleSendMessage} />;
    default:
      return <InterativeListPage
      language={language}
      basic_learning_items={basicLearningItems}
      interative_scene={interativeItems} 
      onListItemClick={handleListItemClick} />;
  }
}

export default MainPage;
