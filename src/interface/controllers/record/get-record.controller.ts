import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/types/types";
import {
  GetRecordUseCase,
  type IGetRecordInput,
  type IGetRecordOutput,
} from "@/applications/usecases/record/get-record.usecase";

export const getRecordController = async (
  input: IGetRecordInput
): Promise<IGetRecordOutput | undefined> => {
  const getRecordUseCase = container.get<GetRecordUseCase>(
    TYPES.GetRecordUseCase
  );

  return await getRecordUseCase.execute(input);
};
