import { namespaceReducer } from './reducers/namespace.reducer';
import {
  INamespace,
  NamespaceActions,
  NamespaceTypes
} from './types/namespace.types';
import {
  createContext,
  useEffect,
  useReducer,
  useContext,
  Dispatch,
  FC
} from 'react';
import { EXPRESS } from '@services/enviroments';
import { useRouter } from 'next/router';
import axios from 'axios';
import ServerContext from './server.store';
import { useSession } from 'next-auth/react';
import { IUserServer } from './types/user.types';

export type InitialNamespaceState = {
  id: string | null | undefined;
  namespaces: INamespace[];
  mapNamespaces: { [key: string]: INamespace };
  namespacesWithCategory: INamespace[];
  loading?: boolean;
  error?: boolean;
  msg?: string;
};

export const initialState = {
  id:
    typeof window !== 'undefined'
      ? localStorage.getItem('id-namespace') + ''
      : '',
  namespaces: [] as INamespace[],
  namespacesWithCategory: [] as INamespace[],
  mapNamespaces: {} as { [key: string]: INamespace },
  loading: false,
  error: false,
  msg: ''
};

const NamespaceContext = createContext<{
  state: InitialNamespaceState;
  dispatch: Dispatch<NamespaceActions>;
  readNamespaces: (server: string, change: boolean) => void;
  createNamespace: (namespace: INamespace) => void;
  updateNamespace: (_id: string, namespace: INamespace) => void;
  deleteNamespace: (_id: string) => void;
  handleIdNamespace: (namespace: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  readNamespaces: () => null,
  createNamespace: () => null,
  updateNamespace: () => null,
  deleteNamespace: () => null,
  handleIdNamespace: () => null
});

export const NamespaceProvider: FC = ({ children }) => {
  const { push } = useRouter();
  const { query, ...route } = useRouter();
  const { data: session } = useSession();
  const [state, dispatch] = useReducer(namespaceReducer, initialState);
  const { socket } = useContext(ServerContext);

  const {
    state: { id: idServer, change }
  } = useContext(ServerContext);

  const handleIdNamespace = async (namespace: string) => {
    if (!query.server) return;

    const res = await axios.patch(
      `${EXPRESS}/api/user-servers/${query.server}/${session?.user._id}`,
      { namespace }
    );
    const { msg, _userServer }: { msg: string; _userServer: IUserServer } =
      res.data;

    localStorage.setItem('id-namespace', _userServer.namespace);
    dispatch({
      type: NamespaceTypes.CHANGE_ID,
      payload: _userServer.namespace
    });
    push(`/channels/${idServer}/${namespace}`);
  };

  const readIdNamespace = async (idServer: string) => {
    if (!idServer) return;
    if (!session?.user) return;

    const res = await axios.get(
      `${EXPRESS}/api/user-servers/${idServer}/${session?.user._id}`
    );
    const { msg, _userServer }: { msg: string; _userServer: IUserServer } =
      res.data;

    localStorage.setItem('id-namespace', _userServer.namespace);
    dispatch({
      type: NamespaceTypes.CHANGE_ID,
      payload: _userServer.namespace
    });
    return _userServer.namespace;
  };

  const readNamespaces = async (
    server: string | null,
    change: boolean | undefined
  ) => {
    if (!server || server === 'notAccess') return;

    try {
      const res = await axios.get(
        `${EXPRESS}/api/namespaces/@server/${server}`
      );
      const data: { msg: string; docs: INamespace[] } = res.data;
      const namespace = await readIdNamespace(server);

      if (data.docs) {
        dispatch({ type: NamespaceTypes.READ, payload: data.docs });
        // console.log(query);
        if (!namespace) {
          push(`/channels/${server}/${data.docs[0]._id}`);
        } else {
          push(`/channels/${server}/${namespace}`);
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const createNamespace = async (namespace: INamespace) => {
    const newNamespace = { ...session?.user, ...namespace };
    try {
      const res = await axios.post(`${EXPRESS}/api/namespaces`, newNamespace);
      const data: { msg: string; _namespace: INamespace } = res.data;

      socket.emit('namespace:create', data._namespace, () => {
        if ('error' in res) return new Error('Error in create Namespace');

        dispatch({ type: NamespaceTypes.CREATE, payload: data._namespace });
        handleIdNamespace(data._namespace._id);
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const updateNamespace = async (_id: string, namespace: INamespace) => {
    try {
      const res = await axios.patch(
        `${EXPRESS}/api/namespaces/${_id}`,
        namespace
      );
      const data: { msg: string; _namespace: INamespace } = res.data;

      socket.emit('namespace:update', data._namespace, (res) => {
        if ('error' in res) return new Error('Error in update Namespace');

        dispatch({ type: NamespaceTypes.UPDATE, payload: data._namespace });
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const deleteNamespace = async (_id: string) => {
    try {
      const res = await axios.delete(`${EXPRESS}/api/namespaces/${_id}`);
      const data: { msg: string; _namespace: INamespace } = res.data;

      socket.emit('namespace:delete', _id, (res) => {
        if ('error' in res) return new Error('Error in delete namespace');

        dispatch({ type: NamespaceTypes.DELETE, payload: _id });
        if (_id === query.id)
          push(`/channels/${idServer}/${state.namespaces[0]._id}`);
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('namespace:created', (namespace) => {
      dispatch({ type: NamespaceTypes.CREATE, payload: namespace });
    });

    socket.on('namespace:updated', (namespace) => {
      dispatch({ type: NamespaceTypes.UPDATE, payload: namespace });
    });

    socket.on('namespace:deleted', (_id) => {
      dispatch({ type: NamespaceTypes.DELETE, payload: _id });
    });

    return () => {
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (state.namespaces.length !== 0 || route.pathname.includes('@me')) return;

    readNamespaces(idServer as string, true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (route.pathname.includes('@me')) return;
    readNamespaces(idServer as string, change);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idServer]);

  useEffect(() => {
    if (state.namespaces.length !== 0 || !route.pathname.includes('@me')) {
      handleIdNamespace(query.id as string);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id]);

  return (
    <NamespaceContext.Provider
      value={{
        state,
        dispatch,
        readNamespaces,
        createNamespace,
        updateNamespace,
        deleteNamespace,
        handleIdNamespace
      }}
    >
      {children}
    </NamespaceContext.Provider>
  );
};

export default NamespaceContext;
