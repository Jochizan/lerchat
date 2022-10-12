import type { NextPage } from 'next';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import ChatForm from '@components/ChatForm';
import CardMessage from '@components/CardMessage';
import { useMessages } from '@store/message.store';
import NamespaceContext from '@store/namespace.context';
import { useSession } from 'next-auth/client';
import ServerContext from '@store/server.context';

const Namespaces: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [session, status] = useSession();
  const { messages, addMessage } = useMessages(id as string);
  const { mapNamespaces } = useContext(NamespaceContext);
  const { mapServers, servers } = useContext(ServerContext);

  if (typeof window !== 'undefined' && status) return null;

  console.log(!Object.keys(servers).length, servers, mapNamespaces);
  if (session && !Object.keys(servers).length) {
    return (
      <section className='grow flex flex-col'>
        <div className='flex h-full flex-col-reverse justify-start mx-8'>
          <section className='overflow-auto'>
            <p className='pr-3 pt-6 m-0 text-lg tx-wlight'>
              Bienvenido al canal general de {id}
            </p>
            <hr className='bg-light-chat mt-3 mb-8' />
            {messages?.map((el, idx) => (
              <CardMessage key={idx} el={el} />
            ))}
          </section>
        </div>
        <ChatForm addMessage={addMessage} />
      </section>
    );
  }

  if (
    status ||
    !Object.keys(mapNamespaces).length ||
    !Object.keys(mapServers).length
  )
    return <div className='tx-wlight'>Cargando...</div>;

  if (!mapNamespaces[id as string]) return <div>Cargando Chat</div>;

  if (!session) router.push('/');

  return (
    <section className='h-screen flex flex-col grow justify-between'>
      <h1 className='text-center m-0 py-3 display-1 fw-normal tx-wlight'>
        {Object.keys(mapNamespaces).length ? (
          mapNamespaces[id as string]?.name
        ) : (
          <div className='tx-wlight'>Cargando Chat...</div>
        )}
      </h1>
      <div className='mx-8 flex h-full flex-col-reverse justify-start'>
        <section className='min-h-min vh-72 overflow-auto flex flex-col w-full'>
          <p className='pr-3 pt-6 m-0 text-lg tx-wlight'>
            Bienvenido al canal general de{' '}
            {mapServers[mapNamespaces[id as string].server].name}
          </p>
          <hr className='bg-light-chat mt-3 mb-8' />
          {messages?.map((el, idx) => (
            <CardMessage key={idx} el={el} />
          ))}
        </section>
      </div>
      <ChatForm addMessage={addMessage} />
    </section>
  );
};

export default Namespaces;
