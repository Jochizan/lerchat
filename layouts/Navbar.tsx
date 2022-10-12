import { useState, useEffect, FC } from 'react';
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton
} from '@material-tailwind/react';
import { useSession, signOut } from 'next-auth/client';
import Link from 'next/link';

const MainNavbar: FC = ({ children }) => {
  const [openNav, setOpenNav] = useState(false);
  const [session, status] = useSession();

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className='mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6'>
      <Link href='/services' passHref>
        <Typography
          as='li'
          variant='paragraph'
          color='blue-gray'
          className='p-1 font-normal tx-wlight'
        >
          <span className='flex items-center'>Servicios</span>
        </Typography>
      </Link>
      <Link href='/@me' passHref>
        <Typography
          as='li'
          variant='paragraph'
          color='blue-gray'
          className='p-1 font-normal tx-wlight'
        >
          <span className='flex items-center'>Cuenta</span>
        </Typography>
      </Link>
      <Link href='/about' passHref>
        <Typography
          as='li'
          variant='paragraph'
          color='blue-gray'
          className='p-1 font-normal tx-wlight'
        >
          <span className='flex items-center'>Sobre Nosotros</span>
        </Typography>
      </Link>
      <Link href='/docs' passHref>
        <Typography
          as='li'
          variant='paragraph'
          color='blue-gray'
          className='p-1 font-normal tx-wlight'
        >
          <span className='flex items-center'>Documentación</span>
        </Typography>
      </Link>
    </ul>
  );

  return (
    <>
      <Navbar className='mx-auto max-w-none py-1 px-3 lg:px-6 lg:py-3 rounded-none bg-secondary'>
        <div className='container mx-auto flex items-center justify-between tx-wlight'>
          <Link href='/' passHref>
            <Typography
              as='a'
              href='#'
              variant='lead'
              className='mr-4 cursor-pointer py-1.5 font-semibold'
            >
              <span>LerChat</span>
            </Typography>
          </Link>
          <div className='hidden lg:block'>{navList}</div>
          {session ? (
            <Button
              variant='outlined'
              size='sm'
              className='hidden br-secondary-50 lg:inline-block rounded-2xl tx-wlight capitalize font-medium text-sm'
              onClick={() => signOut()}
            >
              Cerrar Sesión
            </Button>
          ) : status ? (
            <div className='tx-wlight'>Cargando...</div>
          ) : (
            <Link href='/auth/signin' passHref>
              <Button
                variant='outlined'
                size='sm'
                className='hidden br-white-03 lg:inline-block rounded-2xl tx-wlight capitalize font-medium text-sm'
                ripple
              >
                Iniciar Sesión
              </Button>
            </Link>
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
          {navList}
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

export default MainNavbar;
