const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
import type { NextApiRequest, NextApiResponse } from 'next';
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_API_KEY;

const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Does Azure OpenAI support customer managed keys?" },
    { role: "assistant", content: "Yes, customer managed keys are supported by Azure OpenAI" },
    { role: "user", content: "Do other Azure AI services support this too" },
  ];

const fetch = require('node-fetch');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    const { request_message} = req.body;

  try {
    const response = await fetch(`${endpoint}/openai/deployments/learnmategpt35/chat/completions?api-version=2023-05-15`, {
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

  // export async function hsandler(req: NextApiRequest, res: NextApiResponse) {
  //   if (req.method === 'POST') {
  //     const { request_message} = req.body;
  
  //     try {
        
  //           const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  //           const deploymentId = "learnmategpt35";
  //           const result = await client.getChatCompletions(deploymentId, messages);
  
  //       if (result && result.content > 0) {
  //         res.status(200).json({ answer: result});
  //       } else {
  //         res.status(400).json({ error: 'No response from the ChatGPT API', details: result });
  //       }
  //     } catch (error) {
  //       res.status(500).json({ error: 'Error connecting to the ChatGPT API', details: error });
  //     }
  //   } else {
  //     res.setHeader('Allow', 'POST');
  //     res.status(405).end('Method Not Allowed');
  //   }
  // }
  