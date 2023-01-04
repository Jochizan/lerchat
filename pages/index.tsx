import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TypeSession } from '@interfaces/signin';
import { useRouter } from 'next/router';

const HomePage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TypeSession>();
  const { code_invitation: codeInvitation } = useRouter().query;


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
    <div className='flex flex-col items-center justify-center h-screen bg-light-blue-50'>
      <Image
        src='/logo_favicoin.png'
        alt='Logo'
        className='mb-8'
        width={164}
        height={128}
      />
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>LerChat</h1>
      <div className='w-full max-w-sm rounded-lg shadow-lg bg-dark-03'>
        <div className='px-6 py-4'>
          <div className='text-center text-2xl font-bold tx-wlight mb-4'>
            Bienvenido
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-4'>
              <input
                className='w-full py-2 px-3 border-b-2 border-gray-500 hover:gray-blue-700  bg-transparent leading-tight focus:outline-none focus:shadow-outline text-brown-50'
                type='text'
                {...register('email', {
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'El correo electrónico no es válido'
                  }
                })}
                placeholder='Correo electrónico'
              />
            </div>
            <div className='mb-4'>
              <input
                className='w-full py-2 px-3 border-b-2 border-gray-500 hover:gray-blue-700 leading-tight bg-transparent focus:outline-none focus:shadow-outline text-brown-50'
                type='password'
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 8,
                    message: 'La contraseña debe tener al menos 8 caracteres'
                  }
                })}
                placeholder='Contraseña'
              />
            </div>
            <div className='flex items-center justify-between mb-4'>
              {/* <label className='inline-flex items-center'>
              <input className='form-checkbox' type='checkbox' />
              <span className='ml-2 text-gray-700'>Recordarme</span>
            </label> */}
              {/* <Link href='/password-reset'>
              <a className='text-sm text-blue-500 hover:text-blue-700'>
                ¿Olvidaste tu contraseña?
              </a>
            </Link> */}
            </div>
            <div className='flex items-center justify-center'>
              <button
                className='w-full py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline'
                type='submit'
              >
                Iniciar sesión
              </button>
            </div>
          </form>
          <div className='flex items-center justify-center mt-4 mb-2'>
            <Link href='/auth/signup' passHref>
              <button className='w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-full focus:outline-none focus:shadow-outline'>
                Registrarse
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
