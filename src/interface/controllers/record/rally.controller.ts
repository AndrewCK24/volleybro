import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  CreateRallyUseCase,
  type ICreateRallyInput,
  type ICreateRallyOutput,
  UpdateRallyUseCase,
  type IUpdateRallyInput,
  type IUpdateRallyOutput,
} from "@/applications/usecases/record/rally.usecase";

export const createRallyController = async (
  input: ICreateRallyInput
): Promise<ICreateRallyOutput | undefined> => {
  const createRallyUseCase = container.get<CreateRallyUseCase>(
    TYPES.CreateRallyUseCase
  );

  return await createRallyUseCase.execute(input);
};

export const updateRallyController = async (
  input: IUpdateRallyInput
): Promise<IUpdateRallyOutput | undefined> => {
  const updateRallyUseCase = container.get<UpdateRallyUseCase>(
    TYPES.UpdateRallyUseCase
  );

  return await updateRallyUseCase.execute(input);
};
