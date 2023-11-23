const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
import type { NextApiRequest, NextApiResponse } from 'next';
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_API_KEY;

const fetch = require('node-fetch');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    const { request_message } = req.body;

    try {
      const response = await fetch(`${endpoint}/openai/deployments/learnmategpt35/chat/completions?api-version=2023-09-01-preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureApiKey
        },
        body: JSON.stringify({ messages: request_message })
      });

      const result = await response.json();

      if (result.choices && result.choices.length > 0) {
        console.log(result.choices[0].message.content.trim());
        res.status(200).json({ answer: result.choices[0].message.content.trim() });
      } else {
        console.error('No response from the ChatGPT API', result);
        res.status(400).json({ error: 'No response from the ChatGPT API', details: result });
      }
    } catch (error) {
      console.error('Error connecting to the ChatGPT API', error);
      res.status(500).json({ error: 'Error connecting to the ChatGPT API', details: error });

    }
  }
}
