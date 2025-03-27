import { User } from "@/entities/user";
import type { IBaseRepository } from "@/applications/repositories/base.repository.interface";

export interface IUserRepository extends IBaseRepository<User> {}
