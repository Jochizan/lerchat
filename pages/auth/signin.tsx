import type { NextPage } from 'next';
import { Button, Input, Typography } from '@material-tailwind/react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TypeSession } from '@interfaces/signin';
import { useRouter } from 'next/router';

const SignInPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TypeSession>();
  const { code_invitation: codeInvitation } = useRouter().query;

  const handleOAuthSignIn = (provider: string) => () => signIn(provider);

  const onSubmit: SubmitHandler<TypeSession> = async (data) => {
    try {
      signIn('credentials', {
        ...data,
        redirect: true,
        callbackUrl: codeInvitation ? `/api/${codeInvitation}` : '/channels/@me'
      });
    } catch (error) {
      window.alert(error);
    }
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
          <h2 className='mt-14 ml-10'>Sign In</h2>
          <article className='flex justify-evenly pt-10 mt-4'>
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
              <span className='text-xs ml-2'>Iniciar Sesión con Google</span>
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
              <span className='text-xs ml-2'>Iniciar Sesión con Facebook</span>
            </Button>
          </article>
          <article className='flex justify-center mt-16 pr-4'>
            <Typography variant='lead' color='white'>
              - OR -
            </Typography>
          </article>
          <article className='w-auto px-8 ml-8 mt-8 bg-input-sign'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mt-6'>
                <Input
                  variant='standard'
                  placeholder='Correo Electronico'
                  {...register('email')}
                  className='tx-wlight br-white-03 w-11/12'
                />
              </div>
              <div className='mt-6'>
                <Input
                  variant='standard'
                  placeholder='Password'
                  {...register('password')}
                  type='password'
                  className='tx-wlight br-white-03 w-11/12'
                />
              </div>
              <div className='mx-2 mt-12'>
                <Button
                  className='w-11/12 mt-4 bg-secondary capitalize text-md py-2'
                  fullWidth
                  type='submit'
                >
                  Sign In
                </Button>
                <article className='flex justify-between items-center w-11/12 mt-4 px-2'>
                  <div className='text-xs flex'>
                    <p className='text-xs mr-2'>¿No tienes una cuenta?</p>
                    <p className='text-cyan-600 text-xs'>
                      <Link
                        href={`/auth/signup${
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
