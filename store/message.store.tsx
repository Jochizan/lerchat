import { FC, useEffect, useReducer, createContext, Dispatch } from 'react';
import {
  MessageLocalTypes,
  MessageActions,
  MessageTypes,
  IMessage
} from './types/message.types';
import { messageReducer } from './reducers/message.reducers';
import { EXPRESS, SOCKET } from '@services/enviroments';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ClientEvents, NamespaceID, ServerEvents } from '@events/events';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

export type InitialMessageState = {
  messages: IMessage[];
  type: MessageLocalTypes;
  hasNextPage: boolean;
  page: number;
  loading: boolean;
  error: boolean;
  msg?: string;
};

export const initialState = {
  messages: [] as IMessage[],
  type:
    (typeof window !== 'undefined' &&
      (localStorage.getItem('message-context') as MessageLocalTypes)) ||
    MessageLocalTypes.NAMESPACE,
  hasNextPage: true,
  loading: false,
  error: false,
  page: 1,
  msg: ''
};

export const MessageContext = createContext<{
  state: InitialMessageState;
  dispatch: Dispatch<MessageActions>;
  readMessages: () => void;
  createMessage: (content: string) => void;
  updateMessage: (_id: string, content: string) => void;
  deleteMessage: (_id: string) => void;
  readMessagesOfPage: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  readMessages: () => null,
  createMessage: () => null,
  updateMessage: () => null,
  deleteMessage: () => null,
  readMessagesOfPage: () => null
});

export const MessageProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);
  const { id: namespace } = useRouter().query;
  const { data: session } = useSession();
  const socket: Socket<ServerEvents, ClientEvents> = io(
    `${SOCKET}/namespace-${namespace}`
  );

  const readMessages = async () => {
    if (!namespace) return;
    dispatch({
      type: MessageTypes.LOADING,
      payload: { loading: true, msg: 'Cargando...' }
    });
    const { data }: { data: { msg: string; docs: IMessage[] } } =
      await axios.get(`${EXPRESS}/api/messages/${namespace}?page=1&size=30`);
    dispatch({ type: MessageTypes.READ, payload: data.docs });
    dispatch({ type: MessageTypes.NEXT_PAGE, payload: 1 });
    dispatch({ type: MessageTypes.HAS_NEXT_PAGE, payload: true });
    dispatch({
      type: MessageTypes.LOADING,
      payload: { loading: false, msg: 'Finalizado' }
    });
  };

  const readMessagesOfPage = async () => {
    if (!namespace) return;
    dispatch({
      type: MessageTypes.LOADING,
      payload: { loading: true, msg: 'Cargando...' }
    });
    const { data }: { data: { msg: string; docs: IMessage[] } } =
      await axios.get(
        `${EXPRESS}/api/messages/${namespace}?page=${state.page + 1}&size=30`
      );
    dispatch({ type: MessageTypes.READ_OF_PAGE, payload: data.docs });
    if (data.docs.length < 30) {
      dispatch({ type: MessageTypes.HAS_NEXT_PAGE, payload: false });
    }
    dispatch({ type: MessageTypes.NEXT_PAGE, payload: state.page + 1 });
    dispatch({
      type: MessageTypes.LOADING,
      payload: { loading: false, msg: 'Finalizado' }
    });
  };

  const createMessage = async (content: string) => {
    const { data }: { data: { msg: string; _message: IMessage } } =
      await axios.post(`${EXPRESS}/api/messages`, {
        content,
        namespace,
        author: session?.user._id
      });

    const _message = {
      content,
      namespace,
      _id: data._message._id,
      author: session?.user,
      createdAt: data._message.createdAt
    };

    socket.emit('message:create', _message as IMessage, (res) => {
      if ('error' in res) return new Error('Error in create Message');

      dispatch({ type: MessageTypes.CREATE, payload: _message as IMessage });
    });
  };

  const updateMessage = async (_id: string, content: string) => {
    const { data }: { data: { msg: string; _message: IMessage } } =
      await axios.patch(`${EXPRESS}/api/messages/${_id}`, {
        content
      });

    const _message = {
      _id,
      content,
      namespace,
      author: session?.user,
      createdAt: data._message.createdAt,
      updatedAt: data._message.updatedAt
    };

    socket.emit('message:update', _message as IMessage, (res) => {
      if ('error' in res) return new Error('Error in update Message');

      dispatch({ type: MessageTypes.UPDATE, payload: _message as IMessage });
    });
  };

  const deleteMessage = async (_id: string) => {
    const { data }: { data: { msg: string; _id: IMessage } } =
      await axios.delete(`${EXPRESS}/api/messages/${_id}`);
    // console.log(data);

    socket.emit(
      'message:delete',
      { _id, namespace } as { namespace: NamespaceID; _id: NamespaceID },
      (res) => {
        if ('error' in res) return new Error('Error in delete Message');

        dispatch({ type: MessageTypes.DELETE, payload: _id });
      }
    );
  };

  useEffect(() => {
    socket.on('message:created', (message) => {
      dispatch({ type: MessageTypes.CREATE, payload: message });
    });

    socket.on('message:updated', (message) => {
      dispatch({ type: MessageTypes.UPDATE, payload: message });
    });

    socket.on('message:deleted', (_id) => {
      dispatch({ type: MessageTypes.DELETE, payload: _id });
    });

    return () => {
      socket.off();
      // console.log(socket);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    return () => {
      socket.disconnect();
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    readMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace]);

  return (
    <MessageContext.Provider
      value={{
        state,
        dispatch,
        readMessages,
        createMessage,
        updateMessage,
        deleteMessage,
        readMessagesOfPage
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
