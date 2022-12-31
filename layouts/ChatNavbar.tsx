import { useState, useEffect, FC, useContext } from 'react';
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Avatar
} from '@material-tailwind/react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import UsersContext from '@store/user.store';

const ChatNavbar: FC = ({ children }) => {
  const [openNav, setOpenNav] = useState(false);
  const { disconnectUser } = useContext(UsersContext);
  const { data: session } = useSession();

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );

    return () => {
      window.removeEventListener('resize', () => null);
    };
  }, []);

  return (
    <>
      <Navbar className='mx-auto max-w-none py-0.5 px-2 lg:px-4 lg:py-1.5 my-0.5 rounded-none bg-dark-01'>
        <div className='mx-auto flex items-center justify-between tx-wlight'>
          <label className='hidden lg:block relative w-5/12'>
            <input
              placeholder='Server, persons and links'
              className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-3xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
            />
            <span className='absolute inset-y-0 right-3 flex items-center pl-2'>
              <svg className='h-5 w-5 fill-slate-300' viewBox='0 0 30 30'>
                <g id='surface4419972'>
                  <path d='M 13 3 C 7.488281 3 3 7.488281 3 13 C 3 18.511719 7.488281 23 13 23 C 15.398438 23 17.597656 22.148438 19.324219 20.734375 L 25.292969 26.707031 C 25.542969 26.96875 25.917969 27.074219 26.265625 26.980469 C 26.617188 26.890625 26.890625 26.617188 26.980469 26.265625 C 27.074219 25.917969 26.96875 25.542969 26.707031 25.292969 L 20.734375 19.320312 C 22.148438 17.597656 23 15.398438 23 13 C 23 7.488281 18.511719 3 13 3 Z M 13 5 C 17.429688 5 21 8.570312 21 13 C 21 17.429688 17.429688 21 13 21 C 8.570312 21 5 17.429688 5 13 C 5 8.570312 8.570312 5 13 5 Z M 13 5 ' />
                </g>
              </svg>
            </span>
          </label>
          {session?.user ? (
            <Button
              variant='outlined'
              size='sm'
              className='hidden br-secondary-50 rounded-2xl tx-wlight capitalize font-medium text-sm
              br-dark-01 lg:flex justify-center items-center'
              onClick={() => {
                // disconnectUser();
                signOut({
                  redirect: true,
                  callbackUrl: '/'
                });
              }}
            >
              <Typography variant='paragraph' className='mr-3'>
                {session?.user.name}
              </Typography>
              <Avatar
                src='/default.png'
                alt='Foto de perfil'
                size='xs'
                variant='circular'
              />
            </Button>
          ) : (
            <div>Cargando datos del usuario...</div>
          )}

          <IconButton
            variant='text'
            className='ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden'
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                className='h-6 w-6'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            )}
          </IconButton>
        </div>
        <MobileNav open={openNav}>
          <Button
            variant='outlined'
            size='sm'
            className='hidden lg:inline-block rounded-2xl bg-primary text-xs capitalizes backdrop-opacity-50 tx-wlight'
            ripple
          >
            <Link href='/auth/signin' passHref>
              Inicar Sesión
            </Link>
          </Button>
        </MobileNav>
      </Navbar>
      {children}
    </>
  );
};

export default ChatNavbar;
