import { IMessage } from '@interfaces/store.interfaces';
import { Avatar } from '@material-tailwind/react';

const CardMessage = ({ el }: { el: IMessage }) => {
  if (!el.author) {
    return <div className='tx-wlight'>Cargando mensaje...</div>;
  }

  return (
    <div className='tx-wlight flex items-center hover:bg-gray-700 my-1'>
      <section className='mx-4'>
        <Avatar
          src='/default.png'
          alt='Foto de perfil'
          size='xs'
          variant='circular'
        ></Avatar>
      </section>
      <section>
        <h5 className='font-bold text-sm'>{el.author.name}</h5>
        <p className='tx-wlight text-xs my-1'>{el.content}</p>
      </section>
    </div>
  );
};

export default CardMessage;
