import axios from 'axios';

export const getGPT = async () => {
  return await axios.get('/api/completion').then((res) => res.data);
};
