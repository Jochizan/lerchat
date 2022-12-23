import { FC, useEffect, useContext, useState, SyntheticEvent } from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  hideMenu,
  MenuItem
} from 'react-contextmenu';
import ServerContext from '@store/server.store';
import NamespaceContext from '@store/namespace.store';
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader
} from '@material-tailwind/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { IServer } from '@store/types/server.types';
import ModalForm from '@components/Modal';
import ButtonServer from '@components/ButtonServer';
import { INamespace } from '@store/types/namespace.types';
import UsersContext from '@store/user.store';

const Aside: FC = ({ children }) => {
  const {
    state: { mapServers, servers, id: idServer },
    deleteServer,
    createServer,
    updateServer,
    handleIdServer,
    getCodeInvitation
  } = useContext(ServerContext);
  const {
    state: { users }
  } = useContext(UsersContext);
  const { data: session } = useSession();
  const {
    state: { namespaces },
    readNamespaces,
    createNamespace
  } = useContext(NamespaceContext);
  const [copied, setCopied] = useState(false);
  const [openServer, setOpenServer] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openNamespace, setOpenNamespace] = useState(false);
  const [click, setClick] = useState(false);
  const [ID, setID] = useState('');
  const router = useRouter();
  const id = router.query;
  const {
    register: registerServer,
    handleSubmit: handleSubmitServer,
    formState: { errors: errorsServer }
  } = useForm<IServer>();

  const {
    register: registerNamespace,
    handleSubmit: handleSubmitNamespace,
    formState: { errors: errorsNamespace }
  } = useForm<INamespace>();

  const handleOpenServer = () => setOpenServer(!openServer);
  const handleOpenNamespace = () => setOpenNamespace(!openNamespace);
  const handleOpenCreate = () => setOpenCreate(!openCreate);

  useEffect(() => {
    if (!(idServer && servers.length && click && id.server !== idServer))
      return;

    readNamespaces(idServer as string, click);
    setClick(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idServer, servers, click]);

  const handleCreateServer: SubmitHandler<IServer> = async (data) => {
    createServer(data);
    handleOpenCreate();
  };

  const handleDeleteServer = (e: SyntheticEvent, data: any) => {
    deleteServer(data._id);
  };

  const handleGetAndShareLinkInvitation = (e: SyntheticEvent, data: any) => {
    handleOpenServer();
    setID(data._id);
    setCopied(false);

    if (mapServers[data._id].invitation) return;

    getCodeInvitation(data._id);
  };

  const handleCreateNamespace: SubmitHandler<INamespace> = (data) => {
    createNamespace({ ...data, server: idServer as string });
    handleOpenServer();
  };

  return (
    <section className='flex h-screen'>
      <aside className='bg-ndark h-full flex flex-col'>
        <div className='w-10 max-h-20 h-20 items-center text-center'>
          <Link href='/home' passHref>
            <span className='text-base tx-wlight cursor-pointer'>LerChat</span>
          </Link>
        </div>
        <div className='flex h-full'>
          <div className='flex flex-col items-center gap-3 h-full max-h-screen p-0.5 w-16'>
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
                className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-3xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
              />
            </ModalForm>
            <ModalForm
              open={openNamespace}
              handler={handleOpenNamespace}
              title={'Creación de espacio de trabajo'}
              button={'Crear espacio de trabajo'}
              description={
                'Solo necesitamos un nombre del espacio para continuar'
              }
              handleSubmit={handleSubmitNamespace(handleCreateNamespace)}
            >
              <input
                required
                placeholder='Nombre del servidor'
                {...registerNamespace('name')}
                className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-3xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
              />
            </ModalForm>
            {servers.length ? (
              servers.map(({ _id, name, image }) => (
                <div key={_id}>
                  <ContextMenuTrigger id={_id}>
                    <ButtonServer
                      className={`bg-${
                        image !== 'default.png' ? 'transparent' : 'primary'
                      } p-0.5 py-1 w-10 h-10 group static z-0 tx-wlight rounded-lg hover:rounded-md ease-out transition-all  uppercase`}
                      submit={() => {
                        setClick(true);
                        handleIdServer(_id);
                      }}
                    >
                      <div className='bg-dark-02 text-xs rounded-lg w-fit p-1.5 items-center h-8 ml-12 z-10 hidden group-hover:flex absolute tx-wlight'>
                        {name}
                      </div>
                      {image !== 'default.png' ? (
                        <Image
                          src={`/${image}`}
                          alt='Logo del servidor'
                          className='rounded-2xl hover:rounded-xl ease-out transition-all'
                          width={20}
                          height={20}
                        />
                      ) : (
                        <div className='rounded-2xl text-xl hover:rounded-xl ease-out transition-all'>
                          {name.slice(0, 2)}
                        </div>
                      )}
                    </ButtonServer>
                  </ContextMenuTrigger>
                  <ContextMenu id={_id}>
                    <MenuItem
                      onClick={handleGetAndShareLinkInvitation}
                      data={{ _id }}
                    >
                      Obtener link de grupo
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem onClick={handleDeleteServer} data={{ _id }}>
                      Borrar Servidor
                    </MenuItem>
                  </ContextMenu>
                </div>
              ))
            ) : (
              <div className='p-2'>
                <span className='tx-wlight'>...</span>
              </div>
            )}
            <div>
              <Button
                className='bg-primary p-0.5 py-1 w-10 h-10 group static z-0'
                onClick={handleOpenCreate}
              >
                <div className='bg-dark-02 text-xs rounded-lg w-fit p-1.5 items-center h-8 ml-12 z-10 hidden group-hover:flex absolute tx-wlight'>
                  Crear Servidor
                </div>
                <span className='text-2xl'>+</span>
              </Button>
            </div>
          </div>
          <Dialog
            open={openServer}
            handler={handleOpenServer}
            className='bg-dark-03'
          >
            <DialogHeader className='tx-wlight flex justify-between p-2 ml-4'>
              Invitar amigos al servidor...
              <Button
                variant='filled'
                color='red'
                onClick={handleOpenServer}
                className='p-2.5 px-4 m-2 right-0'
              >
                <span className='text-sm'>x</span>
              </Button>
            </DialogHeader>
            <DialogBody divider className='tx-wlight flex flex-col gap-2'>
              <p>Amigos al server: </p>
              <div className='flex items-center'>
                <span className='m-2 py-0.5 w-full font-semibold text-sm bg-dark-03 br-dark-02 tx-wlight rounded-xs focus:outline-none focus:border-none focus:ring-1 overflow-auto'>
                  http://localhost:3000/api/
                  {mapServers[ID]?.invitation}
                </span>
                {/* Incertar código de lista de amigos y el vinculo para invitar a personas */}
                <Button
                  variant='filled'
                  color='green'
                  className={`bg-${
                    copied ? 'secondary' : 'primary'
                  } p-2.5 px-4 m-2 right-0 cursor-pointer`}
                  onClick={() => {
                    setCopied(true);
                    navigator.clipboard.writeText(
                      `http://localhost:3000/api/${mapServers[ID]?.invitation}`
                    );
                  }}
                >
                  <span>{copied ? 'Copiado ✅' : 'Copiar vinculo'}</span>
                </Button>
              </div>
            </DialogBody>
          </Dialog>
          <ContextMenuTrigger id={(idServer as string) + '#'}>
            <div
              className='pt-16 bg-gray-900 block w-40 overflow-hidden h-full'
              onClick={() => hideMenu()}
            >
              {Object.keys(id).length && namespaces.length ? (
                namespaces?.map(({ _id, name }) => (
                  <Link
                    key={_id}
                    href={`/channels/${idServer}/${_id}`}
                    passHref
                  >
                    <div className='w-full pl-1.5'>
                      <span className='tx-nlight cursor-pointer align-middle'>
                        -&gt; {name}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <span className='tx-nlight truncate'>
                  {router.route === '/channels' && 'Sin espacios para chatear'}
                </span>
              )}
            </div>
          </ContextMenuTrigger>
          <ContextMenu id={(idServer as string) + '#'}>
            <MenuItem
              onClick={handleGetAndShareLinkInvitation}
              data={{ _id: idServer }}
            >
              Obtener link de grupo
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={setOpenNamespace} data={{ _id: idServer }}>
              Crear espacio de chat
            </MenuItem>
          </ContextMenu>
        </div>
      </aside>
      <main className='grow flex max-h-screen flex-col h-full'>{children}</main>
      <section className='w-40 bg-ndark'>
        <div className='flex flex-col items-start justify-start h-full'>
          <div className='pt-16' />
          {users.length ? (
            users.map((el) => (
              <div
                key={el._id}
                className='flex justify-center items-center gap-2 p-2'
              >
                <Image
                  src={`/${el.image}`}
                  alt='Imagen de perfil'
                  width={35}
                  height={35}
                  className='rounded-full'
                />
                <div className='flex flex-col'>
                  <span className='tx-wlight'>{el.name}</span>
                  <span
                    className={`${
                      el.state === 'connected'
                        ? 'text-green-600'
                        : 'text-gray-800'
                    }`}
                  >
                    * {el.state}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </section>
    </section>
  );
};

export default Aside;


        {/* <Virtuoso
          className='tx-wlight mb-3'
          style={{ overscrollBehavior: 'contain', overflowY: 'scroll' }}
          data={internalMessages}
          ref={virtuoso}
          startReached={startReached}
          firstItemIndex={Math.max(0, firstItemIndex)}
          totalCount={internalMessages.length}
          followOutput={followOutput}
          initialTopMostItemIndex={internalMessages.length - 1}
          itemContent={(idx, data) => (
            <CardMessage
              key={idx}
              msg={data}
              scrollToLastIndex={scrollToLastIndex}
              // reinitializeToLastIndex={reinitializeToLastIndex}
            />
          )}
          alignToBottom
        /> */}