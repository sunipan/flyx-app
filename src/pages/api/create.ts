import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { env } from '../../env/server.mjs';
import { connectToElasticsearch } from '../../lib/connectElastic';

// Every time this runs it overwrites the previous data

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
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
    max_tokens: 1000,
  });

  const completion = openAiRes?.data.choices[0]?.text;
  if (!completion) {
    res.status(500).json({ message: 'Completion failed' });
    return;
  }

  // Parse the string
  const firstSplit = completion.split(',');

  const finalSplit = firstSplit.map((item) => {
    const [name, email] = item.split(':');
    return { name, email };
  }) as { name: string; email: string }[];

  // Open Elastic client to upload content
  const client = await connectToElasticsearch();

  if (client === 'ERR_ENV_NOT_DEFINED') {
    res.status(500).json({ message: 'Elasticsearch not configured' });
    return;
  }

  // Store promises in array
  const promises = [];
  for (let i = 1; i <= finalSplit.length; i++) {
    promises.push(
      client.create({
        index: 'search-flyx',
        id: i.toString(),
        body: {
          name: finalSplit[i]?.name.trim(),
          email: finalSplit[i]?.email.trim(),
          label: i % 2 === 0 ? 'customer' : 'employee',
        },
      })
    );
  }

  // Run all requests in parallel
  const createRes = await Promise.all(promises);
  res.status(201).json({ createRes });
};

export default create;
