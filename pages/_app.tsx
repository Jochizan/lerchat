import Head from 'next/head';
import '../styles/global.css';
import Aside from '../layouts/Aside';
import type { AppProps } from 'next/app';
import { ServerProvider } from '@store/server.store';
import { NamespaceProvider } from '@store/namespace.store';
import { MessageProvider } from '@store/message.store';
import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from '@material-tailwind/react';
import MainNavbar from 'layouts/Navbar';
import ChatNavbar from 'layouts/ChatNavbar';
import { useRouter } from 'next/router';

const AuthProvider = ({ children }: any) => {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === 'loading') return <div>Loading...</div>;

  return children;
};

const AuthSession = ({ children }: any) => {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { push } = useRouter();
  const { status, data: session } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (session) push('/channels/@me');

  if (!session) return children;
  else return null;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
  router: { route }
}: AppProps) => {
  if (route.includes('/sign') || route.includes('/out')) {
    return (
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <Head>
          <title>{route.slice(1).toUpperCase() && ' | '}LerChat</title>
        </Head>
        <ThemeProvider>
          <AuthSession>
            <Component {...pageProps} />
          </AuthSession>
        </ThemeProvider>
      </SessionProvider>
    );
  }

  if (!route.includes('/channels')) {
    return (
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <Head>
          <title>{route.slice(1).toUpperCase() && ' | '}LerChat</title>
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
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <ServerProvider>
        <NamespaceProvider>
          <MessageProvider>
            <Head>
              <title>LerChat</title>
            </Head>
            <ThemeProvider>
              <AuthProvider>
                <Aside>
                  <ChatNavbar>
                    <Component {...pageProps} />
                  </ChatNavbar>
                </Aside>
              </AuthProvider>
            </ThemeProvider>
          </MessageProvider>
        </NamespaceProvider>
      </ServerProvider>
    </SessionProvider>
  );
};

export default App;
