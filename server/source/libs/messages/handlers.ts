import { Components } from '../app';
import { Socket } from 'socket.io';
import IMessage from '../../interfaces/message';
import { sanitizeErrors } from '../errors/errors';
import { MessageID } from '../types';
import { ClientEvents, Response, ServerEvents } from '../events/events';

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
        const namespace = socket.nsp.name.slice(1);
        const _message = await messageRepository.create(payload, namespace);

        callback({
          data: _message.id
        });

        socket.broadcast.emit('message:created', _message);
      } catch (error) {
        return callback({
          msg: sanitizeErrors(error as string)
        });
      }
    },

    readMessage: async (
      id: MessageID,
      callback: (res: Response<IMessage>) => void
    ) => {
      try {
        const message = await messageRepository.readById(id);

        callback({
          data: message
        });
      } catch (error) {
        callback({
          msg: sanitizeErrors(error as string)
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
      } catch (error) {
        return callback({
          msg: sanitizeErrors(error as string)
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
      } catch (error) {
        return callback({
          msg: sanitizeErrors(error as string)
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
