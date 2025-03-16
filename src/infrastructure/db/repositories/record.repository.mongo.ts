import { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import {
  Record as RecordModel,
  RecordDocument,
} from "@/infrastructure/db/mongoose/schemas/record";
import { Record } from "@/entities/record";
import { BaseMongoRepository } from "@/infrastructure/db/repositories";

export class RecordRepositoryImpl
  extends BaseMongoRepository<Record, RecordDocument>
  implements IRecordRepository
{
  constructor() {
    super(RecordModel);
  }
}
