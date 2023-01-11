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
import { SERVER } from '@services/enviroments';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { IServer } from '@store/types/server.types';
import ModalForm from '@components/Modal';
import ButtonServer from '@components/ButtonServer';
import { INamespace } from '@store/types/namespace.types';
import UsersContext from '@store/user.store';
import { ICategory } from '@store/types/category.types';
import CategoryContext from '@store/category.store';

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
  const {
    state: { namespaces },
    readNamespaces,
    createNamespace,
    updateNamespace,
    deleteNamespace
  } = useContext(NamespaceContext);
  const {
    state: { categories },
    createCategory,
    updateCategory,
    deleteCategory
  } = useContext(CategoryContext);

  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [update, setUpdate] = useState(false);
  const [openServer, setOpenServer] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openNamespace, setOpenNamespace] = useState(false);
  const [IDCategory, setIDCategory] = useState('');
  const [click, setClick] = useState(false);
  const [ID, setID] = useState('');
  const { query, ...route } = useRouter();
  const id = query;
  const isCreator =
    session?.user?._id === mapServers[idServer as string]?.creator;

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

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    formState: { errors: errosCategory }
  } = useForm<ICategory>();

  const handleOpenCreate = () => setOpenCreate(!openCreate);
  const handleOpenServer = () => setOpenServer(!openServer);
  const handleOpenCategory = () => setOpenCategory(!openCategory);
  const handleOpenNamespace = () => setOpenNamespace(!openNamespace);

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

  const handleUpdateServer: SubmitHandler<IServer> = async (data) => {
    setUpdate(false);
    updateServer(data._id, data);
    handleOpenServer();
  };

  const handleCreateNamespace: SubmitHandler<INamespace> = (data) => {
    if (!IDCategory) {
      createNamespace({
        ...data,
        server: idServer as string
      });
    } else {
      createNamespace({
        ...data,
        server: idServer as string,
        category: IDCategory
      });
      setIDCategory('');
    }
    // console.log(data, IDCategory);
    handleOpenNamespace();
  };

  const handleUpdateNamespace: SubmitHandler<INamespace> = (data) => {
    setUpdate(false);
    updateNamespace(data._id, data);
    handleOpenNamespace();
  };

  const handleCreateCategory: SubmitHandler<ICategory> = (data) => {
    createCategory({ ...data, server: idServer as string });
    handleOpenCategory();
  };

  const handleUpdateCategory: SubmitHandler<ICategory> = (data) => {
    setUpdate(false);
    updateCategory(data._id, data);
    handleOpenCategory();
  };

  const handleDeleteNamespace = (e: SyntheticEvent, data: any) => {
    deleteNamespace(data._id);
  };

  const handleDeleteCategory = (e: SyntheticEvent, data: any) => {
    deleteCategory(data._id);
  };

  const handleDeleteServer = (e: SyntheticEvent, data: any) => {
    deleteServer(data._id);
  };

  const handleCreateNamespaceOfCategory = (e: SyntheticEvent, data: any) => {
    setUpdate(false);
    handleOpenNamespace();
    setIDCategory(data.category);
  };

  const handleGetAndShareLinkInvitation = (e: SyntheticEvent, data: any) => {
    handleOpenServer();
    setID(data._id);
    setCopied(false);

    if (mapServers[data._id].invitation) return;

    getCodeInvitation(data._id);
  };

  return (
    <section className='flex h-screen'>
      <aside className='bg-ndark h-full flex flex-col'>
        <Link href='/home' passHref>
          <p className='text-base tx-wlight h-16 text-center cursor-pointer  flex items-center justify-center'>
            LerChat
          </p>
        </Link>
        <div className='flex h-full grow-1'>
          <div className='flex flex-col items-center gap-3 h-full max-h-screen p-0.5 w-16'>
            <div className='border-b border-gray-700 pb-3'>
              <Button
                className='bg-primary p-0.5 py-1 w-10 h-10 group z-0 rounded-2xl hover:rounded-lg flex justify-center items-center relative'
                onClick={() => {
                  route.push('/channels/@me');
                }}
              >
                <div className='bg-dark-02 text-xs rounded-lg w-fit p-1.5 items-center h-8 ml-12 z-10 hidden group-hover:flex absolute top-1 left-0 tx-wlight whitespace-nowrap'>
                  Principal
                </div>
                <i className='material-icons'>chat_bubble</i>
              </Button>
            </div>
            <ModalForm
              open={openCreate}
              handler={handleOpenCreate}
              title={
                update ? 'Actualización de servidor' : 'Creación de servidor'
              }
              button={update ? 'Actualizar servidor' : 'Crear servidor'}
              description={
                update
                  ? 'Actualizamos el nombre para el servidor para continuar'
                  : 'Solo necesitamos un nombre para el servidor para continuar'
              }
              handleSubmit={handleSubmitServer(
                update ? handleUpdateServer : handleCreateServer
              )}
            >
              <input
                required
                placeholder='Nombre del servidor'
                {...registerServer('name')}
                className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-2xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
              />
            </ModalForm>
            <ModalForm
              open={openNamespace}
              handler={handleOpenNamespace}
              title={
                update
                  ? 'Actualización de espacio de trabajo'
                  : 'Creación de espacio de trabajo'
              }
              button={
                update
                  ? 'Actualizar espacio de trabajo'
                  : 'Crear espacio de trabajo'
              }
              description={
                update
                  ? 'Actualizamos el espacio de trabajo'
                  : 'Solo necesitamos un nombre del espacio para continuar'
              }
              handleSubmit={handleSubmitNamespace(
                update ? handleUpdateNamespace : handleCreateNamespace
              )}
            >
              <input
                required
                placeholder='Nombre del espacio'
                {...registerNamespace('name')}
                className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
              />
            </ModalForm>
            <ModalForm
              open={openCategory}
              handler={handleOpenCategory}
              title={
                update
                  ? 'Actualizar categoría del servidor'
                  : 'Creación de categoría del servidor'
              }
              button={update ? 'Actualizar categoría' : 'Crear categoría'}
              description={
                update
                  ? 'Actualizamos el nombre de la categoría'
                  : 'Solo necesitamos el nombre de la categoría'
              }
              handleSubmit={handleSubmitCategory(
                update ? handleUpdateCategory : handleCreateCategory
              )}
            >
              <input
                required
                placeholder='Nombre de la categoría'
                {...registerCategory('name')}
                className='mr-4 py-1.5 w-full px-2.5 font-medium bg-white-03 br-white-01 tx-wdark rounded-xl br-white-03 focus:outline-none focus:border-none focus:ring-1'
              />
            </ModalForm>
            {servers.length ? (
              servers.map(({ _id, name, image, creator }) => (
                <div key={_id}>
                  <ContextMenuTrigger id={_id}>
                    <ButtonServer
                      className={`bg-${
                        image !== 'default.png' ? 'transparent' : 'primary'
                      } p-0.5 py-1 w-10 h-10 group static z-0 tx-wlight rounded-2xl hover:rounded-lg ease-out transition-all  uppercase`}
                      submit={() => {
                        setClick(true);
                        handleIdServer(_id);
                      }}
                    >
                      <div
                        className='
                     whitespace-nowrap bg-dark-02 text-xs font-semibold rounded-lg w-fit p-1.5 items-center h-8 ml-12 z-10 hidden group-hover:flex absolute tx-wlight'
                      >
                        {name}
                      </div>
                      {image !== 'default.png' ? (
                        <Image
                          src={`/${image}`}
                          alt='Logo del servidor'
                          className='rounded-2xl hover:rounded-lg ease-out transition-all'
                          width={20}
                          height={20}
                        />
                      ) : (
                        <div className='rounded-2xl text-xl hover:rounded-lg ease-out transition-all'>
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
                    {session?.user._id === creator && (
                      <>
                        <MenuItem divider />
                        <MenuItem onClick={handleDeleteServer} data={{ _id }}>
                          Borrar Servidor
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem
                          onClick={() => {
                            setUpdate(true);
                            handleOpenServer();
                          }}
                          data={{ _id }}
                        >
                          Actualizar Servidor
                        </MenuItem>
                      </>
                    )}
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
                className='bg-primary p-0.5 py-1 w-10 h-10 group z-0 rounded-2xl hover:rounded-lg flex justify-center items-center relative'
                onClick={handleOpenCreate}
              >
                <div className='bg-dark-02 text-xs rounded-lg w-fit p-1.5 items-center h-8 ml-12 z-10 hidden group-hover:flex absolute top-1 left-0 tx-wlight whitespace-nowrap'>
                  Crear Servidor
                </div>
                <i className='material-icons'>add</i>
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
                  {SERVER}/api/
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
                      `${SERVER}/api/${mapServers[ID]?.invitation}`
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
              className={`pt-16 bg-gray-900 block w-40 overflow-hidden h-full ${
                !route.pathname.includes('@me') ? 'block' : 'hidden'
              }`}
              onClick={() => hideMenu()}
            >
              {Object.keys(id).length && namespaces.length ? (
                namespaces?.map(
                  ({ _id, name, category }) =>
                    !category && (
                      <div key={_id}>
                        <ContextMenuTrigger id={_id + '#'}>
                          <Link
                            key={_id}
                            href={`/channels/${idServer}/${_id}`}
                            passHref
                          >
                            <div className='w-full pl-2'>
                              <span className='tx-nlight cursor-pointer align-middle flex items-center'>
                                <i
                                  className='material-icons text-sm pr-2'
                                  style={{
                                    fontSize: '14px'
                                  }}
                                >
                                  east
                                </i>
                                <p className='truncate text-base'>{name}</p>
                              </span>
                            </div>
                          </Link>
                        </ContextMenuTrigger>
                        {isCreator && (
                          <ContextMenu id={_id + '#'}>
                            <MenuItem
                              onClick={() => {
                                setUpdate(true);
                                handleOpenNamespace();
                              }}
                              data={{ _id }}
                            >
                              Actualizar espacio
                            </MenuItem>
                            <MenuItem divider />
                            <MenuItem
                              onClick={handleDeleteNamespace}
                              data={{ _id }}
                            >
                              Borrar espacio
                            </MenuItem>
                          </ContextMenu>
                        )}
                      </div>
                    )
                )
              ) : (
                <div className='tx-wlight flex justify-center'>
                  <i
                    className='material-icons spin'
                    style={{ fontSize: '36px' }}
                  >
                    refresh
                  </i>
                </div>
              )}
              {Object.keys(id).length && categories.length ? (
                categories?.map(({ _id, name }) => (
                  <div key={_id}>
                    <ContextMenuTrigger id={_id + '#'}>
                      <div className='w-full pt-2 pb-1 pl-1 text-base'>
                        <span className='tx-nlight cursor-pointer align-middle flex items-center'>
                          <i
                            className='material-icons text-sm pr-1'
                            style={{
                              fontSize: '14px',
                              width: '14px',
                              height: '14px'
                            }}
                          >
                            south
                          </i>
                          <p className='uppercase text-sm truncate'>{name}</p>
                        </span>
                      </div>
                    </ContextMenuTrigger>
                    {isCreator && (
                      <ContextMenu id={_id + '#'}>
                        <MenuItem
                          onClick={() => {
                            setUpdate(true);
                            handleOpenCategory;
                          }}
                          data={{ _id }}
                        >
                          Actualizar categoría
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem onClick={handleDeleteCategory} data={{ _id }}>
                          Borrar categoría
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem
                          onClick={handleCreateNamespaceOfCategory}
                          data={{ category: _id }}
                        >
                          Crear espacio de esta categoría
                        </MenuItem>
                      </ContextMenu>
                    )}
                    {Object.keys(id).length && namespaces.length ? (
                      namespaces?.map(
                        ({ _id: idNamespace, name, category }) =>
                          category === _id && (
                            <div key={idNamespace}>
                              <ContextMenuTrigger id={idNamespace + '#'}>
                                <Link
                                  href={`/channels/${idServer}/${idNamespace}`}
                                  passHref
                                >
                                  <div className='w-full pl-3.5'>
                                    <span className='tx-nlight cursor-pointer align-middle flex items-center'>
                                      <i
                                        className='material-icons pr-2'
                                        style={{
                                          fontSize: '14px'
                                        }}
                                      >
                                        east
                                      </i>
                                      <p className='truncate text-base'>
                                        {name}
                                      </p>
                                    </span>
                                  </div>
                                </Link>
                              </ContextMenuTrigger>
                              {isCreator && (
                                <ContextMenu id={idNamespace + '#'}>
                                  <MenuItem
                                    onClick={() => {
                                      setUpdate(true);
                                      handleOpenNamespace();
                                    }}
                                    data={{ _id: idNamespace }}
                                  >
                                    Actualizar espacio
                                  </MenuItem>
                                  <MenuItem divider />
                                  <MenuItem
                                    onClick={handleDeleteNamespace}
                                    data={{ _id: idNamespace }}
                                  >
                                    Borrar espacio
                                  </MenuItem>
                                </ContextMenu>
                              )}
                            </div>
                          )
                      )
                    ) : (
                      <div>
                        <p className='tx-nlight'>espacios...</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>
                  <p className='tx-nlight'>categorías...</p>
                </div>
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
            {isCreator && (
              <>
                <MenuItem divider />
                <MenuItem
                  onClick={handleOpenNamespace}
                  data={{ _id: idServer }}
                >
                  Crear espacio de chat
                </MenuItem>
                <MenuItem onClick={handleOpenCategory} data={{ _id: idServer }}>
                  Crear categoría
                </MenuItem>
              </>
            )}
          </ContextMenu>
        </div>
      </aside>
      <main className='grow flex max-h-screen flex-col h-full'>{children}</main>
      <section
        className={`w-40 bg-ndark left-to-right transition-all ${
          !route.pathname.includes('@me') ? 'block' : 'hidden'
        }`}
      >
        <div className='flex flex-col items-center justify-start h-full'>
          <p className='tx-nlight text-base pt-4'>Usuarios</p>
          <div className='pt-6 tx-nlight' />
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
                  <span className='tx-wlight truncate'>{el.name}</span>
                  <div className='w-full flex items-center justify-between'>
                    <i
                      className={`material-icons ${
                        el.state === 'connected'
                          ? 'text-green-800'
                          : 'text-gray-800'
                      }`}
                      style={{ fontSize: '14px' }}
                    >
                      radio_button_checked
                    </i>
                    <p
                      className={`${
                        el.state === 'connected'
                          ? 'text-green-700'
                          : 'text-gray-700'
                      } text-sm pl-1`}
                    >
                      {el.state === 'connected' ? 'conectado' : 'desconectado'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='tx-wlight flex justify-center'>
              <i className='material-icons spin' style={{ fontSize: '36px' }}>
                refresh
              </i>
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

export default Aside;
