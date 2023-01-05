import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { env } from '../../env/server.mjs';
import { connectToElasticsearch } from '../../lib/connectElastic';

// Every time this runs it overwrites the previous data

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'PATCH') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }
    const { list } = req.body;
    // Open Elastic client to upload content
    const client = await connectToElasticsearch();

    if (client === 'ERR_ENV_NOT_DEFINED') {
      res.status(500).json({ message: 'Elasticsearch not configured' });
      return;
    }

    // Store promises in array
    const updatePromises = [];
    for (let i = 1; i <= 25; i++) {
      updatePromises.push(
        client.update({
          index: 'search-flyx',
          id: i.toString(),
          doc: {
            name: list[i]?.name.trim(),
            email: list[i]?.email.trim(),
          },
          retry_on_conflict: 3,
        })
      );
    }

    // Run all requests in parallel
    const updateRes = await Promise.all(updatePromises);
    res.status(200).json({ updateRes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default update;
