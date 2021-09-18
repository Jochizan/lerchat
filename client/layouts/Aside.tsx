import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import style from '../styles/aside.module.css';
import { useContext } from 'react';
import ServerContext from '@store/server.context';

const Aside: FC = ({ children }) => {
  const { servers } = useContext(ServerContext);

  return (
    <section className='vh-100 d-flex'>
      <aside
        className={'bg-ndark d-flex flex-column p-3 ' + style.asideContainer}
      >
        {servers?.map((server, idx) => (
          <Link key={idx} href={`/server/${server._id}`}>
            {server.name}
          </Link>
        ))}
      </aside>
      <main className='flex-grow-1'>{children}</main>
    </section>
  );
};

export default Aside;
