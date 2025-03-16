import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  UpdateSetUseCase,
  type IUpdateSetInput,
  type IUpdateSetOutput,
} from "@/applications/usecases/record/update-set.usecase";

export const updateSetController = async (
  input: IUpdateSetInput
): Promise<IUpdateSetOutput | undefined> => {
  const updateSetUseCase = container.get<UpdateSetUseCase>(
    TYPES.UpdateSetUseCase
  );

  return await updateSetUseCase.execute(input);
};
