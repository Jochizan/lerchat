import { FC, useEffect, useContext, useState } from 'react';
import Link from 'next/link';
import ServerContext from '@store/server.context';
import NamespaceContext from '@store/namespace.context';
import { Button } from '@material-tailwind/react';
import { useRouter } from 'next/router';

const Aside: FC = ({ children }) => {
  const { servers, idServer, handleIdServer } = useContext(ServerContext);
  const { namespaces, getNamespaces } = useContext(NamespaceContext);
  const [click, setClick] = useState(false);
  const router = useRouter();
  const id = router.query;

  useEffect(() => {
    if (idServer && servers.length && (click || id)) {
      getNamespaces(idServer, click);
      setClick(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idServer, servers, click]);

  // console.log(servers, click);

  return (
    <section className='flex h-screen max-h-screen'>
      <aside className='bg-ndark h-full  flex flex-col p-4 aside-container'>
        <div className='mx-auto pt-2'>
          <Link href='/home' passHref>
            <span className='text-xl tx-wlight cursor-pointer'>LerChat</span>
          </Link>
        </div>
        <div className='flex flex-col justify-start gap-2 h-full max-h-screen p-4'>
          {servers.length ? (
            servers.map(({ _id, name }) => (
              <div key={_id} className='w-28 overflow-hidden'>
                <Button
                  className='bg-primary py-2 px-4  whitespace-nowrap truncate w-full'
                  onClick={() => {
                    handleIdServer(_id);
                    setClick(true);
                  }}
                >
                  {name}
                </Button>
              </div>
            ))
          ) : (
            <span className='tx-wlight'>Sin servidores</span>
          )}
          <div className='mt-4 block w-28 overflow-hidden p-4'>
            {Object.keys(id).length && namespaces.length ? (
              namespaces?.map(({ _id, name }) => (
                <Link key={_id} href={`/namespaces/${_id}`} passHref>
                  <span className='tx-nlight cursor-pointer'>{name}</span>
                </Link>
              ))
            ) : (
              <span className='tx-nlight truncate'>
                {router.route === '/namespaces' && 'Sin espacios para chatear'}
              </span>
            )}
          </div>
        </div>
      </aside>
      <main className='grow flex flex-col max-h-screen h-screen'>
        {children}
      </main>
    </section>
  );
};

export default Aside;
