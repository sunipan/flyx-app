import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = new Configuration({
    organization: 'org-sFgCROE4jmCFC6UI5I64fV6a',
    apiKey: process.env.OPEN_AI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  if (req.method === 'GET') {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Generate a list of 25 random full names and emails in the format name:email',
      max_tokens: 1000,
    });

    res.status(200).json({ completion: completion?.data.choices[0]?.text || null });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
