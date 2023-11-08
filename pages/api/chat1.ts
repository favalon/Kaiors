import type { NextApiRequest, NextApiResponse } from 'next';
import {Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { request_message} = req.body;

    try {
      
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: request_message,
      });

      if (completion.data.choices && completion.data.choices.length > 0&&
        completion.data.choices[0].message) {
        res.status(200).json({ answer: completion.data.choices[0].message.content.trim() });
      } else {
        res.status(400).json({ error: 'No response from the ChatGPT API', details: completion });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error connecting to the ChatGPT API', details: error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
