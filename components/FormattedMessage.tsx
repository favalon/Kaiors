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
    userName: string;
    title: string;
    botName: string;
    objective: string;
    [key: string]: any;
}

const FormattedMessage = ({
    chat_history,
    history_messages,
    roleSettings,
    userName,
    botName,
    objective,
    functionMessage,
  }: FormattedMessageProps): { role: string; content: string; }[] => {

    const replacePlaceholders = (template: string, values: { [key: string]: string } | undefined): string => {
        
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

    
    const getRandomValue = (list: string | any[]) => list[Math.floor(Math.random() * list.length)];

    const replaceSettings = {
        "user_name": userName,
        "bot_name": botName,
        "function_message":functionMessage,
        "objective":objective
    };


    const replacedTemplate = replacePlaceholders(roleSettings, replaceSettings);

    const messages = [
        { role: "user", content: replacedTemplate },
        ...history_messages.map((message) => ({
            role: message.isOwnMessage ? "user" : "assistant",
            content: message.text,
        })),
      ];
    
    console.log("messages:  123123 ", messages);

    return messages

}

export default FormattedMessage;