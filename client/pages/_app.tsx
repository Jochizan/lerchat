import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import Aside from '../layouts/Aside';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ULChat Project</title>
      </Head>
      <Aside>
        <Component {...pageProps} />
      </Aside>
    </>
  );
}

export default MyApp;
