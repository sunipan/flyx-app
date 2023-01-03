import { type NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import { MentionsList } from '../components/Mentions/MentionsList';
import { updateElastic } from '../lib/fetchers';
import { useSearchApi } from '../lib/useSearchApi';
import Image from 'next/image';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Home: NextPage = () => {
  const { users, search, mutate } = useSearchApi();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [divText, setDivText] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [previousMentionsList, setPreviousMentionsList] = useState<string[]>([]);

  useEffect(() => {
    const createNewList = async () => {
      if (isLoading) {
        await updateElastic();
        await setTimeout(() => {
          mutate();
          setIsLoading(false);
        }, 1000); // SWR kept returning old data, so I had to add a timeout
      }
    };
    createNewList();
  }, [isLoading]);

  useEffect(() => {
    if (text.length === 0) {
      search('');
    }
  }, [text]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (text.length > e.target.value.length) {
      const lastMentionStart = divText.lastIndexOf('<span');
      const lastMentionEnd = divText.lastIndexOf('</span') + 7;
      if (divText.length === lastMentionEnd && lastMentionStart !== -1 && previousMentionsList.length > 0) {
        setDivText(divText.slice(0, lastMentionStart));
        // If text is being deleted
        setText(e.target.value.slice(0, text.lastIndexOf(previousMentionsList.pop() as string)));
      } else {
        setDivText(divText.slice(0, -1)); // Remove last character from div
        setText(e.target.value);
      }
    } else {
      setDivText(divText + (e.target.value.split(text)[1] || e.target.value)); // Add text to div without erasing HTML
      setText(e.target.value);
    }
    if (e.target.value.includes('@')) {
      const text = e.target.value.split('@')[1] || '';
      if (text.length > 0) {
        search(text);
      }
    }
  };

  if (!users) {
    return (
      <Layout className="flex min-h-screen items-center justify-center">
        <div>
          <Image src="/assets/spinner.svg" alt="Loading spinner" height="30" width="30" />
        </div>
      </Layout>
    );
  }
  return (
    <Layout className="flex min-h-screen flex-col items-center pt-36">
      <h2 className="mb-2 text-2xl">Sebi Unipan Flyx App Challenge!</h2>
      <div className="relative h-72 w-1/2">
        <div
          className="transparent absolute inset-x-0 top-0 mb-2 h-64 w-full whitespace-pre-wrap rounded-lg py-3 px-2 text-transparent"
          dangerouslySetInnerHTML={{ __html: divText }}
        ></div>
        <textarea
          ref={textRef}
          placeholder="Mention others using '@'"
          value={text}
          onChange={handleInputChange}
          className="absolute inset-x-0 top-0 mb-2 h-64 w-full resize-none whitespace-pre-wrap rounded-lg border border-black bg-transparent py-3 px-2"
        />
        <div className={`${!text.includes('@') && 'hidden'} absolute inset-x-0 top-72 flex h-[240px] justify-start`}>
          <MentionsList
            textRef={textRef}
            mentionsText={divText}
            setMentionsText={setDivText}
            textareaText={text}
            setTextareaText={setText}
            users={users}
            setPrevMentions={setPreviousMentionsList}
            prevMentions={previousMentionsList}
          />
        </div>
      </div>
      <button
        onClick={() => setIsLoading(true)}
        className="flex h-10 w-1/2 items-center justify-center rounded-lg bg-blue-500 p-2 font-bold text-white hover:opacity-70"
      >
        {isLoading ? <LoadingSpinner className="h-[20px] w-[20px] animate-spin invert" /> : 'Create New List'}
      </button>
    </Layout>
  );
};

export default Home;
