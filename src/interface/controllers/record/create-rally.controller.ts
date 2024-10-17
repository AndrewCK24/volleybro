import {
  CreateRallyUseCase,
  type ICreateRallyInput,
  type ICreateRallyOutput,
} from "@/applications/use-cases/record/create-rally.use-case";
import {
  UserRepositoryImpl,
  TeamRepositoryImpl,
  RecordRepositoryImpl,
} from "@/infrastructure/repositories";

export const createRallyController = async (
  input: ICreateRallyInput
): Promise<ICreateRallyOutput | undefined> => {
  const createRallyUseCase = new CreateRallyUseCase(
    new UserRepositoryImpl(),
    new TeamRepositoryImpl(),
    new RecordRepositoryImpl()
  );

  return await createRallyUseCase.execute(input);
};
