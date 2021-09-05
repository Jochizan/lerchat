import { Server } from 'socket.io';
import http from 'http';

const chatController = (http: http.Server) => {
  const io = new Server(http, {
    cors: {
      origin: ['http://localhost:3000']
    }
  });

  io.on('connection', (socket) => {
    socket.on('send-message', (message) => {
      console.log('message from client =>', message, socket.id);
      socket.broadcast.emit('receive-message', message);
    });
  });
};

export default chatController;
