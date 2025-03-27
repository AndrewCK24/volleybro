import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  FindRecordUseCase,
  type IFindRecordInput,
  type IFindRecordOutput,
  CreateRecordUseCase,
  type ICreateRecordInput,
  type ICreateRecordOutput,
} from "@/applications/usecases/record/record.usecase";

export const findRecordController = async (
  input: IFindRecordInput
): Promise<IFindRecordOutput | undefined> => {
  const findRecordUseCase = container.get<FindRecordUseCase>(
    TYPES.FindRecordUseCase
  );

  return await findRecordUseCase.execute(input);
};

export const createRecordController = async (
  input: ICreateRecordInput
): Promise<ICreateRecordOutput | undefined> => {
  const createRecordUseCase = container.get<CreateRecordUseCase>(
    TYPES.CreateRecordUseCase
  );

  return await createRecordUseCase.execute(input);
};
