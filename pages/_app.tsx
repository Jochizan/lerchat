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
import ChatNavbar from 'layouts/ChatNavbar';

const App = ({
  Component,
  pageProps: { session, ...pageProps },
  router: { route }
}: AppProps) => {
  if (route.includes('/sign') && !route.includes('/out')) {
    return (
      <SessionProvider session={session}>
        <Head>
          <title>{route.slice(1).toUpperCase()} | LerChat</title>
        </Head>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    );
  }
  if (!route.includes('/home') && !route.includes('/namespaces')) {
    return (
      <SessionProvider session={session}>
        <Head>
          <title>{route.slice(1).toUpperCase()} | LerChat</title>
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
              <ChatNavbar>
                <Component {...pageProps} />
              </ChatNavbar>
            </Aside>
          </ThemeProvider>
        </NamespaceProvider>
      </ServerProvider>
    </SessionProvider>
  );
};

export default App;
