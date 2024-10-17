import { IRecordRepository } from "@/applications/repositories/record.repository.interface";
import { Record } from "@/infrastructure/mongoose/schemas/record";

export class RecordRepositoryImpl implements IRecordRepository {
  async find(filter: { [key: string]: any }) {
    return await Record.find(filter);
  }

  async findOne(filter: { [key: string]: any }) {
    return await Record.findOne(filter);
  }

  async create(data: any) {
    return await Record.create(data);
  }

  async update(filter: { [key: string]: any }, data: any) {
    return await Record.findOneAndReplace(filter, data, { new: true });
  }

  async delete(filter: { [key: string]: any }) {
    const result = await Record.findOneAndDelete(filter);
    return !!result;
  }
}
