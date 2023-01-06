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
import { SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';
import { MessageContext } from '@store/message.store';
import { hideMenu } from 'react-contextmenu/modules/actions';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IServer } from '@store/types/server.types';
import { checkDate } from '@libs/groupedMessages';
import { useSession } from 'next-auth/react';

const CardMessage = ({ msg }: { msg: IMessage }) => {
  const { data: session } = useSession();
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
  const [showIcons, setShowIcons] = useState(false);
  const okDate = checkDate(msg.createdAt as string);
  const ID_MENU = msg._id + '#';

  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleOpenDelete = () => setOpenDelete(!openDelete);
  const handleOpenUpdate = () => setOpenUpdate(!openUpdate);

  if (!msg.author) return null;

  const isAuthor = session?.user._id === msg?.author._id;

  const handleDeleteMessage = (e: SyntheticEvent) => {
    e.preventDefault();
    handleOpenDelete();
  };

  const handleUpdateMessage = (e: SyntheticEvent) => {
    e.preventDefault();
    handleOpenUpdate();
  };

  const onSubmitUpdate: SubmitHandler<IServer> = async (data) => {
    updateMessage(msg._id as string, data.name);
  };

  const onSubmitDelete: SubmitHandler<IServer> = async () => {
    deleteMessage(msg._id as string);
  };

  return (
    <>
      <ContextMenuTrigger id={ID_MENU}>
        <div
          className={`rounded-lg flex flex-col relative ${
            msg.next || msg.nextTime ? 'py-0.5 pt-1' : 'pt-0.5'
          }`}
          onMouseEnter={() => setShowIcons(true)}
          onMouseLeave={() => setShowIcons(false)}
          onClick={() => hideMenu()}
        >
          <div className='tx-wlight flex items-center group hover:bg-gray-700 py-0.5 rounded-sm'>
            {msg.next || msg.nextTime ? (
              <section className='mx-4'>
                <Avatar
                  src='/default.png'
                  alt='Foto de perfil'
                  size='xs'
                  variant='circular'
                />
              </section>
            ) : (
              <section className='mx-3'>
                <p className='text-xs group-hover:text-gray-500 text-transparent'>
                  {new Date(msg.createdAt as string).toLocaleString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </section>
            )}
            <section>
              {showIcons && (
                <div className='absolute flex right-0 -top-4'>
                  {isAuthor && (
                    <div className='m-0 p-0'>
                      <button
                        className='bg-red-600 text-white p-0.5 rounded-sm'
                        title='Borrar mensaje'
                        onClick={() => handleOpenDelete()}
                      >
                        <i className='material-icons flex items-center'>
                          delete
                        </i>
                      </button>
                      <button
                        className='bg-yellow-600 text-white p-0.5 rounded-sm'
                        title='Editar mensaje'
                        onClick={() => handleOpenUpdate()}
                      >
                        <i className='material-icons flex items-center'>edit</i>
                      </button>
                    </div>
                  )}
                  <div className='m-0 p-0'>
                    <button
                      className='bg-gray-600 text-white p-0.5 rounded-sm'
                      title='Mostrar más opciones'
                    >
                      <i className='material-icons flex items-center'>
                        more_horiz
                      </i>
                    </button>
                  </div>
                </div>
              )}
              {(msg.next || msg.nextTime) && (
                <div className='flex items-baseline gap-2'>
                  <h5 className='font-semibold text-sm p-0'>
                    {msg.author ? msg.author.name : 'unknown'}
                  </h5>
                  <p className='text-xs text-gray-500'>
                    {okDate
                      ? okDate +
                        new Date(msg.createdAt as string).toLocaleString(
                          'es-ES',
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )
                      : new Date(msg.createdAt as string).toLocaleString(
                          'es-ES',
                          {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}
                  </p>
                </div>
              )}
              <p
                className={`tx-wlight text-sm ${
                  msg.next || msg.nextTime ? 'pt-1' : 'pt-0.5'
                }`}
              >
                {msg.content}
              </p>
            </section>
          </div>
        </div>
      </ContextMenuTrigger>
      <Dialog
        open={openUpdate}
        handler={handleOpenUpdate}
        className='bg-dark-03'
        size='xs'
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.8, y: +50 }
        }}
      >
        <form onSubmit={handleSubmit(onSubmitUpdate)}>
          <DialogHeader className='tx-wlight flex justify-between p-2 ml-4'>
            Actualizar mensaje
            {/* <Button
              variant='filled'
              color='red'
              onClick={handleOpenUpdate}
              className='p-2.5 px-4 m-2 right-0'
            >
              <span className='text-sm'>x</span>
            </Button> */}
          </DialogHeader>
          <DialogBody divider className='tx-wlight flex flex-col p-4'>
            Actualice su mensaje a continuación...
            <input
              required
              {...register('name')}
              className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
            />
          </DialogBody>
          <DialogFooter className='flex justify-center'>
            <Button
              variant='filled'
              color='green'
              className='bg-primary'
              type='submit'
              onClick={handleOpenUpdate}
            >
              <span>Actualizar mensaje</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
      <Dialog
        open={openDelete}
        handler={handleOpenDelete}
        className='bg-dark-03'
        size='xs'
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.8, y: +50 }
        }}
      >
        <form onSubmit={handleSubmit(onSubmitDelete)}>
          <DialogHeader className='tx-wlight flex justify-between p-2 ml-4'>
            Borrar mensaje
            {/* <Button
              variant='filled'
              color='red'
              onClick={handleOpenDelete}
              className='p-2.5 px-4 m-2 right-0'
            >
              <span className='text-sm'>x</span>
            </Button> */}
          </DialogHeader>
          <DialogBody divider className='tx-wlight flex flex-col p-4'>
            <p className='text-base pb-2'>
              Esta seguro de borrar el siguiente mensaje:{' '}
            </p>
            <div className='tx-wlight flex items-center bg-gray-700 group hover:bg-red-500 py-0.5 rounded-sm'>
              <section className='mx-4'>
                <Avatar
                  src='/default.png'
                  alt='Foto de perfil'
                  size='xs'
                  variant='circular'
                />
              </section>
              <section className='p-1'>
                <div className='flex items-baseline gap-2'>
                  <h5 className='font-semibold text-sm p-0'>
                    {msg.author ? msg.author.name : 'unknown'}
                  </h5>
                  <p className='text-xs text-gray-500'>
                    {new Date(msg.createdAt as string).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <p
                  className={`tx-wlight text-sm ${
                    msg.next || msg.nextTime ? 'pt-1' : 'pt-0.5'
                  }`}
                >
                  {msg.content}
                </p>
              </section>
            </div>
          </DialogBody>
          <DialogFooter className='flex justify-end items-center gap-2'>
            <Button
              variant='filled'
              color='gray'
              className='bg-gray-600'
              onClick={handleOpenDelete}
            >
              <span>Cancelar</span>
            </Button>
            <Button
              variant='filled'
              color='red'
              className='bg-red-700'
              type='submit'
              onClick={handleOpenDelete}
            >
              <span>Borrar mensaje</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
      <ContextMenu id={ID_MENU}>
        {isAuthor && (
          <>
            <MenuItem onClick={handleDeleteMessage}>Borrar</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={handleUpdateMessage}>Actualizar</MenuItem>
          </>
        )}
      </ContextMenu>
    </>
  );
};

export default CardMessage;
