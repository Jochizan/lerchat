import { createContext, FC, useEffect, Dispatch, useReducer } from 'react';
import { IServer, ServerActions, ServerTypes } from './types/server.types';
import { EXPRESS } from '@services/enviroments';
import { useSession } from 'next-auth/react';
import { serverReducer } from './reducers/server.reducer';
import axios from 'axios';
import { useRouter } from 'next/router';
import { UserID } from '@events/events';
// import { IUser } from './types/user.types';

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
  dispatch: Dispatch<ServerActions>;
  createServer: (server: IServer) => void;
  updateServer: (_id: string, server: IServer) => void;
  deleteServer: (_id: string) => void;
  handleIdServer: (server: string) => void;
  getCodeInvitation: (_id: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  createServer: () => null,
  updateServer: () => null,
  deleteServer: () => null,
  handleIdServer: () => null,
  getCodeInvitation: () => null
});

export const ServerProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(serverReducer, initialState);
  const {
    query: { server }
    // ...route
  } = useRouter();
  const { data: session } = useSession();

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
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   // socket.on('user:connect', (userID: UserID) => {
  //   //   dispatch({ type: ServerTypes.CONNECT, payload: userID });
  //   // });

  //   // socket.on('user:disconnect', (userID: UserID) => {
  //   //   dispatch({ type: ServerTypes.DISCONNECT, payload: userID});
  //   // });

  //   // console.log(state);

  //   return () => {
  //     // socket.off('user:connect');
  //   };

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state]);

  useEffect(() => {
    // socket.emit('user:connect', session?.user._id as UserID, (res) => {
    //   dispatch({ type: ServerTypes.CONNECT, payload: session?.user._id });
    // });

    return () => {
      // socket.emit(
      //   'user:disconnect',
      //   session?.user._id as UserID,
      //   (res: any) => {
      //     console.log(res);
      //   }
      // );
      // socket.on('user:disconnect', (server: IServer) => {
      //   dispatch({ type: ServerTypes.UPDATE, payload: server });
      // });
      // socket.off('user:connect');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!(state.id !== server)) return;

    handleIdServer(server as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server]);

  useEffect(() => {
    if (state.servers.length !== 0) return;

    readServers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <ServerContext.Provider
      value={{
        state,
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
