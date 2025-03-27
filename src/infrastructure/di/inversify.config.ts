import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "@/infrastructure/di/types";

import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import { IAuthenticationService } from "@/applications/services/auth/authentication.service.interface";
import { IAuthorizationService } from "@/applications/services/auth/authorization.service.interface";

import { UserRepositoryImpl } from "@/infrastructure/db/repositories";
import { TeamRepositoryImpl } from "@/infrastructure/db/repositories";
import { RecordRepositoryImpl } from "@/infrastructure/db/repositories";
import { AuthenticationService } from "@/infrastructure/services/auth/authentication.service";
import { AuthorizationService } from "@/infrastructure/services/auth/authorization.service";

import {
  FindRecordUseCase,
  CreateRecordUseCase,
} from "@/applications/usecases/record/record.usecase";
import { FindMatchesUseCase } from "@/applications/usecases/record/matches.usecase";
import {
  CreateSetUseCase,
  UpdateSetUseCase,
} from "@/applications/usecases/record/set.usecase";
import { CreateRallyUseCase } from "@/applications/usecases/record/create-rally.usecase";
import { CreateSubstitutionUseCase } from "@/applications/usecases/record/create-substitution.usecase";
import { UpdateRallyUseCase } from "@/applications/usecases/record/update-rally.usecase";

const container = new Container();

// register repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
container.bind<ITeamRepository>(TYPES.TeamRepository).to(TeamRepositoryImpl);
container
  .bind<IRecordRepository>(TYPES.RecordRepository)
  .to(RecordRepositoryImpl);

// register services
container
  .bind<IAuthenticationService>(TYPES.AuthenticationService)
  .to(AuthenticationService);
container
  .bind<IAuthorizationService>(TYPES.AuthorizationService)
  .to(AuthorizationService);

// register usecases
container
  .bind<FindRecordUseCase>(TYPES.FindRecordUseCase)
  .to(FindRecordUseCase);
container
  .bind<CreateRecordUseCase>(TYPES.CreateRecordUseCase)
  .to(CreateRecordUseCase);
container
  .bind<FindMatchesUseCase>(TYPES.FindMatchesUseCase)
  .to(FindMatchesUseCase);
container.bind<CreateSetUseCase>(TYPES.CreateSetUseCase).to(CreateSetUseCase);
container
  .bind<CreateRallyUseCase>(TYPES.CreateRallyUseCase)
  .to(CreateRallyUseCase);
container
  .bind<CreateSubstitutionUseCase>(TYPES.CreateSubstitutionUseCase)
  .to(CreateSubstitutionUseCase);
container.bind<UpdateSetUseCase>(TYPES.UpdateSetUseCase).to(UpdateSetUseCase);
container
  .bind<UpdateRallyUseCase>(TYPES.UpdateRallyUseCase)
  .to(UpdateRallyUseCase);

export { container };
