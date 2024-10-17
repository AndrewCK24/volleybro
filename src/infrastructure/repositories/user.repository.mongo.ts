import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import { User } from "@/infrastructure/mongoose/schemas/user";

export class UserRepositoryImpl implements IUserRepository {
  async find(filter: { [key: string]: any }) {
    return await User.find(filter);
  }

  async findOne(filter: { [key: string]: any }) {
    return await User.findOne(filter);
  }

  async create(data: any) {
    return await User.create(data);
  }

  async update(filter: { [key: string]: any }, data: any) {
    return await User.findOneAndReplace(filter, data, { new: true });
  }

  async delete(filter: { [key: string]: any }) {
    const result = await User.findByIdAndDelete(filter);
    return !!result;
  }
}
