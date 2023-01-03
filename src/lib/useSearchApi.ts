import useSwr from 'swr';
import { getAllElastic } from './fetchers';
import { useEffect, useState } from 'react';
import { User } from './types/UserType';

export const useSearchApi = () => {
  const { data, mutate } = useSwr('/api/search', getAllElastic, { revalidateOnFocus: false });
  const [parsedData, setParsedData] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data?.hits.length) {
      setParsedData(parseData());
    }
  }, [data?.hits[0]._source.name]);

  const parseData = () =>
    data?.hits.map((item: { _id: string; _source: { name: string; email: string; label: string } }) => {
      const { name, email, label } = item._source;
      return { name, email, label, id: item._id };
    });

  const search = (query: string) => {
    const filteredUsers = parsedData.filter((user: User) => {
      const { name, email } = user;
      return name.toLowerCase().includes(query.toLowerCase()) || email.toLowerCase().includes(query.toLowerCase());
    });
    setUsers(filteredUsers);
  };

  return {
    search,
    mutate,
    users,
  };
};
