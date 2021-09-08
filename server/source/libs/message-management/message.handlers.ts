import { Components } from '../app';
import { Socket } from 'socket.io';
import { sanitizeErrorMessage } from '../../utils/errors.joi';
import IMessage from '../../interfaces/message';
import { MessageID } from '../message-management/message.repository';
import { ClientEvents, Response, ServerEvents } from '../events/message.events';
import { Schema } from 'mongoose';

/*const idSchema = Joi.string().objectId();*/

/*const messageSchema = Joi.object({*/
/*id: Joi.objectId(),*/
/*message: Joi.string().max(256).required()*/
/*});*/

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
      //validate the payload
      /*            const { error, value } = messageSchema*/
      /*.tailor('create')*/
      /*.validate(payload, {*/
      /*abortEarly: false,*/
      /*stripUnknown: true*/
      /*});*/

      /*      if (error) {*/
      /*return callback({*/
      /*error: Errors.INVALID_PAYLOAD,*/
      /*errorDetails: mapErrorDetails(error.details)*/
      /*});*/
      /*}*/

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
      /*      const { error } = idSchema.validate(id);*/

      /*if (error) {*/
      /*return callback({*/
      /*error: Errors.ENTITY_NOT_FOUND*/
      /*});*/
      /*}*/

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
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      /*      const { error, value } = messageSchema*/
      /*.tailor('update')*/
      /*.validate(payload, {*/
      /*abortEarly: false,*/
      /*stripUnknown: true*/
      /*});*/

      /*      if (error) {*/
      /*return callback({*/
      /*error: Errors.INVALID_PAYLOAD,*/
      /*errorDetails: mapErrorDetails(error.details)*/
      /*});*/
      /*}*/

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
      // @ts-ignore
      const socket: Socket<ClientEvents, ServerEvents> = this;

      /*      const { error } = idSchema.validate(id);*/

      /*if (error) {*/
      /*return callback({*/
      /*error: Errors.ENTITY_NOT_FOUND*/
      /*});*/
      /*}*/

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
