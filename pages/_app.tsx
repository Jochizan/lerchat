import Head from 'next/head';
import '../styles/global.css';
import Aside from '../layouts/Aside';
import type { AppProps } from 'next/app';
import { ServerProvider } from '@store/server.store';
import { NamespaceProvider } from '@store/namespace.store';
import { MessageProvider } from '@store/message.store';
import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from '@material-tailwind/react';
// import MainNavbar from 'layouts/Navbar';
import ChatNavbar from 'layouts/ChatNavbar';
import { useRouter } from 'next/router';
import { UsersProvider } from '@store/user.store';
import { CategoryProvider } from '@store/category.store';

const AuthProvider = ({ children }: any) => {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === 'authenticated') return children;
  else return null;
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
  if (
    route.includes('/sign') ||
    route.includes('/out') ||
    !route.includes('/channels')
  ) {
    return (
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <Head>
          <title>
            {route.slice(1).toUpperCase()
              ? `${route.slice(1).toUpperCase()} | `
              : ''}
            LerChat
          </title>
        </Head>
        <ThemeProvider>
          <AuthSession>
            <Component {...pageProps} />
          </AuthSession>
        </ThemeProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <AuthProvider>
        <UsersProvider>
          <ServerProvider>
            <CategoryProvider>
              <NamespaceProvider>
                <MessageProvider>
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
                </MessageProvider>
              </NamespaceProvider>
            </CategoryProvider>
          </ServerProvider>
        </UsersProvider>
      </AuthProvider>
    </SessionProvider>
  );
};

export default App;
