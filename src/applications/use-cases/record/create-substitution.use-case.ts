import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import { AuthenticationService } from "@/infrastructure/service/auth/authentication.service";
import { AuthorizationService } from "@/infrastructure/service/auth/authorization.service";
import { type Substitution, Side } from "@/entities/record";
import { Role } from "@/entities/team";

export interface ICreateSubstitutionInput {
  params: { recordId: string; setIndex: number; rallyIndex: number };
  data: Substitution;
}

export type ICreateSubstitutionOutput = Substitution[];

export class CreateSubstitutionUseCase {
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
    input: ICreateSubstitutionInput
  ): Promise<ICreateSubstitutionOutput | undefined> {
    const { params, data: substitution } = input;
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

    const { setIndex } = params;
    const {
      team,
      players: { in: inPlayer, out: outPlayer },
    } = substitution;

    const side = team === Side.HOME ? "home" : "away";
    const lineup = record.sets[setIndex].lineups[side];

    const startingIndex = lineup.starting.findIndex(
      (p) => p._id.toString() === outPlayer
    );
    const startingPlayer = lineup.starting[startingIndex];
    const subIndex = lineup.substitutes.findIndex(
      (p) => p._id.toString() === inPlayer
    );
    const subPlayer = lineup.substitutes[subIndex];

    startingPlayer._id = inPlayer;
    subPlayer._id = outPlayer;
    subPlayer.sub = { _id: inPlayer };

    if (!!startingPlayer.sub?._id) {
      startingPlayer.sub._id = null;
    } else {
      startingPlayer.sub = { _id: outPlayer };
    }

    lineup.starting[startingIndex] = startingPlayer;
    lineup.substitutes[subIndex] = subPlayer;
    record.sets[setIndex].lineups[side] = lineup;
    record.sets[setIndex].substitutions.push(substitution);
    record.teams[side].stats[setIndex].substitution += 1;

    await this.recordRepository.update({ _id: params.recordId }, record);

    return record.sets[setIndex].substitutions;
  }
}
