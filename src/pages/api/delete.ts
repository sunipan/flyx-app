import { NextApiRequest, NextApiResponse } from 'next';
import { connectToElasticsearch } from '../../lib/connectElastic';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Open Elastic client to upload content
    const client = await connectToElasticsearch();

    if (client === 'ERR_ENV_NOT_DEFINED') {
      res.status(500).json({ message: 'Elasticsearch not configured' });
      return;
    }

    // Store promises in array
    const promises = [];
    for (let i = 1; i <= 25; i++) {
      promises.push(
        client.delete({
          index: 'search-flyx',
          id: i.toString(),
        })
      );
    }

    // Run all requests in parallel
    const deleteRes = await Promise.all(promises);
    res.status(201).json({ deleteRes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
