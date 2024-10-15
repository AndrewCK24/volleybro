import { Record, Team, Lineup } from "@/entities/record";
import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import { AuthenticationService } from "@/infrastructure/service/auth/authentication.service";
import { AuthorizationService } from "@/infrastructure/service/auth/authorization.service";
import { Role } from "@/entities/team";

export interface ICreateRecordInput {
  params: { teamId: string };
  data: {
    info: Record["info"];
    team: Team;
    lineup: Lineup;
  };
}

export interface ICreateRecordOutput extends Record {}

export class CreateRecordUseCase {
  private userRepository: IUserRepository;
  private teamRepository: ITeamRepository;
  private recordRepository: IRecordRepository;

  constructor(
    userRepository: IUserRepository,
    teamRepository: ITeamRepository,
    recordRepository: IRecordRepository
  ) {
    this.userRepository = userRepository;
    this.teamRepository = teamRepository;
    this.recordRepository = recordRepository;
  }

  async execute(
    input: ICreateRecordInput
  ): Promise<ICreateRecordOutput | undefined> {
    const { params, data } = input;
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

    const record = await this.recordRepository.create({
      team_id: params.teamId,
      info: data.info,
      teams: { home: { ...data.team, lineup: data.lineup }, away: {} },
    });

    return record;
  }
}
