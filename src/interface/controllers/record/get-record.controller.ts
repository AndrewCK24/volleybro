import {
  GetRecordUseCase,
  type IGetRecordInput,
  type IGetRecordOutput,
} from "@/applications/use-cases/record/get-record.use-case";
import {
  UserRepositoryImpl,
  TeamRepositoryImpl,
  RecordRepositoryImpl,
} from "@/infrastructure/repositories";

export const getRecordController = async (
  input: IGetRecordInput
): Promise<IGetRecordOutput | undefined> => {
  const getRecordUseCase = new GetRecordUseCase(
    new UserRepositoryImpl(),
    new TeamRepositoryImpl(),
    new RecordRepositoryImpl()
  );

  return await getRecordUseCase.execute(input);
};
