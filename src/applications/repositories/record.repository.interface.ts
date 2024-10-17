import { Record } from "@/entities/record";

export interface IRecordRepository {
  find(filter: { [key: string]: any }): Promise<Record[]>;
  findOne(filter: { [key: string]: any }): Promise<Record | undefined>;
  create(data: any): Promise<Record>;
  update(filter: { [key: string]: any }, data: any): Promise<Record>;
  delete(filter: { [key: string]: any }): Promise<boolean>;
}
