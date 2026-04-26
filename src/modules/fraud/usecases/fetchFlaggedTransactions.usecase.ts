import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Usecase } from '../../../broker/types';
import { FraudService } from '../services/fraud.service';
import { FetchFlaggedTransactionsDto } from '../dtos/fraudCheck.dto';

@Injectable()
export class FetchFlaggedTransactionsUsecase extends Usecase {
  constructor(private readonly fraudService: FraudService) {
    super();
  }

  async execute(
    _entityManager: EntityManager,
    dto: FetchFlaggedTransactionsDto,
  ) {
    return this.fraudService.fetchFlagged(dto);
  }
}
