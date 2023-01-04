import {
  createContext,
  FC,
  useEffect,
  Dispatch,
  useReducer,
  useState
} from 'react';
import { IServer, ServerActions, ServerTypes } from './types/server.types';
import { EXPRESS, SOCKET } from '@services/enviroments';
import { useSession } from 'next-auth/react';
import { serverReducer } from './reducers/server.reducer';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ClientEvents, ServerEvents, UserID } from '@events/index';
import { io, Socket } from 'socket.io-client';

export type InitialServerState = {
  id: string | null | undefined;
  servers: IServer[];
  mapServers: { [key: string]: IServer };
  users: UserID[];
  change?: boolean;
  loading?: boolean;
  error?: boolean;
  msg?: string;
};

export const initialState = {
  id:
    typeof window !== 'undefined' ? localStorage.getItem('id-server') + '' : '',
  servers: [] as IServer[],
  mapServers: {} as { [key: string]: IServer },
  users: [] as string[],
  change: false,
  loading: false,
  error: false,
  msg: ''
};

const ServerContext = createContext<{
  state: InitialServerState;
  socket: Socket<ServerEvents, ClientEvents>;
  dispatch: Dispatch<ServerActions>;
  createServer: (server: IServer) => void;
  updateServer: (_id: string, server: IServer) => void;
  deleteServer: (_id: string) => void;
  handleIdServer: (server: string) => void;
  getCodeInvitation: (_id: string) => void;
}>({
  state: initialState,
  socket: null as any,
  dispatch: () => null,
  createServer: () => null,
  updateServer: () => null,
  deleteServer: () => null,
  handleIdServer: () => null,
  getCodeInvitation: () => null
});

export const ServerProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(serverReducer, initialState);
  const [socket, setSocket] = useState<Socket<ServerEvents, ClientEvents>>(
    null as any
  );
  const { push } = useRouter();
  const {
    query: { server }
  } = useRouter();
  const { data: session } = useSession();
  // const socket: Socket<ServerEvents, ClientEvents> = io(
  // `${SOCKET}/server-${server}`
  // );

  const handleIdServer = (server: string) => {
    localStorage.setItem('id-server', server);
    dispatch({ type: ServerTypes.CHANGE_ID, payload: server });
  };

  const readServers = async () => {
    const _id = session?.user._id;
    if (!_id || state.servers.length !== 0) return;

    try {
      const res = await axios.get(`${EXPRESS}/api/servers/@me/${_id}`);
      const data: { msg: string; _servers: IServer[] } = res.data;

      if (data._servers)
        dispatch({ type: ServerTypes.READ, payload: data._servers });
    } catch (err) {
      console.error(err);
    }
  };

  const getCodeInvitation = async (_id: string) => {
    if (!_id) return;

    const { data }: { data: { msg: string; url: string } } = await axios.get(
      `${EXPRESS}/api/servers/invitation/${_id}`
    );

    console.log(data);

    dispatch({
      type: ServerTypes.GET_LINK,
      payload: { url: data.url, id: _id }
    });
  };

  const createServer = async (data: IServer) => {
    const newServer = { ...session?.user, name: data.name };
    delete newServer['state'];
    try {
      const { data }: { data: { msg: string; _server: IServer } } =
        await axios.post(`${EXPRESS}/api/servers`, newServer);

      dispatch({ type: ServerTypes.CREATE, payload: data._server });
    } catch (err) {
      console.error(err);
    }
  };

  const updateServer = async (_id: string, server: IServer) => {
    try {
      const { data }: { data: { msg: string; _server: IServer } } =
        await axios.patch(`${EXPRESS}/api/servers/${_id}`, server);

      dispatch({ type: ServerTypes.UPDATE, payload: data._server });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteServer = async (_id: string) => {
    try {
      const { data }: { data: { msg: string; _id: string } } =
        await axios.delete(`${EXPRESS}/api/servers/${_id}`);

      dispatch({ type: ServerTypes.DELETE, payload: _id });
      push('/channels/@me');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!(state.id !== server)) return;

    handleIdServer(server as string);

    const manager = io(`${SOCKET}/server-${server}`);
    setSocket(manager);

    return () => {
      manager.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server]);

  useEffect(() => {
    if (state.servers.length !== 0) return;

    readServers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    const manager = io(`${SOCKET}/server-${server}`);
    setSocket(manager);

    return () => {
      if (socket) socket.close();
      manager.close();
      // setSocket(null as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ServerContext.Provider
      value={{
        state,
        socket,
        dispatch,
        handleIdServer,
        getCodeInvitation,
        createServer,
        updateServer,
        deleteServer
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export default ServerContext;
