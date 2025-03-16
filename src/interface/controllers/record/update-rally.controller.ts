import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  UpdateRallyUseCase,
  type IUpdateRallyInput,
  type IUpdateRallyOutput,
} from "@/applications/usecases/record/update-rally.usecase";

export const updateRallyController = async (
  input: IUpdateRallyInput
): Promise<IUpdateRallyOutput | undefined> => {
  const updateRallyUseCase = container.get<UpdateRallyUseCase>(
    TYPES.UpdateRallyUseCase
  );

  return await updateRallyUseCase.execute(input);
};
