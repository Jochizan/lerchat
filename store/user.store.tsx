import {
  createContext,
  FC,
  useEffect,
  Dispatch,
  useReducer,
  useContext
} from 'react';
import { IUser, UserActions, UserTypes } from './types/user.types';
import { EXPRESS, SOCKET } from '@services/enviroments';
import { useSession } from 'next-auth/react';
import { usersReducer } from './reducers/user.reducer';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ClientEvents, ServerEvents, UserID } from '../events/events';
import { SocketContext } from './socket.store';
// import { io, Socket } from 'socket.io-client';

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
  readUsers: (_id: string) => void;
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
  const {
    query: { server },
    ...route
  } = useRouter();
  // const socket: Socket<ServerEvents, ClientEvents> = io(`${SOCKET}/lerchat-gn`);
  const { socket } = useContext(SocketContext);
  const { data: session } = useSession();

  // const handleIdUser = (user: string) => {
  //   localStorage.setItem('id-user', user);
  //   dispatch({ type: UserTypes.CHANGE_ID, payload: user });
  // };

  const readUsers = async () => {
    const _id = session?.user._id;
    if (!_id || state.users.length !== 0 || !server) return;

    try {
      connectUser();
      const res = await axios.get(
        `${EXPRESS}/api/user-servers/@server/${server}`
      );
      const data: { msg: string; _users: IUser[] } = res.data;

      console.log(data._users);
      dispatch({
        type: UserTypes.READ,
        payload: data._users
      });

      socket.emit('user:connect', _id as UserID, (res) => {
        console.log(res);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const connectUser = async () => {
    const _id = session?.user._id;
    const res = await axios.patch(`${EXPRESS}/api/users/${_id}`, {
      state: 'connected'
    });
    // console.log(res);
  };

  const disconnectUser = () => {
    const _id = session?.user._id;
    // const res = await axios.patch(`${EXPRESS}/api/users/${_id}`, {
    //   state: 'disconnected'
    // });
    // console.log(res);

    socket.emit('user:disconnect', _id as UserID, (res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    socket.on('user:connect', (user: UserID) => {
      console.log(user);
      dispatch({
        type: UserTypes.CONNECT,
        payload: user
      });
    });

    socket.on('user:disconnect', (user: UserID) => {
      console.log(user);
      dispatch({
        type: UserTypes.DISCONNECT,
        payload: user
      });
    });

    // window.addEventListener('beforeunload', (e) => {
    //   e.preventDefault();
    //   e.returnValue = '';
    // });
  
    // return () => {
    //   window.removeEventListener('beforeunload', (e) => {
    //     e.preventDefault();
    //     e.returnValue = '';
    //   });
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (state.users.length !== 0 && !server) return;

    readUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, server]);

  useEffect(() => {
    return () => {
      socket.disconnect();
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
