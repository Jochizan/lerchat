import { Server as HttpServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import { ClientEvents, ServerEvents } from './events/message.events';
import { MessageRepository } from './messages/repository';
import createMessageHandlers from './messages/handlers';
import { isValidObjectId } from 'mongoose';

isValidObjectId;
export interface Components {
  messageRepository: MessageRepository;
}

export function createApplication(
  httpServer: HttpServer,
  components: Components,
  serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

  io.of(/\w/).on('connection', (socket) => {
    socket.prependAny((event) => {
      console.log(event);
    });

    socket.on('testing:list', ({ username, romname }: any) => {
      console.log(username, romname);
    });

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
