import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  GetMatchesUseCase,
  type IGetMatchesInput,
  type IGetMatchesOutput,
} from "@/applications/usecases/record/get-matches.usecase";

export const getMatchesController = async (
  input: IGetMatchesInput
): Promise<IGetMatchesOutput | undefined> => {
  const getMatchesUseCase = container.get<GetMatchesUseCase>(
    TYPES.GetMatchesUseCase
  );
  return await getMatchesUseCase.execute(input);
};
