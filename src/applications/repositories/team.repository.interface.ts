import { Team } from "@/entities/team";

export interface ITeamRepository {
  findById(id: string): Promise<Team | undefined>;
  create(data: any): Promise<Team>;
  update(id: string, data: any): Promise<Team>;
  delete(id: string): Promise<boolean>;
}
