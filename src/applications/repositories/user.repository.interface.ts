import { User } from "@/entities/user";

export interface IUserRepository {
  find(filter: { [key: string]: any }): Promise<User[]>;
  findOne(filter: { [key: string]: any }): Promise<User | undefined>;
  create(data: any): Promise<User>;
  update(filter: { [key: string]: any }, data: any): Promise<User>;
  delete(filter: { [key: string]: any }): Promise<boolean>;
}
