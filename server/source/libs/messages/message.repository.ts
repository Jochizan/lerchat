import { Schema } from 'mongoose';
import { Errors } from '../../utils/errors.joi';
import Message from '../../models/Message';
import IMessage from '@/source/interfaces/message';
// import INamespace from '@/source/interfaces/namespace';

abstract class CrudRepository<T, S, ID> {
  abstract getAll(namespace: S): Promise<T[]>;
  abstract getById(id: ID): Promise<T>;
  abstract create(entity: T): Promise<T>;
  abstract deleteById(id: ID): Promise<void>;
  abstract updateById(entity: T, id: ID): Promise<T>;
}

export type MessageID = Schema.Types.ObjectId;

export abstract class MessageRepository extends CrudRepository<
  IMessage,
  string,
  MessageID
> {}

export class InMemoryMessageRepository extends MessageRepository {
  async getAll(namespace: string): Promise<IMessage[]> {
    const _messages = await Message.find({ namespace });
    const _newMessages = _messages.map((message) => {
      console.log(message);
      return {
        message: message.message,
        namespace: message.namespace
      } as IMessage;
    });
    return Promise.resolve(_newMessages);
  }

  async getById(id: MessageID): Promise<IMessage> {
    const _message = await Message.findById(id);
    if (_message) {
      return Promise.resolve(_message);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  create(entity: IMessage): Promise<IMessage> {
    entity.message = entity.message[0];
    return Promise.resolve(Message.create(entity));
  }

  async updateById(entity: IMessage, id: MessageID): Promise<IMessage> {
    const _message = await Message.findById(id);
    if (_message) {
      return Promise.resolve(
        Message.findByIdAndUpdate(id, entity, { new: true })
      );
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  async deleteById(id: MessageID): Promise<void> {
    const _message = await Message.findByIdAndDelete(id);
    console.log(_message);
    if (_message) {
      return Promise.resolve(_message);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }
}
