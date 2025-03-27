import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  CreateSetUseCase,
  type ICreateSetInput,
  type ICreateSetOutput,
  UpdateSetUseCase,
  type IUpdateSetInput,
  type IUpdateSetOutput,
} from "@/applications/usecases/record/set.usecase";

export const createSetController = async (
  input: ICreateSetInput
): Promise<ICreateSetOutput | undefined> => {
  const createSetUseCase = container.get<CreateSetUseCase>(
    TYPES.CreateSetUseCase
  );

  return await createSetUseCase.execute(input);
};

export const updateSetController = async (
  input: IUpdateSetInput
): Promise<IUpdateSetOutput | undefined> => {
  const updateSetUseCase = container.get<UpdateSetUseCase>(
    TYPES.UpdateSetUseCase
  );

  return await updateSetUseCase.execute(input);
};
