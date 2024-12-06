import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import { AuthenticationService } from "@/infrastructure/service/auth/authentication.service";
import { AuthorizationService } from "@/infrastructure/service/auth/authorization.service";
import { Role } from "@/entities/team";
import type { Record } from "@/entities/record";

export interface IGetRecordInput {
  params: { teamId: string };
}

export type IGetRecordOutput = Record[];

export class GetRecordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private teamRepository: ITeamRepository,
    private recordRepository: IRecordRepository
  ) {}

  async execute(input: IGetRecordInput): Promise<IGetRecordOutput | undefined> {
    const { params } = input;
    const authenticationService = new AuthenticationService(
      this.userRepository
    );
    const user = await authenticationService.verifySession();

    const authorizationService = new AuthorizationService(this.teamRepository);
    await authorizationService.verifyTeamRole(
      params.teamId.toString(),
      user._id.toString(),
      Role.MEMBER
    );

    const records = await this.recordRepository.find({
      team_id: params.teamId,
    });

    return records;
  }
}
