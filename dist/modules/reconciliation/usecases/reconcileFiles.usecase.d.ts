import { EntityManager } from 'typeorm';
import { Usecase } from '../../../broker/types';
import { ReconciliationService } from '../services/reconciliation.service';
export declare class ReconcileFilesUsecase extends Usecase {
    private readonly reconciliationService;
    constructor(reconciliationService: ReconciliationService);
    execute(_entityManager: EntityManager, dto: {
        fileA: Express.Multer.File;
        fileB: Express.Multer.File;
        page: number;
        limit: number;
    }): Promise<{
        summary: import("../dtos/reconcile.dto").ReconciliationSummary;
        missingInA: import("../dtos/reconcile.dto").MissingTransaction[];
        missingInB: import("../dtos/reconcile.dto").MissingTransaction[];
        amountMismatches: import("../dtos/reconcile.dto").AmountMismatch[];
        statusMismatches: import("../dtos/reconcile.dto").StatusMismatch[];
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
