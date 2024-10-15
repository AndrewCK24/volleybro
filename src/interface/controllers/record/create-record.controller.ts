import {
  CreateRecordUseCase,
  type ICreateRecordInput,
  type ICreateRecordOutput,
} from "@/applications/use-cases/record/create-record.use-case";
import {
  UserRepositoryImpl,
  TeamRepositoryImpl,
  RecordRepositoryImpl,
} from "@/infrastructure/repositories";

export const createRecordController = async (
  input: ICreateRecordInput
): Promise<ICreateRecordOutput | undefined> => {
  const createRecordUseCase = new CreateRecordUseCase(
    new UserRepositoryImpl(),
    new TeamRepositoryImpl(),
    new RecordRepositoryImpl()
  );

  return await createRecordUseCase.execute(input);
};
