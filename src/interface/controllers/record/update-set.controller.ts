import {
  UpdateSetUseCase,
  type IUpdateSetInput,
  type IUpdateSetOutput,
} from "@/applications/use-cases/record/update-set.use-case";
import {
  UserRepositoryImpl,
  TeamRepositoryImpl,
  RecordRepositoryImpl,
} from "@/infrastructure/repositories";

export const updateSetController = async (
  input: IUpdateSetInput
): Promise<IUpdateSetOutput | undefined> => {
  const updateSetUseCase = new UpdateSetUseCase(
    new UserRepositoryImpl(),
    new TeamRepositoryImpl(),
    new RecordRepositoryImpl()
  );

  return await updateSetUseCase.execute(input);
};
