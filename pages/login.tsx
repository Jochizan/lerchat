import type { NextPage } from 'next';
import { Button, Input, Typography } from '@material-tailwind/react';
import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import { useSession, signIn } from 'next-auth/client';
import { useEffect } from 'react';

const LoginPage: NextPage = () => {
  const [session, loading] = useSession();

  useEffect(() => {
    if (session && !loading) Router.push('/namespaces');
  }, [session, loading]);

  return (
    <div className='w-full h-screen flex items-center justify-center tx-wlight bg-light-blue-50'>
      <section className='medias-absolute bg-secondary rounded-3xl br-dark-03 border-8 flex'>
        <div className='w-1/3 flex flex-col items-center justify-center'>
          <h1 className='pb-12'>LerChat</h1>
          <Image
            src='/logo_favicoin.png'
            width={140}
            height={120}
            alt='Logo of Tiquor'
          />
        </div>
        <div className='w-2/3 rounded-l-3xl bg-dark-03 p-8'>
          <h2 className='mt-14 ml-10'>Create Account</h2>
          {/* <Image */}
          {/* <div className=''>
          <Link href='/auth/privacy'>Politica de Privacidad</Link>
        </div>

        <div className='py-3'>
          <Link href='/auth/terms'>Condiciones del servicio</Link>
        </div> */}
          <article className='flex justify-evenly pt-10'>
            <Button
              variant='outlined'
              size='sm'
              className='capitalize bg-black flex items-center tx-wlight'
            >
              <Image
                src='/gg.png'
                width={30}
                height={30}
                alt='sesión con facebook'
              />
              <span className='text-xs ml-2'>Sign Up with Google</span>
            </Button>
            <Button
              variant='outlined'
              size='sm'
              className='capitalize bg-black flex items-center tx-wlight'
            >
              <Image
                src='/fb.png'
                width={30}
                height={30}
                alt='sesión con facebook'
              />
              <span className='text-xs ml-2'>Sign Up with Facebook</span>
            </Button>
          </article>
          <article className='flex justify-center mt-12 pr-4'>
            <Typography variant='lead' color='white'>
              - OR -
            </Typography>
          </article>
          <article className='w-auto px-8 ml-8 mt-4'>
            <div className='flex justify-center items-center tx-wlight placeholder:text-white'>
              <Input
                placeholder='Nombres'
                variant='standard'
                className='tx-wlight br-white-03 w-5/6'
                color='blue'
              />
              <Input
                variant='standard'
                placeholder='Apellidos'
                className='tx-wlight br-white-03 w-5/6'
              />
            </div>
            <div className='mt-6'>
              <Input
                variant='standard'
                placeholder='Email Address'
                className='tx-wlight br-white-03 w-11/12'
              />
            </div>
            <div className='mt-6'>
              <Input
                variant='standard'
                placeholder='Password'
                className='tx-wlight br-white-03 w-11/12'
              />
            </div>
            <div className='mx-2 mt-10'>
              <Button
                className='w-11/12 mt-4 bg-secondary capitalize text-md py-2'
                fullWidth
                onClick={() => signIn()}
              >
                Create Account
              </Button>
              <article className='flex justify-between items-center w-11/12 mt-4 px-2'>
                <div className='text-xs flex'>
                  <p className='text-xs mr-2'>Already have an account?</p>
                  <p className='text-cyan-600 text-xs'>
                    <Link href='/logout'>Login</Link>
                  </p>
                </div>
                <Typography className='text-xs'>
                  site designed by @jochizan
                </Typography>
              </article>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
