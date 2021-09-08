import { Schema } from 'mongoose';
import { Errors } from '../../utils/errors.joi';
import IMessage from '@/source/interfaces/message';

abstract class CrudRepository<T, ID> {
  abstract getAll(): Promise<T[]>;
  abstract getById(id: ID): Promise<T>;
  abstract create(entity: T, id?: ID): Promise<void>;
  abstract deleteById(id: ID): Promise<void>;
  abstract updateById(id: ID, entity: T): Promise<T>;
}

export type MessageID = Schema.Types.ObjectId;

export abstract class MessageRepository extends CrudRepository<
  IMessage,
  MessageID
> {}

export class InMemoryMessageRepository extends MessageRepository {
  private readonly messages: Map<MessageID, IMessage> = new Map();

  getAll(): Promise<IMessage[]> {
    const entities = Array.from(this.messages.values());
    return Promise.resolve(entities);
  }

  getById(id: MessageID): Promise<IMessage> {
    if (this.messages.has(id)) {
      return Promise.resolve(this.messages.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  create(entity: IMessage, id: MessageID): Promise<void> {
    this.messages.set(id, entity);
    return Promise.resolve();
  }

  updateById(id: MessageID, entity: IMessage): Promise<IMessage> {
    if (this.messages.has(id)) {
      this.messages.set(id, entity);
      return Promise.resolve(this.messages.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  deleteById(id: MessageID): Promise<void> {
    const deleted = this.messages.delete(id);
    if (deleted) {
      return Promise.resolve();
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }
}
