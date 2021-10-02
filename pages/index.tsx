import type { NextPage } from 'next';
import Link from 'next/link';

const HomePage: NextPage = () => {
  return (
    <div className='container'>
      <div className='row'>
        <h1 className='text-center tx-wlight'>Home Page</h1>
        <div className='fs-2 vh-100 d-flex flex-column justify-content-center align-items-center'>
          <Link href='/login'>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
