import { FC } from 'react';
import Link from 'next/link';
import style from '../styles/aside.module.css';

const Aside: FC = ({ children }) => {
  return (
    <section className='vh-100 d-flex'>
      <aside className={'bg-ndark d-flex flex-column p-3 ' + style.asideContainer} >
        <Link href='/chat/1'>Namespace 1</Link>
        <Link href='/chat/2'>Namespace 2</Link>
      </aside>
      <main className='flex-grow-1'>{children}</main>
    </section>
  );
};

export default Aside;
