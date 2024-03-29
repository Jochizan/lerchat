import type { NextPage, NextPageContext } from 'next';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import ChatForm from '@components/ChatForm';
import CardMessage from '@components/CardMessage';
import NamespaceContext from '@store/namespace.store';
import ServerContext from '@store/server.store';
import { MessageContext } from '@store/message.store';
import fetch from 'isomorphic-unfetch';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { EXPRESS } from '@services/enviroments';


const ChannelsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  // const prevChatId = usePrevious(id);
  const {
    state: { messages, create, loading, error, hasNextPage },
    createMessage,
    readMessagesOfPage
  } = useContext(MessageContext);
  // savedMessages[id as string] = messages;
  const {
    state: { mapNamespaces }
  } = useContext(NamespaceContext);
  const {
    state: { mapServers }
  } = useContext(ServerContext);

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: readMessagesOfPage,
    disabled: !!error,
    rootMargin: '200px 0px 0px 0px'
  });

  const internalMessages = useMemo(() => {
    return messages;
  }, [messages]);

  const scrollableRootRef = useRef<HTMLDivElement | null>(null);
  const lastScrollDistanceToBottomRef = useRef<number>();

  const reversedMessages = useMemo(
    () => [...internalMessages].reverse(),
    [internalMessages]
  );

  // We keep the scroll position when new items are added etc.
  useEffect(() => {
    const scrollableRoot = scrollableRootRef.current;
    const lastScrollDistanceToBottom =
      lastScrollDistanceToBottomRef.current ?? 0;
    if (scrollableRoot) {
      if (!create) {
        scrollableRoot.scrollTop =
          scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
      } else {
        scrollableRoot.scrollTop = scrollableRoot.scrollHeight;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reversedMessages, rootRef]);

  const rootRefSetter = useCallback(
    (node: HTMLDivElement) => {
      rootRef(node);
      scrollableRootRef.current = node;
    },
    [rootRef]
  );

  const handleRootScroll = useCallback(() => {
    const rootNode = scrollableRootRef.current;
    if (rootNode) {
      const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
      lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
    }
  }, []);

  if (!Object.values(mapNamespaces).length || !Object.values(mapServers).length)
    return <div className='tx-wlight'>Cargando...</div>;

  if (!mapNamespaces[id as string]) return <div>Cargando Chat</div>;

  const namespaceName = mapNamespaces[id as string]
    ? mapNamespaces[id as string]?.name
    : 'Cargando Chat';

  const serverName = mapServers[mapNamespaces[id as string]?.server as string]
    ? mapServers[mapNamespaces[id as string]?.server as string]?.name
    : 'Cargando Chat';

  return (
    <section className='h-full flex flex-col grow justify-between'>
      <h1 className='text-center m-0 py-3 display-1 fw-normal tx-wlight'>
        {namespaceName}
      </h1>
      <div className='mx-8 flex flex-col justify-end h-1 grow'>
        <p className='pr-3 pt-6 m-0 text-lg tx-wlight'>
          Bienvenido al canal {namespaceName} de {serverName}
        </p>
        <hr className='bg-light-chat mt-3 mb-4' />
        <div
          className='overflow-auto max-h-min pt-4'
          ref={rootRefSetter}
          onScroll={handleRootScroll}
          style={{ overscrollBehavior: 'contain' }}
        >
          <ul className='m-0 list-none'>
            {(hasNextPage || loading) && (
              <li ref={infiniteRef}>
                <div className='tx-wlight flex justify-center'>
                  <i
                    className='material-icons spin'
                    style={{ fontSize: '48px' }}
                  >
                    refresh
                  </i>
                </div>
              </li>
            )}
            {reversedMessages.map((msg, idx) => (
              <CardMessage key={idx} msg={msg} />
            ))}
          </ul>
        </div>
        <ChatForm createMessage={createMessage} namespace={namespaceName} />
      </div>
    </section>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  if (context.req && context.res) {
    const { req, res } = context;

    const params = req?.url?.split('/');
    if (!params) return { props: {} };

    const session = await unstable_getServerSession(
      req as IncomingMessage & { cookies: NextApiRequestCookies },
      res,
      authOptions
    );

    if (params.length > 2 && session?.user && params[2] !== 'data') {
      const user = await fetch(
        `${EXPRESS}/api/user-servers/@verify?user=${session?.user._id}&server=${params[2]}`,
        {}
      );
      const data = await user.json();

      if (!data.ok) {
        const loginUrl = `/channels/noAccess?redirectTo=${encodeURIComponent(
          req?.url || false
        )}`;
        res.writeHead(302, 'Not verify user server', { Location: loginUrl });
        res.end();
      }
      return { props: { session } };
    }
    return { props: {} };
  }
}

export default ChannelsPage;
