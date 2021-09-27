import type { NextPage } from 'next';
import NamespaceContext from '@store/namespace.context';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';

const Namespaces: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { namespaces, getNamespaces } = useContext(NamespaceContext);

  useEffect(() => {
    if (!id) return;
    getNamespaces(id as string);
  }, [id]);

  return (
    <section className='vh-100 d-flex flex-column justify-content-between'>
      <h1 className='text-center m-0 py-3 display-1 fw-normal tx-wlight'>
        NameSpace {id}
      </h1>
      <div className='d-flex flex-column p-3'>
        {namespaces?.map(({ _id, name }, idx) => (
          <Link key={idx} href={`/namespaces/${_id}`}>
            {name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Namespaces;
