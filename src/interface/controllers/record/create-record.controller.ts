import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  CreateRecordUseCase,
  type ICreateRecordInput,
  type ICreateRecordOutput,
} from "@/applications/usecases/record/create-record.usecase";

export const createRecordController = async (
  input: ICreateRecordInput
): Promise<ICreateRecordOutput | undefined> => {
  const createRecordUseCase = container.get<CreateRecordUseCase>(
    TYPES.CreateRecordUseCase
  );

  return await createRecordUseCase.execute(input);
};
