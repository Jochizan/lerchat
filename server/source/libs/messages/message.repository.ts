import { Errors } from '../errors/message.errors';
import { ObjectId } from 'mongoose';
import Message from '../../models/Message';
import IMessage from '../../interfaces/message';

abstract class CrudRepository<T, SID, ID> {
  abstract getAll(namespace: SID): Promise<T[]>;
  abstract getById(id: ID): Promise<T>;
  abstract create(entity: T): Promise<T>;
  abstract deleteById(id: ID): Promise<void>;
  abstract updateById(entity: T, id: ID): Promise<T>;
}

export type MessageID = ObjectId;
export type NamespaceID = ObjectId;

export abstract class Repository extends CrudRepository<
  IMessage,
  NamespaceID,
  MessageID
> {}

export class MessageRepository extends Repository {
  getAll(namespace: NamespaceID): Promise<IMessage[]> {
    return Promise.resolve(Message.find({ namespace }));
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
    console.log(entity);
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
    if (_message) {
      return Promise.resolve(_message);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }
}
