import { CreateRecordUseCase } from "@/applications/use-cases/record/create-record.use-case";

import {
  UserRepositoryImpl,
  TeamRepositoryImpl,
  RecordRepositoryImpl,
} from "@/infrastructure/repositories";
import type {
  ICreateRecordInput,
  ICreateRecordOutput,
} from "@/applications/use-cases/record/create-record.use-case";

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
