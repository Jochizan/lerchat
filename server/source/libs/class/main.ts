export abstract class CrudRepository<T, NID, ID> {
  abstract create(entity: T, space?: NID): Promise<T>;
  abstract readById(id: ID): Promise<T>;
  abstract deleteById(id: ID): Promise<void>;
  abstract updateById(entity: T, id: ID): Promise<T>;
}
