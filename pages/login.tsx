import type { NextPage } from 'next';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import Router from 'next/router';
import { useSession, signIn } from 'next-auth/client';
import { useEffect } from 'react';

const LoginPage: NextPage = () => {
  const [session, loading] = useSession();

  useEffect(() => {
    if (session && !loading) Router.push('/namespaces');
  }, [session, loading]);

  return (
    <section className='w-100 vh-100 d-flex flex-column align-items-center justify-content-center tx-wlight'>
      <div className='py-3'>
        <Link href='/auth/privacy'>Politica de Privacidad</Link>
      </div>

      <div className='py-3'>
        <Link href='/auth/terms'>Condiciones del servicio</Link>
      </div>

      <Button onClick={() => signIn()}>Sign in</Button>
    </section>
  );
};

export default LoginPage;
