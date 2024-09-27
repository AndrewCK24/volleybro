import { Role } from "@/src/entities/team";

export interface IAuthorizationService {
  verifyTeamRole(teamId: string, userId: string, role: Role): Promise<void>;
}
