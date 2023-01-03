import { NextApiRequest, NextApiResponse } from 'next';
import { connectToElasticsearch } from '../../lib/connectElastic';

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') {
      res.status(400).json({ message: 'Invalid method' });
    }
    const client = await connectToElasticsearch();

    if (client === 'ERR_ENV_NOT_DEFINED') {
      res.status(500).json({ message: 'Elasticsearch not configured' });
      return;
    }

    const { hits } = await client.search({
      index: 'search-flyx',
      body: {
        query: { match_all: {} },
      },
      size: 25,
    });
    res.status(200).json({ hits: hits.hits });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default search;
