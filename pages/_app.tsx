import Head from 'next/head';
import '../styles/global.css';
import Aside from '../layouts/Aside';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ServerProvider } from '@store/server.context';

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
    <ServerProvider>
      <Head>
        <title>LerChat</title>
      </Head>
      <Aside>
        <Component {...pageProps} />
      </Aside>
    </ServerProvider>
  );
};

export default App;
