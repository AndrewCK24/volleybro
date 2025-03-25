import { injectable, inject } from "inversify";
import { TYPES } from "@/infrastructure/di/types";
import type { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import type { IAuthenticationService } from "@/applications/services/auth/authentication.service.interface";
import type { IAuthorizationService } from "@/applications/services/auth/authorization.service.interface";
import { Role } from "@/entities/team";
import type { Record } from "@/entities/record";

export interface IGetRecordInput {
  params: { _id: string };
}

export type IGetRecordOutput = Record;

@injectable()
export class GetRecordUseCase {
  constructor(
    @inject(TYPES.RecordRepository) private recordRepository: IRecordRepository,
    @inject(TYPES.AuthenticationService)
    private authenticationService: IAuthenticationService,
    @inject(TYPES.AuthorizationService)
    private authorizationService: IAuthorizationService
  ) {}

  async execute(input: IGetRecordInput): Promise<IGetRecordOutput | undefined> {
    const { params } = input;
    const user = await this.authenticationService.verifySession();

    const record = await this.recordRepository.findOne({
      _id: params._id,
    });

    await this.authorizationService.verifyTeamRole(
      record.team_id.toString(),
      user._id.toString(),
      Role.MEMBER
    );

    return record;
  }
}
