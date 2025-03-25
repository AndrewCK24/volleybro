import { injectable, inject } from "inversify";
import { TYPES } from "@/infrastructure/di/types";
import type { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import type { IAuthenticationService } from "@/applications/services/auth/authentication.service.interface";
import type { IAuthorizationService } from "@/applications/services/auth/authorization.service.interface";
import { Role } from "@/entities/team";
import type { MatchResult } from "@/entities/record";

export interface IGetMatchesInput {
  params: { teamId: string; lastId?: string; limit?: number };
}

export type IGetMatchesOutput = {
  matches: MatchResult[];
  hasMore: boolean;
  lastId: string;
};

@injectable()
export class GetMatchesUseCase {
  constructor(
    @inject(TYPES.RecordRepository) private recordRepository: IRecordRepository,
    @inject(TYPES.AuthenticationService)
    private authenticationService: IAuthenticationService,
    @inject(TYPES.AuthorizationService)
    private authorizationService: IAuthorizationService
  ) {}

  async execute(
    input: IGetMatchesInput
  ): Promise<IGetMatchesOutput | undefined> {
    const { params } = input;
    const user = await this.authenticationService.verifySession();

    await this.authorizationService.verifyTeamRole(
      params.teamId.toString(),
      user._id.toString(),
      Role.MEMBER
    );

    const results = await this.recordRepository.findMatchesWithPagination(
      { team_id: params.teamId },
      { lastId: params.lastId }
    );

    const { data: matches, hasMore, lastId } = results;

    return {
      matches,
      hasMore,
      lastId,
    };
  }
}
