import { FC } from 'react';
import style from '../styles/Aside.module.css';

const Aside: FC = ({ children }) => {
  return (
    <section className='vh-100 d-flex'>
      <aside className={'bg-ndark ' + style.asideContainer} />
      <main className='flex-grow-1'>{children}</main>
    </section>
  );
};

export default Aside;
