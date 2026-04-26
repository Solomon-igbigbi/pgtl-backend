import { DataSource, EntityManager, Repository } from 'typeorm';
import { FlaggedTransaction } from '../../modules/core/entities/flaggedTransaction.entity';
import { FetchFlaggedTransactionsDto } from '../../modules/fraud/dtos/fraudCheck.dto';
export declare class FlaggedTransactionRepository extends Repository<FlaggedTransaction> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    bulkInsert(records: Partial<FlaggedTransaction>[], entityManager: EntityManager): Promise<FlaggedTransaction[]>;
    findFlagged(dto: FetchFlaggedTransactionsDto): Promise<{
        items: FlaggedTransaction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
