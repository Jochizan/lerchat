import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import style from '../styles/aside.module.css';
import { INamespace } from '@interfaces/store.interfaces';

const Aside: FC = ({ children }) => {
  const [namespaces, setNamespaces] = useState<INamespace[]>([]);
  const getNamespaces = async () => {
    const res = await fetch('http://localhost:5500/namespaces');
    const data = await res.json();
    setNamespaces(data._namespaces);
  };

  useEffect(() => {
    getNamespaces();
  }, []);

  return (
    <section className='vh-100 d-flex'>
      <aside
        className={'bg-ndark d-flex flex-column p-3 ' + style.asideContainer}
      >
        {namespaces.map((namespace, idx) => (
          <Link key={idx} href={`/chat/${namespace._id}`}>
            {namespace.name}
          </Link>
        ))}
      </aside>
      <main className='flex-grow-1'>{children}</main>
    </section>
  );
};

export default Aside;
