import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { IMessage } from '../interfaces/store.interfaces';
import { ClientEvents, ServerEvents } from '../events/events';

export const useMessages = (namespace: string) => {
  const socket: Socket<ServerEvents, ClientEvents> = io(
    `http://localhost:5500/${namespace}`
  );
  const [messages, setMessages] = useState<IMessage[]>([]);

  socket.on('disconnect', () => {});

  socket.on('message:created', (message) => {
    setMessages([...messages, message]);
  });

  socket.on('message:updated', (message) => {
    const existingMessage = messages.find((t) => t._id === message._id);

    if (existingMessage) {
      existingMessage.message = message.message;
    }
  });

  socket.on('message:deleted', (id) => {
    const index = messages.findIndex((t) => {
      return t._id === id;
    });

    if (index !== -1) {
      messages.splice(index, 1);
    }
  });

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('message:list', namespace, (res) => {
        if ('error' in res) {
          // handle the error
          return console.log(res);
        }
        setMessages(res.data);
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect', () => {
        setMessages([]);
      });
      socket.off('message');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace]);

  const addMessage = (message: string) => {
    socket.emit('message:create', { message, namespace }, (res) => {
      if ('error' in res) {
        return new Error('Error in create Message');
      }

      setMessages([...messages, { _id: res.data, message, namespace }]);
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
