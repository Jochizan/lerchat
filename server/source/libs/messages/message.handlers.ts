import { Components } from '../app';
import { Socket } from 'socket.io';
import { sanitizeErrorMessage } from '../../utils/errors.joi';
import IMessage from '@/source/interfaces/message';
import { MessageID } from '../messages/message.repository';
import { ClientEvents, Response, ServerEvents } from '../events/message.events';
import { Schema } from 'mongoose';

const handlerMessages = (
  components: Components,
  socket: Socket<ClientEvents, ServerEvents>
) => {
  const { messageRepository } = components;

  return {
    createMessage: async (
      payload: Omit<IMessage, 'id'>,
      callback: (res: Response<MessageID>) => void
    ) => {
      const id = new Schema.Types.ObjectId(new Date().toString());

      // persist the entity
      try {
        await messageRepository.create(payload, id);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e as string)
        });
      }

      // acknowledge the creation
      callback({
        data: id
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
      } catch (e) {
        callback({
          error: sanitizeErrorMessage(e as string)
        });
      }
    },

    updateMessage: async (
      payload: IMessage,
      callback: (res?: Response<void>) => void
    ) => {
      try {
        await messageRepository.create(payload);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e as string)
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
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e as string)
        });
      }

      callback();
      socket.broadcast.emit('message:deleted', id);
    },

    listMessage: async (callback: (res: Response<IMessage[]>) => void) => {
      try {
        callback({
          data: await messageRepository.getAll()
        });
      } catch (e) {
        callback({
          error: sanitizeErrorMessage(e as string)
        });
      }
    }
  };
};

export default handlerMessages;
