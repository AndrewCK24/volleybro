import { injectable, inject } from "inversify";
import { TYPES } from "@/types/types";
import type { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import type { IAuthenticationService } from "@/applications/services/auth/authentication.service.interface";
import type { IAuthorizationService } from "@/applications/services/auth/authorization.service.interface";
import { type Lineup, Role } from "@/entities/team";
import type { Record, Team } from "@/entities/record";

export interface ICreateRecordInput {
  params: { teamId: string };
  data: {
    info: Record["info"];
    team: Team;
    lineup: Lineup;
  };
}

export interface ICreateRecordOutput extends Record {}

@injectable()
export class CreateRecordUseCase {
  constructor(
    @inject(TYPES.RecordRepository) private recordRepository: IRecordRepository,
    @inject(TYPES.AuthenticationService)
    private authenticationService: IAuthenticationService,
    @inject(TYPES.AuthorizationService)
    private authorizationService: IAuthorizationService
  ) {}

  async execute(
    input: ICreateRecordInput
  ): Promise<ICreateRecordOutput | undefined> {
    const { params, data } = input;
    const user = await this.authenticationService.verifySession();

    await this.authorizationService.verifyTeamRole(
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
