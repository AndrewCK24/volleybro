import { injectable, inject } from "inversify";
import { TYPES } from "@/types/types";
import type { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import type { IAuthenticationService } from "@/applications/services/auth/authentication.service.interface";
import type { IAuthorizationService } from "@/applications/services/auth/authorization.service.interface";
import { updateRallyOptimistic as updateRally } from "@/lib/features/record/helpers";
import { type Entry, type Rally } from "@/entities/record";
import { Role } from "@/entities/team";

export type IUpdateRallyInput = {
  params: { recordId: string; setIndex: number; entryIndex: number };
  data: Rally;
};

export type IUpdateRallyOutput = Entry[];

@injectable()
export class UpdateRallyUseCase {
  constructor(
    @inject(TYPES.RecordRepository) private recordRepository: IRecordRepository,
    @inject(TYPES.AuthenticationService)
    private authenticationService: IAuthenticationService,
    @inject(TYPES.AuthorizationService)
    private authorizationService: IAuthorizationService
  ) {}

  async execute(
    input: IUpdateRallyInput
  ): Promise<IUpdateRallyOutput | undefined> {
    const { params, data: rally } = input;
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

    const set = record.sets[params.setIndex];
    if (!set) throw new Error("Set not found");

    const updatedRecord = updateRally(params, rally, record);

    await this.recordRepository.update({ _id: record._id }, updatedRecord);

    return updatedRecord.sets[params.setIndex].entries;
  }
}
