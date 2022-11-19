import type { NextPage, NextPageContext } from 'next';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import ChatForm from '@components/ChatForm';
import CardMessage from '@components/CardMessage';
import NamespaceContext from '@store/namespace.store';
import { useSession } from 'next-auth/react';
import ServerContext from '@store/server.store';
import { MessageContext } from '@store/message.store';
import usePrevious from '@hooks/usePrevius';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { IMessage } from '@store/types/message.types';
import fetch from 'isomorphic-unfetch';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

const savedMessages: { [key: string]: IMessage[] } = {};

const START_INDEX = 500;

const ChannelsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const virtuoso = useRef<VirtuosoHandle>(null);
  const prevChatId = usePrevious(id);
  const { data: session, status } = useSession({ required: true });
  const {
    state: { messages },
    createMessage,
    readMessagesOfPage
  } = useContext(MessageContext);
  savedMessages[id as string] = messages;
  const {
    state: { namespaces, mapNamespaces }
  } = useContext(NamespaceContext);
  const {
    state: { mapServers }
  } = useContext(ServerContext);
  const [firstItemIndex, setFirstItemIndex] = useState(
    START_INDEX - messages.length
  );
  const [page, setPage] = useState(2);

  const internalMessages = useMemo(() => {
    const newFirstItemIndex = START_INDEX - messages.length;
    setFirstItemIndex(newFirstItemIndex);
    return messages;
  }, [messages]);

  const startReached = useCallback(() => {
    console.log('Chat: startReached');
    readMessagesOfPage(page);
    savedMessages[id as string] = messages;
    setPage(page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const followOutput = useCallback(
    (isAtBottom) => (isAtBottom ? 'smooth' : false),
    []
  );

  const scrollToLastIndex = () => {
    virtuoso.current!.scrollToIndex({
      index: internalMessages.length - 1,
      behavior: 'smooth'
    });
  };

  if (prevChatId !== (id as string)) return null;

  if (!Object.keys(mapNamespaces).length || !Object.keys(mapServers).length)
    return <div className='tx-wlight'>Cargando...</div>;

  if (!mapNamespaces[id as string]) return <div>Cargando Chat</div>;

  return (
    <section className='h-full flex flex-col grow justify-between'>
      <h1 className='text-center m-0 py-3 display-1 fw-normal tx-wlight'>
        {Object.keys(mapNamespaces).length ? (
          mapNamespaces[id as string]?.name
        ) : (
          <div className='tx-wlight'>Cargando Chat...</div>
        )}
      </h1>
      <div className='mx-8 flex h-full flex-col' style={{ flex: '1' }}>
        <p className='pr-3 pt-6 m-0 text-lg tx-wlight'>
          Bienvenido al canal general de{' '}
          {mapServers[mapNamespaces[id as string].server].name}
        </p>
        <hr className='bg-light-chat mt-3 mb-8 flex' />
        <Virtuoso
          className='tx-wlight'
          style={{ overscrollBehavior: 'contain' }}
          data={internalMessages}
          ref={virtuoso}
          startReached={startReached}
          firstItemIndex={Math.max(0, firstItemIndex)}
          followOutput={followOutput}
          initialTopMostItemIndex={messages.length - 1}
          itemContent={(idx, data) => (
            <CardMessage
              key={idx}
              msg={data}
              nextMsg={internalMessages[idx + 1]}
            />
          )}
          alignToBottom
        />
        <ChatForm
          createMessage={createMessage}
          scrollToLastIndex={scrollToLastIndex}
        />
      </div>
    </section>
  );
};

const verifySessions = {};

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
        `http://localhost:5000/api/user-servers/@verify?user=${session?.user._id}&server=${params[2]}`,
        {}
      );
      const data = await user.json();

      if (!data.ok) {
        const loginUrl = `/channels/notAccess?redirectTo=${encodeURIComponent(
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

// requireVerifyUserServer(ChannelsPage);

export default ChannelsPage;
