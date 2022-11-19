import type { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Input, Typography } from '@material-tailwind/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import type { TypeUser } from '@interfaces/signin';
import axios from 'axios';

const SignInPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TypeUser>();
  const { push, query } = useRouter();
  const { code_invitation: codeInvitation } = query;

  const handleOAuthSignIn = (provider: string) => () => signIn(provider);

  const onSubmit: SubmitHandler<TypeUser> = async (data) => {
    const res = await axios.post('/api/user', data);

    console.log(res);
    push(
      `/auth/signin?${
        codeInvitation ? 'code_invitation=' : ''
      }code_invitation=${codeInvitation}`
    );
  };

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
          <h2 className='mt-14 ml-10'>Crear Cuenta</h2>
          <article className='flex justify-evenly pt-10'>
            <Button
              variant='outlined'
              size='sm'
              onClick={handleOAuthSignIn('google')}
              className='capitalize bg-black flex items-center tx-wlight'
            >
              <Image
                src='/gg.png'
                width={30}
                height={30}
                alt='sesión con google'
              />
              <span className='text-xs ml-2'>Registrarse con Google</span>
            </Button>
            <Button
              variant='outlined'
              size='sm'
              onClick={handleOAuthSignIn('facebook')}
              className='capitalize bg-black flex items-center tx-wlight'
            >
              <Image
                src='/fb.png'
                width={30}
                height={30}
                alt='sesión con facebook'
              />
              <span className='text-xs ml-2'>Registrarse con Facebook</span>
            </Button>
          </article>
          <article className='flex justify-center mt-12 pr-4'>
            <Typography variant='lead' color='white'>
              - OR -
            </Typography>
          </article>
          <article className='w-auto px-8 ml-8 mt-4'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='flex justify-center items-center tx-wlight placeholder:text-white'>
                <Input
                  placeholder='Nombres'
                  variant='standard'
                  {...register('name')}
                  className='tx-wlight br-white-03 w-5/6'
                  color='blue'
                />
                <Input
                  variant='standard'
                  placeholder='Apellidos'
                  {...register('lastName')}
                  className='tx-wlight br-white-03 w-5/6'
                />
              </div>
              <div className='mt-6'>
                <Input
                  variant='standard'
                  placeholder='Correo Electronico'
                  autoComplete='off'
                  {...register('email')}
                  className='tx-wlight br-white-03 w-11/12'
                />
              </div>
              <div className='mt-6'>
                <Input
                  variant='standard'
                  placeholder='Contraseña'
                  type='password'
                  autoComplete='off'
                  {...register('password')}
                  className='tx-wlight br-white-03 w-11/12'
                />
              </div>
              <div className='mx-2 mt-10'>
                <Button
                  className='w-11/12 mt-4 bg-secondary capitalize text-md py-2'
                  fullWidth
                  type='submit'
                >
                  Crear Cuenta
                </Button>
                <article className='flex justify-between items-center w-11/12 mt-4 px-2'>
                  <div className='text-xs flex'>
                    <p className='text-xs mr-2'>¿Ya tienes una cuenta?</p>
                    <p className='text-cyan-600 text-xs'>
                      <Link
                        href={`/auth/signin${
                          codeInvitation ? `?code_server=${codeInvitation}` : ''
                        }`}
                      >
                        Resgistrarse
                      </Link>
                    </p>
                  </div>
                  <Typography className='text-xs'>
                    sitio diseñador por @jochizan
                  </Typography>
                </article>
              </div>
            </form>
          </article>
        </div>
      </section>
    </div>
  );
};

export default SignInPage;
