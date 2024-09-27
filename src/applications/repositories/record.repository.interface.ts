import { Record } from "@/src/entities/record";

export interface IRecordRepository {
  findById(id: string): Promise<Record>;
  create(data: any): Promise<Record>;
  update(id: string, data: any): Promise<Record>;
  delete(id: string): Promise<any>;
}
