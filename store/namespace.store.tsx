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

export type InitialNamespaceState = {
  id: string | null | undefined;
  namespaces: INamespace[];
  mapNamespaces: { [key: string]: INamespace };
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
  const [state, dispatch] = useReducer(namespaceReducer, initialState);
  const {
    state: { id: idServer, change }
    // dispatch: dispatchServer
  } = useContext(ServerContext);

  const handleIdNamespace = (namespace: string) => {
    if (!namespace) return;
    localStorage.setItem('id-namespace', namespace);
    dispatch({ type: NamespaceTypes.CHANGE_ID, payload: namespace });
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

      if (data.docs) {
        dispatch({ type: NamespaceTypes.READ, payload: data.docs });
        handleIdNamespace(data.docs[0]._id);
        // dispatchServer({ type: ServerTypes.CHANGE, payload: false });
        if (change) push(`/channels/${server}/${data.docs[0]._id}`);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const createNamespace = async (namespace: INamespace) => {};
  const updateNamespace = async (_id: string, namespace: INamespace) => {};
  const deleteNamespace = async (_id: string) => {};

  // useEffect(() => {
  //   readNamespaces(idServer as string, change);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [idServer]);

  useEffect(() => {
    if (state.namespaces.length !== 0 || route.pathname.includes('@me'))
      return;

    readNamespaces(idServer as string, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(query);

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
