import Head from 'next/head';
import '../styles/global.css';
import '../styles/Aside.css';
import Aside from '../layouts/Aside';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ServerProvider } from '@store/server.context';
import { NamespaceProvider } from '@store/namespace.context';
import { Provider as SessionProvider } from 'next-auth/client';

const App = ({
  Component,
  pageProps: { session, ...pageProps },
  router: { route }
}: AppProps) => {
  if (
    (route.startsWith('/') && !route.startsWith('/namespace')) ||
    route.includes('/auth')
  ) {
    return (
      <SessionProvider session={session}>
        <Head>
          <title>{route.slice(1)}</title>
        </Head>
        <Component {...pageProps} />
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={session}>
      <ServerProvider>
        <NamespaceProvider>
          <Head>
            <title>LerChat</title>
          </Head>
          <Aside>
            <Component {...pageProps} />
          </Aside>
        </NamespaceProvider>
      </ServerProvider>
    </SessionProvider>
  );
};

export default App;
