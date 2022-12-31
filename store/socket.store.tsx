import { useRouter } from 'next/router';
import { createContext, FC, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientEvents, ServerEvents } from '@events/events';
import {  SOCKET } from '@services/enviroments';

export const SocketContext = createContext<{
  socket: Socket<ServerEvents, ClientEvents>;
  // connect: () => void;
  disconnect: () => void;
  emit: (event: string, data: any) => void;
  on: (event: string, cb: (data: any) => void) => void;
  changeServer: (server: string) => void;
}>({
  socket: null as any,
  // connect: () => null,
  disconnect: () => null,
  emit: () => null,
  on: () => null,
  changeServer: () => null
});

export const SocketProvider: FC = ({ children }) => {
  // const [socket, setSocket] = useState<Socket<ServerEvents, ClientEvents>>(
  //   null as any
  // );
  const {
    query: { server }
  } = useRouter();
  // const { data: session } = useSession();

  const socket = io(`${SOCKET}/server-${server}`, {
    reconnectionDelayMax: 10000,
    query: {
      // token: session?.user._id
    }
  });

  const disconnect = () => {
    if (socket) socket.disconnect();
  };

  const emit = (event: any, data: any) => {
    if (socket) socket.emit(event, data);
  };

  const on = (event: any, cb: (data: any) => void) => {
    if (socket) socket.on(event, cb);
  };

  const changeServer = (server: string) => {
    if (socket) {
      socket.close();
      const manager = io(`${SOCKET}/server-${server}`);
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        // connect,
        disconnect,
        changeServer,
        emit,
        on
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
