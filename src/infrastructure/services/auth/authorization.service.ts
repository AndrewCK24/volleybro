import { injectable, inject } from "inversify";
import { TYPES } from "@/infrastructure/di/types";
import { IAuthorizationService } from "@/applications/services/auth/authorization.service.interface";
import type { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { Role } from "@/entities/team";

@injectable()
export class AuthorizationService implements IAuthorizationService {
  constructor(
    @inject(TYPES.TeamRepository) private teamRepository: ITeamRepository
  ) {}

  async verifyTeamRole(
    teamId: string,
    userId: string,
    role: Role = Role.MEMBER
  ): Promise<void> {
    const team = await this.teamRepository.findOne({ _id: teamId });
    if (!team) throw new Error("Team not found");

    const member = team.members.find(
      (member) => member.user_id.toString() === userId
    );
    if (!member) throw new Error("User not found in team");

    if (role === Role.MEMBER) return;
    if (role === Role.OWNER && member.role === Role.OWNER) return;
    if (role === Role.ADMIN && !!member.role) return;

    throw new Error(`User does not have role(${role}) privileges`);
  }
}
