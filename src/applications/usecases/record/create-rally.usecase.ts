import { injectable, inject } from "inversify";
import { TYPES } from "@/infrastructure/di/types";
import type { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import type { IAuthenticationService } from "@/applications/services/auth/authentication.service.interface";
import type { IAuthorizationService } from "@/applications/services/auth/authorization.service.interface";
import { getPreviousRally } from "@/lib/features/record/helpers";
import { type Entry, type Rally, EntryType } from "@/entities/record";
import { Role } from "@/entities/team";

export interface ICreateRallyInput {
  params: { recordId: string; setIndex: number; entryIndex: number };
  data: Rally;
}

export type ICreateRallyOutput = Entry[];

@injectable()
export class CreateRallyUseCase {
  constructor(
    @inject(TYPES.RecordRepository) private recordRepository: IRecordRepository,
    @inject(TYPES.AuthenticationService)
    private authenticationService: IAuthenticationService,
    @inject(TYPES.AuthorizationService)
    private authorizationService: IAuthorizationService
  ) {}

  async execute(
    input: ICreateRallyInput
  ): Promise<ICreateRallyOutput | undefined> {
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

    // TODO: handle race condition
    // 若傳入的 setIndex, (entryIndex), scores, type, num 一致時，則視為同筆資料不新增
    // 若 setIndex, score 等資料不同時，通知後傳入之使用者，令其選擇合適之紀錄，或新增於前者紀錄之後（如何更新前者之資料？）

    const set = record.sets[params.setIndex];
    if (!set) throw new Error("Set not found");

    // same logic as createRallyOptimistic (src/lib/features/record/helpers/create-rally.helper.ts)
    const previousRally = getPreviousRally(
      record,
      params.setIndex,
      params.entryIndex
    );
    const isServing = previousRally
      ? previousRally.win
      : record.sets[params.setIndex].options.serve === "home";
    if (rally.win && !isServing)
      record.teams.home.stats[params.setIndex].rotation += 1;

    const homePlayerIndex = record.teams.home.players.findIndex(
      (player) => player._id.toString() === rally.home.player._id.toString()
    );
    const homePlayer = record.teams.home.players[homePlayerIndex];
    const homeTeam = record.teams.home;
    const awayTeam = record.teams.away;

    if (rally.win) {
      if (homePlayerIndex !== -1) {
        homePlayer.stats[params.setIndex][rally.home.type].success += 1;
        record.teams.home.players[homePlayerIndex] = homePlayer;
      }
      homeTeam.stats[params.setIndex][rally.home.type].success += 1;
      awayTeam.stats[params.setIndex][rally.away.type].error += 1;
    } else {
      if (homePlayerIndex !== -1) {
        homePlayer.stats[params.setIndex][rally.home.type].error += 1;
        record.teams.home.players[homePlayerIndex] = homePlayer;
      }
      homeTeam.stats[params.setIndex][rally.home.type].error += 1;
      awayTeam.stats[params.setIndex][rally.away.type].success += 1;
    }

    record.teams.home = homeTeam;
    record.teams.away = awayTeam;
    record.sets[params.setIndex].entries[params.entryIndex] = {
      type: EntryType.RALLY,
      data: rally,
    };

    await this.recordRepository.update({ _id: params.recordId }, record);

    return record.sets[params.setIndex].entries;
  }
}
