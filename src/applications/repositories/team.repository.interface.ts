import { Team } from "@/entities/team";

export interface ITeamRepository {
  find(filter: { [key: string]: any }): Promise<Team[]>;
  findOne(filter: { [key: string]: any }): Promise<Team | undefined>;
  create(data: any): Promise<Team>;
  update(filter: { [key: string]: any }, data: any): Promise<Team>;
  delete(filter: { [key: string]: any }): Promise<boolean>;
}
