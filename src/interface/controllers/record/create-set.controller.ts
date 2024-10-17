import {
  CreateSetUseCase,
  type ICreateSetInput,
  type ICreateSetOutput,
} from "@/applications/use-cases/record/create-set.use-case";
import {
  UserRepositoryImpl,
  TeamRepositoryImpl,
  RecordRepositoryImpl,
} from "@/infrastructure/repositories";

export const createSetController = async (
  input: ICreateSetInput
): Promise<ICreateSetOutput | undefined> => {
  const createSetUseCase = new CreateSetUseCase(
    new UserRepositoryImpl(),
    new TeamRepositoryImpl(),
    new RecordRepositoryImpl()
  );

  return await createSetUseCase.execute(input);
};
