import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import {
  Team as TeamModel,
  TeamDocument,
} from "@/infrastructure/mongoose/schemas/team";
import { Team } from "@/entities/team";
import { BaseMongoRepository } from "@/infrastructure/repositories";

export class TeamRepositoryImpl
  extends BaseMongoRepository<Team, TeamDocument>
  implements ITeamRepository
{
  constructor() {
    super(TeamModel);
  }
}
