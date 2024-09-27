import { IRecordRepository } from "@/src/applications/repositories/record.repository.interface";
import { Record } from "@/src/infrastructure/mongoose/schemas/record";

export class RecordRepositoryImpl implements IRecordRepository {
  async findById(id: string) {
    return await Record.findById(id);
  }

  async create(data: any) {
    return await Record.create(data);
  }

  async update(id: string, data: any) {
    return await Record.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    const result = await Record.findByIdAndDelete(id);
    return !!result;
  }
}
