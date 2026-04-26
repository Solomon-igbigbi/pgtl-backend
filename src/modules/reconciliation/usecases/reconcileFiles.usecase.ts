import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Usecase } from '../../../broker/types';
import { ReconciliationService } from '../services/reconciliation.service';

@Injectable()
export class ReconcileFilesUsecase extends Usecase {
  constructor(private readonly reconciliationService: ReconciliationService) {
    super();
  }

  async execute(
    _entityManager: EntityManager,
    dto: {
      fileA: Express.Multer.File;
      fileB: Express.Multer.File;
      page: number;
      limit: number;
    },
  ) {
    const { fileA, fileB, page, limit } = dto;

    this.reconciliationService.validateFiles(fileA, fileB);

    const [mapA, mapB] = await Promise.all([
      this.reconciliationService.parseCsvBuffer(fileA.buffer),
      this.reconciliationService.parseCsvBuffer(fileB.buffer),
    ]);

    const result = this.reconciliationService.reconcile(mapA, mapB);

    const maxTotal = Math.max(
      result.missingInA.length,
      result.missingInB.length,
      result.amountMismatches.length,
      result.statusMismatches.length,
    );
    const totalPages = Math.ceil(maxTotal / limit) || 1;

    return {
      summary: result.summary,
      missingInA: this.reconciliationService.paginate(
        result.missingInA,
        page,
        limit,
      ),
      missingInB: this.reconciliationService.paginate(
        result.missingInB,
        page,
        limit,
      ),
      amountMismatches: this.reconciliationService.paginate(
        result.amountMismatches,
        page,
        limit,
      ),
      statusMismatches: this.reconciliationService.paginate(
        result.statusMismatches,
        page,
        limit,
      ),
      page,
      limit,
      totalPages,
    };
  }
}
