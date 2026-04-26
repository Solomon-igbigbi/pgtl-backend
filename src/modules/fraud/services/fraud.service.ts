import { Injectable, BadRequestException } from '@nestjs/common';
import { FlaggedTransactionRepository } from '../../../adapters/repositories/flaggedTransaction.repository';
import { FetchFlaggedTransactionsDto } from '../dtos/fraudCheck.dto';
import { EntityManager } from 'typeorm';
import { FlaggedTransaction } from '../../core/entities/flaggedTransaction.entity';

@Injectable()
export class FraudService {
  constructor(private readonly flaggedTransactionRepository: FlaggedTransactionRepository) {}

  async saveFlagged(records: Partial<FlaggedTransaction>[], entityManager: EntityManager) {
    if (!records.length) return [];
    return this.flaggedTransactionRepository.bulkInsert(records, entityManager);
  }

  async fetchFlagged(dto: FetchFlaggedTransactionsDto) {
    return this.flaggedTransactionRepository.findFlagged(dto);
  }

  parseJsonBuffer(buffer: Buffer): any[] {
    try {
      const text = buffer.toString('utf-8');
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new BadRequestException('JSON file must contain an array of transactions');
      }
      return parsed;
    } catch {
      throw new BadRequestException('Invalid JSON file');
    }
  }
}
