import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  CreateRallyUseCase,
  type ICreateRallyInput,
  type ICreateRallyOutput,
} from "@/applications/usecases/record/create-rally.usecase";

export const createRallyController = async (
  input: ICreateRallyInput
): Promise<ICreateRallyOutput | undefined> => {
  const createRallyUseCase = container.get<CreateRallyUseCase>(
    TYPES.CreateRallyUseCase
  );

  return await createRallyUseCase.execute(input);
};
