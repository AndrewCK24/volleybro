import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  CreateSetUseCase,
  type ICreateSetInput,
  type ICreateSetOutput,
} from "@/applications/usecases/record/create-set.usecase";

export const createSetController = async (
  input: ICreateSetInput
): Promise<ICreateSetOutput | undefined> => {
  const createSetUseCase = container.get<CreateSetUseCase>(
    TYPES.CreateSetUseCase
  );

  return await createSetUseCase.execute(input);
};
