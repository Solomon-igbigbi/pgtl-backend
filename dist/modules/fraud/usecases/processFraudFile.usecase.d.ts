import { EntityManager } from 'typeorm';
import { Usecase } from '../../../broker/types';
import { FraudService } from '../services/fraud.service';
import { FraudDetectionService } from '../services/fraudDetection.service';
export declare class ProcessFraudFileUsecase extends Usecase {
    private readonly fraudService;
    private readonly fraudDetectionService;
    constructor(fraudService: FraudService, fraudDetectionService: FraudDetectionService);
    execute(entityManager: EntityManager, dto: {
        file: Express.Multer.File;
    }): Promise<{
        totalTransactions: number;
        totalFlagged: number;
        byType: Record<string, number>;
    }>;
}
