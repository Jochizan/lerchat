import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../interfaces/store.interfaces';
import { ClientEvents, ServerEvents } from '../libs/events';

const socket: Socket<ServerEvents, ClientEvents> = io('http://localhost:5500');

// const mapMessage = (message: any) => {
//   return {
//     ...message,
//     editing: false,
//     synced: true
//   };
// };

const initialMessage: Message[] = [];

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessage);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('message:list', (res) => {
        if ('error' in res) {
          // handle the error
          return console.log(res);
        }
        setMessages(res.data);
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message:created', (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, [messages]);

  // this.socket.on('message:created', (message) => {
  //   this.messages.push(mapMessage(message));
  // });

  // this.socket.on('message:updated', (message) => {
  //   const existingMessage = this.messages.find((t) => {
  //     return t.id === message.id;
  //   });
  //   if (existingMessage) {
  //     existingMessage.message = message.message;
  //   }
  // });

  // this.socket.on('message:deleted', (id) => {
  //   const index = this.messages.findIndex((t) => {
  //     return t.id === id;
  //   });
  //   if (index !== -1) {
  //     this.messages.splice(index, 1);
  //   }
  // });

  // const remove = (message: Message) => {
  //   messages.splice(this.messages.indexOf(message), 1);
  //   this.socket.emit('message:delete', message.id, (res) => {
  //     if (res && 'error' in res) {
  //       console.log(res);
  //     }
  //   });
  // }

  const addMessage = (message: string) => {
    console.log(messages);

    socket.emit('message:create', { message }, (res) => {
      if ('error' in res) {
        // handle the error
        return console.log(res);
      }

      setMessages([...messages, { id: res.data, message }]);
    });
  };

  return { messages, addMessage };
};
