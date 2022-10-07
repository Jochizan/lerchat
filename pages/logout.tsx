import type { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@material-tailwind/react';
import { useSession, signOut } from 'next-auth/client';

const LogoutPage: NextPage = () => {
  const [session] = useSession();

  if (session) {
    return (
      <section className='vw-100 vh-100 d-flex flex-column align-items-center justify-content-center tx-wlight'>
        Signed in as {session.user?.email} <br />
        <Button onClick={() => signOut()}>
          Sign out
        </Button>
      </section>
    );
  }
  return (
    <section className='vw-100 vh-100 d-flex flex-column align-items-center justify-content-center tx-wlight'>
      <Link href='/login'>Login</Link>
    </section>
  );
};

export default LogoutPage;
