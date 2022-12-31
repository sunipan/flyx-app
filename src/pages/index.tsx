import { type NextPage } from 'next';
import { Layout } from '../components/Layout';
import { createElastic, searchElastic } from '../lib/fetchers';

const Home: NextPage = () => {
  return (
    <Layout className="flex min-h-screen flex-col items-center justify-center">
      <div></div>
      <button onClick={createElastic} className="rounded-lg bg-blue-500 p-2 font-bold text-white hover:opacity-70">
        Create
      </button>
    </Layout>
  );
};

export default Home;
