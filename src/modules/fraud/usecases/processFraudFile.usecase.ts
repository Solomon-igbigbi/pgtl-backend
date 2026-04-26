import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Usecase } from '../../../broker/types';
import { FraudService } from '../services/fraud.service';
import { FraudDetectionService } from '../services/fraudDetection.service';

@Injectable()
export class ProcessFraudFileUsecase extends Usecase {
  constructor(
    private readonly fraudService: FraudService,
    private readonly fraudDetectionService: FraudDetectionService,
  ) {
    super();
  }

  async execute(
    entityManager: EntityManager,
    dto: { file: Express.Multer.File },
  ) {
    const { file } = dto;
    if (!file) throw new BadRequestException('JSON file is required');

    const transactions = this.fraudService.parseJsonBuffer(file.buffer);
    const flagged = this.fraudDetectionService.detect(transactions);
    const saved = await this.fraudService.saveFlagged(flagged, entityManager);

    const byType = flagged.reduce(
      (acc, f) => {
        acc[f.fraudType] = (acc[f.fraudType] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalTransactions: transactions.length,
      totalFlagged: saved.length,
      byType,
    };
  }
}
