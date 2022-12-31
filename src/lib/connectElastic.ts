import { Client } from '@elastic/elasticsearch';
import { env } from '../env/server.mjs';

export async function connectToElasticsearch() {
  const ESS_CLOUD_ID = env.ESS_CLOUD_ID;
  const ESS_API_KEY = env.ESS_API_KEY;

  if (!ESS_CLOUD_ID || !ESS_API_KEY) {
    return 'ERR_ENV_NOT_DEFINED';
  }

  return new Client({
    cloud: {
      id: ESS_CLOUD_ID,
    },
    auth: {
      apiKey: ESS_API_KEY,
    },
  });
}
