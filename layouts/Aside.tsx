import { FC, useEffect, useContext } from 'react';
import Link from 'next/link';
import ServerContext from '@store/server.context';
import NamespaceContext from '@store/namespace.context';
import { Button } from '@material-tailwind/react';

const Aside: FC = ({ children }) => {
  const { servers, idServer, handleIdServer } = useContext(ServerContext);
  const { namespaces, getNamespaces } = useContext(NamespaceContext);

  useEffect(() => {
    if (servers.length) handleIdServer(servers[0]._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servers]);

  useEffect(() => {
    if (idServer) getNamespaces(idServer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idServer]);
  // console.log(servers);

  return (
    <section className='flex min-h-screen'>
      <aside className='bg-ndark min-h-full flex flex-col p-8 aside-container'>
        <div className='d-flex flex-col justify-around h-24'>
          {servers.length ? (
            servers.map(({ _id, name }) => (
              <Button key={_id} onClick={() => handleIdServer(_id)}>
                {name}
              </Button>
            ))
          ) : (
            <span className='tx-wlight'>Sin servidores</span>
          )}
        </div>
        <div className='pt-12 flex flex-col'>
          {namespaces?.map(({ _id, name }) => (
            <Link key={_id} href={`/namespaces/${_id}`} passHref>
              <span className='tx-wlight'>{name}</span>
            </Link>
          ))}
        </div>
      </aside>
      <main className='grow flex flex-col min-h-screen'>{children}</main>
    </section>
  );
};

export default Aside;
