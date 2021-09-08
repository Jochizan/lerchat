import Head from 'next/head';
import '../styles/globals.css';
import Aside from '../layouts/Aside';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = ({ Component, pageProps, router: { route } }: AppProps) => {
  if (route === '/login' || route === '/register') {
    return (
      <>
        <Head>
          <title>{route.slice(1)}</title>
        </Head>
        <Component {...pageProps} />;
      </>
    );
  }

  return (
    <>
      <Head>
        <title>ULChat</title>
      </Head>
      <Aside>
        <Component {...pageProps} />
      </Aside>
    </>
  );
}

export default App;
