import { Team } from "@/entities/team";
import type { IBaseRepository } from "@/applications/repositories/base.repository.interface";

export interface ITeamRepository extends IBaseRepository<Team> {}
