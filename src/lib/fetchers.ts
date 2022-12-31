import axios from 'axios';

export const getGPT = async () => {
  return await axios.get('/api/completion').then((res) => res.data);
};

export const createElastic = async () => {
  return await axios.put('/api/create').then((res) => res.data);
};

export const searchElastic = async (query: string) => {
  return await axios.get(`/api/search?query=${query}`).then((res) => res.data);
};
