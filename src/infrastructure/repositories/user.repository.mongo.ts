import { IUserRepository } from "@/src/applications/repositories/user.repository.interface";
import { User } from "@/src/infrastructure/mongoose/schemas/user";

export class UserRepositoryImpl implements IUserRepository {
  async findById(id: string) {
    return await User.findById(id);
  }

  async create(data: any) {
    return await User.create(data);
  }

  async update(id: string, data: any) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}
