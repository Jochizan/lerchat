import { Errors } from '../errors/errors';
import { CrudRepository } from '../class/main';
import Message from '../../models/Message';
import IMessage from '../../interfaces/message';
import { MessageID, NamespaceID } from '../types';

export abstract class Repository extends CrudRepository<
  IMessage,
  string,
  MessageID
> {}

export class MessageRepository extends Repository {
  create(entity: IMessage, namespace?: string): Promise<IMessage> {
    return Promise.resolve(Message.create({ ...entity, namespace }));
  }

  readById(id: MessageID): Promise<IMessage> {
    console.log(id);
    return Promise.resolve(Message.findById(id));
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
