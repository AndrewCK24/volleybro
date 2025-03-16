import { injectable, inject } from "inversify";
import { TYPES } from "@/infrastructure/di/types";
import type { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import type { IAuthenticationService } from "@/applications/services/auth/authentication.service.interface";
import type { IAuthorizationService } from "@/applications/services/auth/authorization.service.interface";
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

@injectable()
export class UpdateSetUseCase {
  constructor(
    @inject(TYPES.RecordRepository) private recordRepository: IRecordRepository,
    @inject(TYPES.AuthenticationService)
    private authenticationService: IAuthenticationService,
    @inject(TYPES.AuthorizationService)
    private authorizationService: IAuthorizationService
  ) {}

  async execute(input: IUpdateSetInput): Promise<IUpdateSetOutput | undefined> {
    const { params, data } = input;
    const user = await this.authenticationService.verifySession();

    const record = await this.recordRepository.findOne({
      _id: params.recordId,
    });
    if (!record) throw new Error("Record not found");

    await this.authorizationService.verifyTeamRole(
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
