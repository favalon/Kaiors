import React from 'react';
import quiz_values from 'config/quiz_values.json';

interface Message {
    id: string;
    senderName: string;
    senderImage: string;
    text: string;
    isOwnMessage: boolean;
}

interface FormattedMessageProps {
    chat_history: Message[];
    history_messages: Message[];
    roleSettings: string;
    title: string;
    userName: string;
    userEnglishLevel: string;
    userLanguage: string;
    botName: string;
    [key: string]: any;
}

const FormattedMessage = ({
    chat_history,
    history_messages,
    roleSettings,
    title,
    userName,
    userEnglishLevel,
    userLanguage,
    botName,
    functionMessage,
  }: FormattedMessageProps): { role: string; content: string; }[] => {

    const replacePlaceholders = (template: string, values: { [key: string]: string } | undefined): string => {
        
        console.log('template:', template);
        console.log('values:', values);
        if (values === undefined) {
            return template;
        } else {
            return (
                template.replace(/\${(.*?)}/g, (match, key) => values[key] || "")
            );
        }
    };

    let formattedMessages = chat_history.reduce((acc, message, index) => {
        const sender = message.isOwnMessage ? userName : botName;
        const text = `${sender}: ${message.text}${index < chat_history.length - 1 ? '\n' : ''}`;
        return acc + text;
    }, '');
    formattedMessages = "\n" + formattedMessages + "\n";

    //place name 
    const dnd_places = [
        "Privet Drive",
        "Hogwarts School of Witchcraft and Wizardry",
        "Diagon Alley",
        "Hogsmeade",
        "Godric's Hollow",
        "Azkaban",
        "Ministry of Magic",
        "The Burrow",
        "Platform Nine and Three-Quarters",
        "Forbidden Forest",
        "Gringotts Wizarding Bank",
        "St. Mungo's Hospital for Magical Maladies and Injuries",
        "The Leaky Cauldron",
        "The Great Hall",
        "The Room of Requirement",
        "The Chamber of Secrets",
        "The Forbidden Corridor",
        "The Quidditch Pitch",
        "The Astronomy Tower",
        "The Shrieking Shack",
        "The Triwizard Maze",
        "The Department of Mysteries",
        "The Battle of Hogwarts"
      ];
      

    const getRandomValue = (list: string | any[]) => list[Math.floor(Math.random() * list.length)];

    const replaceSettings = {
        "topic": title,
        "chat_history": formattedMessages,
        "user_name": userName,
        "user_english_level": userEnglishLevel,
        "language": userLanguage,
        "bot_name": botName,
        "reading_skill": getRandomValue(quiz_values.reading_skill),
        "grammer_point": getRandomValue(quiz_values.grammar_point),
        "question_type": getRandomValue(quiz_values.question_type),
        "dnd_take_place":getRandomValue(dnd_places),
        "dnd_arrive_place":getRandomValue(dnd_places),
        "function_message":functionMessage,
    };

    

    const replacedTemplate = replacePlaceholders(roleSettings, replaceSettings);

    const messages = [
        { role: "user", content: replacedTemplate },
        ...history_messages.map((message) => ({
            role: message.isOwnMessage ? "user" : "assistant",
            content: message.text,
        })),
      ];

    return messages

}

export default FormattedMessage;