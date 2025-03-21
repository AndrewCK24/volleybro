export interface IBaseRepository<T> {
  find(filter: { [key: string]: any }): Promise<T[]>;
  findOne(filter: { [key: string]: any }): Promise<T | undefined>;
  create(data: any): Promise<T>;
  update(filter: { [key: string]: any }, data: any): Promise<T>;
  delete(filter: { [key: string]: any }): Promise<boolean>;
}
