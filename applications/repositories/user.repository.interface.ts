import { User } from "@/entities/user";

export interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  create(data: any): Promise<User>;
  update(id: string, data: any): Promise<User>;
  delete(id: string): Promise<boolean>;
}
