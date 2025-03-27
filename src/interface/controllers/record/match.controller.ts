import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  FindMatchesUseCase,
  type IFindMatchesInput,
  type IFindMatchesOutput,
} from "@/applications/usecases/record/matches.usecase";

export const findMatchesController = async (
  input: IFindMatchesInput
): Promise<IFindMatchesOutput | undefined> => {
  const getMatchesUseCase = container.get<FindMatchesUseCase>(
    TYPES.FindMatchesUseCase
  );
  return await getMatchesUseCase.execute(input);
};
