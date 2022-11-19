import { useEffect, FC, useReducer, createContext, Dispatch } from 'react';
import {
  MessageLocalTypes,
  MessageActions,
  MessageTypes,
  IMessage
} from './types/message.types';
import { messageReducer } from './reducers/message.reducers';
import { ClientEvents, ServerEvents } from '../events/events';
import { EXPRESS, SOCKET } from '@services/enviroments';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';

export type InitialMessageState = {
  messages: IMessage[];
  type: MessageLocalTypes;
  loading?: boolean;
  error?: boolean;
  msg?: string;
};

export const initialState = {
  messages: [] as IMessage[],
  type:
    (typeof window !== 'undefined' &&
      (localStorage.getItem('message-context') as MessageLocalTypes)) ||
    MessageLocalTypes.NAMESPACE,
  loading: false,
  error: false,
  msg: ''
};

export const MessageContext = createContext<{
  state: InitialMessageState;
  dispatch: Dispatch<MessageActions>;
  createMessage: (content: string) => void;
  updateMessage: (_id: string, content: string) => void;
  deleteMessage: (_id: string) => void;
  readMessagesOfPage: (page: number) => void;
}>({
  state: initialState,
  dispatch: () => null,
  createMessage: () => null,
  updateMessage: () => null,
  deleteMessage: () => null,
  readMessagesOfPage: () => null
});

export const MessageProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);
  const { id: namespace } = useRouter().query;
  const socket: Socket<ServerEvents, ClientEvents> = io(
    `${SOCKET}/${namespace}`
  );
  const { data: session } = useSession();

  useEffect(() => {
    readMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace]);

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const readMessages = async () => {
    if (!namespace) return;
    const { data }: { data: { msg: string; docs: IMessage[] } } =
      await axios.get(`${EXPRESS}/api/messages/${namespace}?page=1&size=10`);
    dispatch({ type: MessageTypes.READ, payload: data.docs });
  };

  const readMessagesOfPage = async (page: number) => {
    if (!namespace) return;
    const { data }: { data: { msg: string; docs: IMessage[] } } =
      await axios.get(
        `${EXPRESS}/api/messages/${namespace}?page=${page}&size=10`
      );
    dispatch({ type: MessageTypes.READ_OF_PAGE, payload: data.docs });
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
      author: session?.user
    };

    socket.emit('message:create', _message, (res) => {
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
      author: session?.user
    };

    socket.emit('message:update', _message, (res) => {
      if ('error' in res) return new Error('Error in update Message');

      dispatch({ type: MessageTypes.UPDATE, payload: _message as IMessage });
    });
  };

  const deleteMessage = async (_id: string) => {
    const { data }: { data: { msg: string; _id: IMessage } } =
      await axios.delete(`${EXPRESS}/api/messages/${_id}`);
    console.log(data);

    socket.emit('message:delete', _id, (res) => {
      if ('error' in res) return new Error('Error in delete Message');

      dispatch({ type: MessageTypes.DELETE, payload: _id });
    });
  };

  return (
    <MessageContext.Provider
      value={{
        state,
        dispatch,
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
