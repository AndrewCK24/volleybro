import {
  UpdateRallyUseCase,
  type IUpdateRallyInput,
  type IUpdateRallyOutput,
} from "@/applications/use-cases/record/update-rally.use-case";
import {
  UserRepositoryImpl,
  TeamRepositoryImpl,
  RecordRepositoryImpl,
} from "@/infrastructure/repositories";

export const updateRallyController = async (
  input: IUpdateRallyInput
): Promise<IUpdateRallyOutput | undefined> => {
  const updateRallyUseCase = new UpdateRallyUseCase(
    new UserRepositoryImpl(),
    new TeamRepositoryImpl(),
    new RecordRepositoryImpl()
  );

  return await updateRallyUseCase.execute(input);
};
