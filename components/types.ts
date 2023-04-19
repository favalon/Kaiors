import { type } from "os";

export interface PageData {
  concept: Item[];
  setting: Setting; // Add the proper type for the dnd page data
  chatProps: ChatProps; 
  chatMessage:Message[];
  chatHistory:History[];
  role_setting: roleSetting;
};



export interface Item  {
  title: string;
  content: string;
  tags: string[];
}


interface Setting  {
  [key: string]: string;
  userName: string;
  language: string;
  englishLevel: string;
  concept: string;
}

interface ChatProps  {
  [key:string]: string;
  daily_topics: string; 
  concept: string; 
  userName: string; 
  userEnglishLevel: string; 
  language: string
  
}



interface roleSetting  {
  get_level:string;
  [key:string]: string;
}

interface Message{
  [key: string]: string;
  message: string;
  type: string;
}

interface History{
  [key: string]: string;
  message: string;
  type: string;
  time: string;
}
