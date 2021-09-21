import { NextPage } from 'next';
import { INamespace } from '@interfaces/store.interfaces';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Server: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [namespaces, setNamespaces] = useState<INamespace[]>([]);

  const getNamespaces = async () => {
    const res = await fetch(`http://localhost:5500/api/namespaces/${id}`);
    const data = await res.json();
    setNamespaces(data._namespaces);
  };

  useEffect(() => {
    id && getNamespaces();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className='tx-wlight d-flex flex-column p-3'>
      {namespaces?.map((namespace, idx) => (
        <section className='py-2' key={idx}>
          <Link href={`/server/${id}/${namespace._id}`}>{namespace.name}</Link>
        </section>
      ))}
    </div>
  );
};

export default Server;
