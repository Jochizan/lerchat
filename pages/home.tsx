import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useContext, useEffect, useState } from 'react';
import { EXPRESS } from '@services/enviroments';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader
} from '@material-tailwind/react';
import { TypeServer } from '@interfaces/chat.interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import ServerContext from '@store/server.context';

const HomePage: NextPage = () => {
  const { push } = useRouter();
  const [session, status] = useSession();
  const { getServers } = useContext(ServerContext);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TypeServer>();

  const handleOpen = () => setOpen(!open);

  const onSubmit: SubmitHandler<TypeServer> = async (data) => {
    const newServer = { ...session?.user, name: data.name };
    const res = await fetch(`${EXPRESS}/api/servers`, {
      method: 'POST',
      body: JSON.stringify(newServer),
      headers: { 'Content-Type': 'application/json' }
    });

    const createdServer = await res.json();
    if (res.ok && createdServer && session) {
      getServers(session.user._id);
    }
    handleOpen();
  };

  if (typeof window !== 'undefined' && status) return null;

  if (status) return <div className='tx-wlight'>Cargando...</div>;

  if (!session) push('/');

  return (
    <section className='tx-wlight grow flex justify-center items-center'>
      {/* Sesión Iniciada correcamente */}
      <Button ripple className='bg-primary' onClick={handleOpen}>
        Crear Servidor
      </Button>
      <Dialog open={open} handler={handleOpen} className='bg-dark-03'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className='tx-wlight flex justify-between p-2 ml-4'>
            Creación de servidor
            <Button
              variant='filled'
              color='red'
              onClick={handleOpen}
              className='p-2.5 px-4 m-2 right-0'
            >
              <span className='text-sm'>x</span>
            </Button>
          </DialogHeader>
          <DialogBody divider className='tx-wlight flex flex-col m-4'>
            Solo necesitamos un nombre del servidor para continuar...
            <input
              required
              placeholder='Nombre del servidor'
              {...register('name')}
              className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-3xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
            />
          </DialogBody>
          <DialogFooter className='flex justify-center'>
            <Button
              variant='filled'
              color='green'
              className='bg-primary'
              type='submit'
              onClick={handleOpen}
            >
              <span>Crear Servidor</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </section>
  );
};

export default HomePage;
