import { Components } from '../app';
import { Socket } from 'socket.io';
import { sanitizeErrorMessage } from '../../utils/errors.joi';
import { MessageID } from '../messages/message.repository';
import { ClientEvents, Response, ServerEvents } from '../events/message.events';
import IMessage from '@/source/interfaces/message';
// import INamespace from '@/source/interfaces/namespace';

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
      // persist the entity
      payload.namespace = socket.nsp.name as string;
      let _message: IMessage;
      try {
        _message = await messageRepository.create(payload);
      } catch (err) {
        return callback({
          error: sanitizeErrorMessage(err as string)
        });
      }

      // acknowledge the creation
      callback({
        data: _message.id
      });

      // notify the other users
      socket.broadcast.emit('message:created', payload);
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
          error: sanitizeErrorMessage(err as string)
        });
      }
    },

    updateMessage: async (
      payload: IMessage,
      callback: (res?: Response<void>) => void
    ) => {
      try {
        await messageRepository.updateById(payload, payload.id);
      } catch (err) {
        return callback({
          error: sanitizeErrorMessage(err as string)
        });
      }

      callback();
      socket.broadcast.emit('message:updated', payload);
    },

    deleteMessage: async (
      id: MessageID,
      callback: (res?: Response<void>) => void
    ) => {
      try {
        await messageRepository.deleteById(id);
      } catch (err) {
        return callback({
          error: sanitizeErrorMessage(err as string)
        });
      }

      callback();
      socket.broadcast.emit('message:deleted', id);
    },

    listMessage: async (callback: (res: Response<IMessage[]>) => void) => {
      try {
        callback({
          data: await messageRepository.getAll(socket.nsp.name as string)
        });
      } catch (err) {
        callback({
          error: sanitizeErrorMessage(err as string)
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
