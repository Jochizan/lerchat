import { ObjectId } from 'mongoose';
import { Errors } from '../errors/errors';
import { CrudRepository } from '../class/main';
import IUser from '../../interfaces/user';
import User from '../../models/User';
import { UserID } from '../types';

export abstract class Repository extends CrudRepository<
  IUser,
  string,
  UserID
> {}

// export class NamespaceRepository extends Repository {
//   create(entity: IUser): Promise<IUser> {
//     console.log(entity);
//     return Promise.resolve(User.create(entity));
//   }

//   async updateById(entity: IUser, id: UserID): Promise<IUser> {
//     const _message = await User.findById(id);
//     if (_message) {
//       return Promise.resolve(
//         Namespace.findByIdAndUpdate(id, entity, { new: true })
//       );
//     } else {
//       return Promise.reject(Errors.ENTITY_NOT_FOUND);
//     }
//   }

//   async deleteById(id: UserID): Promise<void> {
//     const _message = await Namespace.findByIdAndDelete(id);
//     if (_message) {
//       return Promise.resolve(_message);
//     } else {
//       return Promise.reject(Errors.ENTITY_NOT_FOUND);
//     }
//   }
// }
