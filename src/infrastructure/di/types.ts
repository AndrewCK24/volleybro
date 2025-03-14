export const TYPES = {
  UserRepository: Symbol.for("UserRepository"),
  TeamRepository: Symbol.for("TeamRepository"),
  RecordRepository: Symbol.for("RecordRepository"),

  AuthenticationService: Symbol.for("AuthenticationService"),
  AuthorizationService: Symbol.for("AuthorizationService"),

  CreateRecordUseCase: Symbol.for("CreateRecordUseCase"),
  CreateSetUseCase: Symbol.for("CreateSetUseCase"),
  CreateRallyUseCase: Symbol.for("CreateRallyUseCase"),
  CreateSubstitutionUseCase: Symbol.for("CreateSubstitutionUseCase"),
  GetRecordUseCase: Symbol.for("GetRecordUseCase"),
  UpdateSetUseCase: Symbol.for("UpdateSetUseCase"),
  UpdateRallyUseCase: Symbol.for("UpdateRallyUseCase"),
};
