import { AddRallyUseCase } from "@/applications/use-cases/record/add-rally.use-case";
import { Record, Rally } from "@/entities/record";

import {
  UserRepositoryImpl,
  TeamRepositoryImpl,
  RecordRepositoryImpl,
} from "@/infrastructure/repositories";

// TODO: 建立 presenter

export const addRallyController = async (
  params: { id: Record["_id"]; setNum: number },
  rally: Rally
) => {
  const addRallyUseCase = new AddRallyUseCase(
    new UserRepositoryImpl(),
    new TeamRepositoryImpl(),
    new RecordRepositoryImpl()
  );

  return await addRallyUseCase.execute(params, rally);
};
