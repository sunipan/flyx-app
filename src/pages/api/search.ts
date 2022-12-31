import { NextApiRequest, NextApiResponse } from 'next';
import { connectToElasticsearch } from '../../lib/connectElastic';

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: 'Query undefined or invalid' });
      return;
    }

    const client = await connectToElasticsearch();

    if (client === 'ERR_ENV_NOT_DEFINED') {
      res.status(500).json({ message: 'Elasticsearch not configured' });
      return;
    }

    const { hits } = await client.search({
      index: 'search-flyx',
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['name', 'email'],
          },
        },
      },
    });
    res.status(200).json({ hits: hits.hits });
  }
};

export default search;
