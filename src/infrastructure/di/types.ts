export const TYPES = {
  UserRepository: Symbol.for("UserRepository"),
  TeamRepository: Symbol.for("TeamRepository"),
  RecordRepository: Symbol.for("RecordRepository"),

  AuthenticationService: Symbol.for("AuthenticationService"),
  AuthorizationService: Symbol.for("AuthorizationService"),

  FindRecordUseCase: Symbol.for("FindRecordUseCase"),
  CreateRecordUseCase: Symbol.for("CreateRecordUseCase"),
  FindMatchesUseCase: Symbol.for("FindMatchesUseCase"),
  CreateSetUseCase: Symbol.for("CreateSetUseCase"),
  CreateRallyUseCase: Symbol.for("CreateRallyUseCase"),
  CreateSubstitutionUseCase: Symbol.for("CreateSubstitutionUseCase"),
  UpdateSetUseCase: Symbol.for("UpdateSetUseCase"),
  UpdateRallyUseCase: Symbol.for("UpdateRallyUseCase"),
};
