import { type NextPage } from 'next';
import Head from 'next/head';
import { getGPT } from '../lib/fetchers/openAiFetcher';
import useSwr from 'swr';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  const { data, error } = useSwr('/api/completion', getGPT, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  if (error)
    return (
      <Layout className="flex min-h-screen flex-col items-center justify-center">
        <div>Failed to load</div>
      </Layout>
    );

  if (!data)
    return (
      <Layout className="flex min-h-screen flex-col items-center justify-center">
        <div>Loading...</div>
      </Layout>
    );

  return (
    <Layout className="flex min-h-screen flex-col items-center justify-center">
      <div>{data.completion}</div>
    </Layout>
  );
};

export default Home;
