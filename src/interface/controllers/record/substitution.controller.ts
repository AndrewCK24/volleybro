import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import {
  CreateSubstitutionUseCase,
  type ICreateSubstitutionInput,
  type ICreateSubstitutionOutput,
} from "@/applications/usecases/record/substitution.usecase";

export const createSubstitutionController = async (
  input: ICreateSubstitutionInput
): Promise<ICreateSubstitutionOutput | undefined> => {
  const createSubstitutionUseCase = container.get<CreateSubstitutionUseCase>(
    TYPES.CreateSubstitutionUseCase
  );

  return await createSubstitutionUseCase.execute(input);
};
