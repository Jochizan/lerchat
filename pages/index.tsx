import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@material-tailwind/react/';

const HomePage: NextPage = () => {
  return (
    <div className='container mx-auto'>
      <h1 className='text-center tx-wlight'>Home Page</h1>
      <div className='fs-2 vh-100 d-flex flex-column justify-content-center align-items-center'></div>
    </div>
  );
};

export default HomePage;
