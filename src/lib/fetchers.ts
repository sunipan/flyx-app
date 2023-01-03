import axios from 'axios';

export const getGPT = async () => {
  return await axios.get('/api/completion').then((res) => res.data);
};

export const updateElastic = async () => {
  return await axios.put('/api/update').then((res) => res.data);
};

export const createElastic = async () => {
  return await axios.post('/api/create').then((res) => res.data);
};

export const getAllElastic = async () => {
  return await axios.get('/api/search').then((res) => res.data);
};
