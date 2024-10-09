import { Role } from "@/entities/team";

export interface IAuthorizationService {
  verifyTeamRole(teamId: string, userId: string, role: Role): Promise<void>;
}
