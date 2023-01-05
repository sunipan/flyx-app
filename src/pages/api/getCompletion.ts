import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { env } from '../../env/server.mjs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }

    const config = new Configuration({
      organization: env.OPEN_AI_ORG_KEY,
      apiKey: env.OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(config);

    // Get chatGPT completion
    const openAiRes = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Generate a comma-separated list of 25 random full names and emails in the format name:email',
      max_tokens: 1500,
    });

    const completion = openAiRes?.data.choices[0]?.text;
    if (!completion) {
      res.status(500).json({ message: 'Completion failed' });
      return;
    }

    // Parse the string
    const firstSplit = completion.split(',');

    const finalSplit = firstSplit.map((item, i) => {
      const [name, email] = item.split(':');
      return { name, email };
    }) as { name: string; email: string }[];

    res.status(200).json({ list: finalSplit });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
