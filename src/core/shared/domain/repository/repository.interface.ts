export interface IRepository<E, ID> {
  insert(entity: E): Promise<void>;
  update(id: ID, entity: E): Promise<void>;

  exists(id: ID): Promise<boolean>;
  findById(id: ID): Promise<E | null>;
  findAll(): Promise<E[]>;
}
