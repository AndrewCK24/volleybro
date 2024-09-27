import { ITeamRepository } from "@/src/applications/repositories/team.repository.interface";
import { Team } from "@/src/infrastructure/mongoose/schemas/team";

export class TeamRepositoryImpl implements ITeamRepository {
  async findById(id: string) {
    return await Team.findById(id);
  }

  async create(data: any) {
    return await Team.create(data);
  }

  async update(id: string, data: any) {
    return await Team.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    const result = await Team.findByIdAndDelete(id);
    return !!result;
  }
}
