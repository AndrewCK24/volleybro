import { Rally } from "@/entities/record";
import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import { AuthenticationService } from "@/infrastructure/service/auth/authentication.service";
import { AuthorizationService } from "@/infrastructure/service/auth/authorization.service";
import { Role } from "@/entities/team";

/**
 * Use case for adding a rally to a specific set in a record.
 *
 * @class AddRallyUseCase
 *
 * @param {IUserRepository} userRepository - Repository for user data.
 * @param {ITeamRepository} teamRepository - Repository for team data.
 * @param {IRecordRepository} recordRepository - Repository for record data.
 *
 * @method execute
 * @async
 * @param {Object} params - Parameters for the use case.
 * @param {Record["_id"]} params.id - The ID of the record to update.
 * @param {number} params.setNum - The number of the set to which the rally will be added.
 * @param {Rally} rally - The rally to add to the set.
 * @returns {Promise<void>} - A promise that resolves when the rally has been added.
 *
 * @throws {Error} If the record is not found.
 * @throws {Error} If the set is not found.
 */
export class AddRallyUseCase {
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
    params: { id: string; setNum: number; rallyNum: number },
    rally: Rally
  ): Promise<Rally[] | undefined> {
    const authenticationService = new AuthenticationService(
      this.userRepository
    );
    const user = await authenticationService.verifySession();

    const record = await this.recordRepository.findOne({ _id: params.id });
    if (!record) throw new Error("Record not found");

    const authorizationService = new AuthorizationService(this.teamRepository);
    await authorizationService.verifyTeamRole(
      record.team_id.toString(),
      user._id.toString(),
      Role.MEMBER
    );

    // TODO: handle race condition
    // 若傳入的 setNum, (rallyNum), scores, type, num 一致時，則視為同筆資料不新增
    // 若 setNum, score 等資料不同時，通知後傳入之使用者，令其選擇合適之紀錄，或新增於前者紀錄之後（如何更新前者之資料？）

    const set = record.sets[params.setNum];
    if (!set) throw new Error("Set not found");

    record.sets[params.setNum].rallies[params.rallyNum] = rally;

    await this.recordRepository.update({ _id: params.id }, record);

    return record.sets[params.setNum].rallies;
  }
}

export type { Rally };
