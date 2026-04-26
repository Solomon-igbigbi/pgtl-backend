import { FlaggedTransactionRepository } from '../../../adapters/repositories/flaggedTransaction.repository';
import { FetchFlaggedTransactionsDto } from '../dtos/fraudCheck.dto';
import { EntityManager } from 'typeorm';
import { FlaggedTransaction } from '../../core/entities/flaggedTransaction.entity';
export declare class FraudService {
    private readonly flaggedTransactionRepository;
    constructor(flaggedTransactionRepository: FlaggedTransactionRepository);
    saveFlagged(records: Partial<FlaggedTransaction>[], entityManager: EntityManager): Promise<FlaggedTransaction[]>;
    fetchFlagged(dto: FetchFlaggedTransactionsDto): Promise<{
        items: FlaggedTransaction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    parseJsonBuffer(buffer: Buffer): any[];
}
