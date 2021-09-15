import { Components } from '../app';
import { Socket } from 'socket.io';
import IMessage from '../../interfaces/message';
import { sanitizeErrors } from '../errors/message.errors';
import { MessageID, NamespaceID } from './repository';
import { ClientEvents, Response, ServerEvents } from '../events/message.events';

const handlerMessages = (
  components: Components,
  socket: Socket<ClientEvents, ServerEvents>
) => {
  const { messageRepository } = components;

  return {
    createMessage: async (
      payload: IMessage,
      callback: (res: Response<MessageID>) => void
    ) => {
      try {
        const _message = await messageRepository.create(payload);

        callback({
          data: _message.id
        });

        socket.broadcast.emit('message:created', _message);
      } catch (err) {
        return callback({
          error: sanitizeErrors(err as string)
        });
      }
    },

    readMessage: async (
      id: MessageID,
      callback: (res: Response<IMessage>) => void
    ) => {
      try {
        const message = await messageRepository.getById(id);

        callback({
          data: message
        });
      } catch (err) {
        callback({
          error: sanitizeErrors(err as string)
        });
      }
    },

    updateMessage: async (
      payload: IMessage,
      callback: (res?: Response<void>) => void
    ) => {
      try {
        await messageRepository.updateById(payload, payload.id);

        callback();

        socket.broadcast.emit('message:updated', payload);
      } catch (err) {
        return callback({
          error: sanitizeErrors(err as string)
        });
      }
    },

    deleteMessage: async (
      id: MessageID,
      callback: (res?: Response<void>) => void
    ) => {
      try {
        await messageRepository.deleteById(id);

        callback();

        socket.broadcast.emit('message:deleted', id);
      } catch (err) {
        return callback({
          error: sanitizeErrors(err as string)
        });
      }
    },

    listMessage: async (
      id: NamespaceID,
      callback: (res: Response<IMessage[]>) => void
    ) => {
      try {
        const data = await messageRepository.getAll(id);

        callback({
          data
        });
      } catch (err) {
        console.log(err);
        callback({
          error: sanitizeErrors(err as string)
        });
      }
    }

    // typing: async (callback: (res: Response<User[]>) => void) => {
    //   try {
    //     callback({
    //       data: await messageRepository.typing(id)
    //     });
    //   } catch (err) {
    //     callback({
    //       error: sanitizeErrorMessage(err as string)
    //     });
    //   }
    // }
  };
};

export default handlerMessages;
