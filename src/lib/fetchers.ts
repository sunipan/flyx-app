import axios from 'axios';
import { UserMinimal } from './types/UserType';

export const getGPT = async () => {
  return await axios.get('/api/getCompletion').then((res) => res.data);
};

export const updateElastic = async (list: UserMinimal[]) => {
  return await axios.patch('/api/update', { list }).then((res) => res.data);
};

export const createElastic = async () => {
  return await axios.post('/api/create').then((res) => res.data);
};

export const getAllElastic = async () => {
  return await axios.get('/api/search').then((res) => res.data);
};
