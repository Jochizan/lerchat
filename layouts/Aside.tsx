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

  return (
    <section className='vh-100 h-100 d-flex'>
      <aside className='bg-ndark h-100 d-flex flex-column p-3 aside-container'>
        <div className='d-flex flex-column justify-content-around h-25'>
          {servers?.map(({ _id, name }) => (
            <Button key={_id} onClick={() => handleIdServer(_id)}>
              {name}
            </Button>
          ))}
        </div>
        <div className='pt-5 d-flex flex-column'>
          {namespaces?.map(({ _id, name }) => (
            <Link key={_id} href={`/namespaces/${_id}`}>
              {name}
            </Link>
          ))}
        </div>
      </aside>
      <main className='flex-grow-1'>{children}</main>
    </section>
  );
};

export default Aside;
