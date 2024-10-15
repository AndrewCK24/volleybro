import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import { AuthenticationService } from "@/infrastructure/service/auth/authentication.service";
import { AuthorizationService } from "@/infrastructure/service/auth/authorization.service";
import type { Record, Set } from "@/entities/record";
import { Role } from "@/entities/team";

export interface IUpdateSetInput {
  params: { recordId: string; setIndex: number };
  data: {
    // lineup: Lineup;
    options: Set["options"];
  };
}

export interface IUpdateSetOutput extends Record {}

export class UpdateSetUseCase {
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

  async execute(input: IUpdateSetInput): Promise<IUpdateSetOutput | undefined> {
    const { params, data } = input;
    const authenticationService = new AuthenticationService(
      this.userRepository
    );
    const user = await authenticationService.verifySession();

    const record = await this.recordRepository.findOne({
      _id: params.recordId,
    });
    if (!record) throw new Error("Record not found");

    const authorizationService = new AuthorizationService(this.teamRepository);
    await authorizationService.verifyTeamRole(
      record.team_id.toString(),
      user._id.toString(),
      Role.MEMBER
    );

    record.sets[params.setIndex].options = data.options;
    // TODO: new feature: update lineup of the set (without increasing substitution count)

    const updatedRecord = await this.recordRepository.update(
      { _id: params.recordId },
      record
    );

    return updatedRecord;
  }
}
