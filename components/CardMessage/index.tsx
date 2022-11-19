import { IMessage } from '@store/types/message.types';
import {
  Avatar,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader
} from '@material-tailwind/react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { SyntheticEvent, useContext, useState } from 'react';
import { MessageContext } from '@store/message.store';
import { hideMenu } from 'react-contextmenu/modules/actions';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IServer } from '@store/types/server.types';

const CardMessage = ({
  msg,
  nextMsg
}: {
  msg: IMessage;
  nextMsg: IMessage;
}) => {
  const { deleteMessage, updateMessage } = useContext(MessageContext);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IServer>({
    defaultValues: {
      name: msg.content as string
    }
  });
  const ID_MENU = msg._id + '#';

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleDeleteMessage = (e: SyntheticEvent, data: any) => {
    deleteMessage(data._id);
  };

  const handleUpdateMessage = (e: SyntheticEvent, data: any) => {
    handleOpen();
  };

  const onSubmit: SubmitHandler<IServer> = async (data) => {
    updateMessage(msg._id as string, data.name);
  };

  return (
    <>
      <ContextMenuTrigger id={ID_MENU}>
        <div className='py-1' onClick={() => hideMenu()}>
          <div className='tx-wlight flex items-center hover:bg-gray-700 py-1 rounded-sm'>
            <section className='mx-4'>
              <Avatar
                src='/default.png'
                alt='Foto de perfil'
                size='xs'
                variant='circular'
              />
            </section>
            <section>
              <h5 className='font-bold text-sm'>
                {msg.author ? msg.author.name : ''}
              </h5>
              <p className='tx-wlight text-xs py-1'>{msg.content}</p>
            </section>
          </div>
        </div>
      </ContextMenuTrigger>
      <Dialog open={open} handler={handleOpen} className='bg-dark-03'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className='tx-wlight flex justify-between p-2 ml-4'>
            Actualizar mensaje
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
            Solo necesitamos un nombre dmsg servidor para continuar...
            <input
              required
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
              <span>Actualizar mensaje</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
      <ContextMenu id={ID_MENU}>
        <MenuItem onClick={handleDeleteMessage} data={{ _id: msg._id }}>
          Borrar
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={handleUpdateMessage}>Actualizar</MenuItem>
      </ContextMenu>
    </>
  );
};

export default CardMessage;
