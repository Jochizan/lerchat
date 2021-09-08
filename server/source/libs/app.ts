import { Server as HttpServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import { ClientEvents, ServerEvents } from './events/message.events';
import { MessageRepository } from './messages/message.repository';
import createMessageHandlers from './messages/message.handlers';

export interface Components {
  messageRepository: MessageRepository;
}

export function createApplication(
  httpServer: HttpServer,
  components: Components,
  serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

  io.on('connection', (socket) => {
    const {
      createMessage,
      updateMessage,
      deleteMessage,
      readMessage,
      listMessage
    } = createMessageHandlers(components, socket);

    socket.on('message:create', createMessage);
    socket.on('message:read', readMessage);
    socket.on('message:update', updateMessage);
    socket.on('message:delete', deleteMessage);
    socket.on('message:list', listMessage);
  });

  return io;
}
