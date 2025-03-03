import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import {
  User as UserModel,
  UserDocument,
} from "@/infrastructure/mongoose/schemas/user";
import { User } from "@/entities/user";
import { BaseMongoRepository } from "@/infrastructure/repositories";

export class UserRepositoryImpl
  extends BaseMongoRepository<User, UserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }
}
