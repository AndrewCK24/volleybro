import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { Team } from "@/infrastructure/mongoose/schemas/team";

export class TeamRepositoryImpl implements ITeamRepository {
  async find(filter: { [key: string]: any }) {
    return await Team.find(filter);
  }

  async findOne(filter: { [key: string]: any }) {
    return await Team.findOne(filter);
  }

  async create(data: any) {
    return await Team.create(data);
  }

  async update(filter: { [key: string]: any }, data: any) {
    return await Team.findOneAndReplace(filter, data, { new: true });
  }

  async delete(filter: { [key: string]: any }) {
    const result = await Team.findOneAndDelete(filter);
    return !!result;
  }
}
