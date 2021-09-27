import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { IMessage } from '../interfaces/store.interfaces';
import { ClientEvents, ServerEvents } from '../events/events';
import { EXPRESS, SOCKET } from '@services/enviroments';

export const useMessages = (
  namespace: string,
  author: string = '61512a876e4ecd13a1836597'
) => {
  const socket: Socket<ServerEvents, ClientEvents> = io(
    `${SOCKET}/${namespace}`
  );

  const [messages, setMessages] = useState<IMessage[]>([]);

  const getMessages = async () => {
    const res = await fetch(`${EXPRESS}/api/messages/${namespace}`);
    const data = await res.json();
    console.log(data);
    setMessages(data.docs);
  };

  console.log(messages);

  useEffect(() => {
    socket.on('message:created', (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    socket.on('connect', () => {
      //   socket.emit('user:connect', author);
    });

    if (!namespace) return;

    getMessages();

    return () => {
      socket.off('connect');
      socket.off('disconnect', () => {
        setMessages([]);
        // socket.emit('user:disconnect', author);
      });
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace]);

  // socket.on('message:updated', (message) => {
  //   const existingMessage = messages.find((t) => t._id === message._id);

  //   if (existingMessage) {
  //     existingMessage.message = message.message;
  //   }
  // });

  // socket.on('message:deleted', (id) => {
  //   const index = messages.findIndex((t) => {
  //     return t._id === id;
  //   });

  //   if (index !== -1) {
  //     messages.splice(index, 1);
  //   }
  // });

  const addMessage = async (content: string) => {
    const res = await fetch(`${EXPRESS}/api/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content, namespace, author })
    });
    const data: { msg: string; _message: IMessage } = await res.json();
    console.log(data);

    socket.emit('message:create', data._message, (res) => {
      if ('error' in res) {
        return new Error('Error in create Message');
      } else {
        setMessages([...messages, data._message]);
      }
    });
  };

  // const updateMessage = (message: string, id: ObjectId) => {
  //   socket.emit('message:update', { message, id }, (res) => {
  //     if (res && 'error' in res) {
  //       return new Error('Error in update Message');
  //     }

  //     setMessages(
  //       messages.map((msg) => (msg.id === id ? { message, id } : msg))
  //     );
  //   });
  // };

  // const removeMessage = (message: IMessage) => {
  //   setMessages(messages.splice(messages.indexOf(message), 1));
  //   socket.emit('message:delete', message.id, (res) => {
  //     if (res && 'error' in res) {
  //       console.log(res);
  //     }
  //   });
  // };

  return { messages, addMessage };
};
