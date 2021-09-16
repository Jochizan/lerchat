import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { IMessage } from '../interfaces/store.interfaces';
import { ClientEvents, ServerEvents } from '../events/events';

export const useMessages = (
  namespace: string,
  author: string = '614263ff66b38891263bb846'
) => {
  const socket: Socket<ServerEvents, ClientEvents> = io(
    `http://localhost:5500/${namespace}`
  );

  const [messages, setMessages] = useState<IMessage[]>([]);

  const getMessages = async () => {
    const res = await fetch(`http://localhost:5500/api/messages/${namespace}`);
    const data = await res.json();
    setMessages(data._messages);
  };

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('user:connect', author);
    });

    socket.on('message:created', (message) => {
      getMessages();
    });

    if (namespace !== undefined) getMessages();

    return () => {
      socket.off('connect');
      socket.off('disconnect', () => {
        setMessages([]);
        socket.emit('user:disconnect', author);
      });
      socket.off('message');
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

  const addMessage = (message: string) => {
    socket.emit('message:create', { message, author }, (res) => {
      if ('error' in res) {
        return new Error('Error in create Message');
      }

      setMessages([
        ...messages,
        {
          _id: res.data,
          message,
          namespace,
          author
        }
      ]);
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
