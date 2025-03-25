import type { Record, MatchResult } from "@/entities/record";
import type { IBaseRepository } from "@/applications/repositories/base.repository.interface";

export interface IRecordRepository extends IBaseRepository<Record> {
  findMatchesWithPagination(
    filter: { [key: string]: any },
    options: {
      lastId?: string;
      limit?: number;
      sortField?: string;
      sortDirection?: 1 | -1;
    }
  ): Promise<{ data: MatchResult[]; hasMore: boolean; lastId: string }>;
}
