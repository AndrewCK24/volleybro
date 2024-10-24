import {
  CreateSubstitutionUseCase,
  type ICreateSubstitutionInput,
  type ICreateSubstitutionOutput,
} from "@/applications/use-cases/record/create-substitution.use-case";
import {
  UserRepositoryImpl,
  TeamRepositoryImpl,
  RecordRepositoryImpl,
} from "@/infrastructure/repositories";

export const createSubstitutionController = async (
  input: ICreateSubstitutionInput
): Promise<ICreateSubstitutionOutput | undefined> => {
  const createSubstitutionUseCase = new CreateSubstitutionUseCase(
    new UserRepositoryImpl(),
    new TeamRepositoryImpl(),
    new RecordRepositoryImpl()
  );

  return await createSubstitutionUseCase.execute(input);
};
