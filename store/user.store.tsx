import {
  createContext,
  FC,
  useEffect,
  Dispatch,
  useReducer,
  useState
} from 'react';
import { IUser, UserActions, UserTypes } from './types/user.types';
import { EXPRESS, SOCKET } from '@services/enviroments';
import { useSession } from 'next-auth/react';
import { usersReducer } from './reducers/user.reducer';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ClientEvents, ServerEvents, UserID } from '../events';
import { io, Socket } from 'socket.io-client';

export type InitialUserState = {
  users: IUser[];
  mapUsers: { [key: string]: IUser };
  change?: boolean;
  loading?: boolean;
  error?: boolean;
  msg?: string;
};

export const initialState = {
  users: [] as IUser[],
  mapUsers: {} as { [key: string]: IUser },
  change: false,
  loading: false,
  error: false,
  msg: ''
};

const UsersContext = createContext<{
  state: InitialUserState;
  dispatch: Dispatch<UserActions>;
  readUsers: () => void;
  disconnectUser: () => void;
  // handleIdUser: (user: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  readUsers: () => null,
  disconnectUser: () => null
  // handleIdUser: () => null
});

export const UsersProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);
  const [connect, setConnect] = useState(false);
  const [socket, setSocket] = useState<Socket<ServerEvents, ClientEvents>>(
    null as any
  );
  const {
    query: { server },
    ...route
  } = useRouter();
  const { data: session } = useSession();

  // const handleIdUser = (user: string) => {
  //   localStorage.setItem('id-user', user);
  //   dispatch({ type: UserTypes.CHANGE_ID, payload: user });
  // };

  const readUsers = async () => {
    const _id = session?.user._id;
    // console.log(_id, state.users.length, server);
    if (!_id || !server) return;

    try {
      const res = await axios.get(
        `${EXPRESS}/api/user-servers/@server/${server}`
      );
      const data: { msg: string; _users: IUser[] } = res.data;

      // console.log(data._users);
      dispatch({
        type: UserTypes.READ,
        payload: data._users
      });
    } catch (err) {
      console.error(err);
    }
  };

  const connectUser = async () => {
    const _id = session?.user._id;
    await axios.patch(`${EXPRESS}/api/users/${_id}`, {
      state: 'connected'
    });
    setConnect(true);
    socket.emit('user:connect', _id as UserID, (res) => {});
  };

  const disconnectUser = async () => {
    const _id = session?.user._id;
    await axios.patch(`${EXPRESS}/api/users/${_id}`, {
      state: 'disconnected'
    });

    socket.emit('user:disconnect', _id as UserID, (res) => {});
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('user:connect', (user: UserID) => {
      dispatch({
        type: UserTypes.CONNECT,
        payload: user
      });
    });

    socket.on('user:disconnect', (user: UserID) => {
      dispatch({
        type: UserTypes.DISCONNECT,
        payload: user
      });
    });

    return () => {
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, socket]);

  useEffect(() => {
    if (!server || !socket) return;

    readUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server, socket]);

  useEffect(() => {
    const manager = io(`${SOCKET}/lerchat-gn`);
    setSocket(manager);

    return () => {
      if (socket) socket.close();
      manager.close();
      // setSocket(null as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket || !session || session.user.state === 'connected' || connect)
      return;

    connectUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, session]);

  return (
    <UsersContext.Provider
      value={{
        state,
        dispatch,
        readUsers,
        disconnectUser
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersContext;
