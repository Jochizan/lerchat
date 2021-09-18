import { Errors } from '../errors/errors';
import { CrudRepository } from '../class/main';
import Namespace from '../../models/Namespace';
import INamespace from '../../interfaces/namespace';
import { NamespaceID } from '../types';

export abstract class Repository extends CrudRepository<
  INamespace,
  string,
  NamespaceID
> {}

export class NamespaceRepository extends Repository {
  create(entity: INamespace): Promise<INamespace> {
    console.log(entity);
    return Promise.resolve(Namespace.create(entity));
  }

  readById(id: NamespaceID): Promise<INamespace> {
    console.log(id);
    return Promise.resolve(Namespace.findById(id));
  }

  async updateById(entity: INamespace, id: NamespaceID): Promise<INamespace> {
    const _message = await Namespace.findById(id);
    if (_message) {
      return Promise.resolve(
        Namespace.findByIdAndUpdate(id, entity, { new: true })
      );
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  async deleteById(id: NamespaceID): Promise<void> {
    const _message = await Namespace.findByIdAndDelete(id);
    if (_message) {
      return Promise.resolve(_message);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }
}
