import Head from 'next/head';
import { ReactNode } from 'react';

export const Layout = ({ children, className }: { children: ReactNode; className: string }) => {
  return (
    <>
      <Head>
        <title>Flyx App</title>
        <meta name="description" content="Flyx ChatGPT app by Sebi Unipan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={className}>{children}</main>
    </>
  );
};
