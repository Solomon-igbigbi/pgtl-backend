import { EntityManager } from 'typeorm';
import { Usecase } from '../../../broker/types';
import { FraudService } from '../services/fraud.service';
import { FetchFlaggedTransactionsDto } from '../dtos/fraudCheck.dto';
export declare class FetchFlaggedTransactionsUsecase extends Usecase {
    private readonly fraudService;
    constructor(fraudService: FraudService);
    execute(_entityManager: EntityManager, dto: FetchFlaggedTransactionsDto): Promise<{
        items: import("../../core/entities/flaggedTransaction.entity").FlaggedTransaction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
