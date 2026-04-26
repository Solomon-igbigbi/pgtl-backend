import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { FlaggedTransaction } from '../../modules/core/entities/flaggedTransaction.entity';
import { FetchFlaggedTransactionsDto } from '../../modules/fraud/dtos/fraudCheck.dto';

@Injectable()
export class FlaggedTransactionRepository extends Repository<FlaggedTransaction> {
  constructor(private readonly dataSource: DataSource) {
    super(FlaggedTransaction, dataSource.createEntityManager());
  }

  async bulkInsert(records: Partial<FlaggedTransaction>[], entityManager: EntityManager) {
    const CHUNK = 500;
    for (let i = 0; i < records.length; i += CHUNK) {
      await entityManager.insert(FlaggedTransaction, records.slice(i, i + CHUNK));
    }
    return records as FlaggedTransaction[];
  }

  async findFlagged(dto: FetchFlaggedTransactionsDto) {
    const qb = this.createQueryBuilder('ft').orderBy('ft.timestamp', 'DESC');

    if (dto.userId) {
      qb.where('ft.userId = :userId', { userId: dto.userId });
    }

    const total = await qb.getCount();
    const items = await qb
      .skip((dto.page - 1) * dto.limit)
      .take(dto.limit)
      .getMany();

    return {
      items,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit) || 1,
    };
  }
}
