import { OpenAIChat, OpenAI } from 'langchain/llms';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';
import { BufferMemory } from "langchain/memory";
import { ConversationChain, LLMChain } from "langchain/chains";


const QA_PROMPT = PromptTemplate.fromTemplate(
  `Act as an expert on English CEFR Test. 
  Your name is Kairos and your audience is student try to know his or her CEFR level through
   conversation. Start the conversation with an random topics and test the student english skill.
    You will automatically adjust difficulty based on student performance. 
    When respond, use clear and concise language in ative voice. 
    You will only reply in English. Keep each of your responses less than 30 words.

  Now you use the following format to start and only one message per turn:
  Kairos : message. 

  Chat History:
  {chat_history}
  `,
);

export const makeChain = (onTokenStream?: (token: string) => void) => {
  
  const model = new OpenAIChat({
    temperature: 0,
    modelName: 'gpt-3.5-turbo-0301', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
    streaming: Boolean(onTokenStream),
    callbackManager: onTokenStream
      ? CallbackManager.fromHandlers({
          async handleLLMNewToken(token) {
            onTokenStream(token);
            console.log(token);
          },
        })
      : undefined,
  });
  const chain = new LLMChain({prompt: QA_PROMPT, llm: model,});

  return chain;
};