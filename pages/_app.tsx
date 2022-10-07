import Head from 'next/head';
import '../styles/global.css';
import '../styles/Aside.css';
import Aside from '../layouts/Aside';
import type { AppProps } from 'next/app';
import { ServerProvider } from '@store/server.context';
import { NamespaceProvider } from '@store/namespace.context';
import { Provider as SessionProvider } from 'next-auth/client';
import { ThemeProvider } from '@material-tailwind/react';
import MainNavbar from 'layouts/Navbar';

const App = ({
  Component,
  pageProps: { session, ...pageProps },
  router: { route }
}: AppProps) => {
  if (route.startsWith('/log')) {
    return (
      <SessionProvider session={session}>
        <Head>
          <title>{route.slice(1)}</title>
        </Head>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    );
  }

  if (
    (route.startsWith('/') && !route.startsWith('/namespace')) ||
    route.includes('/auth')
  ) {
    return (
      <SessionProvider session={session}>
        <Head>
          <title>{route.slice(1)}</title>
        </Head>
        <ThemeProvider>
          <MainNavbar>
            <Component {...pageProps} />
          </MainNavbar>
        </ThemeProvider>
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
          <ThemeProvider>
            <Aside>
              <Component {...pageProps} />
            </Aside>
          </ThemeProvider>
        </NamespaceProvider>
      </ServerProvider>
    </SessionProvider>
  );
};

export default App;
