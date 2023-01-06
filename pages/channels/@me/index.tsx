import ModalForm from '@components/Modal';
import ServerContext from '@store/server.store';
import { IServer } from '@store/types/server.types';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const HomePage = () => {
  const { createServer } = useContext(ServerContext);
  const [openCreate, setOpenCreate] = useState(false);

  const {
    register: registerServer,
    handleSubmit: handleSubmitServer,
    formState: { errors: errorsServer }
  } = useForm<IServer>();

  const handleCreateServer: SubmitHandler<IServer> = async (data) => {
    createServer(data);
    handleOpenCreate();
  };

  const handleOpenCreate = () => setOpenCreate(!openCreate);

  return (
    <div className='flex flex-col items-center justify-center h-screen '>
      <Image
        src='/logo_favicoin.png'
        alt='Logo'
        className='mb-8'
        width={164}
        height={128}
      />
      <h1 className='text-3xl font-bold text-gray-100 mb-8'>LerChat</h1>
      <div className='w-full max-w-xs'>
        <button
          className='w-full py-4 px-8 font-bold text-white bg-primary rounded-full shadow-xl  focus:outline-none focus:shadow-outline'
          onClick={handleOpenCreate}
        >
          ¡Comienza ahora!
        </button>
      </div>
      <ModalForm
        open={openCreate}
        handler={handleOpenCreate}
        title={'Creación de servidor'}
        button={'Crear servidor'}
        description={
          'Solo necesitamos un nombre para el servidor para continuar'
        }
        handleSubmit={handleSubmitServer(handleCreateServer)}
      >
        <input
          required
          placeholder='Nombre del servidor'
          {...registerServer('name')}
          className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
        />
      </ModalForm>
    </div>
  );
};

export default HomePage;
